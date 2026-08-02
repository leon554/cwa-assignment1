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
