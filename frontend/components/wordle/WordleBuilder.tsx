"use client";

import PhonemeWordDisplay from "@/components/phoneme/PhonemeWordDisplay";
import GenerateButton from "@/components/shared/GenerateButton";
import { downloadHtmlFile } from "@/lib/html-export/download";
import { generateWordleHtml } from "@/lib/html-export/wordle-template";
import { activityToWordleConfig } from "@/lib/wordle/types";
import type { WordleActivity } from "@/types/api-types";

type WordleBuilderProps = {
  activity: WordleActivity | null;
};

export default function WordleBuilder({ activity }: WordleBuilderProps) {
  function handleGenerate() {
    if (!activity) return;
    const config = activityToWordleConfig(activity);
    const html = generateWordleHtml(config);
    downloadHtmlFile(html, `phoneme-wordle-${config.englishWord}.html`);
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
