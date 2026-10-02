"use client";

import { useState } from "react";
import AlertBanner from "@/components/shared/AlertBanner";
import GenerateButton from "@/components/shared/GenerateButton";
import { downloadHtmlFile, slugify } from "@/lib/html-export/download";
import { generateWordSearchHtml } from "@/lib/html-export/wordsearch-template";
import { trackGeneration } from "@/lib/metrics/track-generation";
import { activityToPuzzle } from "@/lib/wordsearch/generator";
import type { WordSearchPuzzle } from "@/lib/wordsearch/types";
import type { WordSearchActivity } from "@/types/api-types";

type WordSearchBuilderProps = {
  activity: WordSearchActivity | null;
  onPuzzleChange: (puzzle: WordSearchPuzzle) => void;
  showAnswers: boolean;
  onShowAnswersChange: (show: boolean) => void;
};

function generationError(result: unknown) {
  if (
    result !== null &&
    typeof result === "object" &&
    "errorMessage" in result &&
    typeof result.errorMessage === "string" &&
    result.errorMessage.length > 0
  ) {
    return result.errorMessage;
  }
  return null;
}

export default function WordSearchBuilder({
  activity,
  onPuzzleChange,
  showAnswers,
  onShowAnswersChange,
}: WordSearchBuilderProps) {
  const [error, setError] = useState<string | null>(null);
  const words = activity?.wordList.words ?? [];

  function wordSearchError(puzzle: WordSearchPuzzle) {
    if (!activity) return;
    if (activity.wordList.words.length === 0) {
      return { errorMessage: "Word list is empty" };
    }
    if (puzzle.solutions.length < puzzle.words.length) {
      return {
        errorMessage: `Word could not be placed in ${activity.gridWidth}x${activity.gridHeight} grid`,
      };
    }
  }

  function runTracked(run: () => { errorMessage: string } | undefined) {
    if (!activity) return;
    setError(null);
    try {
      const result = trackGeneration({
        activityType: "WORD_SEARCH",
        wordListId: activity.wordListId,
        run,
      });
      const message = generationError(result);
      if (message) setError(message);
    } catch {
      setError("HTML export failed");
    }
  }

  function handleRegenerate() {
    if (!activity) return;
    runTracked(() => {
      const puzzle = activityToPuzzle(activity);
      onPuzzleChange(puzzle);
      return wordSearchError(puzzle);
    });
  }

  function handleGenerate() {
    if (!activity) return;
    runTracked(() => {
      const puzzle = activityToPuzzle(activity);
      const html = generateWordSearchHtml(puzzle);
      downloadHtmlFile(html, `${slugify(activity.name, "phoneme-word-search")}.html`);
      return wordSearchError(puzzle);
    });
  }

  if (!activity) {
    return (
      <div>
        <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
          Selected Activity
        </h3>
        <p className="text-sm text-muted">
          Save an activity above, then load it to preview and generate the HTML output.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold tracking-wide text-muted">
        Selected Activity
      </h3>

      <p className="text-lg font-semibold">{activity.name}</p>

      {words.length === 0 && (
        <AlertBanner variant="warning">
          This word list is empty, so no puzzle can be built.
        </AlertBanner>
      )}
      {words
        .filter((word) => word.phonemes.length === 0)
        .map((word) => (
          <AlertBanner key={`empty-${word.id}`} variant="warning">
            Word &quot;{word.englishWord}&quot; has no phonemes.
          </AlertBanner>
        ))}
      {words
        .filter(
          (word) =>
            word.phonemes.length > Math.max(activity.gridWidth, activity.gridHeight),
        )
        .map((word) => (
          <AlertBanner key={`long-${word.id}`} variant="warning">
            Word &quot;{word.englishWord}&quot; has {word.phonemes.length} phonemes, which is
            longer than the larger grid side of{" "}
            {Math.max(activity.gridWidth, activity.gridHeight)}.
          </AlertBanner>
        ))}
      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      <div>
        <p className="mb-1 block text-sm font-medium">
          Words in {activity.wordList.name}
        </p>
        <div className="max-h-48 overflow-y-auto rounded-md border border-card-border bg-background p-2 font-mono text-sm">
          {words.map((w) => (
            <p key={w.id}>
              {w.phonemes.join(" ")}
              <span className="ml-2 font-sans text-muted">{w.englishWord}</span>
            </p>
          ))}
        </div>
      </div>

      <dl className="space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Grid size</dt>
          <dd className="font-medium">
            {activity.gridWidth} x {activity.gridHeight}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={handleRegenerate}
        disabled={words.length === 0}
        className="w-full rounded-md border border-card-border bg-background px-4 py-2 text-sm font-semibold hover:bg-card disabled:cursor-not-allowed disabled:opacity-50"
      >
        Regenerate puzzle
      </button>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showAnswers}
          onChange={(e) => onShowAnswersChange(e.target.checked)}
          className="rounded"
        />
        Show answers (preview only)
      </label>

      <GenerateButton
        onGenerate={handleGenerate}
        label="Generate Word Search HTML"
        disabled={words.length === 0}
      />
    </div>
  );
}
