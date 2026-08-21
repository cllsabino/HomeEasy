import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from '../marketplace/order.entity';
import { ProfessionalProfile } from '../professionals/professional-profile.entity';
import { EngagementController } from './engagement.controller';
import { EngagementService } from './engagement.service';
import { Favorite } from './favorite.entity';
import { Review } from './review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Review, Order, ProfessionalProfile])],
  controllers: [EngagementController],
  providers: [EngagementService]
})
export class EngagementModule {}
