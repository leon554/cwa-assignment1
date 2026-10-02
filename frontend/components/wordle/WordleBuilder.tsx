"use client";

import { useState } from "react";
import PhonemeWordDisplay from "@/components/phoneme/PhonemeWordDisplay";
import AlertBanner from "@/components/shared/AlertBanner";
import GenerateButton from "@/components/shared/GenerateButton";
import { downloadHtmlFile, slugify } from "@/lib/html-export/download";
import { generateWordleHtml } from "@/lib/html-export/wordle-template";
import { trackGeneration } from "@/lib/metrics/track-generation";
import { activityToWordleConfig } from "@/lib/wordle/types";
import type { WordleActivity } from "@/types/api-types";

type WordleBuilderProps = {
  activity: WordleActivity | null;
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

export default function WordleBuilder({ activity }: WordleBuilderProps) {
  const [error, setError] = useState<string | null>(null);

  function handleGenerate() {
    if (!activity) return;
    setError(null);
    try {
      const result = trackGeneration({
        activityType: "WORDLE",
        wordId: activity.wordId,
        run: () => {
          const config = activityToWordleConfig(activity);
          const html = generateWordleHtml(config);
          downloadHtmlFile(html, `${slugify(activity.name, "phoneme-wordle")}.html`);
          if (activity.word.phonemes.length === 0) {
            return { errorMessage: "Wordle target has no phonemes" };
          }
        },
      });
      const message = generationError(result);
      if (message) setError(message);
    } catch {
      setError("HTML export failed");
    }
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

      {activity.word.phonemes.length === 0 && (
        <AlertBanner variant="warning">Wordle target has no phonemes.</AlertBanner>
      )}
      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      <PhonemeWordDisplay
        phonemes={activity.word.phonemes}
        english={activity.word.englishWord}
      />

      <dl className="space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Max guesses</dt>
          <dd className="font-medium">{activity.maxGuesses}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Show English word on win</dt>
          <dd className="font-medium">{activity.showEnglishWord ? "Yes" : "No"}</dd>
        </div>
      </dl>

      <GenerateButton onGenerate={handleGenerate} label="Generate Wordle HTML" />
    </div>
  );
}
