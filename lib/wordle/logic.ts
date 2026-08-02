import type { TileState } from "./types";

export function evaluateGuess(guess: string[], target: string[]): TileState[] {
  const result: TileState[] = Array(guess.length).fill("absent");
  const targetCounts = new Map<string, number>();

  for (const phoneme of target) {
    targetCounts.set(phoneme, (targetCounts.get(phoneme) ?? 0) + 1);
  }

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      targetCounts.set(guess[i], (targetCounts.get(guess[i]) ?? 1) - 1);
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;
    const count = targetCounts.get(guess[i]) ?? 0;
    if (count > 0) {
      result[i] = "present";
      targetCounts.set(guess[i], count - 1);
    }
  }

  return result;
}

export function isWinningGuess(guess: string[], target: string[]): boolean {
  return (
    guess.length === target.length &&
    guess.every((phoneme, i) => phoneme === target[i])
  );
}

export function getKeyboardStates(
  guesses: { phonemes: string[]; states: TileState[] }[],
): Record<string, "correct" | "present" | "absent"> {
  const states: Record<string, "correct" | "present" | "absent"> = {};
  const priority = { correct: 3, present: 2, absent: 1 };

  for (const guess of guesses) {
    for (let i = 0; i < guess.phonemes.length; i++) {
      const phoneme = guess.phonemes[i];
      const state = guess.states[i];
      if (state === "empty" || state === "filled") continue;
      const current = states[phoneme];
      if (!current || priority[state] > priority[current]) {
        states[phoneme] = state;
      }
    }
  }

  return states;
}
