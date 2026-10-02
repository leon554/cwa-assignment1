import { activityLabel, formatTimestamp } from "@/components/dashboard/labels";
import type { GenerationLog } from "@/types/api-types";

type GenerationsTableProps = {
  generations: GenerationLog[];
  total: number;
};

export default function GenerationsTable({ generations, total }: GenerationsTableProps) {
  return (
    <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Generations</h3>
      {generations.length === 0 ? (
        <p className="text-sm text-muted">There is nothing to show yet.</p>
      ) : (
        <>
          {total > generations.length && (
            <p className="mb-4 text-sm text-muted">
              Showing {generations.length} of {total} matching generations.
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted">
                <tr className="border-b border-card-border">
                  <th className="py-2 pr-4 font-medium">Activity</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Duration</th>
                  <th className="py-2 pr-4 font-medium">Time</th>
                  <th className="py-2 font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {generations.map((generation) => (
                  <tr key={generation.id} className="border-b border-card-border last:border-b-0">
                    <td className="py-2 pr-4">{activityLabel(generation.activityType)}</td>
                    <td className="py-2 pr-4">{generation.status === "SUCCESS" ? "Success" : "Failed"}</td>
                    <td className="py-2 pr-4">{generation.durationMs} ms</td>
                    <td className="py-2 pr-4">{formatTimestamp(generation.createdAt)}</td>
                    <td className="py-2">{generation.errorMessage ?? "—"}</td>
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
