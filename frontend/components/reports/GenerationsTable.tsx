import { activityLabel, formatTimestamp } from "@/components/dashboard/labels";
import type { GenerationLog } from "@/types/api-types";

type GenerationsTableProps = {
  generations: GenerationLog[];
  total: number;
  page: number;
  pageSize: number;
  activityType: string;
  status: string;
  from: string;
  to: string;
};

function reportsHref(
  page: number,
  filters: { activityType: string; status: string; from: string; to: string },
) {
  const params = new URLSearchParams();
  if (filters.activityType) params.set("activityType", filters.activityType);
  if (filters.status) params.set("status", filters.status);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/reports?${search}` : "/reports";
}

export default function GenerationsTable({
  generations,
  total,
  page,
  pageSize,
  activityType,
  status,
  from,
  to,
}: GenerationsTableProps) {
  const filters = { activityType, status, from, to };
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = start + generations.length - 1;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Generations</h3>
      {generations.length === 0 ? (
        <p className="text-sm text-muted">There is nothing to show yet.</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted">
            Showing {start}–{end} of {total} matching generations.
          </p>
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
          {(page > 1 || page < lastPage) && (
            <nav className="mt-4 flex items-center gap-4 text-sm" aria-label="Pagination">
              {page > 1 && (
                <a href={reportsHref(page - 1, filters)} className="font-medium text-primary hover:underline">
                  Previous
                </a>
              )}
              {page < lastPage && (
                <a href={reportsHref(page + 1, filters)} className="font-medium text-primary hover:underline">
                  Next
                </a>
              )}
            </nav>
          )}
        </>
      )}
    </section>
  );
}
