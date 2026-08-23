import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';

import { normalizeEmail } from '../shared/utils/email.utils';
import { assertAdultBirthDate } from '../shared/utils/birth-date.utils';
import { normalizePhone } from '../shared/utils/phone.utils';
import { normalizeDocument } from '../shared/utils/document.utils';
import { MediaPurpose } from '../storage/media-purpose.enum';
import { StorageService } from '../storage/storage.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfile } from './user-profile.entity';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  findById(userId: string) {
    return this.usersRepository.findOne({ where: { id: userId, isActive: true } });
  }

  findByEmailWithPassword(email: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: normalizeEmail(email) })
      .andWhere('user.isActive = true')
      .getOne();
  }

  create(name: string, email: string, passwordHash: string, birthDate: string) {
    assertAdultBirthDate(birthDate);
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.save(
        manager.create(User, {
          name: name.trim(),
          email: normalizeEmail(email),
          passwordHash
        })
      );
      await manager.save(manager.create(UserProfile, { userId: user.id, birthDate }));
      return user;
    });
  }

  async findOwnProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId, isActive: true } });
    if (!user) {
      return null;
    }
    const profile = await this.dataSource.getRepository(UserProfile).findOne({ where: { userId } });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberSince: user.createdAt,
      phone: profile?.phone || null,
      birthDate: profile?.birthDate || null,
      profilePhotoMediaId: profile?.profilePhotoMediaId || null,
      address: profile?.address || null,
      city: profile?.city || null,
      state: profile?.state || null,
      cpf: profile?.cpf || null,
      cnpj: profile?.cnpj || null,
      instagram: profile?.instagram || null,
      facebook: profile?.facebook || null,
      twitter: profile?.twitter || null,
      website: profile?.website || null,
      linkedin: profile?.linkedin || null
    };
  }

  async updateOwnProfile(userId: string, dto: UpdateUserProfileDto) {
    try {
      await this.dataSource.transaction(async (manager) => {
        if (dto.profilePhotoMediaId !== undefined) {
          await this.storageService.attachToContext(
            dto.profilePhotoMediaId,
            userId,
            MediaPurpose.ProfilePhoto,
            userId,
            manager
          );
        }
        if (dto.name) {
          await manager.update(User, { id: userId }, { name: dto.name.trim() });
        }
        const existingProfile = await manager.findOne(UserProfile, { where: { userId } });
        const profile = existingProfile || manager.create(UserProfile, { userId });
        if (dto.phone !== undefined) {
          profile.phone = normalizePhone(dto.phone);
        }
        if (dto.birthDate !== undefined) {
          assertAdultBirthDate(dto.birthDate);
          profile.birthDate = dto.birthDate;
        }
        if (dto.profilePhotoMediaId !== undefined) {
          profile.profilePhotoMediaId = dto.profilePhotoMediaId;
        }
        if (dto.address !== undefined) {
          profile.address = dto.address.trim() || null;
        }
        if (dto.city !== undefined) {
          profile.city = dto.city.trim() || null;
        }
        if (dto.state !== undefined) {
          profile.state = dto.state.toUpperCase();
        }
        if (dto.cpf !== undefined) {
          profile.cpf = dto.cpf ? normalizeDocument(dto.cpf) : null;
          profile.cnpj = null;
        }
        if (dto.cnpj !== undefined) {
          profile.cnpj = dto.cnpj ? normalizeDocument(dto.cnpj) : null;
          profile.cpf = null;
        }
        if (dto.instagram !== undefined) {
          profile.instagram = dto.instagram.trim() || null;
        }
        if (dto.facebook !== undefined) {
          profile.facebook = dto.facebook.trim() || null;
        }
        if (dto.twitter !== undefined) {
          profile.twitter = dto.twitter.trim() || null;
        }
        if (dto.website !== undefined) {
          profile.website = dto.website.trim() || null;
        }
        if (dto.linkedin !== undefined) {
          profile.linkedin = dto.linkedin.trim() || null;
        }
        await manager.save(profile);
      });
    } catch (error) {
      if (error instanceof QueryFailedError && (error.driverError as { code?: string }).code === '23505') {
        throw new ConflictException('O CPF ou CNPJ informado já pertence a outra conta.');
      }
      throw error;
    }
    return this.findOwnProfile(userId);
  }

  async findPublicIdentity(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId, isActive: true } });
    if (!user) {
      return null;
    }
    const profile = await this.dataSource.getRepository(UserProfile).findOne({ where: { userId } });
    return {
      id: user.id,
      name: user.name,
      memberSince: user.createdAt,
      profilePhotoMediaId: profile?.profilePhotoMediaId || null
    };
  }
}
