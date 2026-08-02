"use client";

import GenerateButton from "@/components/shared/GenerateButton";
import { downloadHtmlFile } from "@/lib/html-export/download";
import { generateWordSearchHtml } from "@/lib/html-export/wordsearch-template";
import { defaultWordSearchText } from "@/lib/phoneme-words";
import { generateWordSearch } from "@/lib/wordsearch/generator";
import type { WordSearchPuzzle } from "@/lib/wordsearch/types";
import { useCallback, useState } from "react";

type WordSearchBuilderProps = {
  onPuzzleChange: (puzzle: WordSearchPuzzle) => void;
  onShowAnswersChange: (show: boolean) => void;
};

export default function WordSearchBuilder({
  onPuzzleChange,
  onShowAnswersChange,
}: WordSearchBuilderProps) {
  const [wordText, setWordText] = useState(defaultWordSearchText());
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [showAnswers, setShowAnswers] = useState(false);
  const [error, setError] = useState("");

  const buildPuzzle = useCallback(() => {
    const lines = wordText.trim().split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

    if (lines.length === 0) {
      setError("Enter at least one word.");
      return null;
    }

    setError("");
    return generateWordSearch(lines, rows, cols);
  }, [wordText, rows, cols]);

  function handleRegenerate() {
    const puzzle = buildPuzzle();
    if (puzzle) onPuzzleChange(puzzle);
  }

  function handleShowAnswers(checked: boolean) {
    setShowAnswers(checked);
    onShowAnswersChange(checked);
  }

  function handleGenerate() {
    const puzzle = buildPuzzle();
    if (!puzzle) return;
    const html = generateWordSearchHtml(puzzle);
    downloadHtmlFile(html, "phoneme-word-search.html");
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="word-input" className="mb-1 block text-sm font-medium">
          Words (one per line, space-separated phonemes)
        </label>
        <textarea
          id="word-input"
          value={wordText}
          onChange={(e) => setWordText(e.target.value)}
          rows={6}
          className="w-full rounded-md border border-card-border bg-background px-3 py-2 font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="grid-rows" className="mb-1 block text-sm font-medium">
            Rows
          </label>
          <input
            id="grid-rows"
            type="number"
            min={5}
            max={20}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="grid-cols" className="mb-1 block text-sm font-medium">
            Cols
          </label>
          <input
            id="grid-cols"
            type="number"
            min={5}
            max={20}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleRegenerate}
        className="w-full rounded-md border border-card-border bg-background px-4 py-2 text-sm font-semibold hover:bg-card"
      >
        Regenerate puzzle
      </button>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showAnswers}
          onChange={(e) => handleShowAnswers(e.target.checked)}
          className="rounded"
        />
        Show answers (preview only)
      </label>

      <GenerateButton
        onGenerate={handleGenerate}
        label="Generate Word Search HTML"
      />
    </div>
  );
}
