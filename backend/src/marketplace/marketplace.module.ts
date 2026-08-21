import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfessionalProfile } from '../professionals/professional-profile.entity';
import { Service } from '../services/service.entity';
import { StorageModule } from '../storage/storage.module';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { Order } from './order.entity';
import { Proposal } from './proposal.entity';
import { ServiceRequest } from './service-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRequest, Proposal, Order, Service, ProfessionalProfile]),
    StorageModule
  ],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService]
})
export class MarketplaceModule {}
