import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from '../marketplace/order.entity';
import { CommunicationsController } from './communications.controller';
import { CommunicationsService } from './communications.service';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';
import { Notification } from './notification.entity';
import { UserBlock } from './user-block.entity';
import { UserPresence } from './user-presence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message, Notification, UserBlock, UserPresence, Order])],
  controllers: [CommunicationsController],
  providers: [CommunicationsService]
})
export class CommunicationsModule {}
