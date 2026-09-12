# API

Backend for the Phoneme Activity Builder. A Next.js app that exposes REST route handlers over a Postgres database via Prisma. It serves no UI.

See the [root README](../README.md) for the full architecture, the endpoint table, and how to run the whole stack.

## Running

Inside Docker (recommended) the API is published on port 80 and reached at http://localhost:80. To run it on its own:

```bash
cp .env.example .env      # set DATABASE_URL to a reachable Postgres
npm install
npx prisma generate
npm run dev
```

## Layout

```
app/api/phoneme-words/            List, create, read, update, delete words
app/api/phoneme-word-lists/       List, create, read, update, delete word lists
app/api/wordle-activities/        Wordle configurations
app/api/word-search-activities/   Word Search configurations
app/api/settings/                 Global theme and layout
app/health/                       Health check
lib/prisma.ts                     Prisma client singleton (pg driver adapter)
lib/api/validation.ts             Request body validators
lib/api-utils.ts                  Id parsing, Prisma error mapping, response helpers
middleware.ts                     CORS headers for the frontend origin
prisma/schema.prisma              Data model
prisma/migrations/                Migration history
```

## Conventions

Route handlers follow the same shape throughout:

1. Parse and validate the id with `parseId`, returning `400` on anything that is not a positive integer.
2. Run the matching validator from `lib/api/validation.ts`, which returns a discriminated `ValidationReturn` so the handler can bail out early with a clear message.
3. Check referential preconditions, for example that a Wordle activity's word actually exists, or that a Word Search activity's list is not empty.
4. Wrap the Prisma call and map failures with `handlePrismaError`, which turns `P2025` into `404` and `P2003` into `409`.

Error responses are always `{ "error": "message" }`.

## Health check

`GET /health` runs `SELECT 1` against the database.

```json
{ "status": "ok", "db": "connected" }
```

It returns `200` when the database is reachable and `503` with `{ "status": "error", "db": "unreachable" }` when it is not.

## Data model notes

Phonemes are stored as `String[]` on `PhonemeWord`, not as a single concatenated string. This is deliberate: many HCE phoneme symbols occupy more than one character (`tʃ`, `dʒ`, `ʉː`), so a character-level representation would split them and corrupt both the Wordle tiles and the Word Search grid cells.

## Prisma commands

```bash
npx prisma generate          # regenerate the client after editing the schema
npx prisma migrate dev       # create and apply a migration in development
npx prisma migrate deploy    # apply existing migrations
npx prisma db push           # sync the schema without a migration (used by the Dockerfile)
npx prisma studio            # browse the data
```
