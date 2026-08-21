import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommunications1787346000000 implements MigrationInterface {
  name = 'CreateCommunications1787346000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE message_type AS ENUM ('text', 'image', 'budget', 'system')`);
    await queryRunner.query(
      `CREATE TYPE notification_type AS ENUM ('new_proposal', 'proposal_accepted', 'order_updated', 'new_message', 'review_received', 'dispute_updated')`
    );
    await queryRunner.query(`
      CREATE TABLE conversations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id uuid NOT NULL UNIQUE REFERENCES orders(id) ON DELETE RESTRICT,
        client_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        professional_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        last_message_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT conversations_different_participants_check CHECK (client_id <> professional_id)
      )
    `);
    await queryRunner.query(
      'CREATE INDEX conversations_client_index ON conversations(client_id, last_message_at DESC)'
    );
    await queryRunner.query(
      'CREATE INDEX conversations_professional_index ON conversations(professional_id, last_message_at DESC)'
    );
    await queryRunner.query(`
      CREATE TABLE messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        type message_type NOT NULL DEFAULT 'text',
        content text,
        attachment jsonb,
        budget_amount numeric(10, 2),
        read_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT messages_payload_check CHECK (
          (type = 'text' AND content IS NOT NULL)
          OR (type = 'image' AND attachment IS NOT NULL)
          OR (type = 'budget' AND budget_amount IS NOT NULL AND budget_amount > 0)
          OR (type = 'system' AND content IS NOT NULL)
        )
      )
    `);
    await queryRunner.query(
      'CREATE INDEX messages_conversation_index ON messages(conversation_id, created_at DESC)'
    );
    await queryRunner.query(
      'CREATE INDEX messages_unread_index ON messages(conversation_id, read_at) WHERE read_at IS NULL'
    );
    await queryRunner.query(`
      CREATE TABLE user_blocks (
        blocker_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        blocked_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (blocker_id, blocked_id),
        CONSTRAINT user_blocks_different_users_check CHECK (blocker_id <> blocked_id)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE user_presence (
        user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        typing_conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
        typing_expires_at timestamptz,
        last_seen_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE notifications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type notification_type NOT NULL,
        title varchar(120) NOT NULL,
        body text NOT NULL,
        action_url varchar(300) NOT NULL,
        read_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      'CREATE INDEX notifications_user_index ON notifications(user_id, read_at, created_at DESC)'
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS notifications');
    await queryRunner.query('DROP TABLE IF EXISTS user_presence');
    await queryRunner.query('DROP TABLE IF EXISTS user_blocks');
    await queryRunner.query('DROP TABLE IF EXISTS messages');
    await queryRunner.query('DROP TABLE IF EXISTS conversations');
    await queryRunner.query('DROP TYPE IF EXISTS notification_type');
    await queryRunner.query('DROP TYPE IF EXISTS message_type');
  }
}
