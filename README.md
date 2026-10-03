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

The API container runs `prisma migrate deploy` on start, so committed migrations are applied to the database automatically.

If you previously ran the stack with `db push` and migrations fail on an old volume, reset once then rebuild:

```bash
docker compose down -v
docker compose up --build
```

`down -v` drops the database. After the stack is up again, load the seed data from the API container:

```bash
docker compose exec api npm install
docker compose exec api npx prisma migrate deploy --config prisma7.config.ts
docker compose exec api npx prisma generate --config prisma7.config.ts
docker compose exec api npm run db:seed
```

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
- **WordleActivity** — a named Wordle configuration: target word, max guesses, and whether to reveal the English word on a win. `name` defaults to `Untitled Wordle` for backfilled rows.
- **WordSearchActivity** — a named Word Search configuration: word list plus grid width and height. `name` defaults to `Untitled Word Search` for backfilled rows.
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
3. On `/wordle`, give the activity a name, pick a saved word and its settings, then save it.
4. On `/word-search`, give the activity a name, pick a saved word list and grid size, then save it.
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

## Load testing with JMeter

This load test hits the frontend pages and the API calls around the builder. Wordle and Word Search generation runs in the browser, so JMeter does not exercise it. The plan covers the pages and the API around that work, including `POST /api/metrics/generation`.

### Prerequisites

Java 8+ and JMeter 5.6.x. On macOS: `brew install jmeter`.

Dev mode gives misleading numbers, so run the stack in production mode and seed the database:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
docker compose exec api npx prisma db seed
```

### What the test plan does

[loadtest/phoneme-builder.jmx](loadtest/phoneme-builder.jmx) runs the requests below once per iteration. A Constant Timer waits `${__P(thinkTime,0)}` milliseconds before every request. Each sampler asserts the response code.

Frontend on `${__P(host,localhost)}:${__P(frontendPort,3000)}`, expecting 200:

- `GET /health`
- `GET /word`
- `GET /wordle`
- `GET /word-search`
- `GET /dashboard`

API on `${__P(host,localhost)}:${__P(apiPort,80)}`:

- `GET /api/phoneme-word-lists` (200). A JSON extractor stores `$[0].words[0].id` as `wordId`.
- `POST /api/wordle-activities` (201). A JSON extractor stores `$.id` as `activityId`.
- `GET /api/wordle-activities` (200)
- `POST /api/metrics/generation` (201)
- `DELETE /api/wordle-activities/${activityId}` (200)

`-J` properties and their defaults in the plan:

| Property | Default |
| --- | --- |
| `host` | `localhost` |
| `frontendPort` | `3000` |
| `apiPort` | `80` |
| `threads` | `1` |
| `rampUp` | `1` (seconds) |
| `loops` | `1` |
| `thinkTime` | `0` (milliseconds) |

### How to run

```bash
./loadtest/run.sh
```

[loadtest/run.sh](loadtest/run.sh) runs stages `x1`, `x10`, `x100`, `x1000`, and `x3000`. Ramp-up is 5 seconds when the stage has 100 users or fewer, and 30 seconds above that. Each stage passes `-Jloops=5` and `-JthinkTime=500`. Results go to `loadtest/results/x<N>.jtl`, with the HTML report at `loadtest/results/x<N>/index.html`. A failed stage is logged and the script continues. The script also raises the open-file limit and, unless `JVM_ARGS` is already set, gives JMeter a 1g/4g heap.

On Windows:

```powershell
.\loadtest\run.ps1
```

[loadtest/run.ps1](loadtest/run.ps1) runs stages `x1`, `x10`, `x100`, `x1000`, and `x10000`. It only passes `-Jthreads`, so ramp-up, loops, and think time stay at the plan defaults (1 second, 1 loop, 0 ms). It stops on the first failing stage. Output paths are the same.

A single-user smoke test should report 0% errors:

```bash
cd loadtest
jmeter -n -t phoneme-builder.jmx -Jthreads=1 -l results/smoke.jtl -e -o results/smoke
```

`loadtest/results/` and `jmeter.log` are git-ignored. Reset and reseed the database afterwards. The run writes generation logs, and a failed delete can leave Wordle activities behind.

### How to read the results

Open `index.html` for a stage.

| Metric | Where it appears |
| --- | --- |
| Average response time | Statistics table, Average column |
| 95th percentile | Statistics table, 95% Line column |
| Error % | Statistics table, and the Errors chart |
| Throughput (requests/second) | Statistics table, Throughput column |
| Active threads | Active Threads Over Time |

Response Times Over Time shows how latency moved during the run.

### Results

p95 values come from each report's Statistics table.

| Stage | Requests | Throughput | Average | Max | Error % | p95 |
| --- | --- | --- | --- | --- | --- | --- |
| x1 | 50 | 1.9/s | 24 ms | 74 ms | 0% | TODO |
| x10 | 500 | 16.2/s | 20 ms | 59 ms | 0% | TODO |
| x100 | 5,000 | 163.7/s | 9 ms | 196 ms | 0% | TODO |
| x1000 | 50,000 | 425.3/s | 1,223 ms | 5,714 ms | 0.002% (1 error) | TODO |
| x3000 | 150,000 | 230.8/s | 11,118 ms | 84,241 ms | 10.44% (15,660 errors) | TODO |

### Analysis

Up to 100 users there were no errors, and responses stayed under 200 ms. Throughput at these levels is limited by the think time, not by the server.

At 1,000 users, throughput plateaued at roughly 430 to 460 requests/s while active users climbed from about 720 to 1,000. Average response time rose from about 315 ms to 1.5 to 1.8 s. That suggests the saturation point on the test machine is roughly 430 requests/s, with requests queueing beyond that. There were almost no errors.

At 3,000 users, throughput peaked around 430/s, then fell to roughly 130 to 270/s once all 3,000 users were active. Average response time rose to 10 to 20 s, with a maximum of 84 s. Errors came in bursts: some 30-second windows were at 14 to 53% failures, and others were at 0%. That pattern fits stalling and recovery.

At x3000, the large majority of failures were `java.net.SocketException` "Connection reset" and `NoHttpResponseException` ("failed to respond") on the frontend pages (`/dashboard`, `/word-search`, `/wordle`, `/word`, `/health` on port 3000), plus the same on `GET /api/phoneme-word-lists`. About 622 iterations then also produced 400s on `POST /api/wordle-activities`, `POST /api/metrics/generation`, and `DELETE`, because the `wordId` extraction got no response and fell back to `NOT_FOUND`. Those are knock-on failures. The API container logs showed no errors, pool exhaustion, or timeouts.

The evidence points to the connection layer and the server-rendered frontend rather than the database. Candidates that were not isolated: Node process saturation, Docker Desktop networking on macOS, keep-alive timeouts, and JMeter, both Next.js servers, and Postgres sharing one laptop.

x10000 was attempted, but JMeter could not create more than about 4,069 threads on macOS (`pthread_create` failed, `EAGAIN`), so the top stage was set to 3,000. That is a limit of the load generator, not the application.

### Limitations and improvements

The run is a single machine on localhost, with no network latency, against seeded data only.

Possible improvements: scale the frontend horizontally, cache or statically render pages, tune connection and keep-alive settings, and run the load generator on a separate machine.

### Screenshots

- [x1000 statistics](docs/load-testing/x1000-statistics.png) <!-- TODO: add screenshot -->
- [x3000 response times](docs/load-testing/x3000-response-times.png) <!-- TODO: add screenshot -->
