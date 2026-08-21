import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfessionalProfile } from '../professionals/professional-profile.entity';
import { AvailabilityException } from './availability-exception.entity';
import { AvailabilityPeriod } from './availability-period.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

@Module({
  imports: [TypeOrmModule.forFeature([AvailabilityPeriod, AvailabilityException, ProfessionalProfile])],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService]
})
export class SchedulesModule {}
