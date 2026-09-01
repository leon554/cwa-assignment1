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
  GlobalSettings

} from "@/types/api-types";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const HEALTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/health`;

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
