type DatabaseConfigValue = boolean | number | string | undefined;

type DatabaseConfigReader = (key: string) => DatabaseConfigValue;

export function createDatabaseOptions(readConfig: DatabaseConfigReader, useDirectUrl = false) {
  const databaseUrl = readString(readConfig(useDirectUrl ? 'DATABASE_DIRECT_URL' : 'DATABASE_URL'));
  const fallbackDatabaseUrl = useDirectUrl ? readString(readConfig('DATABASE_URL')) : '';
  const connectionUrl = databaseUrl || fallbackDatabaseUrl;
  const connectionOptions = connectionUrl
    ? { url: connectionUrl }
    : {
        host: readString(readConfig('DATABASE_HOST')),
        port: readNumber(readConfig('DATABASE_PORT'), 5435),
        database: readString(readConfig('DATABASE_NAME')),
        username: readString(readConfig('DATABASE_USER')),
        password: readString(readConfig('DATABASE_PASSWORD'))
      };

  return {
    type: 'postgres' as const,
    ...connectionOptions,
    ssl: readBoolean(readConfig('DATABASE_SSL')) ? { rejectUnauthorized: true } : false,
    extra: { max: readNumber(readConfig('DATABASE_POOL_SIZE'), 5) }
  };
}

function readString(value: DatabaseConfigValue) {
  return typeof value === 'string' ? value : '';
}

function readNumber(value: DatabaseConfigValue, fallback: number) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function readBoolean(value: DatabaseConfigValue) {
  return value === true || value === 'true';
}
