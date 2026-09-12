import type { WordleActivity } from "@/types/api-types";

export type TileState = "empty" | "filled" | "correct" | "present" | "absent";

export type WordleGameStatus = "playing" | "won" | "lost";

export type WordleConfig = {
  targetPhonemes: string[];
  englishWord: string;
  maxGuesses: number;
  showEnglishOnWin: boolean;
};

export type WordleGuess = {
  phonemes: string[];
  states: TileState[];
};

export function activityToWordleConfig(activity: WordleActivity): WordleConfig {
  return {
    targetPhonemes: activity.word.phonemes,
    englishWord: activity.word.englishWord,
    maxGuesses: activity.maxGuesses,
    showEnglishOnWin: activity.showEnglishWord ?? false,
  };
}
