import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserProfiles1787364000000 implements MigrationInterface {
  name = 'CreateUserProfiles1787364000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE user_profiles (
        user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        phone varchar(20),
        birth_date date,
        address varchar(200),
        city varchar(100),
        state varchar(2),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT user_profiles_state_check CHECK (state IS NULL OR state = upper(state))
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS user_profiles');
  }
}
