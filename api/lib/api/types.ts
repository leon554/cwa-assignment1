// An incoming JSON body before validation: keys are known to exist as a record,
// but no field can be trusted until a validator has checked it.
export type RequestBody = Record<string, unknown>;

// Shapes a body is known to have once the matching validator has passed, so
// handlers can read fields without re-checking each one.
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
