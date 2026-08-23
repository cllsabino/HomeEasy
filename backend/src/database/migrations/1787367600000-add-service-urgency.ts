import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceUrgency1787367600000 implements MigrationInterface {
  name = 'AddServiceUrgency1787367600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE service_urgency AS ENUM ('flexible', 'this_week', 'urgent')`);
    await queryRunner.query(
      `ALTER TABLE service_requests ADD COLUMN urgency service_urgency NOT NULL DEFAULT 'flexible'`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE service_requests DROP COLUMN IF EXISTS urgency');
    await queryRunner.query('DROP TYPE IF EXISTS service_urgency');
  }
}
