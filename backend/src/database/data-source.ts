import 'dotenv/config';
import { DataSource } from 'typeorm';

import { createDatabaseOptions } from './database-options';

export default new DataSource({
  ...createDatabaseOptions((key) => process.env[key], true),
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false
});
