import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length, Max, Min } from 'class-validator';

import { MessageType } from '../communication.enums';

export class SendMessageDto {
  @IsEnum(MessageType)
  type: MessageType;

  @IsOptional()
  @IsString()
  @Length(1, 3000)
  content?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(99999999)
  budgetAmount?: number;

  @IsOptional()
  @IsUUID()
  mediaId?: string;
}
