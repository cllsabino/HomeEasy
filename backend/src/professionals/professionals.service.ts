import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Service } from '../services/service.entity';
import { normalizePhone } from '../shared/utils/phone.utils';
import { FindProfessionalsQueryDto } from './dto/find-professionals-query.dto';
import { ReplaceProfessionalServicesDto } from './dto/replace-professional-services.dto';
import { UpdateProfessionalProfileDto } from './dto/update-professional-profile.dto';
import { ProfessionalProfile } from './professional-profile.entity';
import { ProfessionalService } from './professional-service.entity';
import { toPrivateProfessionalProfile, toPublicProfessionalProfile } from './professional-profile.utils';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(ProfessionalProfile)
    private readonly profilesRepository: Repository<ProfessionalProfile>,
    @InjectRepository(ProfessionalService)
    private readonly professionalServicesRepository: Repository<ProfessionalService>,
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>
  ) {}

  async findPublic(query: FindProfessionalsQueryDto) {
    this.validateLocationQuery(query);

    const queryBuilder = this.createProfileQuery(true)
      .where('profile.isAvailable = true')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    if (query.serviceId) {
      queryBuilder.andWhere('professionalService.serviceId = :serviceId', { serviceId: query.serviceId });
    }
    if (query.city) {
      queryBuilder.andWhere('LOWER(profile.city) = LOWER(:city)', { city: query.city.trim() });
    }
    if (query.state) {
      queryBuilder.andWhere('profile.state = :state', { state: query.state.toUpperCase() });
    }

    const hasCoordinates = query.latitude !== undefined && query.longitude !== undefined;
    if (hasCoordinates) {
      const radiusKm = query.radiusKm || 50;
      const locationExpression = this.createLocationExpression();
      queryBuilder
        .addSelect(`ST_Distance(profile.location, ${locationExpression})`, 'distance_meters')
        .andWhere(`ST_DWithin(profile.location, ${locationExpression}, :radiusMeters)`)
        .setParameters({
          latitude: query.latitude,
          longitude: query.longitude,
          radiusMeters: radiusKm * 1000
        })
        .orderBy('distance_meters', 'ASC');
    } else {
      queryBuilder.orderBy('profile.updatedAt', 'DESC');
    }

    const [result, total] = await Promise.all([queryBuilder.getRawAndEntities(), queryBuilder.getCount()]);
    const professionals = result.entities.map((profile) => {
      const matchingRow = result.raw.find(
        (row: Record<string, unknown>) => row.profile_user_id === profile.userId
      );
      const distanceMeters = matchingRow?.distance_meters;
      return toPublicProfessionalProfile(
        profile,
        distanceMeters === undefined ? undefined : Number(distanceMeters)
      );
    });

    return { professionals, page: query.page, limit: query.limit, total };
  }

  async findPublicById(professionalId: string) {
    const profile = await this.createProfileQuery(true)
      .where('profile.userId = :professionalId', { professionalId })
      .andWhere('profile.isAvailable = true')
      .getOne();
    if (!profile) {
      throw new NotFoundException('Perfil profissional não encontrado.');
    }

    return toPublicProfessionalProfile(profile);
  }

  async findOwn(userId: string) {
    const profile = await this.createProfileQuery(false)
      .where('profile.userId = :userId', { userId })
      .getOne();
    if (!profile) {
      throw new NotFoundException('Perfil profissional não encontrado.');
    }

    return toPrivateProfessionalProfile(profile);
  }

  async updateOwn(userId: string, dto: UpdateProfessionalProfileDto) {
    const existingProfile = await this.profilesRepository.findOne({ where: { userId } });
    const profile = existingProfile || this.profilesRepository.create({ userId });

    this.profilesRepository.merge(profile, {
      bio: dto.bio.trim(),
      phone: normalizePhone(dto.phone),
      city: dto.city.trim(),
      state: dto.state.toUpperCase(),
      location: { type: 'Point', coordinates: [dto.longitude, dto.latitude] },
      serviceRadiusKm: dto.serviceRadiusKm,
      yearsOfExperience: dto.yearsOfExperience,
      isAvailable: dto.isAvailable
    });
    await this.profilesRepository.save(profile);

    return this.findOwn(userId);
  }

  async replaceOwnServices(userId: string, dto: ReplaceProfessionalServicesDto) {
    const profileExists = await this.profilesRepository.exists({ where: { userId } });
    if (!profileExists) {
      throw new NotFoundException('Crie o perfil profissional antes de adicionar serviços.');
    }

    const serviceIds = dto.services.map((professionalService) => professionalService.serviceId);
    if (new Set(serviceIds).size !== serviceIds.length) {
      throw new BadRequestException('A lista contém serviços duplicados.');
    }

    const activeServices = serviceIds.length
      ? await this.servicesRepository.findBy({ id: In(serviceIds), isActive: true })
      : [];
    if (activeServices.length !== serviceIds.length) {
      throw new BadRequestException('Um ou mais serviços informados não existem ou estão inativos.');
    }

    await this.professionalServicesRepository.manager.transaction(async (manager) => {
      await manager.delete(ProfessionalService, { professionalId: userId });
      if (!dto.services.length) {
        return;
      }

      const professionalServices = dto.services.map((serviceDto) =>
        manager.create(ProfessionalService, {
          professionalId: userId,
          serviceId: serviceDto.serviceId,
          basePrice: serviceDto.basePrice === undefined ? null : serviceDto.basePrice.toFixed(2),
          description: serviceDto.description?.trim() || null,
          isActive: serviceDto.isActive
        })
      );
      await manager.save(ProfessionalService, professionalServices);
    });

    return this.findOwn(userId);
  }

  private createProfileQuery(onlyActiveServices: boolean) {
    const professionalServiceCondition = onlyActiveServices
      ? 'professionalService.isActive = true'
      : undefined;
    const serviceCondition = onlyActiveServices ? 'service.isActive = true' : undefined;

    return this.profilesRepository
      .createQueryBuilder('profile')
      .innerJoinAndSelect('profile.user', 'user', 'user.isActive = true')
      .leftJoinAndSelect('profile.services', 'professionalService', professionalServiceCondition)
      .leftJoinAndSelect('professionalService.service', 'service', serviceCondition);
  }

  private createLocationExpression() {
    return 'ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography';
  }

  private validateLocationQuery(query: FindProfessionalsQueryDto) {
    const hasLatitude = query.latitude !== undefined;
    const hasLongitude = query.longitude !== undefined;
    if (hasLatitude !== hasLongitude) {
      throw new BadRequestException('latitude e longitude devem ser informadas juntas.');
    }
    if (query.radiusKm !== undefined && !hasLatitude) {
      throw new BadRequestException('radiusKm exige latitude e longitude.');
    }
  }
}
