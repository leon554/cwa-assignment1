import { activityLabel } from "@/components/dashboard/labels";
import StatCard from "@/components/shared/StatCard";
import type { ActivityCounts, ActivityTypeName, GenerationStats } from "@/types/api-types";

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
      <StatCard label="Wordle activities" value={String(activityCounts.wordle)} />
      <StatCard label="Word Search activities" value={String(activityCounts.wordSearch)} />
      <StatCard label="Generations" value={String(generationStats.total)} />
      <StatCard label="Successful generations" value={String(generationStats.success)} />
      <StatCard label="Failed generations" value={String(generationStats.failed)} />
      <StatCard label="Success rate" value={successRate} />
      <StatCard label="Average time on page" value={averageTime} />
      <StatCard label="Most used activity" value={mostUsed} />
    </section>
  );
}
