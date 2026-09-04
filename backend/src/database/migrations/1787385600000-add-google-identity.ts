import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGoogleIdentity1787385600000 implements MigrationInterface {
  name = 'AddGoogleIdentity1787385600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" ADD COLUMN "google_subject" varchar(255)');
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_users_google_subject" ON "users" ("google_subject") WHERE "google_subject" IS NOT NULL'
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_users_google_subject"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "google_subject"');
  }
}
