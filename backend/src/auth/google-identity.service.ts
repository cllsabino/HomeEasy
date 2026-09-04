import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

export interface GoogleIdentity {
  subject: string;
  email: string;
  name: string;
}

@Injectable()
export class GoogleIdentityService {
  private readonly client = new OAuth2Client();
  private readonly clientIds: string[];

  constructor(configService: ConfigService) {
    this.clientIds = configService
      .get<string>('GOOGLE_OAUTH_CLIENT_IDS', '')
      .split(',')
      .map((clientId) => clientId.trim())
      .filter(Boolean);
  }

  async verify(idToken: string): Promise<GoogleIdentity> {
    if (!this.clientIds.length) {
      throw new ServiceUnavailableException('O login com Google ainda não está configurado.');
    }

    try {
      const ticket = await this.client.verifyIdToken({ idToken, audience: this.clientIds });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email || !payload.email_verified || !payload.name) {
        throw new UnauthorizedException('A conta Google não possui uma identidade verificada completa.');
      }
      return { subject: payload.sub, email: payload.email, name: payload.name };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('A credencial Google é inválida ou expirou.');
    }
  }
}
