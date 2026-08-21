import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFoundation1724083200000 implements MigrationInterface {
  name = 'CreateFoundation1724083200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "postgis"');
    await queryRunner.query("CREATE TYPE user_role AS ENUM ('user', 'admin')");
    await queryRunner.query(`
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(160) NOT NULL,
        email varchar(254) NOT NULL UNIQUE,
        password_hash varchar NOT NULL,
        role user_role NOT NULL DEFAULT 'user',
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE refresh_tokens (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        token_hash varchar(64) NOT NULL UNIQUE,
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at timestamptz NOT NULL,
        revoked_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query('CREATE INDEX refresh_tokens_user_id_index ON refresh_tokens(user_id)');
    await queryRunner.query(`
      CREATE TABLE services (
        id varchar(12) PRIMARY KEY,
        name varchar(120) NOT NULL UNIQUE,
        category varchar(80) NOT NULL,
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS services');
    await queryRunner.query('DROP TABLE IF EXISTS refresh_tokens');
    await queryRunner.query('DROP TABLE IF EXISTS users');
    await queryRunner.query('DROP TYPE IF EXISTS user_role');
  }
}
