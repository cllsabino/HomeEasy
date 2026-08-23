import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDirectedRequestNotification1787382000000 implements MigrationInterface {
  name = 'AddDirectedRequestNotification1787382000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'new_service_request'`);
  }

  async down(): Promise<void> {
    // PostgreSQL não remove valores de enum de forma segura sem recriar o tipo.
  }
}
