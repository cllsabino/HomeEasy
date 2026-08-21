import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePasswordReset1787360400000 implements MigrationInterface {
  name = 'CreatePasswordReset1787360400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE password_reset_tokens (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        token_hash varchar(64) NOT NULL UNIQUE,
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at timestamptz NOT NULL,
        used_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      'CREATE INDEX password_reset_tokens_user_index ON password_reset_tokens(user_id, expires_at DESC)'
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS password_reset_tokens');
  }
}
