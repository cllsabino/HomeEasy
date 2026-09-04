import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4096)
  idToken: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
