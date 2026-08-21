import { IsEnum, IsString, Length } from 'class-validator';

import { DisputeReason } from '../moderation.enums';

export class CreateDisputeDto {
  @IsEnum(DisputeReason)
  reason: DisputeReason;

  @IsString()
  @Length(20, 3000)
  description: string;
}
