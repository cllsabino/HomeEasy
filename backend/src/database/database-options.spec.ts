import { createDatabaseOptions } from './database-options';

describe('createDatabaseOptions', () => {
  it('uses the pooled URL for the application connection', () => {
    const environment = {
      DATABASE_URL: 'postgresql://user:password@pooled.example.com/homeeasy',
      DATABASE_DIRECT_URL: 'postgresql://user:password@direct.example.com/homeeasy',
      DATABASE_SSL: true,
      DATABASE_POOL_SIZE: 5
    };

    const options = createDatabaseOptions((key) => environment[key as keyof typeof environment]);

    expect(options).toMatchObject({
      url: environment.DATABASE_URL,
      ssl: { rejectUnauthorized: true },
      extra: { max: 5 }
    });
  });

  it('uses the direct URL for migrations', () => {
    const environment = {
      DATABASE_URL: 'postgresql://user:password@pooled.example.com/homeeasy',
      DATABASE_DIRECT_URL: 'postgresql://user:password@direct.example.com/homeeasy',
      DATABASE_SSL: 'true'
    };

    const options = createDatabaseOptions((key) => environment[key as keyof typeof environment], true);

    expect(options).toMatchObject({ url: environment.DATABASE_DIRECT_URL });
  });

  it('keeps the local database configuration compatible', () => {
    const environment = {
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: '5435',
      DATABASE_NAME: 'homeeasy',
      DATABASE_USER: 'homeeasy',
      DATABASE_PASSWORD: 'local-password',
      DATABASE_SSL: 'false'
    };

    const options = createDatabaseOptions((key) => environment[key as keyof typeof environment]);

    expect(options).toMatchObject({
      host: 'localhost',
      port: 5435,
      database: 'homeeasy',
      username: 'homeeasy',
      password: 'local-password',
      ssl: false,
      extra: { max: 5 }
    });
  });
});
