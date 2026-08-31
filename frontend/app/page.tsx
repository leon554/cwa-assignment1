import Link from "next/link";

const ACTIVITIES = [
  {
    href: "/wordle",
    title: "Phoneme Wordle",
    description:
      "Build a single-word guessing game using HCE phoneme symbols. Students use the phoneme keyboard to guess the target word.",
  },
  {
    href: "/word-search",
    title: "Phoneme Word Search",
    description:
      "Create a word search puzzle from a small list of phoneme-based words for literacy and phoneme-recognition practice.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <section className="mb-10 text-center">
        <h2 className="mb-4 text-3xl font-bold text-primary">
          Welcome to the Phoneme Activity Builder
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          A classroom tool for Speech Pathology teachers to create and preview
          phoneme-based Wordle and Word Search activities, then download them as
          standalone HTML files for students.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {ACTIVITIES.map((activity) => (
          <Link
            key={activity.href}
            href={activity.href}
            className="group rounded-xl border border-card-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h3 className="mb-2 text-xl font-semibold text-primary group-hover:underline">
              {activity.title}
            </h3>
            <p className="text-sm text-muted">{activity.description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary">
              Open builder &rarr;
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-10 rounded-xl border border-card-border bg-card p-6 text-center">
        <p className="text-sm text-muted">
          New to this project?{" "}
          <Link href="/about" className="font-medium text-primary hover:underline">
            Read the About page
          </Link>{" "}
          to learn how Assessment 1 works and watch the demonstration video.
        </p>
      </section>
    </div>
  );
}
