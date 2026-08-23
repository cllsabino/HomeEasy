interface EnvironmentVariables {
  NODE_ENV: string;
  PORT: number;
  FRONTEND_ORIGINS: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  REFRESH_TOKEN_DAYS: number;
  MINIO_ENDPOINT: string;
  MINIO_PORT: number;
  MINIO_USE_SSL: boolean;
  MINIO_ACCESS_KEY: string;
  MINIO_SECRET_KEY: string;
  MINIO_BUCKET: string;
  FRONTEND_BASE_URL: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_FROM: string;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
}

export function validateEnvironment(environment: Record<string, unknown>): EnvironmentVariables {
  const requiredKeys = [
    'FRONTEND_ORIGINS',
    'DATABASE_HOST',
    'DATABASE_NAME',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'JWT_ACCESS_SECRET',
    'MINIO_ENDPOINT',
    'MINIO_ACCESS_KEY',
    'MINIO_SECRET_KEY',
    'MINIO_BUCKET'
  ];
  const missingKeys = requiredKeys.filter((key) => !readString(environment[key]).trim());

  if (missingKeys.length) {
    throw new Error(`Variáveis de ambiente obrigatórias ausentes: ${missingKeys.join(', ')}.`);
  }

  const accessSecret = readString(environment.JWT_ACCESS_SECRET);
  if (accessSecret.length < 32) {
    throw new Error('JWT_ACCESS_SECRET deve possuir pelo menos 32 caracteres.');
  }

  return {
    NODE_ENV: readString(environment.NODE_ENV, 'development'),
    PORT: Number(environment.PORT || 3000),
    FRONTEND_ORIGINS: readString(environment.FRONTEND_ORIGINS),
    DATABASE_HOST: readString(environment.DATABASE_HOST),
    DATABASE_PORT: Number(environment.DATABASE_PORT || 5435),
    DATABASE_NAME: readString(environment.DATABASE_NAME),
    DATABASE_USER: readString(environment.DATABASE_USER),
    DATABASE_PASSWORD: readString(environment.DATABASE_PASSWORD),
    JWT_ACCESS_SECRET: accessSecret,
    JWT_ACCESS_EXPIRES_IN: readString(environment.JWT_ACCESS_EXPIRES_IN, '15m'),
    REFRESH_TOKEN_DAYS: Number(environment.REFRESH_TOKEN_DAYS || 30),
    MINIO_ENDPOINT: readString(environment.MINIO_ENDPOINT),
    MINIO_PORT: Number(environment.MINIO_PORT || 9000),
    MINIO_USE_SSL: readString(environment.MINIO_USE_SSL, 'false') === 'true',
    MINIO_ACCESS_KEY: readString(environment.MINIO_ACCESS_KEY),
    MINIO_SECRET_KEY: readString(environment.MINIO_SECRET_KEY),
    MINIO_BUCKET: readString(environment.MINIO_BUCKET),
    FRONTEND_BASE_URL: readString(environment.FRONTEND_BASE_URL, 'http://localhost:4200'),
    SMTP_HOST: readString(environment.SMTP_HOST, 'localhost'),
    SMTP_PORT: Number(environment.SMTP_PORT || 1025),
    SMTP_SECURE: readString(environment.SMTP_SECURE, 'false') === 'true',
    SMTP_FROM: readString(environment.SMTP_FROM, 'Home Easy <nao-responda@homeeasy.local>'),
    SMTP_USER: readString(environment.SMTP_USER),
    SMTP_PASSWORD: readString(environment.SMTP_PASSWORD)
  };
}

function readString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}
