# Frontend

Builder UI for the Phoneme Activity Builder. A Next.js app where teachers manage phoneme words, assemble word lists, configure Wordle and Word Search activities, preview them live, and download them as standalone HTML files.

See the [root README](../README.md) for the full architecture and how to run the whole stack.

## Running

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000. The app expects the API to be reachable at `NEXT_PUBLIC_API_URL`, which defaults to http://localhost:80.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/word` | Manage phoneme words and word lists |
| `/wordle` | Manage Wordle activities, preview, export HTML |
| `/word-search` | Manage Word Search activities, preview, export HTML |
| `/settings` | Theme, layout, API health check |
| `/about` | Project background |

## Layout

```
app/                     Routes, each delegating to a client component
components/
  phoneme/               Phoneme keyboard and word display
  word/ wordlist/        Word and word list CRUD
  wordle/ wordsearch/    Activity CRUD, builders, previews
  shared/                Reusable inputs, layout, Spinner, DeleteButton, ActionButton, LoadingRow
  settings/              Theme, layout, health check
lib/
  wordle/                Guess evaluation and config types
  wordsearch/            Puzzle generator
  html-export/           Standalone HTML templates and download helper
providers/WordsContext   Shared data layer
service/api-service.ts   Typed API client
types/api-types.ts       Request and response shapes
```

## Data flow

Every server interaction goes through `service/api-service.ts`. No component calls `fetch` directly, and failures are thrown as `ApiError` carrying the HTTP status and the server's message.

`providers/WordsContext.tsx` sits above the pages and owns the four collections the UI reads: words, word lists, Wordle activities, and Word Search activities. Each is managed by an internal `useCollection` hook that owns its own items, loading flag, and `refresh` function. Because the flags are per collection rather than shared, refreshing one list never blanks out the others.

Components follow a consistent trio per entity:

- **Fetcher** — renders the list, owns a local `deletingId` so only the row being removed shows a spinner.
- **Creator** — a create/update form that owns a local `saving` flag for its button. In Update mode with an empty collection, the form is hidden and a short message explains that something must be created first.
- **Manager** — stacks the fetcher above the creator.

Reads are owned by the provider; writes are owned by the component performing them. After a successful write the component calls the matching `refresh` function and the provider refetches.

## Activity generation

Both builders are driven entirely by stored data. Selecting a saved activity maps it into the shape the preview and export already expect:

- `activityToWordleConfig` in `lib/wordle/types.ts` produces a `WordleConfig` from a stored `WordleActivity`.
- `activityToPuzzle` in `lib/wordsearch/generator.ts` builds a puzzle from a stored activity's word list and grid size.

Phonemes are kept as arrays end to end. `activityToPuzzle` joins them with spaces before handing them to the generator, which splits on whitespace, so a multi-character symbol like `tʃ` occupies exactly one grid cell instead of two.

The generated HTML in `lib/html-export/` is fully self-contained, with inline styles and script, so a teacher can hand the downloaded file straight to students with no server involved.
