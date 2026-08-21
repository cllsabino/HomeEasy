import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceRequestForms1787356800000 implements MigrationInterface {
  name = 'AddServiceRequestForms1787356800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE services ADD COLUMN request_form jsonb NOT NULL DEFAULT '[]'::jsonb`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE services DROP COLUMN IF EXISTS request_form');
  }
}
