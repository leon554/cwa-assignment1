import type { TileState } from "@/lib/wordle/types";
import WordleRow from "./WordleRow";

type WordleGridProps = {
  guesses: { phonemes: string[]; states: TileState[] }[];
  currentGuess: string[];
  maxGuesses: number;
  wordLength: number;
};

export default function WordleGrid({guesses, currentGuess, maxGuesses, wordLength,}: WordleGridProps) {
  const showCurrentRow =
    guesses.length < maxGuesses &&
    !guesses.some((g) => g.states.every((s) => s === "correct"));

  const emptyRows = maxGuesses - guesses.length - (showCurrentRow ? 1 : 0);

  const currentStates: TileState[] = Array(wordLength).fill("empty");
  for (let i = 0; i < currentGuess.length; i++) {
    currentStates[i] = "filled";
  }

  return (
    <div className="flex flex-col gap-1.5" role="grid" aria-label="Wordle guess grid">
      {guesses.map((guess, i) => (
        <WordleRow
          key={i}
          phonemes={guess.phonemes}
          states={guess.states}
          wordLength={wordLength}
          animate
        />
      ))}
      {showCurrentRow && (
        <WordleRow
          phonemes={currentGuess}
          states={currentStates}
          wordLength={wordLength}
        />
      )}
      {Array.from({ length: Math.max(0, emptyRows) }).map((_, i) => (
        <WordleRow
          key={`empty-${i}`}
          phonemes={[]}
          states={Array(wordLength).fill("empty")}
          wordLength={wordLength}
        />
      ))}
    </div>
  );
}
