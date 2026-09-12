export type RequestBody = Record<string, unknown>;

export interface PhonemeWordBody {
  englishWord: string;
  phonemes: string[];
}

export interface WordListBody {
  name: string;
  wordIds?: number[];
}

export interface WordleActivityBody {
  name: string;
  wordId: number;
  maxGuesses?: number;
  showEnglishWord?: boolean;
}

export interface WordSearchActivityBody {
  name: string;
  wordListId: number;
  gridWidth?: number;
  gridHeight?: number;
}

export interface GlobalSettingsBody {
  theme?: string;
  layout?: string;
}
