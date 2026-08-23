import { hash } from 'bcryptjs';

import dataSource from '../data-source';

const demoPassword = 'HomeEasy@2026';
const clientId = '10000000-0000-4000-8000-000000000001';
const professionals = [
  {
    id: '20000000-0000-4000-8000-000000000001',
    name: 'Carlos Andrade',
    email: 'carlos.demo@homeeasy.local',
    serviceId: 're02',
    price: 130,
    rating: 5,
    comment: 'Resolveu o vazamento rapidamente e deixou tudo organizado.',
    city: 'Recife',
    longitude: -34.8813,
    latitude: -8.0539
  },
  {
    id: '20000000-0000-4000-8000-000000000002',
    name: 'Juliana Martins',
    email: 'juliana.demo@homeeasy.local',
    serviceId: 'ma01',
    price: 110,
    rating: 5,
    comment: 'Limpeza muito cuidadosa e atendimento pontual.',
    city: 'Recife',
    longitude: -34.9009,
    latitude: -8.0476
  },
  {
    id: '20000000-0000-4000-8000-000000000003',
    name: 'Bruno Silva',
    email: 'bruno.demo@homeeasy.local',
    serviceId: 're01',
    price: 150,
    rating: 4,
    comment: 'Explicou o problema elétrico com clareza e fez um bom serviço.',
    city: 'Olinda',
    longitude: -34.8553,
    latitude: -8.0089
  },
  {
    id: '20000000-0000-4000-8000-000000000004',
    name: 'Lucas Ferreira',
    email: 'lucas.demo@homeeasy.local',
    serviceId: 'ma04',
    price: 180,
    rating: 5,
    comment: 'Acabamento excelente e prazo cumprido.',
    city: 'Jaboatão dos Guararapes',
    longitude: -34.923,
    latitude: -8.1128
  },
  {
    id: '20000000-0000-4000-8000-000000000005',
    name: 'Marina Costa',
    email: 'marina.demo@homeeasy.local',
    serviceId: 'ma05',
    price: 95,
    rating: 5,
    comment: 'O jardim ficou renovado e recebi boas orientações de manutenção.',
    city: 'Paulista',
    longitude: -34.8731,
    latitude: -7.9408
  },
  {
    id: '20000000-0000-4000-8000-000000000006',
    name: 'Rafael Santos',
    email: 'rafael.demo@homeeasy.local',
    serviceId: 'ma06',
    price: 120,
    rating: 4,
    comment: 'Montagem segura, rápida e sem danos aos móveis.',
    city: 'Camaragibe',
    longitude: -35.0202,
    latitude: -8.0235
  }
];

async function seedDevelopmentData() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('O seed de demonstração não pode ser executado em produção.');
  }

  await dataSource.initialize();
  const passwordHash = await hash(demoPassword, 12);
  await dataSource.transaction(async (manager) => {
    await manager.query(
      `INSERT INTO users (id, name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, 'user', true)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, is_active = true`,
      [clientId, 'Ana Souza', 'cliente.demo@homeeasy.local', passwordHash]
    );
    await manager.query(
      `INSERT INTO user_profiles (user_id, phone, birth_date, address, city, state)
       VALUES ($1, '81999990000', '1992-05-14', 'Rua de Demonstração, 100', 'Recife', 'PE')
       ON CONFLICT (user_id) DO UPDATE SET phone = EXCLUDED.phone, city = EXCLUDED.city, state = EXCLUDED.state`,
      [clientId]
    );

    for (let index = 0; index < professionals.length; index += 1) {
      const professional = professionals[index];
      const requestId = `30000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;
      const proposalId = `40000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;
      const orderId = `50000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;
      const reviewId = `60000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;

      await manager.query(
        `INSERT INTO users (id, name, email, password_hash, role, is_active)
         VALUES ($1, $2, $3, $4, 'user', true)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, is_active = true`,
        [professional.id, professional.name, professional.email, passwordHash]
      );
      await manager.query(
        `INSERT INTO professional_profiles
          (user_id, bio, phone, city, state, location, service_radius_km, years_of_experience, is_available, verification_status)
         VALUES ($1, $2, '81988880000', $3, 'PE', ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography, 40, $6, true, 'professional_verified')
         ON CONFLICT (user_id) DO UPDATE SET bio = EXCLUDED.bio, city = EXCLUDED.city, location = EXCLUDED.location, is_available = true, verification_status = EXCLUDED.verification_status`,
        [
          professional.id,
          `${professional.name} é profissional verificado com experiência em atendimento residencial.`,
          professional.city,
          professional.longitude,
          professional.latitude,
          4 + index
        ]
      );
      await manager.query(
        `INSERT INTO professional_services (professional_id, service_id, base_price, description, is_active)
         VALUES ($1, $2, $3, $4, true)
         ON CONFLICT (professional_id, service_id) DO UPDATE SET base_price = EXCLUDED.base_price, description = EXCLUDED.description, is_active = true`,
        [
          professional.id,
          professional.serviceId,
          professional.price,
          'Atendimento residencial com orçamento claro e serviço garantido.'
        ]
      );
      for (const weekday of [1, 2, 3, 4, 5]) {
        await manager.query(
          `INSERT INTO availability_periods (professional_id, weekday, start_time, end_time)
           VALUES ($1, $2, '08:00', '18:00') ON CONFLICT ON CONSTRAINT availability_periods_unique_time DO NOTHING`,
          [professional.id, weekday]
        );
      }
      await manager.query(
        `INSERT INTO service_requests
          (id, client_id, service_id, description, urgency, answers, attachments, address, city, state, location, budget_minimum, budget_maximum, status, proposal_count, maximum_proposals, preferred_professional_id, expires_at)
         VALUES ($1, $2, $3, 'Atendimento residencial concluído para demonstração.', 'flexible', '{}'::jsonb, '[]'::jsonb, 'Rua de Demonstração, 100', 'Recife', 'PE', ST_SetSRID(ST_MakePoint(-34.8813, -8.0539), 4326)::geography, $4, $5, 'accepted', 1, 4, $6, now() + interval '30 days')
         ON CONFLICT (id) DO NOTHING`,
        [
          requestId,
          clientId,
          professional.serviceId,
          professional.price - 20,
          professional.price + 30,
          professional.id
        ]
      );
      await manager.query(
        `INSERT INTO proposals
          (id, request_id, professional_id, price, message, estimated_duration_minutes, materials_included, travel_fee, payment_methods, status, valid_until)
         VALUES ($1, $2, $3, $4, 'Proposta demonstrativa aceita pelo cliente.', 120, true, 0, ARRAY['Pix', 'Cartão'], 'accepted', now() + interval '30 days')
         ON CONFLICT (id) DO NOTHING`,
        [proposalId, requestId, professional.id, professional.price]
      );
      await manager.query(
        `INSERT INTO orders
          (id, request_id, proposal_id, client_id, professional_id, agreed_price, scheduled_at, status)
         VALUES ($1, $2, $3, $4, $5, $6, now() - interval '15 days', 'completed')
         ON CONFLICT (id) DO NOTHING`,
        [orderId, requestId, proposalId, clientId, professional.id, professional.price]
      );
      await manager.query(
        `INSERT INTO reviews
          (id, order_id, client_id, professional_id, rating, comment, professional_response, responded_at, is_published)
         VALUES ($1, $2, $3, $4, $5, $6, 'Obrigado pela confiança! Foi um prazer ajudar.', now() - interval '10 days', true)
         ON CONFLICT (id) DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, professional_response = EXCLUDED.professional_response, is_published = true`,
        [reviewId, orderId, clientId, professional.id, professional.rating, professional.comment]
      );
    }
  });
  await dataSource.destroy();
  process.stdout.write(
    `Dados locais criados: 1 cliente, ${professionals.length} profissionais e ${professionals.length} avaliações.\n`
  );
  process.stdout.write(`Login de demonstração: cliente.demo@homeeasy.local / ${demoPassword}\n`);
}

seedDevelopmentData().catch(async (error) => {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.stderr.write(`Falha no seed local: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
