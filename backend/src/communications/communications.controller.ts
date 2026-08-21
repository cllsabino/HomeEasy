import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';

import { AuthenticatedUser } from '../auth/authenticated-user.decorator';
import { PublicUser } from '../shared/utils/public-user.utils';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateTypingDto } from './dto/update-typing.dto';
import { CommunicationsService } from './communications.service';

@Controller()
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationsService) {}

  @Post('conversations/orders/:orderId')
  createFromOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser
  ) {
    return this.communicationsService.createFromOrder(orderId, authenticatedUser.id);
  }

  @Get('conversations')
  findConversations(@AuthenticatedUser() authenticatedUser: PublicUser) {
    return this.communicationsService.findConversations(authenticatedUser.id);
  }

  @Get('conversations/:conversationId/messages')
  findMessages(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Query('before') before?: string
  ) {
    return this.communicationsService.findMessages(conversationId, authenticatedUser.id, before);
  }

  @Post('conversations/:conversationId/messages')
  sendMessage(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Body() sendMessageDto: SendMessageDto
  ) {
    return this.communicationsService.sendMessage(conversationId, authenticatedUser.id, sendMessageDto);
  }

  @Patch('conversations/:conversationId/read')
  markConversationRead(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser
  ) {
    return this.communicationsService.markConversationRead(conversationId, authenticatedUser.id);
  }

  @Put('presence')
  updatePresence(
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Body() updateTypingDto: UpdateTypingDto
  ) {
    return this.communicationsService.updatePresence(
      authenticatedUser.id,
      updateTypingDto.conversationId,
      updateTypingDto.isTyping
    );
  }

  @Get('conversations/:conversationId/presence')
  findPresence(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser
  ) {
    return this.communicationsService.findPresence(conversationId, authenticatedUser.id);
  }

  @Put('blocks/:userId')
  blockUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser
  ) {
    return this.communicationsService.blockUser(authenticatedUser.id, userId);
  }

  @Delete('blocks/:userId')
  unblockUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser
  ) {
    return this.communicationsService.unblockUser(authenticatedUser.id, userId);
  }

  @Get('notifications')
  findNotifications(@AuthenticatedUser() authenticatedUser: PublicUser) {
    return this.communicationsService.findNotifications(authenticatedUser.id);
  }

  @Patch('notifications/:notificationId/read')
  markNotificationRead(
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser
  ) {
    return this.communicationsService.markNotificationRead(notificationId, authenticatedUser.id);
  }
}
