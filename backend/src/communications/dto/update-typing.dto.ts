import { IsBoolean, IsUUID } from 'class-validator';

export class UpdateTypingDto {
  @IsUUID()
  conversationId: string;

  @IsBoolean()
  isTyping: boolean;
}
