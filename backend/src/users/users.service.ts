import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { normalizeEmail } from '../shared/utils/email.utils';
import { normalizePhone } from '../shared/utils/phone.utils';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfile } from './user-profile.entity';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
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

  create(name: string, email: string, passwordHash: string) {
    return this.usersRepository.save(
      this.usersRepository.create({
        name: name.trim(),
        email: normalizeEmail(email),
        passwordHash
      })
    );
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
      address: profile?.address || null,
      city: profile?.city || null,
      state: profile?.state || null
    };
  }

  async updateOwnProfile(userId: string, dto: UpdateUserProfileDto) {
    await this.dataSource.transaction(async (manager) => {
      if (dto.name) {
        await manager.update(User, { id: userId }, { name: dto.name.trim() });
      }
      const existingProfile = await manager.findOne(UserProfile, { where: { userId } });
      const profile = existingProfile || manager.create(UserProfile, { userId });
      if (dto.phone !== undefined) {
        profile.phone = normalizePhone(dto.phone);
      }
      if (dto.birthDate !== undefined) {
        profile.birthDate = dto.birthDate;
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
      await manager.save(profile);
    });
    return this.findOwnProfile(userId);
  }
}
