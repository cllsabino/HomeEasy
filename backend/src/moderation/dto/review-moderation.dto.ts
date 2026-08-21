import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

import { ModerationStatus } from '../moderation.enums';

export class ReviewModerationDto {
  @IsEnum(ModerationStatus)
  status: ModerationStatus;

  @IsOptional()
  @IsString()
  @Length(5, 2000)
  notes?: string;
}
