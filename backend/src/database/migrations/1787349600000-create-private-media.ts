import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePrivateMedia1787349600000 implements MigrationInterface {
  name = 'CreatePrivateMedia1787349600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE media_purpose AS ENUM ('request_attachment', 'chat_attachment', 'verification_document')`
    );
    await queryRunner.query(`
      CREATE TABLE media_objects (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        purpose media_purpose NOT NULL,
        object_key varchar(500) NOT NULL UNIQUE,
        file_name varchar(180) NOT NULL,
        content_type varchar(100) NOT NULL,
        size integer NOT NULL,
        context_id uuid,
        uploaded_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT media_objects_size_check CHECK (size BETWEEN 1 AND 10485760)
      )
    `);
    await queryRunner.query(
      'CREATE INDEX media_objects_owner_index ON media_objects(owner_id, created_at DESC)'
    );
    await queryRunner.query('CREATE INDEX media_objects_context_index ON media_objects(purpose, context_id)');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS media_objects');
    await queryRunner.query('DROP TYPE IF EXISTS media_purpose');
  }
}
