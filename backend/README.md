# Home Easy API

Backend próprio e fonte oficial de dados do Home Easy. Autenticação, marketplace, chat, arquivos e moderação não dependem do Firebase.

## Subir localmente

1. Copie `.env.example` para `.env` e troque todos os segredos de exemplo.
2. Na raiz do repositório, inicie PostgreSQL/PostGIS e MinIO:

```bash
docker compose -f docker-compose.backend.yml --env-file backend/.env up -d
```

3. Instale e prepare a API:

```bash
cd backend
npm install
npm run migration:run
npm run seed:services
npm run start:dev
```

Para preencher somente o ambiente local com um cliente, profissionais, pedidos concluídos e avaliações verificadas:

```bash
npm run db:seed:dev
```

O seed é idempotente e bloqueia execução quando `NODE_ENV=production`.

A API fica disponível em `http://localhost:3000/api`.

## PostgreSQL no Neon

Para homologação ou início da produção com o plano gratuito do Neon, crie um projeto na mesma região da API e copie as duas conexões exibidas pelo painel:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@endpoint-pooler.neon.tech/neondb?sslmode=verify-full&channel_binding=require
DATABASE_DIRECT_URL=postgresql://user:password@endpoint.neon.tech/neondb?sslmode=verify-full&channel_binding=require
DATABASE_SSL=true
DATABASE_POOL_SIZE=5
```

- `DATABASE_URL` usa o endpoint com `-pooler` e atende as conexões da API.
- `DATABASE_DIRECT_URL` usa o endpoint direto e é reservada para migrations e rotinas administrativas.
- As credenciais devem existir somente no `.env` local ou nas variáveis secretas da hospedagem.
- Não execute `db:seed:dev` em produção. Para cadastrar apenas o catálogo inicial, use `npm run seed:services` após as migrations.

Prepare um banco novo nesta ordem:

```bash
npm run migration:run
npm run seed:services
```

As migrations ativam `pgcrypto` e PostGIS, necessários para UUIDs e buscas geográficas. O plano gratuito do Neon reduz a capacidade quando fica ocioso, então a primeira conexão após um período sem uso pode levar mais tempo.

## Rotas iniciais

| Método | Rota | Acesso |
| --- | --- | --- |
| `GET` | `/api/health` | Público |
| `GET` | `/api/services` | Público |
| `POST` | `/api/auth/register` | Público |
| `POST` | `/api/auth/login` | Público |
| `POST` | `/api/auth/refresh` | Público |
| `POST` | `/api/auth/logout` | Público |
| `GET` | `/api/users/me` | Bearer token |
| `GET` | `/api/professionals` | Público; filtros por serviço, região e distância |
| `GET` | `/api/professionals/:professionalId` | Público |
| `GET` | `/api/professionals/me` | Bearer token |
| `PUT` | `/api/professionals/me` | Bearer token |
| `PUT` | `/api/professionals/me/services` | Bearer token |

A localização exata e o telefone ficam restritos ao proprietário do perfil. A busca pública utiliza PostGIS para filtrar e ordenar por distância, retornando somente cidade, estado e distância aproximada.

As tabelas são alteradas somente por migrations. `synchronize` permanece desativado em todos os ambientes.
