import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator';

export class ProfessionalServiceDto {
  @IsString()
  @MaxLength(12)
  serviceId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  basePrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsBoolean()
  isActive: boolean;
}

export class ReplaceProfessionalServicesDto {
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => ProfessionalServiceDto)
  services: ProfessionalServiceDto[];
}
