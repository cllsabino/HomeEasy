import { IsString, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @Length(32, 200)
  token: string;

  @IsString()
  @Length(10, 72)
  @Matches(/[a-z]/, { message: 'A senha deve conter uma letra minúscula.' })
  @Matches(/[A-Z]/, { message: 'A senha deve conter uma letra maiúscula.' })
  @Matches(/[0-9]/, { message: 'A senha deve conter um número.' })
  password: string;
}
