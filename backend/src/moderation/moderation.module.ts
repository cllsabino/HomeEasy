import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from '../marketplace/order.entity';
import { AdminGuard } from '../auth/admin.guard';
import { ProfessionalProfile } from '../professionals/professional-profile.entity';
import { StorageModule } from '../storage/storage.module';
import { Dispute } from './dispute.entity';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';
import { Report } from './report.entity';
import { VerificationDocument } from './verification-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationDocument, Report, Dispute, Order, ProfessionalProfile]),
    StorageModule
  ],
  controllers: [ModerationController],
  providers: [ModerationService, AdminGuard]
})
export class ModerationModule {}
