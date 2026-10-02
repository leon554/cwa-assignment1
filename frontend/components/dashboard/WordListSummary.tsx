import StatCard from "@/components/shared/StatCard";
import type { WordListStats } from "@/types/api-types";

type WordListSummaryProps = {
  stats: WordListStats;
};

export default function WordListSummary({ stats }: WordListSummaryProps) {
  const maxLists = Math.max(0, ...stats.distribution.map((bucket) => bucket.listCount));
  const distributionLabel = stats.distribution
    .map((bucket) => `${bucket.listCount} lists have ${bucket.wordCount} words`)
    .join(", ");

  return (
    <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Word list summary</h3>
      {stats.listCount === 0 ? (
        <p className="text-sm text-muted">There is nothing to show yet.</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Word lists" value={String(stats.listCount)} />
            <StatCard label="Average words per list" value={stats.averageWordsPerList.toFixed(1)} />
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Most common phonemes</h4>
            {stats.mostCommonPhonemes.length === 0 ? (
              <p className="text-sm text-muted">There is nothing to show yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {stats.mostCommonPhonemes.map((entry) => (
                  <li key={entry.phoneme} className="flex justify-between gap-4 border-b border-card-border pb-2 last:border-b-0">
                    <span>{entry.phoneme}</span>
                    <span className="font-medium text-primary">{entry.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Words per list</h4>
            <div
              role="img"
              aria-label={`Distribution of words per list. ${distributionLabel}.`}
              className="space-y-3"
            >
              {stats.distribution.map((bucket) => (
                <div
                  key={bucket.wordCount}
                  className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 text-sm"
                >
                  <span>{bucket.wordCount} words</span>
                  <div className="h-3 rounded bg-card-border">
                    <div
                      className="h-3 rounded bg-primary"
                      style={{ width: `${(bucket.listCount / maxLists) * 100}%` }}
                    />
                  </div>
                  <span className="text-right">{bucket.listCount}</span>
                </div>
              ))}
            </div>
            <table className="sr-only">
              <caption>Distribution of words per list</caption>
              <thead>
                <tr>
                  <th>Word count</th>
                  <th>List count</th>
                </tr>
              </thead>
              <tbody>
                {stats.distribution.map((bucket) => (
                  <tr key={bucket.wordCount}>
                    <td>{bucket.wordCount}</td>
                    <td>{bucket.listCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
