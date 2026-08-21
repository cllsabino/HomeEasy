import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModeration1787353200000 implements MigrationInterface {
  name = 'CreateModeration1787353200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE professional_verification_status ADD VALUE IF NOT EXISTS 'identity_verified'`
    );
    await queryRunner.query(
      `ALTER TYPE professional_verification_status ADD VALUE IF NOT EXISTS 'professional_verified'`
    );
    await queryRunner.query(`ALTER TYPE professional_verification_status ADD VALUE IF NOT EXISTS 'featured'`);
    await queryRunner.query(
      `CREATE TYPE verification_document_type AS ENUM ('identity', 'address_proof', 'professional_certificate')`
    );
    await queryRunner.query(
      `CREATE TYPE moderation_status AS ENUM ('pending', 'in_review', 'approved', 'rejected', 'resolved')`
    );
    await queryRunner.query(
      `CREATE TYPE report_category AS ENUM ('fraud', 'harassment', 'inappropriate_content', 'suspicious_request', 'off_platform_payment', 'other')`
    );
    await queryRunner.query(
      `CREATE TYPE dispute_reason AS ENUM ('service_not_performed', 'service_quality', 'price_conflict', 'property_damage', 'conduct', 'other')`
    );
    await queryRunner.query(`
      CREATE TABLE verification_documents (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        professional_id uuid NOT NULL REFERENCES professional_profiles(user_id) ON DELETE CASCADE,
        media_id uuid NOT NULL UNIQUE REFERENCES media_objects(id) ON DELETE RESTRICT,
        type verification_document_type NOT NULL,
        status moderation_status NOT NULL DEFAULT 'pending',
        review_notes text,
        reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
        reviewed_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      'CREATE INDEX verification_documents_queue_index ON verification_documents(status, created_at)'
    );
    await queryRunner.query(`
      CREATE TABLE reports (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        reporter_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        target_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
        order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
        conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
        review_id uuid REFERENCES reviews(id) ON DELETE SET NULL,
        category report_category NOT NULL,
        description text NOT NULL,
        status moderation_status NOT NULL DEFAULT 'pending',
        resolution_notes text,
        reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT reports_target_check CHECK (
          target_user_id IS NOT NULL OR order_id IS NOT NULL OR conversation_id IS NOT NULL OR review_id IS NOT NULL
        )
      )
    `);
    await queryRunner.query('CREATE INDEX reports_queue_index ON reports(status, created_at)');
    await queryRunner.query(`
      CREATE TABLE disputes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id uuid NOT NULL UNIQUE REFERENCES orders(id) ON DELETE RESTRICT,
        opened_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        reason dispute_reason NOT NULL,
        description text NOT NULL,
        status moderation_status NOT NULL DEFAULT 'pending',
        resolution_notes text,
        reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query('CREATE INDEX disputes_queue_index ON disputes(status, created_at)');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS disputes');
    await queryRunner.query('DROP TABLE IF EXISTS reports');
    await queryRunner.query('DROP TABLE IF EXISTS verification_documents');
    await queryRunner.query('DROP TYPE IF EXISTS dispute_reason');
    await queryRunner.query('DROP TYPE IF EXISTS report_category');
    await queryRunner.query('DROP TYPE IF EXISTS moderation_status');
    await queryRunner.query('DROP TYPE IF EXISTS verification_document_type');
  }
}
