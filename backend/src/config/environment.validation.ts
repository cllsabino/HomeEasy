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
}

export function validateEnvironment(environment: Record<string, unknown>): EnvironmentVariables {
  const requiredKeys = [
    'FRONTEND_ORIGINS',
    'DATABASE_HOST',
    'DATABASE_NAME',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'JWT_ACCESS_SECRET'
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
    DATABASE_PORT: Number(environment.DATABASE_PORT || 5433),
    DATABASE_NAME: readString(environment.DATABASE_NAME),
    DATABASE_USER: readString(environment.DATABASE_USER),
    DATABASE_PASSWORD: readString(environment.DATABASE_PASSWORD),
    JWT_ACCESS_SECRET: accessSecret,
    JWT_ACCESS_EXPIRES_IN: readString(environment.JWT_ACCESS_EXPIRES_IN, '15m'),
    REFRESH_TOKEN_DAYS: Number(environment.REFRESH_TOKEN_DAYS || 30)
  };
}

function readString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}
