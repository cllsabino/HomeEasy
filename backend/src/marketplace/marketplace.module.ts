import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../mail/mail.module';
import { ProfessionalProfile } from '../professionals/professional-profile.entity';
import { ProfessionalsModule } from '../professionals/professionals.module';
import { Service } from '../services/service.entity';
import { StorageModule } from '../storage/storage.module';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceExpirationService } from './marketplace-expiration.service';
import { MarketplaceService } from './marketplace.service';
import { Order } from './order.entity';
import { Proposal } from './proposal.entity';
import { ServiceRequest } from './service-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRequest, Proposal, Order, Service, ProfessionalProfile]),
    MailModule,
    StorageModule,
    ProfessionalsModule
  ],
  controllers: [MarketplaceController],
  providers: [MarketplaceService, MarketplaceExpirationService],
  exports: [MarketplaceService]
})
export class MarketplaceModule {}
