# Phoneme Activity Builder

A classroom tool for Speech Pathology teachers to build phoneme-based **Wordle** and **Word Search** activities and download them as standalone HTML files for students.

Assessment 1 delivered the frontend builder. Assessment 2 adds the backend and database layer, so phoneme word lists and activity settings are now stored in Postgres and the generated HTML is driven by saved data rather than hard-coded examples.

## Architecture

The project is split into two independent Next.js applications plus a Postgres database, orchestrated by Docker Compose.

```
frontend (Next.js, port 3000)  ->  api (Next.js route handlers, port 80)  ->  db (Postgres 16, port 5432)
```

| Service | Port | Role |
| --- | --- | --- |
| `frontend` | 3000 | Builder UI, previews, HTML export |
| `api` | 80 (container 3000) | REST route handlers, validation, Prisma access |
| `db` | 5432 | Postgres 16 |

The frontend never talks to the database directly. Every read and write goes through a single typed service layer, `frontend/service/api-service.ts`, which is the only place `fetch` is called.

## Quick start

```bash
cp .env.example .env
docker compose up --build
```

Then open:

- Builder UI: http://localhost:3000
- Health check: http://localhost:80/health

The API container runs `prisma db push` on start, so the schema is applied to a fresh database automatically.

### Running without Docker

```bash
# Terminal 1 - API (expects a reachable Postgres)
cd api && cp .env.example .env && npm install && npx prisma generate && npm run dev

# Terminal 2 - frontend
cd frontend && cp .env.example .env && npm install && npm run dev
```

## Environment variables

| File | Variable | Purpose |
| --- | --- | --- |
| `.env` | `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Postgres credentials for Compose |
| `api/.env` | `DATABASE_URL` | Prisma connection string (Compose supplies this itself) |
| `frontend/.env` | `NEXT_PUBLIC_API_URL` | API base URL used by the browser |
| `frontend/.env` | `INTERNAL_API_URL` | API base URL used during server rendering |

Each directory ships a `.env.example`. Copy it to `.env` and adjust as needed.

## Database schema

Defined in [api/prisma/schema.prisma](api/prisma/schema.prisma).

- **PhonemeWord** — an English word plus its phonemes, stored as `String[]`. Using an array rather than a single string is what allows multi-character symbols such as `tʃ`, `dʒ`, and `ʉː` to stay intact as one unit.
- **PhonemeWordList** — a named collection of words, many-to-many with `PhonemeWord`. Drives Word Search activities.
- **WordleActivity** — a saved Wordle configuration: target word, max guesses, and whether to reveal the English word on a win.
- **WordSearchActivity** — a saved Word Search configuration: word list plus grid width and height.
- **GlobalSettings** — a single row holding the theme and layout preference.

Both activity models can be stored many times over, so a teacher can keep multiple configurations side by side.

## API endpoints

All under `/api`, except the health check.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Liveness plus a database connectivity probe |
| `GET` `POST` | `/api/phoneme-words` | List and create words |
| `GET` `PUT` `DELETE` | `/api/phoneme-words/:id` | Read, update, delete a word |
| `GET` `POST` | `/api/phoneme-word-lists` | List and create word lists |
| `GET` `PUT` `DELETE` | `/api/phoneme-word-lists/:id` | Read, update, delete a word list |
| `GET` `POST` | `/api/wordle-activities` | List and create Wordle configurations |
| `GET` `PUT` `DELETE` | `/api/wordle-activities/:id` | Read, update, delete a Wordle configuration |
| `GET` `POST` | `/api/word-search-activities` | List and create Word Search configurations |
| `GET` `PUT` `DELETE` | `/api/word-search-activities/:id` | Read, update, delete a Word Search configuration |
| `GET` `PUT` | `/api/settings` | Read and update global settings |

Validation lives in [api/lib/api/validation.ts](api/lib/api/validation.ts) and error responses are shaped by [api/lib/api-utils.ts](api/lib/api-utils.ts). Failures return `{ "error": "message" }` with a `400` for invalid input, `404` for a missing record, and `409` when a record is still referenced by an activity.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/word` | Manage phoneme words and word lists |
| `/wordle` | Manage Wordle activities, preview, and export HTML |
| `/word-search` | Manage Word Search activities, preview, and export HTML |
| `/settings` | Theme, layout, and the API health check |
| `/about` | Project background |

## Typical workflow

1. On `/word`, enter an English word and tap its phonemes on the phoneme keyboard, then save it.
2. Group words into a named word list on the same page.
3. On `/wordle`, pick a saved word and its settings, then save the activity.
4. On `/word-search`, pick a saved word list and grid size, then save the activity.
5. Load a saved activity to play the live preview, then generate the downloadable HTML file.

## Project layout

```
.
├── api/                  Backend: route handlers, Prisma schema and migrations
│   ├── app/api/          REST route handlers
│   ├── app/health/       Health check endpoint
│   ├── lib/              Prisma client, validation, response helpers
│   └── prisma/           Schema and migrations
├── frontend/             Builder UI
│   ├── app/              Routes
│   ├── components/       UI grouped by feature
│   ├── lib/              Wordle logic, word search generator, HTML export
│   ├── providers/        WordsProvider data layer
│   └── service/          Typed API client
└── docker-compose.yml
```
