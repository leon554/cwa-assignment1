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