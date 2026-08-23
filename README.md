<div align="center">
  <img src="src/assets/home-easy-logo-v2.png" alt="Logo Home Easy" width="150">

  # Home Easy

  **Serviços para sua casa, perto de você.**

  Uma plataforma que conecta clientes a profissionais de serviços domésticos e reformas — da busca ao atendimento, em um só lugar.

  [![Angular](https://img.shields.io/badge/Angular-20.3-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL%20%2B%20PostGIS-17-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
  [![Status](https://img.shields.io/badge/status-em%20evolu%C3%A7%C3%A3o-164E63)](#roadmap)

  [Abrir o redesign](https://homeeasy-bd496.web.app/home) · [Ver versão legada](https://homeeasy-52792.web.app/home) · [Executar localmente](#-executando-localmente)
</div>

---

## 🏠 O que é o Home Easy?

O **Home Easy** é um marketplace de serviços para casa, com uma proposta semelhante a plataformas como o GetNinjas. Clientes encontram profissionais da sua região, comparam serviços e avaliações, conversam pelo chat e acompanham seus pedidos. Profissionais podem divulgar seu trabalho, receber solicitações e administrar os atendimentos.

O projeto nasceu há seis anos como Trabalho de Conclusão de Curso no **IFPE** e foi redesenhado para transformar uma aplicação acadêmica em uma experiência de produto mais moderna, útil e utilizável.

## 🌐 Aplicações publicadas

| Versão | Endereço | Objetivo |
| --- | --- | --- |
| **Redesign atual** | [homeeasy-bd496.web.app](https://homeeasy-bd496.web.app/home) | Experiência modernizada, responsiva e em evolução |
| **Sistema legado** | [homeeasy-52792.web.app](https://homeeasy-52792.web.app/home) | Preservação da versão original do projeto |

As duas versões permanecem disponíveis de forma independente, permitindo comparar a evolução da experiência e do produto.

```mermaid
flowchart LR
    A[Cliente pesquisa] --> B[Aplica filtros]
    B --> C[Explora profissionais no mapa]
    C --> D[Compara perfil e avaliações]
    D --> E[Conversa pelo chat]
    E --> F[Solicita e acompanha o serviço]
```

## ✨ Principais funcionalidades

| Para clientes | Para profissionais | Experiência |
| --- | --- | --- |
| Busca inteligente por serviço ou problema | Cadastro e gestão de serviços | Interface responsiva e acessível |
| Filtros por cidade, preço, avaliação e disponibilidade | Recebimento e acompanhamento de pedidos | Filtros persistidos na URL |
| Mapa com profissionais por região | Perfil público com informações profissionais | Estados de loading, erro, sucesso e vazio |
| Perfis, propostas e avaliações | Aceite e gestão dos atendimentos | Confirmação antes de ações destrutivas |
| Chat e acompanhamento de pedidos | Conversas com potenciais clientes | Feedbacks e microinterações consistentes |

O fluxo de contratação agora usa uma solicitação central: o cliente descreve a necessidade, informa região, urgência e orçamento, recebe até quatro propostas e escolhe uma delas. Profissionais visualizam somente oportunidades compatíveis com os serviços e a região de atendimento, podem pausar a disponibilidade e acompanham a validade das propostas.

## 🗺️ Mapa regional

O feed apresenta um mapa interativo com a quantidade de profissionais disponíveis em cada cidade. Ao selecionar um marcador, a listagem é filtrada para aquela região e o estado da busca fica salvo na URL.

- Renderização com **Leaflet** e tiles do **OpenStreetMap**.
- Geocodificação de cidade e estado com **Nominatim**.
- Cache local para reduzir chamadas repetidas.
- Lista acessível como alternativa aos marcadores.
- Nenhum endereço exato é enviado ao serviço de geocodificação.

## 🎨 Redesign

A atualização não se limitou a trocar cores ou aplicar CSS. A interface foi repensada como um sistema consistente de produto:

- hierarquia visual, tipografia e escala de espaçamento;
- identidade visual e novo logo do Home Easy;
- componentes reutilizáveis para navegação, feedbacks, diálogos e estados;
- busca e filtros mais claros, com opções avançadas sob demanda;
- chat flutuante inspirado em aplicativos de mensagem;
- fluxos revisados de autenticação, perfil, contratação e gestão profissional;
- contraste, foco visível, navegação por teclado e áreas clicáveis maiores;
- layouts adaptados para mobile, tablet e desktop.

## 🧰 Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | Angular 20, TypeScript 5.9, HTML5 e CSS3 |
| Autenticação | JWT com access token, refresh token e recuperação por e-mail |
| Dados e geolocalização | PostgreSQL 17 e PostGIS |
| Backend próprio | NestJS 11, TypeORM, MinIO e Mailpit local |
| Arquivos privados | MinIO com URLs assinadas e controle de acesso |
| Mapas | Leaflet, OpenStreetMap e Nominatim |
| Testes | Jasmine, Karma e Jest |

## 🧭 Estrutura do projeto

```text
src/app/
├── home/              # Página inicial e apresentação do produto
├── login-cadastro/    # Login, cadastro e recuperação de senha
├── feed/              # Busca, filtros, categorias e mapa regional
├── perfil/            # Perfil, avaliações e informações do usuário
├── profissional/      # Cadastro e edição de serviços profissionais
├── pedido/            # Pedidos feitos, recebidos e seus detalhes
├── chat/              # Conversas e lista de contatos
├── Servicos/          # Integrações e acesso aos dados
└── shared/            # Componentes, modelos, utilitários e tokens visuais
```

## 🚀 Executando localmente

### Pré-requisitos

- Node.js 20.20.2 ou superior, npm e Docker instalados.
- Portas locais 3000, 4200, 5435, 9000, 9001, 1025 e 8025 disponíveis.

### Instalação

```bash
git clone https://github.com/AlvaroMGueiros/HomeEasy-1.git
cd HomeEasy-1
npm install
```

Com o servidor iniciado, acesse **http://localhost:4200**. O Angular recompila a aplicação automaticamente quando um arquivo é alterado.

### Comandos disponíveis

| Comando | Ação |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a aplicação em `dist/HomeEasy` |
| `npm run build:prod` | Gera o bundle otimizado de produção |
| `npm test` | Executa os testes unitários com Karma |
| `npm run backend:start` | Inicia a API NestJS em modo de desenvolvimento |
| `npm run backend:test` | Executa os testes da API com Jest |

## 🧱 Backend próprio

O redesign usa uma API NestJS e não possui dependências do Firebase. PostgreSQL/PostGIS mantém contas, perfis, serviços, solicitações, propostas, pedidos, avaliações, favoritos, conversas, notificações e moderação. O MinIO guarda anexos e documentos privados; em desenvolvimento, o Mailpit recebe os e-mails de recuperação de senha.

```bash
docker compose -f docker-compose.backend.yml --env-file backend/.env up -d
cd backend
npm run migration:run
npm run seed:services
npm run start:dev
```

Em outro terminal:

```bash
npm start
```

O frontend usa `http://localhost:3000/api` no desenvolvimento e `/api` no build de produção. Em produção, configure um proxy reverso para servir a SPA e encaminhar `/api` à aplicação NestJS. Os segredos de JWT, PostgreSQL, MinIO e SMTP devem ficar apenas no ambiente do servidor.

O sistema legado continua independente em `homeeasy-52792.web.app`; nenhuma tabela ou conta do backend novo altera essa versão. Uma migração futura de contas legadas precisa ser planejada separadamente, pois senhas não devem ser copiadas em texto puro.

## 🛣️ Roadmap

- [x] Redesign completo da experiência
- [x] Busca e filtros avançados
- [x] Chat flutuante e mensagens atômicas
- [x] Mapa de profissionais por cidade
- [x] Responsividade e estados de feedback
- [x] Solicitações com até quatro propostas e aceite transacional
- [x] Disponibilidade profissional e validade de oportunidades
- [x] Fluxo de verificação e painel de indicadores administrativos
- [x] Separação entre perfil privado e perfil público
- [x] Separar completamente o redesign do Firebase legado
- [x] Implementar autenticação JWT e perfil privado no backend próprio
- [x] Persistir coordenadas e busca por raio com PostgreSQL/PostGIS
- [x] Atualizar o projeto para Angular 20, TypeScript 5.9 e RxJS 7
- [ ] Ampliar a cobertura de testes automatizados
- [x] Remover dependências de infraestrutura paga do fluxo local
- [x] Migrar os fluxos principais para uma API própria com banco relacional

## 🤝 Contribuindo

Contribuições são bem-vindas. Para propor uma melhoria:

1. Crie uma branch a partir da `master`.
2. Faça alterações pequenas e bem descritas.
3. Valide o build, os fluxos afetados e a responsividade.
4. Abra um Pull Request explicando o problema e a solução.

## 📖 História do projeto

Este repositório é um fork de [`cllsabino/HomeEasy`](https://github.com/cllsabino/HomeEasy). A nova versão preserva a ideia construída no IFPE e mostra como um sistema acadêmico pode evoluir por meio de pesquisa, auditoria heurística, redesign e engenharia de produto.

---

<div align="center">
  Feito para aproximar quem precisa de ajuda de quem sabe fazer.
</div>
