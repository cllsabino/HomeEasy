import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min
} from 'class-validator';

export class UpdateProfessionalProfileDto {
  @IsString()
  @Length(40, 2000)
  bio: string;

  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'phone deve conter entre 10 e 15 dígitos.' })
  phone: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @Matches(/^[A-Za-z]{2}$/, { message: 'state deve usar a sigla de duas letras.' })
  state: string;

  @Type(() => Number)
  @IsLatitude()
  latitude: number;

  @Type(() => Number)
  @IsLongitude()
  longitude: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(300)
  serviceRadiusKm: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(80)
  yearsOfExperience: number;

  @IsBoolean()
  isAvailable: boolean;
}
