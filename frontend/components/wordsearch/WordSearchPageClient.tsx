"use client";

import BuilderLayout from "@/components/shared/BuilderLayout";
import WordSearchActivityManager from "@/components/wordsearch/WordSearchActivityManager";
import WordSearchBuilder from "@/components/wordsearch/WordSearchBuilder";
import WordSearchPreview from "@/components/wordsearch/WordSearchPreview";
import { activityToPuzzle } from "@/lib/wordsearch/generator";
import type { WordSearchPuzzle } from "@/lib/wordsearch/types";
import { useWords } from "@/providers/WordsContext";
import type { WordSearchActivity } from "@/types/api-types";
import { useState } from "react";

export default function WordSearchPageClient() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [puzzle, setPuzzle] = useState<WordSearchPuzzle | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const WC = useWords();

  // Read the activity back out of the context so edits and deletes flow into the preview.
  const selectedActivity =
    WC.wordSearchActivities.find((a) => a.id === selectedId) ?? null;

  function handlePuzzleChange(next: WordSearchPuzzle) {
    setPuzzle(next);
    setPuzzleKey((k) => k + 1);
  }

  function handleSelect(activity: WordSearchActivity) {
    setSelectedId(activity.id);
    if (activity.wordList.words.length === 0) {
      setPuzzle(null);
      return;
    }
    handlePuzzleChange(activityToPuzzle(activity));
  }

  return (
    <BuilderLayout
      title="Phoneme Word Search Builder"
      section1={
        <div className="flex flex-col gap-5">
          <WordSearchActivityManager
            onSelect={handleSelect}
            selectedId={selectedActivity?.id}
          />
          <hr className="text-muted" />
          <WordSearchBuilder
            activity={selectedActivity}
            onPuzzleChange={handlePuzzleChange}
            showAnswers={showAnswers}
            onShowAnswersChange={setShowAnswers}
          />
        </div>
      }
      section2={
        puzzle && selectedActivity ? (
          <WordSearchPreview
            key={puzzleKey}
            puzzle={puzzle}
            showAnswers={showAnswers}
          />
        ) : (
          <p className="text-sm text-muted">
            Load a saved activity to preview its puzzle.
          </p>
        )
      }
    />
  );
}
