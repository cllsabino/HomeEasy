import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfessionalSchedules1787335200000 implements MigrationInterface {
  name = 'CreateProfessionalSchedules1787335200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE availability_periods (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        professional_id uuid NOT NULL REFERENCES professional_profiles(user_id) ON DELETE CASCADE,
        weekday smallint NOT NULL,
        start_time time NOT NULL,
        end_time time NOT NULL,
        CONSTRAINT availability_periods_weekday_check CHECK (weekday BETWEEN 0 AND 6),
        CONSTRAINT availability_periods_time_check CHECK (start_time < end_time),
        CONSTRAINT availability_periods_unique_time UNIQUE (professional_id, weekday, start_time, end_time)
      )
    `);
    await queryRunner.query(
      'CREATE INDEX availability_periods_professional_index ON availability_periods(professional_id, weekday)'
    );
    await queryRunner.query(`
      CREATE TABLE availability_exceptions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        professional_id uuid NOT NULL REFERENCES professional_profiles(user_id) ON DELETE CASCADE,
        date date NOT NULL,
        is_unavailable boolean NOT NULL DEFAULT true,
        start_time time,
        end_time time,
        CONSTRAINT availability_exceptions_time_check CHECK (
          (is_unavailable = true AND start_time IS NULL AND end_time IS NULL)
          OR (is_unavailable = false AND start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
        ),
        CONSTRAINT availability_exceptions_unique_date UNIQUE (professional_id, date)
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS availability_exceptions');
    await queryRunner.query('DROP TABLE IF EXISTS availability_periods');
  }
}
