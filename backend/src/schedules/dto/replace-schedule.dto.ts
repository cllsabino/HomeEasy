import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested
} from 'class-validator';

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export class AvailabilityPeriodDto {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number;

  @IsString()
  @Matches(timePattern)
  startTime: string;

  @IsString()
  @Matches(timePattern)
  endTime: string;
}

export class AvailabilityExceptionDto {
  @IsDateString({ strict: true })
  date: string;

  @IsBoolean()
  isUnavailable: boolean;

  @IsOptional()
  @IsString()
  @Matches(timePattern)
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(timePattern)
  endTime?: string;
}

export class ReplaceScheduleDto {
  @IsArray()
  @ArrayMaxSize(42)
  @ValidateNested({ each: true })
  @Type(() => AvailabilityPeriodDto)
  periods: AvailabilityPeriodDto[];

  @IsArray()
  @ArrayMaxSize(120)
  @ValidateNested({ each: true })
  @Type(() => AvailabilityExceptionDto)
  exceptions: AvailabilityExceptionDto[];
}
