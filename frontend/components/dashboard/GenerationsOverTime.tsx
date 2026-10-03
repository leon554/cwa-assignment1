import { activityLabel, formatDate } from "@/components/dashboard/labels";
import type { GenerationsOverTimePoint } from "@/types/api-types";

type GenerationsOverTimeProps = {
  points: GenerationsOverTimePoint[];
};

type DayCounts = {
  date: string;
  wordle: number;
  wordSearch: number;
};

function groupByDate(points: GenerationsOverTimePoint[]): DayCounts[] {
  const days: DayCounts[] = [];
  for (const point of points) {
    const date = formatDate(point.date);
    let day = days.find((entry) => entry.date === date);
    if (!day) {
      day = { date, wordle: 0, wordSearch: 0 };
      days.push(day);
    }
    if (point.activityType === "WORDLE") {
      day.wordle += point.createdCount;
    } else {
      day.wordSearch += point.createdCount;
    }
  }
  return days;
}

export default function GenerationsOverTime({ points }: GenerationsOverTimeProps) {
  const days = groupByDate(points);
  const max = Math.max(1, ...days.flatMap((day) => [day.wordle, day.wordSearch]));

  return (
    <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Generations over time</h3>
      {points.length === 0 ? (
        <p className="text-sm text-muted">There is nothing to show yet.</p>
      ) : (
        <>
          <div className="mb-4 flex gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="inline-block size-2.5 rounded-sm bg-primary" aria-hidden="true" />
              Wordle
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block size-2.5 rounded-sm bg-[var(--tile-present)]" aria-hidden="true" />
              Word Search
            </span>
          </div>
          <div className="overflow-x-auto">
            <div
              role="img"
              aria-label="Created generations per day for Wordle and Word Search."
              className="flex items-end gap-3"
            >
              {days.map((day) => (
                <div key={day.date} className="flex w-12 shrink-0 flex-col items-center gap-2">
                  <div className="flex h-32 items-end gap-1">
                    <div
                      className="w-3 rounded-sm bg-primary"
                      style={{ height: `${(day.wordle / max) * 100}%` }}
                    />
                    <div
                      className="w-3 rounded-sm bg-[var(--tile-present)]"
                      style={{ height: `${(day.wordSearch / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-center text-[10px] leading-tight text-muted">{day.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-0 overflow-hidden">
          <table className="sr-only">
            <caption>Generations over time</caption>
            <thead>
              <tr>
                <th>Date</th>
                <th>Activity type</th>
                <th>Created</th>
                <th>Success</th>
                <th>Failed</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={`${point.date}-${point.activityType}`}>
                  <td>{formatDate(point.date)}</td>
                  <td>{activityLabel(point.activityType)}</td>
                  <td>{point.createdCount}</td>
                  <td>{point.successCount}</td>
                  <td>{point.failedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </section>
  );
}
