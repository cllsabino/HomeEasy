import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { normalizeEmail } from '../shared/utils/email.utils';
import { UserRole } from './user-role.enum';
import { User } from './user.entity';

@Injectable()
export class AdminBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminBootstrapService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async onApplicationBootstrap() {
    const adminEmail = normalizeEmail(this.configService.get<string>('ADMIN_EMAIL') || '');
    if (!adminEmail) return;

    const result = await this.usersRepository.update(
      { email: adminEmail, isActive: true },
      { role: UserRole.Admin }
    );
    if (!result.affected) {
      this.logger.warn(`Nenhuma conta ativa encontrada para o ADMIN_EMAIL configurado: ${adminEmail}.`);
    }
  }
}
