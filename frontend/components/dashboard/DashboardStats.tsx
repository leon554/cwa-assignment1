import { activityLabel } from "@/components/dashboard/labels";
import type { ActivityCounts, ActivityTypeName, GenerationStats } from "@/types/api-types";

type StatProps = {
  label: string;
  value: string;
};

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

type DashboardStatsProps = {
  activityCounts: ActivityCounts;
  generationStats: GenerationStats;
  averageTimeOnPage: number | null;
  mostUsedActivityType: ActivityTypeName | null;
};

export default function DashboardStats({
  activityCounts,
  generationStats,
  averageTimeOnPage,
  mostUsedActivityType,
}: DashboardStatsProps) {
  const successRate = `${Math.round(generationStats.successRate * 100)}%`;
  const averageTime =
    averageTimeOnPage === null ? "No page views yet" : `${Math.round(averageTimeOnPage)}s`;
  const mostUsed = mostUsedActivityType === null ? "None yet" : activityLabel(mostUsedActivityType);

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Wordle activities" value={String(activityCounts.wordle)} />
      <Stat label="Word Search activities" value={String(activityCounts.wordSearch)} />
      <Stat label="Generations" value={String(generationStats.total)} />
      <Stat label="Successful generations" value={String(generationStats.success)} />
      <Stat label="Failed generations" value={String(generationStats.failed)} />
      <Stat label="Success rate" value={successRate} />
      <Stat label="Average time on page" value={averageTime} />
      <Stat label="Most used activity" value={mostUsed} />
    </section>
  );
}
