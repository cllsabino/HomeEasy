import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly frontendBaseUrl: string;
  private readonly from: string;
  private readonly transporter: Transporter;

  constructor(configService: ConfigService) {
    this.frontendBaseUrl = configService.getOrThrow<string>('FRONTEND_BASE_URL');
    this.from = configService.getOrThrow<string>('SMTP_FROM');
    const user = configService.get<string>('SMTP_USER');
    const password = configService.get<string>('SMTP_PASSWORD');
    this.transporter = nodemailer.createTransport({
      host: configService.getOrThrow<string>('SMTP_HOST'),
      port: configService.getOrThrow<number>('SMTP_PORT'),
      secure: configService.getOrThrow<boolean>('SMTP_SECURE'),
      auth: user && password ? { user, pass: password } : undefined
    });
  }

  async sendPasswordReset(email: string, rawToken: string) {
    const resetUrl = `${this.frontendBaseUrl}/redefinir-senha?token=${encodeURIComponent(rawToken)}`;
    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: 'Redefina sua senha do Home Easy',
      text: `Use este link para redefinir sua senha. Ele expira em 30 minutos: ${resetUrl}`,
      html: `<p>Recebemos uma solicitação para redefinir sua senha.</p><p><a href="${resetUrl}">Criar uma nova senha</a></p><p>O link expira em 30 minutos.</p>`
    });
  }
}
