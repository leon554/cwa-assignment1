import "dotenv/config";
import { ActivityType, GenerationStatus, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DAY_COUNT = 30;
const WORDLE_LOGS = 100;
const SEARCH_LOGS = 100;
const FAILURES_PER_TYPE = 15;
const PAGE_VIEW_COUNT = 300;

const WORDLE_ERRORS = [
  "Wordle target has no phonemes",
  "HTML export failed",
] as const;

const SEARCH_ERRORS = [
  "Word list is empty",
  "Word could not be placed in 10x10 grid",
  "HTML export failed",
] as const;

const ROUTES = ["/", "/wordle", "/word-search", "/word", "/about", "/settings"] as const;

const ROUTE_ACTIVITY: Partial<Record<(typeof ROUTES)[number], ActivityType>> = {
  "/wordle": ActivityType.WORDLE,
  "/word-search": ActivityType.WORD_SEARCH,
};

const WORDS: { englishWord: string; phonemes: string[] }[] = [
  { englishWord: "pin", phonemes: ["p", "ɪ", "n"] },
  { englishWord: "tin", phonemes: ["t", "ɪ", "n"] },
  { englishWord: "dog", phonemes: ["d", "ɔ", "g"] },
  { englishWord: "cat", phonemes: ["k", "æ", "t"] },
  { englishWord: "moon", phonemes: ["m", "ʉː", "n"] },
  { englishWord: "ring", phonemes: ["ɹ", "ɪ", "ŋ"] },
  { englishWord: "ship", phonemes: ["ʃ", "ɪ", "p"] },
  { englishWord: "fish", phonemes: ["f", "ɪ", "ʃ"] },
  { englishWord: "sun", phonemes: ["s", "ɐ", "n"] },
  { englishWord: "thin", phonemes: ["θ", "ɪ", "n"] },
  { englishWord: "this", phonemes: ["ð", "ɪ", "s"] },
  { englishWord: "van", phonemes: ["v", "æ", "n"] },
  { englishWord: "zip", phonemes: ["z", "ɪ", "p"] },
  { englishWord: "see", phonemes: ["s", "iː"] },
  { englishWord: "boot", phonemes: ["b", "ʉː", "t"] },
  { englishWord: "bird", phonemes: ["b", "ɜː", "d"] },
  { englishWord: "book", phonemes: ["b", "ʊ", "k"] },
  { englishWord: "chin", phonemes: ["tʃ", "ɪ", "n"] },
  { englishWord: "jam", phonemes: ["dʒ", "æ", "m"] },
  { englishWord: "yes", phonemes: ["j", "e", "s"] },
  { englishWord: "hat", phonemes: ["h", "æ", "t"] },
  { englishWord: "win", phonemes: ["w", "ɪ", "n"] },
  { englishWord: "bike", phonemes: ["b", "ɑe", "k"] },
  { englishWord: "boat", phonemes: ["b", "əʉ", "t"] },
  { englishWord: "cloud", phonemes: ["k", "l", "æɔ", "d"] },
  { englishWord: "beard", phonemes: ["b", "ɪə", "d"] },
  { englishWord: "about", phonemes: ["ə", "b", "æɔ", "t"] },
  { englishWord: "log", phonemes: ["l", "ɔ", "g"] },
];

const LISTS: { name: string; words: string[] }[] = [
  { name: "Stops and nasals", words: ["pin", "tin", "dog", "cat", "moon", "ring"] },
  { name: "Fricatives", words: ["ship", "fish", "sun", "thin", "this", "van", "zip"] },
  { name: "Long vowels", words: ["see", "boot", "bird", "book"] },
  { name: "Affricates and glides", words: ["chin", "jam", "yes", "hat", "win"] },
  { name: "Diphthongs", words: ["bike", "boat", "cloud", "beard"] },
  { name: "Classroom set", words: ["pin", "ship", "moon", "chin", "bike", "about", "log"] },
];

const WORDLE_ACTIVITIES: {
  name: string;
  word: string;
  maxGuesses: number;
  showEnglishWord: boolean;
}[] = [
  { name: "Pin practice", word: "pin", maxGuesses: 6, showEnglishWord: true },
  { name: "Tin practice", word: "tin", maxGuesses: 6, showEnglishWord: false },
  { name: "Ship practice", word: "ship", maxGuesses: 5, showEnglishWord: true },
  { name: "Moon practice", word: "moon", maxGuesses: 6, showEnglishWord: true },
  { name: "Chin practice", word: "chin", maxGuesses: 4, showEnglishWord: false },
  { name: "Bike practice", word: "bike", maxGuesses: 6, showEnglishWord: true },
  { name: "Boat practice", word: "boat", maxGuesses: 8, showEnglishWord: false },
  { name: "Bird practice", word: "bird", maxGuesses: 6, showEnglishWord: true },
  { name: "Cloud practice", word: "cloud", maxGuesses: 5, showEnglishWord: true },
  { name: "Ring practice", word: "ring", maxGuesses: 6, showEnglishWord: false },
  { name: "See practice", word: "see", maxGuesses: 4, showEnglishWord: true },
  { name: "About practice", word: "about", maxGuesses: 8, showEnglishWord: false },
];

const SEARCH_ACTIVITIES: {
  name: string;
  list: string;
  gridWidth: number;
  gridHeight: number;
}[] = [
  { name: "Stops 10x10", list: "Stops and nasals", gridWidth: 10, gridHeight: 10 },
  { name: "Stops 15x15", list: "Stops and nasals", gridWidth: 15, gridHeight: 15 },
  { name: "Fricatives 10x10", list: "Fricatives", gridWidth: 10, gridHeight: 10 },
  { name: "Fricatives 12x12", list: "Fricatives", gridWidth: 12, gridHeight: 12 },
  { name: "Long vowels 10x10", list: "Long vowels", gridWidth: 10, gridHeight: 10 },
  { name: "Long vowels 15x15", list: "Long vowels", gridWidth: 15, gridHeight: 15 },
  { name: "Affricates 12x12", list: "Affricates and glides", gridWidth: 12, gridHeight: 12 },
  { name: "Diphthongs 10x10", list: "Diphthongs", gridWidth: 10, gridHeight: 10 },
  { name: "Classroom 15x15", list: "Classroom set", gridWidth: 15, gridHeight: 15 },
  { name: "Classroom 12x14", list: "Classroom set", gridWidth: 12, gridHeight: 14 },
];

type SummaryBucket = {
  date: Date;
  activityType: ActivityType;
  successCount: number;
  failedCount: number;
  viewSeconds: number;
  viewCount: number;
};

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function timestampOnDay(today: Date, daysAgo: number, rng: () => number) {
  const stamp = new Date(today);
  stamp.setUTCDate(stamp.getUTCDate() - daysAgo);
  stamp.setUTCHours(Math.floor(rng() * 24), Math.floor(rng() * 60), Math.floor(rng() * 60), 0);
  return stamp;
}

function bucketKey(date: Date, activityType: ActivityType) {
  return `${date.toISOString().slice(0, 10)}|${activityType}`;
}

function requireId(ids: Map<string, number>, key: string) {
  const id = ids.get(key);
  if (id === undefined) throw new Error(`Missing seed record ${key}`);
  return id;
}

async function upsertWords() {
  const ids = new Map<string, number>();
  for (const word of WORDS) {
    const existing = await prisma.phonemeWord.findFirst({
      where: { englishWord: word.englishWord },
    });
    const saved = existing
      ? await prisma.phonemeWord.update({
          where: { id: existing.id },
          data: { phonemes: word.phonemes },
        })
      : await prisma.phonemeWord.create({
          data: { englishWord: word.englishWord, phonemes: word.phonemes },
        });
    ids.set(saved.englishWord, saved.id);
  }
  return ids;
}

async function upsertLists(wordIds: Map<string, number>) {
  const ids = new Map<string, number>();
  for (const list of LISTS) {
    const words = list.words.map((englishWord) => ({ id: requireId(wordIds, englishWord) }));
    const existing = await prisma.phonemeWordList.findFirst({ where: { name: list.name } });
    const saved = existing
      ? await prisma.phonemeWordList.update({
          where: { id: existing.id },
          data: { words: { set: words } },
        })
      : await prisma.phonemeWordList.create({
          data: { name: list.name, words: { connect: words } },
        });
    ids.set(saved.name, saved.id);
  }
  return ids;
}

async function upsertActivities(wordIds: Map<string, number>, listIds: Map<string, number>) {
  for (const activity of WORDLE_ACTIVITIES) {
    const data = {
      wordId: requireId(wordIds, activity.word),
      maxGuesses: activity.maxGuesses,
      showEnglishWord: activity.showEnglishWord,
    };
    const existing = await prisma.wordleActivity.findFirst({ where: { name: activity.name } });
    if (existing) {
      await prisma.wordleActivity.update({ where: { id: existing.id }, data });
    } else {
      await prisma.wordleActivity.create({ data: { name: activity.name, ...data } });
    }
  }

  for (const activity of SEARCH_ACTIVITIES) {
    const data = {
      wordListId: requireId(listIds, activity.list),
      gridWidth: activity.gridWidth,
      gridHeight: activity.gridHeight,
    };
    const existing = await prisma.wordSearchActivity.findFirst({ where: { name: activity.name } });
    if (existing) {
      await prisma.wordSearchActivity.update({ where: { id: existing.id }, data });
    } else {
      await prisma.wordSearchActivity.create({ data: { name: activity.name, ...data } });
    }
  }
}

function buildAnalytics(
  today: Date,
  wordIds: number[],
  listIds: number[],
) {
  const rng = mulberry32(20261002);
  const summaries = new Map<string, SummaryBucket>();

  const ensureBucket = (createdAt: Date, activityType: ActivityType) => {
    const date = startOfUtcDay(createdAt);
    const key = bucketKey(date, activityType);
    const current = summaries.get(key);
    if (current) return current;
    const created: SummaryBucket = {
      date,
      activityType,
      successCount: 0,
      failedCount: 0,
      viewSeconds: 0,
      viewCount: 0,
    };
    summaries.set(key, created);
    return created;
  };

  const logs = [];
  const plans = [
    { activityType: ActivityType.WORDLE, count: WORDLE_LOGS, errors: WORDLE_ERRORS },
    { activityType: ActivityType.WORD_SEARCH, count: SEARCH_LOGS, errors: SEARCH_ERRORS },
  ];

  for (const plan of plans) {
    for (let index = 0; index < plan.count; index++) {
      const failed = index < FAILURES_PER_TYPE;
      const createdAt = timestampOnDay(today, Math.floor(rng() * DAY_COUNT), rng);
      const bucket = ensureBucket(createdAt, plan.activityType);
      if (failed) bucket.failedCount += 1;
      else bucket.successCount += 1;

      logs.push({
        activityType: plan.activityType,
        status: failed ? GenerationStatus.FAILED : GenerationStatus.SUCCESS,
        errorMessage: failed ? plan.errors[index % plan.errors.length] : null,
        durationMs: 40 + Math.floor(rng() * 1960),
        wordId: plan.activityType === ActivityType.WORDLE
          ? wordIds[Math.floor(rng() * wordIds.length)]
          : null,
        wordListId: plan.activityType === ActivityType.WORD_SEARCH
          ? listIds[Math.floor(rng() * listIds.length)]
          : null,
        createdAt,
      });
    }
  }

  const pageViews = [];
  for (let index = 0; index < PAGE_VIEW_COUNT; index++) {
    const route = ROUTES[Math.floor(rng() * ROUTES.length)];
    const createdAt = timestampOnDay(today, Math.floor(rng() * DAY_COUNT), rng);
    const durationSeconds = 5 + Math.floor(rng() * 175);
    const activityType = ROUTE_ACTIVITY[route];
    if (activityType) {
      const bucket = ensureBucket(createdAt, activityType);
      bucket.viewSeconds += durationSeconds;
      bucket.viewCount += 1;
    }
    pageViews.push({ route, durationSeconds, createdAt });
  }

  const dailyMetrics = [...summaries.values()].map((bucket) => ({
    date: bucket.date,
    activityType: bucket.activityType,
    createdCount: bucket.successCount + bucket.failedCount,
    successCount: bucket.successCount,
    failedCount: bucket.failedCount,
    avgTimeOnPage: bucket.viewCount === 0 ? 0 : bucket.viewSeconds / bucket.viewCount,
  }));

  return { logs, pageViews, dailyMetrics };
}

async function main() {
  await prisma.generationLog.deleteMany();
  await prisma.pageView.deleteMany();
  await prisma.dailyMetricSummary.deleteMany();

  const wordIds = await upsertWords();
  const listIds = await upsertLists(wordIds);
  await upsertActivities(wordIds, listIds);

  const today = startOfUtcDay(new Date());
  const { logs, pageViews, dailyMetrics } = buildAnalytics(
    today,
    [...wordIds.values()],
    [...listIds.values()],
  );

  await prisma.generationLog.createMany({ data: logs });
  await prisma.pageView.createMany({ data: pageViews });
  await prisma.dailyMetricSummary.createMany({ data: dailyMetrics });

  const failed = logs.filter((log) => log.status === GenerationStatus.FAILED).length;
  console.log(
    `Seeded ${WORDS.length} words, ${LISTS.length} lists, ${WORDLE_ACTIVITIES.length + SEARCH_ACTIVITIES.length} activities, ${logs.length} generation logs (${failed} failed), ${pageViews.length} page views, ${dailyMetrics.length} daily summaries.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
