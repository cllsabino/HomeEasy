import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfessionalProfiles1787331600000 implements MigrationInterface {
  name = 'CreateProfessionalProfiles1787331600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE professional_verification_status AS ENUM (
        'not_submitted',
        'pending',
        'verified',
        'rejected'
      )
    `);
    await queryRunner.query(`
      CREATE TABLE professional_profiles (
        user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        bio text NOT NULL,
        phone varchar(20) NOT NULL,
        city varchar(100) NOT NULL,
        state varchar(2) NOT NULL,
        location geography(Point, 4326) NOT NULL,
        service_radius_km smallint NOT NULL DEFAULT 25,
        years_of_experience smallint NOT NULL DEFAULT 0,
        is_available boolean NOT NULL DEFAULT true,
        verification_status professional_verification_status NOT NULL DEFAULT 'not_submitted',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT professional_profiles_service_radius_check CHECK (service_radius_km BETWEEN 1 AND 300),
        CONSTRAINT professional_profiles_experience_check CHECK (years_of_experience BETWEEN 0 AND 80),
        CONSTRAINT professional_profiles_state_check CHECK (state = upper(state))
      )
    `);
    await queryRunner.query(
      'CREATE INDEX professional_profiles_location_index ON professional_profiles USING GIST (location)'
    );
    await queryRunner.query(
      'CREATE INDEX professional_profiles_region_index ON professional_profiles (state, city)'
    );
    await queryRunner.query(`
      CREATE TABLE professional_services (
        professional_id uuid NOT NULL REFERENCES professional_profiles(user_id) ON DELETE CASCADE,
        service_id varchar(12) NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
        base_price numeric(10, 2),
        description text,
        is_active boolean NOT NULL DEFAULT true,
        PRIMARY KEY (professional_id, service_id),
        CONSTRAINT professional_services_base_price_check CHECK (base_price IS NULL OR base_price >= 0)
      )
    `);
    await queryRunner.query(
      'CREATE INDEX professional_services_service_id_index ON professional_services(service_id)'
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS professional_services');
    await queryRunner.query('DROP TABLE IF EXISTS professional_profiles');
    await queryRunner.query('DROP TYPE IF EXISTS professional_verification_status');
  }
}
