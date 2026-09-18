import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePushDevices1787389200000 implements MigrationInterface {
  name = 'CreatePushDevices1787389200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "push_devices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "token" varchar(255) NOT NULL,
        "platform" varchar(20) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_push_devices" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_push_devices_token" UNIQUE ("token"),
        CONSTRAINT "FK_push_devices_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_push_devices_user_active" ON "push_devices" ("user_id", "is_active")'
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "push_devices"');
  }
}
