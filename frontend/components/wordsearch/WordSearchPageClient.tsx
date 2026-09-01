"use client";

import BuilderLayout from "@/components/shared/BuilderLayout";
import WordSearchBuilder from "@/components/wordsearch/WordSearchBuilder";
import WordSearchPreview from "@/components/wordsearch/WordSearchPreview";
import { defaultWordSearchText } from "@/lib/phoneme-words";
import { generateWordSearch } from "@/lib/wordsearch/generator";
import type { WordSearchPuzzle } from "@/lib/wordsearch/types";
import { useMemo, useState } from "react";

function createInitialPuzzle(): WordSearchPuzzle {
  const lines = defaultWordSearchText()
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  return generateWordSearch(lines, 10, 10);
}

export default function WordSearchPageClient() {
  const initialPuzzle = useMemo(() => createInitialPuzzle(), []);
  const [puzzle, setPuzzle] = useState<WordSearchPuzzle>(initialPuzzle);
  const [showAnswers, setShowAnswers] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);

  function handlePuzzleChange(next: WordSearchPuzzle) {
    setPuzzle(next);
    setPuzzleKey((k) => k + 1);
  }

  return (
    <BuilderLayout
      title="Phoneme Word Search Builder"
      section1={
        <WordSearchBuilder
          onPuzzleChange={handlePuzzleChange}
          onShowAnswersChange={setShowAnswers}
        />
      }
      section2={
        <WordSearchPreview
          key={puzzleKey}
          puzzle={puzzle}
          showAnswers={showAnswers}
        />
      }
    />
  );
}
