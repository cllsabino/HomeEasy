# Home Easy API

Backend próprio do Home Easy. Esta API convive com o Firebase durante a migração gradual do produto.

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

A API fica disponível em `http://localhost:3000/api`.

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

As tabelas são alteradas somente por migrations. `synchronize` permanece desativado em todos os ambientes.
