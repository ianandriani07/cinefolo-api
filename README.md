# 🎬 cinefolo-api

Backend em **NestJS** que expõe endpoints para gerenciar avaliações (**ratings**) de filmes por `tmdbMovieId`, persistindo dados em **PostgreSQL** via **Prisma**.

A aplicação aplica prefixo global **`/api`**, configura **CORS** via variável de ambiente e escuta por padrão na porta **8000**.

---

## 📌 Visão geral

Este serviço é responsável por:

- Persistir avaliações de filmes (1 a 5)
- Garantir unicidade por usuário/filme no banco (**(userId, tmdbMovieId)**)
- Expor uma API REST para o frontend consumir

> Observação: atualmente o backend utiliza um **usuário fixo** (`userId = 1`) para simplificação do fluxo.

---

## 🧱 Stack

- **Linguagem/Runtime:** TypeScript / Node.js
- **Framework:** NestJS
  - `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`
- **ORM/DB:** Prisma + PostgreSQL
  - `@prisma/client`, `@prisma/adapter-pg`, `pg`

---

## 🏗️ Arquitetura

- **Módulos**
  - `AppModule` importa `PrismaModule` (global) e `RatingsModule`
- **Camadas**
  - **Controller → Service → PrismaClient**
- **Fluxo**
  - `RatingsController` recebe requisições HTTP e chama o `RatingsService`
  - `RatingsService` aplica regras/validações e acessa o banco via `PrismaService`
- **Prisma**
  - `PrismaService` estende `PrismaClient` e utiliza adapter do `pg` (pool)

---

## 🗂️ Estrutura do projeto (resumida)

```text
src/
  app.module.ts
  main.ts
  prisma/
    prisma.module.ts
    prisma.service.ts
  ratings/
    ratings.controller.ts
    ratings.service.ts
    dto/
      upserting-ratings-dto.ts

prisma/
  schema.prisma
  migrations/...
```

## 🔌 Endpoints

**Prefixo global:** `/api`

---

### Ratings (`/api/ratings`)

#### 1) Upsert de avaliação

**PUT** `/api/ratings/:tmdbMovieId`

**Params**
- `tmdbMovieId` (inteiro)

**Body**
- `rating` (inteiro, 1..5)

**Exemplo**

```bash
curl -X PUT "http://localhost:8000/api/ratings/123"   -H "Content-Type: application/json"   -d '{"rating": 4}'
```

**Resposta (200)**

```json
{
  "tmdb_movie_id": 123,
  "rating": 4,
  "created_at": "...",
  "updated_at": "..."
}
```

**Erros**
- `400 Bad Request` se `rating` estiver fora de `1..5`
---

#### 2) Buscar rating de um filme

**GET** `/api/ratings/:tmdbMovieId`

**Exemplo**

```bash
curl "http://localhost:8000/api/ratings/123"
```

**Resposta (200)**

```json
{ "tmdb_movie_id": 123, "rating": 4 }
```

**Erros**
- `404 Not Found` se não existir rating para o filme

---

#### 3) Listar ratings do usuário

**GET** `/api/ratings`

**Exemplo**

```bash
curl "http://localhost:8000/api/ratings"
```

**Resposta (200)**

```json
[
  { "tmdb_movie_id": 123, "rating": 4 }
]
```

---

#### 4) Remover rating de um filme

**DELETE** `/api/ratings/:tmdbMovieId`

**Exemplo**

```bash
curl -X DELETE "http://localhost:8000/api/ratings/123"
```

**Resposta**
- `204 No Content` (sem body)

**Erros**
- `404 Not Found` se o registro não existir

---

## 🔄 Fluxo principal (Criar/Atualizar avaliação)

1. `PUT /api/ratings/:tmdbMovieId` chega no `RatingsController`
2. O controller extrai `tmdbMovieId` e `rating`
3. Chama o `RatingsService`
4. O service:
   - valida `rating` (1..5)
   - realiza **upsert** via Prisma usando a constraint única `(userId, tmdbMovieId)`
   - utiliza `userId = 1` fixo no código
5. Retorna o rating persistido para o cliente

---

## 🧩 Responsabilidades: Backend vs Frontend

### Backend
- Persistir ratings
- Validar intervalo do rating
- Garantir unicidade (usuário + filme)
- Expor endpoints REST
- Configurar CORS e prefixo global `/api`

### Frontend / Cliente
- Buscar filmes no TMDB
- Enviar `tmdbMovieId` e `rating`
- Lidar com respostas e erros (`400` / `404`)

---

## 👨‍💻 Autor

Desenvolvido por **Ian Andriani**  
Projeto pessoal para prática de backend com **NestJS + Prisma + PostgreSQL**.
