import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendUserProfiles1787374800000 implements MigrationInterface {
  name = 'ExtendUserProfiles1787374800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE user_profiles
      ADD COLUMN cpf varchar(11),
      ADD COLUMN cnpj varchar(14),
      ADD COLUMN instagram varchar(120),
      ADD COLUMN facebook varchar(300),
      ADD COLUMN twitter varchar(120),
      ADD COLUMN website varchar(300),
      ADD COLUMN linkedin varchar(300),
      ADD CONSTRAINT user_profiles_cpf_format CHECK (cpf IS NULL OR cpf ~ '^[0-9]{11}$'),
      ADD CONSTRAINT user_profiles_cnpj_format CHECK (cnpj IS NULL OR cnpj ~ '^[0-9]{14}$')
    `);
    await queryRunner.query(
      'CREATE UNIQUE INDEX user_profiles_cpf_unique ON user_profiles(cpf) WHERE cpf IS NOT NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX user_profiles_cnpj_unique ON user_profiles(cnpj) WHERE cnpj IS NOT NULL'
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS user_profiles_cnpj_unique');
    await queryRunner.query('DROP INDEX IF EXISTS user_profiles_cpf_unique');
    await queryRunner.query(`
      ALTER TABLE user_profiles
      DROP CONSTRAINT IF EXISTS user_profiles_cnpj_format,
      DROP CONSTRAINT IF EXISTS user_profiles_cpf_format,
      DROP COLUMN IF EXISTS linkedin,
      DROP COLUMN IF EXISTS website,
      DROP COLUMN IF EXISTS twitter,
      DROP COLUMN IF EXISTS facebook,
      DROP COLUMN IF EXISTS instagram,
      DROP COLUMN IF EXISTS cnpj,
      DROP COLUMN IF EXISTS cpf
    `);
  }
}
