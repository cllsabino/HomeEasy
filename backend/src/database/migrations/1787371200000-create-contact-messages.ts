import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactMessages1787371200000 implements MigrationInterface {
  name = 'CreateContactMessages1787371200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE contact_message_status AS ENUM ('pending', 'answered', 'archived')`);
    await queryRunner.query(`
      CREATE TABLE contact_messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(120) NOT NULL,
        email varchar(180) NOT NULL,
        phone varchar(20) NOT NULL,
        subject varchar(200) NOT NULL,
        message text NOT NULL,
        status contact_message_status NOT NULL DEFAULT 'pending',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      'CREATE INDEX contact_messages_status_index ON contact_messages(status, created_at DESC)'
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS contact_messages');
    await queryRunner.query('DROP TYPE IF EXISTS contact_message_status');
  }
}
