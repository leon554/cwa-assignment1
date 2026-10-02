import { Suspense } from "react";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import {
  ActivityTypeUsageSection,
  DashboardStatsSection,
  GenerationAlertsSection,
  GenerationsOverTimeSection,
  RecentGenerationsSection,
  SystemAlertsSection,
  WordListSummarySection,
  WordListUsageSection,
} from "@/components/dashboard/sections";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <h2 className="mb-2 text-2xl font-bold text-primary">Dashboard</h2>
      <p className="mb-8 text-muted">Activity counts, generation results, and recent classroom usage.</p>
      <div className="space-y-6">
        <Suspense fallback={<SectionSkeleton section="system alerts" />}>
          <SystemAlertsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton section="activity stats" />}>
          <DashboardStatsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton section="alerts" />}>
          <GenerationAlertsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton section="recent generations" />}>
          <RecentGenerationsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton section="activity type usage" />}>
          <ActivityTypeUsageSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton section="generations over time" />}>
          <GenerationsOverTimeSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton section="word list summary" />}>
          <WordListSummarySection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton section="word lists" />}>
          <WordListUsageSection />
        </Suspense>
      </div>
    </div>
  );
}
