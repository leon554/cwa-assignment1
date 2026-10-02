import GenerationFilters from "@/components/reports/GenerationFilters";
import GenerationsTable from "@/components/reports/GenerationsTable";
import { getGenerations } from "@/service/api-service";
import type { ActivityTypeName, GenerationQuery, GenerationStatusName } from "@/types/api-types";

export const dynamic = "force-dynamic";

type ReportsSearchParams = {
  activityType?: string | string[];
  status?: string | string[];
  from?: string | string[];
  to?: string | string[];
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function activityType(value: string): ActivityTypeName | undefined {
  if (value === "WORDLE" || value === "WORD_SEARCH") return value;
  return undefined;
}

function status(value: string): GenerationStatusName | undefined {
  if (value === "SUCCESS" || value === "FAILED") return value;
  return undefined;
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<ReportsSearchParams>;
}) {
  const params = await searchParams;
  const activityTypeValue = first(params.activityType);
  const statusValue = first(params.status);
  const from = first(params.from);
  const to = first(params.to);

  const query: GenerationQuery = { page: 1, pageSize: 100 };
  const selectedType = activityType(activityTypeValue);
  const selectedStatus = status(statusValue);
  if (selectedType) query.activityType = selectedType;
  if (selectedStatus) query.status = selectedStatus;
  if (from) query.from = from;
  if (to) query.to = to;

  const generations = await getGenerations(query);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <h2 className="mb-2 text-2xl font-bold text-primary">Reports</h2>
      <p className="mb-8 text-muted">Generation history filtered by activity type, status, and date.</p>
      <div className="space-y-6">
        <GenerationFilters
          activityType={selectedType ?? ""}
          status={selectedStatus ?? ""}
          from={from}
          to={to}
        />
        <GenerationsTable generations={generations.items} total={generations.total} />
      </div>
    </div>
  );
}
