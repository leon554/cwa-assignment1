type GenerationFiltersProps = {
  activityType: string;
  status: string;
  from: string;
  to: string;
};

const FIELD_CLASS = "w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm";

function exportHref({ activityType, status, from, to }: GenerationFiltersProps) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:80";
  const params = new URLSearchParams();
  if (activityType) params.set("activityType", activityType);
  if (status) params.set("status", status);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const search = params.toString();
  return `${base}/api/metrics/generations/export${search ? `?${search}` : ""}`;
}

export default function GenerationFilters({
  activityType,
  status,
  from,
  to,
}: GenerationFiltersProps) {
  return (
    <form method="get" action="/reports" className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="activityType" className="mb-1 block text-sm font-medium">
            Activity type
          </label>
          <select id="activityType" name="activityType" defaultValue={activityType} className={FIELD_CLASS}>
            <option value="">Any</option>
            <option value="WORDLE">Wordle</option>
            <option value="WORD_SEARCH">Word Search</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select id="status" name="status" defaultValue={status} className={FIELD_CLASS}>
            <option value="">Any</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
        <div>
          <label htmlFor="from" className="mb-1 block text-sm font-medium">
            From
          </label>
          <input id="from" name="from" type="date" defaultValue={from} className={`${FIELD_CLASS} date-input`} />
        </div>
        <div>
          <label htmlFor="to" className="mb-1 block text-sm font-medium">
            To
          </label>
          <input id="to" name="to" type="date" defaultValue={to} className={`${FIELD_CLASS} date-input`} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-[var(--primary-hover)]"
        >
          Apply filters
        </button>
        <a
          href={exportHref({ activityType, status, from, to })}
          className="text-sm font-medium text-primary hover:underline"
        >
          Download CSV
        </a>
      </div>
    </form>
  );
}
