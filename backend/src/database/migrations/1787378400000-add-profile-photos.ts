import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfilePhotos1787378400000 implements MigrationInterface {
  name = 'AddProfilePhotos1787378400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE media_purpose ADD VALUE IF NOT EXISTS 'profile_photo'`);
    await queryRunner.query(`
      ALTER TABLE user_profiles
      ADD COLUMN profile_photo_media_id uuid REFERENCES media_objects(id) ON DELETE SET NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE user_profiles DROP COLUMN IF EXISTS profile_photo_media_id');
  }
}
