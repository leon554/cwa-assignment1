import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
      <h2 className="mb-6 text-2xl font-bold text-primary">About</h2>

      <div className="space-y-6 text-foreground/90">
        <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Project overview</h3>
          <p className="mb-3 text-sm leading-relaxed text-muted">
            The HCE Phoneme Activity Builder is designed for Speech Pathology
            students and teachers. It helps teachers prepare phoneme-based
            classroom activities that support literacy and phoneme-recognition
            skills using broad HCE transcription.
          </p>
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-foreground">Assessment 1</strong> delivered
            the frontend builder: configure activities, preview them in the
            browser, and download standalone HTML files.{" "}
            <strong className="text-foreground">Assessment 2</strong> adds the
            backend and database layer — a Next.js API, Prisma with Postgres,
            full CRUD for words and activities, and HTML generation driven by
            stored data rather than hard-coded examples.
          </p>
        </section>

        <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Assessment 2</h3>
          <p className="mb-3 text-sm leading-relaxed text-muted">
            The application now runs as two Next.js services plus Postgres,
            orchestrated with Docker Compose. Teachers can create, read, update,
            and delete:
          </p>
          <ul className="mb-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>
              Phoneme words stored as a string array so multi-character symbols
              such as <span className="font-mono text-foreground">tʃ</span> stay
              intact
            </li>
            <li>Named word lists that group words for Word Search</li>
            <li>Named Wordle and Word Search activity configurations</li>
            <li>Global theme and layout settings</li>
          </ul>
          <p className="text-sm leading-relaxed text-muted">
            The API validates input, returns clear error messages, and exposes a{" "}
            <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs text-foreground">
              /health
            </code>{" "}
            endpoint that checks database connectivity. Wordle and Word Search
            HTML downloads are generated from saved activities.
          </p>
        </section>

        <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Activity tools</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li>
              <Link href="/word" className="font-medium text-primary hover:underline">
                Manage Words
              </Link>
              {": "}Create and edit phoneme words and word lists. These feed the
              Wordle and Word Search builders.
            </li>
            <li>
              <Link href="/wordle" className="font-medium text-primary hover:underline">
                Phoneme Wordle
              </Link>
              {": "}Save and load Wordle activities from the database, preview
              the game, and download HTML. Students guess with phoneme symbols
              instead of standard spelling.
            </li>
            <li>
              <Link href="/word-search" className="font-medium text-primary hover:underline">
                Phoneme Word Search
              </Link>
              {": "}Save and load Word Search activities from a stored word list
              and grid size, preview the puzzle, and download HTML.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Student details</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="font-medium text-muted">Name</dt>
            <dd>Leon Smit</dd>
            <dt className="font-medium text-muted">Student number</dt>
            <dd>22409758</dd>
          </dl>
        </section>

        <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Demonstration video</h3>
          <p className="mb-3 text-sm text-muted">
            Assessment 2 walkthrough — CRUD, health check, Docker, and HTML
            generation from stored data.
          </p>
          <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-card-border bg-background">
            <p className="text-sm text-muted">
              Video embed placeholder — add your Assessment 2 demonstration
              video here
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
