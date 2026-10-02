import { activityLabel, formatDate } from "@/components/dashboard/labels";
import type { GenerationsOverTimePoint } from "@/types/api-types";

type GenerationsOverTimeProps = {
  points: GenerationsOverTimePoint[];
};

export default function GenerationsOverTime({ points }: GenerationsOverTimeProps) {
  return (
    <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Generations over time</h3>
      {points.length === 0 ? (
        <p className="text-sm text-muted">There is nothing to show yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted">
              <tr className="border-b border-card-border">
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Activity</th>
                <th className="py-2 pr-4 font-medium">Created</th>
                <th className="py-2 pr-4 font-medium">Success</th>
                <th className="py-2 font-medium">Failed</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr
                  key={`${point.date}-${point.activityType}`}
                  className="border-b border-card-border last:border-b-0"
                >
                  <td className="py-2 pr-4">{formatDate(point.date)}</td>
                  <td className="py-2 pr-4">{activityLabel(point.activityType)}</td>
                  <td className="py-2 pr-4">{point.createdCount}</td>
                  <td className="py-2 pr-4">{point.successCount}</td>
                  <td className="py-2">{point.failedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
