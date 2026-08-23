import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  Min
} from 'class-validator';
import { ServiceUrgency } from '../marketplace.enums';

export class CreateServiceRequestDto {
  @IsString()
  @Length(1, 12)
  serviceId: string;

  @IsString()
  @Length(20, 3000)
  description: string;

  @IsEnum(ServiceUrgency)
  urgency: ServiceUrgency;

  @IsObject()
  answers: Record<string, string | number | boolean>;

  @IsString()
  @Length(5, 200)
  address: string;

  @IsString()
  @Length(2, 100)
  city: string;

  @IsString()
  @Length(2, 2)
  state: string;

  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999)
  budgetMinimum?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999)
  budgetMaximum?: number;

  @IsOptional()
  @IsDateString()
  preferredAt?: string;
}
