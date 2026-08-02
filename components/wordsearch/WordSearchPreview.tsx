"use client";

import type { WordSearchPuzzle } from "@/lib/wordsearch/types";
import WordSearchGrid from "./WordSearchGrid";

type WordSearchPreviewProps = {
  puzzle: WordSearchPuzzle;
  showAnswers: boolean;
};

export default function WordSearchPreview({puzzle, showAnswers}: WordSearchPreviewProps) {
  return (
    <WordSearchGrid
      key={`${puzzle.rows}-${puzzle.cols}-${puzzle.words.map((w) => w.display).join("-")}`}
      puzzle={puzzle}
      showAnswers={showAnswers}
    />
  );
}
