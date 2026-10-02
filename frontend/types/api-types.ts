export interface ApiErrorBody {
  error: string;
}

export interface SuccessBody {
  success: true;
}

export interface PhonemeWord {
  id: number;
  englishWord: string;
  phonemes: string[];
}

export interface PhonemeWordList {
  id: number;
  name: string;
  words: PhonemeWord[];
}

export interface WordleActivity {
  id: number;
  name: string;
  wordId: number;
  maxGuesses: number;
  showEnglishWord: boolean | null;
  createdAt: string;
  word: PhonemeWord;
}

export interface WordSearchActivity {
  id: number;
  name: string;
  wordListId: number;
  gridWidth: number;
  gridHeight: number;
  createdAt: string;
  wordList: PhonemeWordList;
}

export interface GlobalSettings {
  id: number;
  theme: string;
  layout: string;
}

export interface HealthStatus {
  status: "ok" | "error";
  db: "connected" | "unreachable";
}

export interface CreatePhonemeWordInput {
  englishWord: string;
  phonemes: string[];
}

export interface UpdatePhonemeWordInput {
  englishWord?: string;
  phonemes?: string[];
}

export interface CreatePhonemeWordListInput {
  name: string;
  wordIds?: number[];
}

export interface UpdatePhonemeWordListInput {
  name?: string;
  wordIds?: number[];
}

export interface CreateWordleActivityInput {
  name: string;
  wordId: number;
  maxGuesses?: number;
  showEnglishWord?: boolean;
}

export interface UpdateWordleActivityInput {
  name?: string;
  wordId?: number;
  maxGuesses?: number;
  showEnglishWord?: boolean;
}

export interface CreateWordSearchActivityInput {
  name: string;
  wordListId: number;
  gridWidth?: number;
  gridHeight?: number;
}

export interface UpdateWordSearchActivityInput {
  name?: string;
  wordListId?: number;
  gridWidth?: number;
  gridHeight?: number;
}

export interface UpdateGlobalSettingsInput {
  theme?: string;
  layout?: string;
}

export type ActivityTypeName = "WORDLE" | "WORD_SEARCH";
export type GenerationStatusName = "SUCCESS" | "FAILED";
export type ActivityActionName = "CREATED" | "UPDATED" | "DELETED";

export interface ActivityCounts {
  wordle: number;
  wordSearch: number;
}

export interface GenerationStats {
  total: number;
  success: number;
  failed: number;
  successRate: number;
}

export interface WordListMetric {
  id: number;
  name: string;
  wordCount: number;
  activityCount: number;
}

export interface PhonemeFrequency {
  phoneme: string;
  count: number;
}

export interface WordCountDistribution {
  wordCount: number;
  listCount: number;
}

export interface WordListStats {
  listCount: number;
  averageWordsPerList: number;
  mostCommonPhonemes: PhonemeFrequency[];
  distribution: WordCountDistribution[];
}

export interface GenerationsOverTimePoint {
  date: string;
  activityType: ActivityTypeName;
  createdCount: number;
  successCount: number;
  failedCount: number;
}

export interface MetricsSummary {
  activityCounts: ActivityCounts;
  generationStats: GenerationStats;
  averageTimeOnPage: number | null;
  mostUsedActivityType: ActivityTypeName | null;
  wordLists: WordListMetric[];
  wordListStats: WordListStats;
  generationsOverTime: GenerationsOverTimePoint[];
}

export interface GenerationLog {
  id: number;
  activityType: ActivityTypeName;
  status: GenerationStatusName;
  errorMessage: string | null;
  durationMs: number;
  wordId: number | null;
  wordListId: number | null;
  createdAt: string;
}

export interface GenerationList {
  items: GenerationLog[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GenerationQuery {
  activityType?: ActivityTypeName;
  status?: GenerationStatusName;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface GenerationAlert {
  activityType: ActivityTypeName;
  errorMessage: string | null;
  count: number;
}

export interface CreateGenerationInput {
  activityType: ActivityTypeName;
  status: GenerationStatusName;
  errorMessage?: string | null;
  durationMs: number;
  wordId?: number | null;
  wordListId?: number | null;
}

export interface PageView {
  id: number;
  route: string;
  durationSeconds: number;
  createdAt: string;
}

export interface CreatePageViewInput {
  route: string;
  durationSeconds: number;
}

export interface ActivityEvent {
  id: number;
  activityType: ActivityTypeName;
  action: ActivityActionName;
  createdAt: string;
}

export interface CreateActivityEventInput {
  activityType: ActivityTypeName;
  action: ActivityActionName;
}