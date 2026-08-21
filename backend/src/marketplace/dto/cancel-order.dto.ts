import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

import { CancellationReason } from '../marketplace.enums';

export class CancelOrderDto {
  @IsEnum(CancellationReason)
  reason: CancellationReason;

  @IsOptional()
  @IsString()
  @Length(5, 500)
  details?: string;
}
