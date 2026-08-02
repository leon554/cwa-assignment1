"use client";

import PhonemeKeyboard from "@/components/phoneme/PhonemeKeyboard";
import {evaluateGuess, getKeyboardStates, isWinningGuess} from "@/lib/wordle/logic";
import type { WordleConfig, WordleGameStatus } from "@/lib/wordle/types";
import { useCallback, useState } from "react";
import WordleGrid from "./WordleGrid";

type WordlePreviewProps = {
  config: WordleConfig;
};

export default function WordlePreview({ config }: WordlePreviewProps) {
  const { targetPhonemes, englishWord, maxGuesses, showEnglishOnWin } = config;
  const wordLength = targetPhonemes.length;

  const [guesses, setGuesses] = useState<
    { phonemes: string[]; states: ReturnType<typeof evaluateGuess> }[]
  >([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [status, setStatus] = useState<WordleGameStatus>("playing");
  const [message, setMessage] = useState("");

  const submitGuess = useCallback(() => {
    if (status !== "playing") return;
    if (currentGuess.length !== wordLength) {
      setMessage(`Enter ${wordLength} phonemes before submitting.`);
      return;
    }
    setMessage("");
    const states = evaluateGuess(currentGuess, targetPhonemes);
    const newGuesses = [...guesses, { phonemes: [...currentGuess], states }];
    setGuesses(newGuesses);
    setCurrentGuess([]);

    if (isWinningGuess(currentGuess, targetPhonemes)) {
      setStatus("won");
    } else if (newGuesses.length >= maxGuesses) {
      setStatus("lost");
    }
  }, [currentGuess, guesses, maxGuesses, status, targetPhonemes, wordLength]);

  function handleKeyPress(symbol: string) {
    if (status !== "playing") return;
    if (currentGuess.length < wordLength) {
      setCurrentGuess((prev) => [...prev, symbol]);
      setMessage("");
    }
  }

  function handleBackspace() {
    if (status !== "playing") return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }

  function handleReset() {
    setGuesses([]);
    setCurrentGuess([]);
    setStatus("playing");
    setMessage("");
  }

  const keyStates = getKeyboardStates(guesses);

  return (
    <div className="flex flex-col items-center gap-6">
      {status === "won" && (
        <div
          role="status"
          className="w-full rounded-lg border border-(--tile-correct) bg-(--found) p-4 text-center"
        >
          <p className="font-semibold text-(--tile-correct)">Correct!</p>
          {showEnglishOnWin && (
            <p className="mt-1 text-sm">
              English word: <strong>{englishWord}</strong>
            </p>
          )}
        </div>
      )}
      {status === "lost" && (
        <div
          role="status"
          className="w-full rounded-lg border border-(--tile-absent) bg-card p-4 text-center"
        >
          <p className="font-semibold">Game over</p>
          <p className="mt-1 text-sm">
            Answer: <strong>{targetPhonemes.join(" ")}</strong> ({englishWord})
          </p>
        </div>
      )}

      <WordleGrid
        guesses={guesses}
        currentGuess={currentGuess}
        maxGuesses={maxGuesses}
        wordLength={wordLength}
      />

      {message && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {message}
        </p>
      )}

      <PhonemeKeyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onEnter={submitGuess}
        keyStates={keyStates}
        disabled={status !== "playing"}
      />

      {status !== "playing" && (
        <button
          type="button"
          onClick={handleReset}
          className="rounded-md border border-card-border px-4 py-2 text-sm font-medium hover:bg-background"
        >
          Play again
        </button>
      )}
    </div>
  );
}
