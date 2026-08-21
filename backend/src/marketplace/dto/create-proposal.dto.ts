import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min
} from 'class-validator';

export class CreateProposalDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(99999999)
  price: number;

  @IsString()
  @Length(10, 2000)
  message: string;

  @Type(() => Number)
  @IsInt()
  @Min(15)
  @Max(43200)
  estimatedDurationMinutes: number;

  @IsBoolean()
  materialsIncluded: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999)
  travelFee?: number;

  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  paymentMethods: string[];
}
