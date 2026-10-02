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

export type WordListStats = {
  listCount: number;
  averageWordsPerList: number;
  mostCommonPhonemes: { phoneme: string; count: number }[];
  distribution: { wordCount: number; listCount: number }[];
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

function generationWhere(filters?: GenerationFilters): Prisma.GenerationLogWhereInput {
  return {
    activityType: filters?.activityType,
    status: filters?.status,
    createdAt:
      filters?.from || filters?.to
        ? { gte: filters.from, lte: filters.to }
        : undefined,
  };
}

export async function getRecentGenerations({
  filters,
  page,
  pageSize,
}: RecentGenerationsQuery): Promise<RecentGenerations> {
  const where = generationWhere(filters);

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

function buildWordListStats(
  lists: { wordCount: number; words: { phonemes: string[] }[] }[],
): WordListStats {
  const listCount = lists.length;
  const averageWordsPerList =
    listCount === 0 ? 0 : lists.reduce((sum, list) => sum + list.wordCount, 0) / listCount;

  const phonemeCounts = new Map<string, number>();
  for (const list of lists) {
    for (const word of list.words) {
      for (const phoneme of word.phonemes) {
        phonemeCounts.set(phoneme, (phonemeCounts.get(phoneme) ?? 0) + 1);
      }
    }
  }

  const mostCommonPhonemes = [...phonemeCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([phoneme, count]) => ({ phoneme, count }));

  const buckets = new Map<number, number>();
  for (const list of lists) {
    buckets.set(list.wordCount, (buckets.get(list.wordCount) ?? 0) + 1);
  }
  const distribution = [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([wordCount, bucketListCount]) => ({ wordCount, listCount: bucketListCount }));

  return { listCount, averageWordsPerList, mostCommonPhonemes, distribution };
}

export async function getWordListSummary(): Promise<{
  wordLists: WordListSummary[];
  wordListStats: WordListStats;
}> {
  const lists = await prisma.phonemeWordList.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      words: { select: { phonemes: true } },
      _count: { select: { words: true, wordSearchActivities: true } },
    },
  });

  const wordLists = lists.map((list) => ({
    id: list.id,
    name: list.name,
    wordCount: list._count.words,
    activityCount: list._count.wordSearchActivities,
  }));

  return {
    wordLists,
    wordListStats: buildWordListStats(
      lists.map((list) => ({ wordCount: list._count.words, words: list.words })),
    ),
  };
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

export async function getMetricsSummary() {
  const [
    activityCounts,
    generationStats,
    averageTimeOnPage,
    mostUsedActivityType,
    wordListReport,
    generationsOverTime,
  ] = await Promise.all([
    getActivityCounts(),
    getGenerationStats(),
    getAverageTimeOnPage(),
    getMostUsedActivityType(),
    getWordListSummary(),
    getGenerationsOverTime(),
  ]);

  return {
    activityCounts,
    generationStats,
    averageTimeOnPage,
    mostUsedActivityType,
    wordLists: wordListReport.wordLists,
    wordListStats: wordListReport.wordListStats,
    generationsOverTime,
  };
}

function csvCell(value: string | number | null) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export async function exportGenerationsCsv(filters?: GenerationFilters) {
  const logs = await prisma.generationLog.findMany({
    where: generationWhere(filters),
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "id",
    "activityType",
    "status",
    "errorMessage",
    "durationMs",
    "wordId",
    "wordListId",
    "createdAt",
  ];
  const rows = logs.map((log) =>
    [
      log.id,
      log.activityType,
      log.status,
      log.errorMessage,
      log.durationMs,
      log.wordId,
      log.wordListId,
      log.createdAt.toISOString(),
    ]
      .map((value) => csvCell(value))
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export type GenerationAlert = {
  activityType: ActivityType;
  errorMessage: string | null;
  count: number;
};

export type SystemAlertCode =
  | "EMPTY_WORD_LIST"
  | "HIGH_FAILURE_RATE"
  | "EMPTY_PHONEMES"
  | "WORD_LONGER_THAN_GRID"
  | "NO_RECENT_GENERATIONS";

export type SystemAlert = {
  code: SystemAlertCode;
  message: string;
  wordListId: number | null;
  wordId: number | null;
  activityId: number | null;
};

function systemAlert(
  code: SystemAlertCode,
  message: string,
  ids: { wordListId?: number; wordId?: number; activityId?: number } = {},
): SystemAlert {
  return {
    code,
    message,
    wordListId: ids.wordListId ?? null,
    wordId: ids.wordId ?? null,
    activityId: ids.activityId ?? null,
  };
}

export async function getSystemAlerts(): Promise<SystemAlert[]> {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [emptyLists, stats, emptyPhonemeWords, wordSearches, recentCount] = await Promise.all([
    prisma.phonemeWordList.findMany({
      where: { words: { none: {} } },
      select: { id: true, name: true },
      orderBy: { id: "asc" },
    }),
    getGenerationStats(),
    prisma.phonemeWord.findMany({
      where: {
        phonemes: { isEmpty: true },
        OR: [
          { wordleActivities: { some: {} } },
          { wordLists: { some: { wordSearchActivities: { some: {} } } } },
        ],
      },
      select: { id: true, englishWord: true },
      orderBy: { id: "asc" },
    }),
    prisma.wordSearchActivity.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        gridWidth: true,
        gridHeight: true,
        wordList: {
          select: {
            words: {
              orderBy: { id: "asc" },
              select: { id: true, englishWord: true, phonemes: true },
            },
          },
        },
      },
    }),
    prisma.generationLog.count({ where: { createdAt: { gte: dayAgo } } }),
  ]);

  const alerts: SystemAlert[] = [];

  for (const list of emptyLists) {
    alerts.push(
      systemAlert("EMPTY_WORD_LIST", `Word list "${list.name}" has no words`, { wordListId: list.id }),
    );
  }

  if (stats.total > 0 && stats.failed / stats.total > 0.2) {
    const percent = Math.round((stats.failed / stats.total) * 100);
    alerts.push(
      systemAlert(
        "HIGH_FAILURE_RATE",
        `Generation failure rate is ${percent}% (${stats.failed} of ${stats.total})`,
      ),
    );
  }

  for (const word of emptyPhonemeWords) {
    alerts.push(
      systemAlert(
        "EMPTY_PHONEMES",
        `Word "${word.englishWord}" has no phonemes and is used by an activity`,
        { wordId: word.id },
      ),
    );
  }

  for (const activity of wordSearches) {
    const limit = Math.max(activity.gridWidth, activity.gridHeight);
    const word = activity.wordList.words.find((entry) => entry.phonemes.length > limit);
    if (!word) continue;
    alerts.push(
      systemAlert(
        "WORD_LONGER_THAN_GRID",
        `Word Search "${activity.name}" includes "${word.englishWord}", which has ${word.phonemes.length} phonemes and the larger grid dimension is ${limit}`,
        { activityId: activity.id, wordId: word.id },
      ),
    );
  }

  if (recentCount === 0) {
    alerts.push(systemAlert("NO_RECENT_GENERATIONS", "No generations in the last 24 hours"));
  }

  return alerts;
}

export async function getAlerts(): Promise<GenerationAlert[]> {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - 6);

  const groups = await prisma.generationLog.groupBy({
    by: ["activityType", "errorMessage"],
    where: {
      status: GenerationStatus.FAILED,
      createdAt: { gte: start },
    },
    _count: { _all: true },
    orderBy: { _count: { errorMessage: "desc" } },
  });

  return groups.map((group) => ({
    activityType: group.activityType,
    errorMessage: group.errorMessage,
    count: group._count._all,
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
