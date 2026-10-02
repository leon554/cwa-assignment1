import ActivityTypeUsage from "@/components/dashboard/ActivityTypeUsage";
import DashboardStats from "@/components/dashboard/DashboardStats";
import GenerationAlerts from "@/components/dashboard/GenerationAlerts";
import GenerationsOverTime from "@/components/dashboard/GenerationsOverTime";
import RecentGenerations from "@/components/dashboard/RecentGenerations";
import WordListSummary from "@/components/dashboard/WordListSummary";
import WordListUsage from "@/components/dashboard/WordListUsage";
import AlertBanner from "@/components/shared/AlertBanner";
import { getGenerationAlerts, getGenerations, getMetricsSummary, getSystemAlerts } from "@/service/api-service";
import type { SystemAlertCode } from "@/types/api-types";

function systemAlertVariant(code: SystemAlertCode) {
  if (code === "HIGH_FAILURE_RATE") return "error" as const;
  if (code === "NO_RECENT_GENERATIONS") return "info" as const;
  return "warning" as const;
}

export async function SystemAlertsSection() {
  const alerts = await getSystemAlerts();
  if (alerts.length === 0) return null;
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertBanner
          key={`${alert.code}-${alert.wordListId ?? ""}-${alert.wordId ?? ""}-${alert.activityId ?? ""}`}
          variant={systemAlertVariant(alert.code)}
        >
          {alert.message}
        </AlertBanner>
      ))}
    </div>
  );
}

export async function DashboardStatsSection() {
  const summary = await getMetricsSummary();
  return (
    <DashboardStats
      activityCounts={summary.activityCounts}
      generationStats={summary.generationStats}
      averageTimeOnPage={summary.averageTimeOnPage}
      mostUsedActivityType={summary.mostUsedActivityType}
    />
  );
}

export async function GenerationAlertsSection() {
  const alerts = await getGenerationAlerts();
  return <GenerationAlerts alerts={alerts} />;
}

export async function RecentGenerationsSection() {
  const generations = await getGenerations({ page: 1, pageSize: 10 });
  return <RecentGenerations generations={generations.items} />;
}

export async function ActivityTypeUsageSection() {
  const summary = await getMetricsSummary();
  return <ActivityTypeUsage activityCounts={summary.activityCounts} />;
}

export async function GenerationsOverTimeSection() {
  const summary = await getMetricsSummary();
  return <GenerationsOverTime points={summary.generationsOverTime} />;
}

export async function WordListSummarySection() {
  const summary = await getMetricsSummary();
  return <WordListSummary stats={summary.wordListStats} />;
}

export async function WordListUsageSection() {
  const summary = await getMetricsSummary();
  return <WordListUsage wordLists={summary.wordLists} />;
}
