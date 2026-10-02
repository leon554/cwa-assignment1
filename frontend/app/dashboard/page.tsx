import ActivityTypeUsage from "@/components/dashboard/ActivityTypeUsage";
import DashboardStats from "@/components/dashboard/DashboardStats";
import GenerationAlerts from "@/components/dashboard/GenerationAlerts";
import GenerationsOverTime from "@/components/dashboard/GenerationsOverTime";
import RecentGenerations from "@/components/dashboard/RecentGenerations";
import WordListSummary from "@/components/dashboard/WordListSummary";
import WordListUsage from "@/components/dashboard/WordListUsage";
import { getGenerationAlerts, getGenerations, getMetricsSummary } from "@/service/api-service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [summary, alerts, generations] = await Promise.all([
    getMetricsSummary(),
    getGenerationAlerts(),
    getGenerations({ page: 1, pageSize: 10 }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <h2 className="mb-2 text-2xl font-bold text-primary">Dashboard</h2>
      <p className="mb-8 text-muted">Activity counts, generation results, and recent classroom usage.</p>
      <div className="space-y-6">
        <DashboardStats
          activityCounts={summary.activityCounts}
          generationStats={summary.generationStats}
          averageTimeOnPage={summary.averageTimeOnPage}
          mostUsedActivityType={summary.mostUsedActivityType}
        />
        <GenerationAlerts alerts={alerts} />
        <RecentGenerations generations={generations.items} />
        <ActivityTypeUsage activityCounts={summary.activityCounts} />
        <GenerationsOverTime points={summary.generationsOverTime} />
        <WordListSummary stats={summary.wordListStats} />
        <WordListUsage wordLists={summary.wordLists} />
      </div>
    </div>
  );
}
