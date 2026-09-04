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
    expect(environment.DATABASE_PORT).toBe(5435);
    expect(environment.DATABASE_SSL).toBe(false);
    expect(environment.DATABASE_POOL_SIZE).toBe(5);
    expect(environment.REFRESH_TOKEN_DAYS).toBe(30);
    expect(environment.MINIO_USE_SSL).toBe(false);
  });

  it('accepts pooled and direct database URLs in production', () => {
    const environment = validateEnvironment({
      ...validEnvironment,
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://user:password@pooled.example.com/homeeasy?sslmode=require',
      DATABASE_DIRECT_URL: 'postgresql://user:password@direct.example.com/homeeasy?sslmode=require',
      DATABASE_SSL: 'true',
      DATABASE_POOL_SIZE: '5',
      DATABASE_HOST: undefined,
      DATABASE_NAME: undefined,
      DATABASE_USER: undefined,
      DATABASE_PASSWORD: undefined
    });

    expect(environment.DATABASE_URL).toContain('pooled.example.com');
    expect(environment.DATABASE_DIRECT_URL).toContain('direct.example.com');
    expect(environment.DATABASE_SSL).toBe(true);
    expect(environment.DATABASE_POOL_SIZE).toBe(5);
  });

  it('requires a direct database URL for production migrations', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://user:password@pooled.example.com/homeeasy?sslmode=require',
        DATABASE_SSL: 'true'
      })
    ).toThrow('DATABASE_DIRECT_URL é obrigatória em produção quando DATABASE_URL é utilizada.');
  });

  it('requires TLS for the production database', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        NODE_ENV: 'production',
        DATABASE_SSL: 'false'
      })
    ).toThrow('DATABASE_SSL deve ser true em produção.');
  });

  it('rejects an invalid database pool size', () => {
    expect(() => validateEnvironment({ ...validEnvironment, DATABASE_POOL_SIZE: '0' })).toThrow(
      'DATABASE_POOL_SIZE deve ser um número inteiro maior que zero.'
    );
  });

  it('rejects a short access token secret', () => {
    expect(() => validateEnvironment({ ...validEnvironment, JWT_ACCESS_SECRET: 'short' })).toThrow(
      'JWT_ACCESS_SECRET deve possuir pelo menos 32 caracteres.'
    );
  });
});
