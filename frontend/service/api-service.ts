import { cache } from "react";
import { 
  ApiErrorBody,
  HealthStatus, 
  PhonemeWord, 
  CreatePhonemeWordInput,
  CreatePhonemeWordListInput,
  CreateWordSearchActivityInput,
  CreateWordleActivityInput,
  UpdatePhonemeWordInput,
  UpdateGlobalSettingsInput,
  UpdateWordleActivityInput,
  UpdatePhonemeWordListInput,
  UpdateWordSearchActivityInput,
  PhonemeWordList,
  SuccessBody,
  WordleActivity,
  WordSearchActivity,
  GlobalSettings,
  MetricsSummary,
  GenerationList,
  GenerationQuery,
  GenerationAlert,
  SystemAlert,
  GenerationLog,
  CreateGenerationInput,
  PageView,
  CreatePageViewInput,
  ActivityEvent,
  CreateActivityEventInput,

} from "@/types/api-types";

const API_ROOT =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL ?? "http://api:3000"
    : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:80";

const API_BASE = `${API_ROOT}/api`;
const HEALTH_URL = `${API_ROOT}/health`;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body: ApiErrorBody = await res.json();
      if (body?.error) message = body.error;
    } catch {}
    throw new ApiError(message, res.status);
  }
  return res.json() as Promise<T>;
}


export async function getHealth(): Promise<HealthStatus> {
  const res = await fetch(HEALTH_URL, { cache: "no-store" });
  return handleResponse<HealthStatus>(res);
}


export async function getPhonemeWords(): Promise<PhonemeWord[]> {
  const res = await fetch(`${API_BASE}/phoneme-words`, { cache: "no-store" });
  return handleResponse<PhonemeWord[]>(res);
}

export async function getPhonemeWord(id: number): Promise<PhonemeWord> {
  const res = await fetch(`${API_BASE}/phoneme-words/${id}`, { cache: "no-store" });
  return handleResponse<PhonemeWord>(res);
}

export async function createPhonemeWord(
  input: CreatePhonemeWordInput
): Promise<PhonemeWord> {
  const res = await fetch(`${API_BASE}/phoneme-words`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<PhonemeWord>(res);
}

export async function updatePhonemeWord(
  id: number,
  input: UpdatePhonemeWordInput
): Promise<PhonemeWord> {
  const res = await fetch(`${API_BASE}/phoneme-words/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<PhonemeWord>(res);
}

export async function deletePhonemeWord(id: number): Promise<SuccessBody> {
  const res = await fetch(`${API_BASE}/phoneme-words/${id}`, { method: "DELETE" });
  return handleResponse<SuccessBody>(res);
}


export async function getPhonemeWordLists(): Promise<PhonemeWordList[]> {
  const res = await fetch(`${API_BASE}/phoneme-word-lists`, { cache: "no-store" });
  return handleResponse<PhonemeWordList[]>(res);
}

export async function getPhonemeWordList(id: number): Promise<PhonemeWordList> {
  const res = await fetch(`${API_BASE}/phoneme-word-lists/${id}`, { cache: "no-store" });
  return handleResponse<PhonemeWordList>(res);
}

export async function createPhonemeWordList(
  input: CreatePhonemeWordListInput
): Promise<PhonemeWordList> {
  const res = await fetch(`${API_BASE}/phoneme-word-lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<PhonemeWordList>(res);
}

export async function updatePhonemeWordList(
  id: number,
  input: UpdatePhonemeWordListInput
): Promise<PhonemeWordList> {
  const res = await fetch(`${API_BASE}/phoneme-word-lists/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<PhonemeWordList>(res);
}

export async function deletePhonemeWordList(id: number): Promise<SuccessBody> {
  const res = await fetch(`${API_BASE}/phoneme-word-lists/${id}`, { method: "DELETE" });
  return handleResponse<SuccessBody>(res);
}

export async function getWordleActivities(): Promise<WordleActivity[]> {
  const res = await fetch(`${API_BASE}/wordle-activities`, { cache: "no-store" });
  return handleResponse<WordleActivity[]>(res);
}

export async function getWordleActivity(id: number): Promise<WordleActivity> {
  const res = await fetch(`${API_BASE}/wordle-activities/${id}`, { cache: "no-store" });
  return handleResponse<WordleActivity>(res);
}

export async function createWordleActivity(
  input: CreateWordleActivityInput
): Promise<WordleActivity> {
  const res = await fetch(`${API_BASE}/wordle-activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<WordleActivity>(res);
}

export async function updateWordleActivity(
  id: number,
  input: UpdateWordleActivityInput
): Promise<WordleActivity> {
  const res = await fetch(`${API_BASE}/wordle-activities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<WordleActivity>(res);
}

export async function deleteWordleActivity(id: number): Promise<SuccessBody> {
  const res = await fetch(`${API_BASE}/wordle-activities/${id}`, { method: "DELETE" });
  return handleResponse<SuccessBody>(res);
}

export async function getWordSearchActivities(): Promise<WordSearchActivity[]> {
  const res = await fetch(`${API_BASE}/word-search-activities`, { cache: "no-store" });
  return handleResponse<WordSearchActivity[]>(res);
}

export async function getWordSearchActivity(id: number): Promise<WordSearchActivity> {
  const res = await fetch(`${API_BASE}/word-search-activities/${id}`, { cache: "no-store" });
  return handleResponse<WordSearchActivity>(res);
}

export async function createWordSearchActivity(
  input: CreateWordSearchActivityInput
): Promise<WordSearchActivity> {
  const res = await fetch(`${API_BASE}/word-search-activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<WordSearchActivity>(res);
}

export async function updateWordSearchActivity(
  id: number,
  input: UpdateWordSearchActivityInput
): Promise<WordSearchActivity> {
  const res = await fetch(`${API_BASE}/word-search-activities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<WordSearchActivity>(res);
}

export async function deleteWordSearchActivity(id: number): Promise<SuccessBody> {
  const res = await fetch(`${API_BASE}/word-search-activities/${id}`, { method: "DELETE" });
  return handleResponse<SuccessBody>(res);
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  const res = await fetch(`${API_BASE}/settings`, { cache: "no-store" });
  return handleResponse<GlobalSettings>(res);
}

export async function updateGlobalSettings(
  input: UpdateGlobalSettingsInput
): Promise<GlobalSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<GlobalSettings>(res);
}

function metricsQuery(query?: GenerationQuery) {
  const params = new URLSearchParams();
  if (!query) return params;
  if (query.activityType) params.set("activityType", query.activityType);
  if (query.status) params.set("status", query.status);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.pageSize !== undefined) params.set("pageSize", String(query.pageSize));
  return params;
}

function metricsUrl(path: string, query?: GenerationQuery) {
  const params = metricsQuery(query);
  const search = params.toString();
  return `${API_BASE}/metrics/${path}${search ? `?${search}` : ""}`;
}

export const getMetricsSummary = cache(async (): Promise<MetricsSummary> => {
  const res = await fetch(`${API_BASE}/metrics/summary`, { cache: "no-store" });
  return handleResponse<MetricsSummary>(res);
});

export async function getGenerations(query?: GenerationQuery): Promise<GenerationList> {
  const res = await fetch(metricsUrl("generations", query), { cache: "no-store" });
  return handleResponse<GenerationList>(res);
}

export async function getGenerationAlerts(): Promise<GenerationAlert[]> {
  const res = await fetch(`${API_BASE}/metrics/alerts`, { cache: "no-store" });
  return handleResponse<GenerationAlert[]>(res);
}

export async function getSystemAlerts(): Promise<SystemAlert[]> {
  const res = await fetch(`${API_BASE}/metrics/system-alerts`, { cache: "no-store" });
  return handleResponse<SystemAlert[]>(res);
}

export async function exportGenerationsCsv(query?: GenerationQuery): Promise<string> {
  const res = await fetch(metricsUrl("generations/export", query), { cache: "no-store" });
  if (!res.ok) return handleResponse<string>(res);
  return res.text();
}

export async function createGeneration(input: CreateGenerationInput): Promise<GenerationLog> {
  const res = await fetch(`${API_BASE}/metrics/generation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<GenerationLog>(res);
}

export async function createPageView(input: CreatePageViewInput): Promise<PageView> {
  const res = await fetch(`${API_BASE}/metrics/page-view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<PageView>(res);
}

export async function createActivityEvent(
  input: CreateActivityEventInput
): Promise<ActivityEvent> {
  const res = await fetch(`${API_BASE}/metrics/activity-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<ActivityEvent>(res);
}
