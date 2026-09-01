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
  wordId: number;
  maxGuesses: number;
  showEnglishWord: boolean | null;
  createdAt: string;
  word: PhonemeWord;
}

export interface WordSearchActivity {
  id: number;
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
  wordId: number;
  maxGuesses?: number;
  showEnglishWord?: boolean;
}

export interface UpdateWordleActivityInput {
  wordId?: number;
  maxGuesses?: number;
  showEnglishWord?: boolean;
}

export interface CreateWordSearchActivityInput {
  wordListId: number;
  gridWidth?: number;
  gridHeight?: number;
}

export interface UpdateWordSearchActivityInput {
  wordListId?: number;
  gridWidth?: number;
  gridHeight?: number;
}

export interface UpdateGlobalSettingsInput {
  theme?: string;
  layout?: string;
}