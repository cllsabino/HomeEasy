import { IsDateString, IsOptional, IsString, IsUUID, Length, Matches, MaxLength } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @Length(3, 160)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/)
  phone?: string | null;

  @IsOptional()
  @IsDateString({ strict: true })
  birthDate?: string | null;

  @IsOptional()
  @IsUUID()
  profilePhotoMediaId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string | null;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/)
  cpf?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^\d{14}$/)
  cnpj?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  instagram?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  facebook?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  twitter?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  website?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  linkedin?: string | null;
}
