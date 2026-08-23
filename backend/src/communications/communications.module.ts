import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminGuard } from '../auth/admin.guard';
import { Order } from '../marketplace/order.entity';
import { StorageModule } from '../storage/storage.module';
import { CommunicationsController } from './communications.controller';
import { CommunicationsService } from './communications.service';
import { ContactMessage } from './contact-message.entity';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';
import { Notification } from './notification.entity';
import { UserBlock } from './user-block.entity';
import { UserPresence } from './user-presence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      Message,
      Notification,
      UserBlock,
      UserPresence,
      Order,
      ContactMessage
    ]),
    StorageModule
  ],
  controllers: [CommunicationsController],
  providers: [CommunicationsService, AdminGuard]
})
export class CommunicationsModule {}
