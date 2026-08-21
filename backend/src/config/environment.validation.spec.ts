import { validateEnvironment } from './environment.validation';

describe('validateEnvironment', () => {
  const validEnvironment = {
    FRONTEND_ORIGINS: 'http://localhost:4200',
    DATABASE_HOST: 'localhost',
    DATABASE_NAME: 'homeeasy',
    DATABASE_USER: 'homeeasy',
    DATABASE_PASSWORD: 'local-password',
    JWT_ACCESS_SECRET: 'a-secure-development-secret-with-32-characters',
    MINIO_ENDPOINT: 'localhost',
    MINIO_ACCESS_KEY: 'homeeasy',
    MINIO_SECRET_KEY: 'local-storage-secret',
    MINIO_BUCKET: 'homeeasy-private'
  };

  it('applies safe development defaults', () => {
    const environment = validateEnvironment(validEnvironment);
    expect(environment.PORT).toBe(3000);
    expect(environment.DATABASE_PORT).toBe(5433);
    expect(environment.REFRESH_TOKEN_DAYS).toBe(30);
    expect(environment.MINIO_USE_SSL).toBe(false);
  });

  it('rejects a short access token secret', () => {
    expect(() => validateEnvironment({ ...validEnvironment, JWT_ACCESS_SECRET: 'short' })).toThrow(
      'JWT_ACCESS_SECRET deve possuir pelo menos 32 caracteres.'
    );
  });
});
