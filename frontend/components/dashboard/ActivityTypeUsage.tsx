import type { ActivityCounts } from "@/types/api-types";

type ActivityTypeUsageProps = {
  activityCounts: ActivityCounts;
};

export default function ActivityTypeUsage({ activityCounts }: ActivityTypeUsageProps) {
  const rows = [
    { label: "Wordle", count: activityCounts.wordle, barClass: "bg-primary" },
    { label: "Word Search", count: activityCounts.wordSearch, barClass: "bg-[var(--tile-present)]" },
  ];
  const max = Math.max(activityCounts.wordle, activityCounts.wordSearch);

  return (
    <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Activity type usage</h3>
      {max === 0 ? (
        <p className="text-sm text-muted">There is nothing to show yet.</p>
      ) : (
        <>
          <div
            role="img"
            aria-label={`Activity type usage. Wordle ${activityCounts.wordle}, Word Search ${activityCounts.wordSearch}.`}
            className="space-y-3"
          >
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 text-sm">
                <span>{row.label}</span>
                <div className="h-3 rounded bg-card-border">
                  <div
                    className={`h-3 rounded ${row.barClass}`}
                    style={{ width: `${(row.count / max) * 100}%` }}
                  />
                </div>
                <span className="text-right">{row.count}</span>
              </div>
            ))}
          </div>
          <table className="sr-only">
            <caption>Activity type usage</caption>
            <thead>
              <tr>
                <th>Activity type</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
