import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Service } from '../services/service.entity';
import { ProfessionalProfile } from './professional-profile.entity';
import { ProfessionalService } from './professional-service.entity';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalProfile, ProfessionalService, Service])],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
  exports: [ProfessionalsService]
})
export class ProfessionalsModule {}
