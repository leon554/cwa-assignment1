import { ActivityAction, ActivityType, GenerationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ActivityCounts = {
  wordle: number;
  wordSearch: number;
};

export type GenerationStats = {
  total: number;
  success: number;
  failed: number;
  successRate: number;
};

export type GenerationFilters = {
  activityType?: ActivityType;
  status?: GenerationStatus;
  from?: Date;
  to?: Date;
};

export type RecentGenerationsQuery = {
  filters?: GenerationFilters;
  page: number;
  pageSize: number;
};

export type RecentGenerations = {
  items: Prisma.GenerationLogGetPayload<object>[];
  total: number;
  page: number;
  pageSize: number;
};

export type WordListSummary = {
  id: number;
  name: string;
  wordCount: number;
  activityCount: number;
};

export type GenerationsOverTimePoint = {
  date: Date;
  activityType: ActivityType;
  createdCount: number;
  successCount: number;
  failedCount: number;
};

export async function getActivityCounts(): Promise<ActivityCounts> {
  const [wordle, wordSearch] = await Promise.all([
    prisma.wordleActivity.count(),
    prisma.wordSearchActivity.count(),
  ]);
  return { wordle, wordSearch };
}

export async function getGenerationStats(): Promise<GenerationStats> {
  const groups = await prisma.generationLog.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const success = groups.find((group) => group.status === GenerationStatus.SUCCESS)?._count._all ?? 0;
  const failed = groups.find((group) => group.status === GenerationStatus.FAILED)?._count._all ?? 0;
  const total = success + failed;

  return {
    total,
    success,
    failed,
    successRate: total === 0 ? 0 : success / total,
  };
}

export async function getAverageTimeOnPage(): Promise<number | null> {
  const result = await prisma.pageView.aggregate({
    _avg: { durationSeconds: true },
  });
  return result._avg.durationSeconds;
}

export async function getMostUsedActivityType(): Promise<ActivityType | null> {
  const groups = await prisma.generationLog.groupBy({
    by: ["activityType"],
    _count: { _all: true },
    orderBy: { _count: { activityType: "desc" } },
    take: 1,
  });
  return groups[0]?.activityType ?? null;
}

export async function getRecentGenerations({
  filters,
  page,
  pageSize,
}: RecentGenerationsQuery): Promise<RecentGenerations> {
  const where: Prisma.GenerationLogWhereInput = {
    activityType: filters?.activityType,
    status: filters?.status,
    createdAt:
      filters?.from || filters?.to
        ? { gte: filters.from, lte: filters.to }
        : undefined,
  };

  const [items, total] = await Promise.all([
    prisma.generationLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.generationLog.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getWordListSummary(): Promise<WordListSummary[]> {
  const lists = await prisma.phonemeWordList.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      _count: { select: { words: true, wordSearchActivities: true } },
    },
  });

  return lists.map((list) => ({
    id: list.id,
    name: list.name,
    wordCount: list._count.words,
    activityCount: list._count.wordSearchActivities,
  }));
}

export async function getGenerationsOverTime(): Promise<GenerationsOverTimePoint[]> {
  const groups = await prisma.dailyMetricSummary.groupBy({
    by: ["date", "activityType"],
    _sum: {
      createdCount: true,
      successCount: true,
      failedCount: true,
    },
    orderBy: { date: "asc" },
  });

  return groups.map((group) => ({
    date: group.date,
    activityType: group.activityType,
    createdCount: group._sum.createdCount ?? 0,
    successCount: group._sum.successCount ?? 0,
    failedCount: group._sum.failedCount ?? 0,
  }));
}

const ACTIVITY_ROUTE: Record<ActivityType, string> = {
  [ActivityType.WORDLE]: "/wordle",
  [ActivityType.WORD_SEARCH]: "/word-search",
};

export type RecordGenerationInput = {
  activityType: ActivityType;
  status: GenerationStatus;
  errorMessage?: string | null;
  durationMs: number;
  wordId?: number | null;
  wordListId?: number | null;
};

export type RecordPageViewInput = {
  route: string;
  durationSeconds: number;
};

export type RecordActivityEventInput = {
  activityType: ActivityType;
  action: ActivityAction;
};

function utcDayRange(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export async function refreshDailySummary() {
  const { start, end } = utcDayRange();
  const [logGroups, viewGroups] = await Promise.all([
    prisma.generationLog.groupBy({
      by: ["activityType", "status"],
      where: { createdAt: { gte: start, lt: end } },
      _count: { _all: true },
    }),
    prisma.pageView.groupBy({
      by: ["route"],
      where: {
        createdAt: { gte: start, lt: end },
        route: { in: Object.values(ACTIVITY_ROUTE) },
      },
      _avg: { durationSeconds: true },
    }),
  ]);

  return Promise.all(
    [ActivityType.WORDLE, ActivityType.WORD_SEARCH].map((activityType) => {
      const successCount =
        logGroups.find(
          (group) => group.activityType === activityType && group.status === GenerationStatus.SUCCESS,
        )?._count._all ?? 0;
      const failedCount =
        logGroups.find(
          (group) => group.activityType === activityType && group.status === GenerationStatus.FAILED,
        )?._count._all ?? 0;
      const avgTimeOnPage =
        viewGroups.find((group) => group.route === ACTIVITY_ROUTE[activityType])?._avg.durationSeconds ?? 0;
      const counts = {
        createdCount: successCount + failedCount,
        successCount,
        failedCount,
        avgTimeOnPage,
      };

      return prisma.dailyMetricSummary.upsert({
        where: { date_activityType: { date: start, activityType } },
        create: { date: start, activityType, ...counts },
        update: counts,
      });
    }),
  );
}

export async function recordGeneration(input: RecordGenerationInput) {
  const log = await prisma.generationLog.create({
    data: { ...input, createdAt: new Date() },
  });
  await refreshDailySummary();
  return log;
}

export async function recordPageView(input: RecordPageViewInput) {
  const view = await prisma.pageView.create({
    data: { ...input, createdAt: new Date() },
  });
  await refreshDailySummary();
  return view;
}

export async function recordActivityEvent(input: RecordActivityEventInput) {
  return prisma.activityEvent.create({
    data: { ...input, createdAt: new Date() },
  });
}
