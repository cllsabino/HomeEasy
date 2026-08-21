import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { normalizeEmail } from '../shared/utils/email.utils';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
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
}
