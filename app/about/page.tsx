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
            <strong className="text-foreground">Assessment 1</strong> focuses on
            frontend design and usability only. Teachers can configure activities,
            preview them in the browser, and generate downloadable HTML files.
            Database-driven word lists will be introduced in Assessment 2.
          </p>
        </section>

        <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Activity tools</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li>
              <Link href="/wordle" className="font-medium text-primary hover:underline">
                Phoneme Wordle
              </Link>
              {": "}A guessing game where students enter phoneme symbols instead
              of standard spelling. Uses a single target word with hover hints
              showing phonetic-to-English equivalence.
            </li>
            <li>
              <Link href="/word-search" className="font-medium text-primary hover:underline">
                Phoneme Word Search
              </Link>
              {": "}A word search puzzle generated from a small list of
              phoneme-based words. Students find phoneme sequences in the grid.
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
          <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-card-border bg-background">
            <p className="text-sm text-muted">
              Video embed placeholder — add your demonstration video here
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
