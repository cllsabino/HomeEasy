import { IsDateString, IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 160)
  name: string;

  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsDateString({ strict: true })
  birthDate: string;

  @IsString()
  @Length(10, 72)
  @Matches(/[a-z]/, { message: 'A senha deve conter uma letra minúscula.' })
  @Matches(/[A-Z]/, { message: 'A senha deve conter uma letra maiúscula.' })
  @Matches(/[0-9]/, { message: 'A senha deve conter um número.' })
  password: string;
}
