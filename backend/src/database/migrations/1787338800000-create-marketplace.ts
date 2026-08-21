import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMarketplace1787338800000 implements MigrationInterface {
  name = 'CreateMarketplace1787338800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE service_request_status AS ENUM ('requested', 'proposal_received', 'accepted', 'cancelled', 'expired')`
    );
    await queryRunner.query(
      `CREATE TYPE proposal_status AS ENUM ('sent', 'accepted', 'rejected', 'withdrawn', 'expired')`
    );
    await queryRunner.query(
      `CREATE TYPE order_status AS ENUM ('accepted', 'scheduled', 'in_progress', 'completed', 'cancelled_by_client', 'cancelled_by_professional', 'disputed')`
    );
    await queryRunner.query(
      `CREATE TYPE cancellation_reason AS ENUM ('schedule_conflict', 'price_disagreement', 'professional_unavailable', 'client_unavailable', 'service_no_longer_needed', 'other')`
    );
    await queryRunner.query(`
      CREATE TABLE service_requests (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        service_id varchar(12) NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
        description text NOT NULL,
        answers jsonb NOT NULL DEFAULT '{}'::jsonb,
        attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
        address varchar(200) NOT NULL,
        city varchar(100) NOT NULL,
        state varchar(2) NOT NULL,
        location geography(Point, 4326),
        budget_minimum numeric(10, 2),
        budget_maximum numeric(10, 2),
        preferred_at timestamptz,
        status service_request_status NOT NULL DEFAULT 'requested',
        proposal_count smallint NOT NULL DEFAULT 0,
        maximum_proposals smallint NOT NULL DEFAULT 4,
        expires_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT service_requests_budget_check CHECK (
          budget_minimum IS NULL OR budget_maximum IS NULL OR budget_minimum <= budget_maximum
        ),
        CONSTRAINT service_requests_proposal_count_check CHECK (
          proposal_count >= 0 AND maximum_proposals BETWEEN 1 AND 20 AND proposal_count <= maximum_proposals
        ),
        CONSTRAINT service_requests_state_check CHECK (state = upper(state))
      )
    `);
    await queryRunner.query(
      'CREATE INDEX service_requests_feed_index ON service_requests(status, service_id, expires_at)'
    );
    await queryRunner.query(
      'CREATE INDEX service_requests_client_index ON service_requests(client_id, created_at DESC)'
    );
    await queryRunner.query(
      'CREATE INDEX service_requests_location_index ON service_requests USING GIST(location)'
    );
    await queryRunner.query(`
      CREATE TABLE proposals (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        request_id uuid NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
        professional_id uuid NOT NULL REFERENCES professional_profiles(user_id) ON DELETE CASCADE,
        price numeric(10, 2) NOT NULL,
        message text NOT NULL,
        estimated_duration_minutes integer NOT NULL,
        materials_included boolean NOT NULL DEFAULT false,
        travel_fee numeric(10, 2) NOT NULL DEFAULT 0,
        payment_methods varchar[] NOT NULL DEFAULT '{}',
        status proposal_status NOT NULL DEFAULT 'sent',
        valid_until timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT proposals_request_professional_unique UNIQUE(request_id, professional_id),
        CONSTRAINT proposals_price_check CHECK (price > 0 AND travel_fee >= 0),
        CONSTRAINT proposals_duration_check CHECK (estimated_duration_minutes BETWEEN 15 AND 43200)
      )
    `);
    await queryRunner.query('CREATE INDEX proposals_request_index ON proposals(request_id, status, price)');
    await queryRunner.query(
      'CREATE INDEX proposals_professional_index ON proposals(professional_id, created_at DESC)'
    );
    await queryRunner.query(`
      CREATE TABLE orders (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        request_id uuid NOT NULL UNIQUE REFERENCES service_requests(id) ON DELETE RESTRICT,
        proposal_id uuid NOT NULL UNIQUE REFERENCES proposals(id) ON DELETE RESTRICT,
        client_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        professional_id uuid NOT NULL REFERENCES professional_profiles(user_id) ON DELETE RESTRICT,
        agreed_price numeric(10, 2) NOT NULL,
        scheduled_at timestamptz,
        status order_status NOT NULL DEFAULT 'accepted',
        cancellation_reason cancellation_reason,
        cancellation_details text,
        cancelled_by uuid REFERENCES users(id) ON DELETE SET NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT orders_price_check CHECK (agreed_price > 0),
        CONSTRAINT orders_different_participants_check CHECK (client_id <> professional_id)
      )
    `);
    await queryRunner.query('CREATE INDEX orders_client_index ON orders(client_id, created_at DESC)');
    await queryRunner.query(
      'CREATE INDEX orders_professional_index ON orders(professional_id, created_at DESC)'
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS orders');
    await queryRunner.query('DROP TABLE IF EXISTS proposals');
    await queryRunner.query('DROP TABLE IF EXISTS service_requests');
    await queryRunner.query('DROP TYPE IF EXISTS cancellation_reason');
    await queryRunner.query('DROP TYPE IF EXISTS order_status');
    await queryRunner.query('DROP TYPE IF EXISTS proposal_status');
    await queryRunner.query('DROP TYPE IF EXISTS service_request_status');
  }
}
