import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

import { GoogleIdentityService } from './google-identity.service';

describe('GoogleIdentityService', () => {
  afterEach(() => jest.restoreAllMocks());

  it('accepts a signed token with a verified email', async () => {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue({
      getPayload: () => ({
        sub: 'google-subject',
        email: 'person@example.com',
        email_verified: true,
        name: 'Person Name'
      })
    } as never);
    const service = new GoogleIdentityService(
      new ConfigService({ GOOGLE_OAUTH_CLIENT_IDS: 'web-client-id' })
    );

    await expect(service.verify('signed-token')).resolves.toEqual({
      subject: 'google-subject',
      email: 'person@example.com',
      name: 'Person Name'
    });
  });

  it('rejects tokens whose email is not verified', async () => {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue({
      getPayload: () => ({
        sub: 'google-subject',
        email: 'person@example.com',
        email_verified: false,
        name: 'Person Name'
      })
    } as never);
    const service = new GoogleIdentityService(
      new ConfigService({ GOOGLE_OAUTH_CLIENT_IDS: 'web-client-id' })
    );

    await expect(service.verify('signed-token')).rejects.toThrow(
      'A conta Google não possui uma identidade verificada completa.'
    );
  });

  it('reports when OAuth clients are not configured', async () => {
    const service = new GoogleIdentityService(new ConfigService({}));

    await expect(service.verify('signed-token')).rejects.toThrow(
      'O login com Google ainda não está configurado.'
    );
  });
});
