import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateContactMessageDto {
  @IsString({ message: 'Informe seu nome.' })
  @IsNotEmpty({ message: 'Informe seu nome.' })
  @Length(2, 120, { message: 'O nome deve ter entre 2 e 120 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'Informe seu e-mail.' })
  email: string;

  @IsString({ message: 'Informe um telefone válido.' })
  @IsNotEmpty({ message: 'Informe seu telefone.' })
  phone: string;

  @IsString({ message: 'Informe o assunto.' })
  @IsNotEmpty({ message: 'Informe o assunto.' })
  @Length(2, 200, { message: 'O assunto deve ter entre 2 e 200 caracteres.' })
  subject: string;

  @IsString({ message: 'Escreva sua mensagem.' })
  @IsNotEmpty({ message: 'Escreva sua mensagem.' })
  @Length(5, 5000, { message: 'A mensagem deve ter entre 5 e 5000 caracteres.' })
  message: string;
}
