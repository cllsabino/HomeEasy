import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEngagement1787342400000 implements MigrationInterface {
  name = 'CreateEngagement1787342400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE service_requests
      ADD COLUMN preferred_professional_id uuid REFERENCES professional_profiles(user_id) ON DELETE SET NULL
    `);
    await queryRunner.query(`
      CREATE TABLE favorites (
        client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        professional_id uuid NOT NULL REFERENCES professional_profiles(user_id) ON DELETE CASCADE,
        created_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (client_id, professional_id),
        CONSTRAINT favorites_different_users_check CHECK (client_id <> professional_id)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE reviews (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id uuid NOT NULL UNIQUE REFERENCES orders(id) ON DELETE RESTRICT,
        client_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        professional_id uuid NOT NULL REFERENCES professional_profiles(user_id) ON DELETE RESTRICT,
        rating smallint NOT NULL,
        comment text NOT NULL,
        professional_response text,
        responded_at timestamptz,
        is_published boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5)
      )
    `);
    await queryRunner.query(
      'CREATE INDEX reviews_professional_index ON reviews(professional_id, is_published, created_at DESC)'
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS reviews');
    await queryRunner.query('DROP TABLE IF EXISTS favorites');
    await queryRunner.query('ALTER TABLE service_requests DROP COLUMN IF EXISTS preferred_professional_id');
  }
}
