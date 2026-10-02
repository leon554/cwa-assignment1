"use client";

type ReportsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ReportsError({ error, reset }: ReportsErrorProps) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <h2 className="mb-2 text-2xl font-bold text-primary">Reports</h2>
      <div className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
        <p className="mb-4 text-sm text-muted">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
