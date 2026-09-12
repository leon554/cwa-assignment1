"use client";

import GenerateButton from "@/components/shared/GenerateButton";
import { downloadHtmlFile, slugify } from "@/lib/html-export/download";
import { generateWordSearchHtml } from "@/lib/html-export/wordsearch-template";
import { activityToPuzzle } from "@/lib/wordsearch/generator";
import type { WordSearchPuzzle } from "@/lib/wordsearch/types";
import type { WordSearchActivity } from "@/types/api-types";

type WordSearchBuilderProps = {
  activity: WordSearchActivity | null;
  onPuzzleChange: (puzzle: WordSearchPuzzle) => void;
  showAnswers: boolean;
  onShowAnswersChange: (show: boolean) => void;
};

export default function WordSearchBuilder({
  activity,
  onPuzzleChange,
  showAnswers,
  onShowAnswersChange,
}: WordSearchBuilderProps) {
  const words = activity?.wordList.words ?? [];

  function handleRegenerate() {
    if (!activity) return;
    onPuzzleChange(activityToPuzzle(activity));
  }

  function handleGenerate() {
    if (!activity) return;
    const html = generateWordSearchHtml(activityToPuzzle(activity));
    downloadHtmlFile(html, `${slugify(activity.name, "phoneme-word-search")}.html`);
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

      <div>
        <p className="mb-1 block text-sm font-medium">
          Words in {activity.wordList.name}
        </p>
        <div className="max-h-48 overflow-y-auto rounded-md border border-card-border bg-background p-2 font-mono text-sm">
          {words.length === 0 ? (
            <p role="alert" className="font-sans text-red-600 dark:text-red-400">
              This word list is empty, so no puzzle can be built.
            </p>
          ) : (
            words.map((w) => (
              <p key={w.id}>
                {w.phonemes.join(" ")}
                <span className="ml-2 font-sans text-muted">{w.englishWord}</span>
              </p>
            ))
          )}
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
