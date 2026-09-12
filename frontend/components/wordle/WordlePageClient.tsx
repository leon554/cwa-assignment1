"use client";

import BuilderLayout from "@/components/shared/BuilderLayout";
import WordleActivityManager from "@/components/wordle/WordleActivityManager";
import WordleBuilder from "@/components/wordle/WordleBuilder";
import WordlePreview from "@/components/wordle/WordlePreview";
import { activityToWordleConfig } from "@/lib/wordle/types";
import { useWords } from "@/providers/WordsContext";
import { useState } from "react";

export default function WordlePageClient() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const WC = useWords();

  // Read the activity back out of the context so edits and deletes flow into the preview.
  const selectedActivity =
    WC.wordleActivities.find((a) => a.id === selectedId) ?? null;

  return (
    <BuilderLayout
      title="Phoneme Wordle Builder"
      section1={
        <div className="flex flex-col gap-5">
          <WordleActivityManager
            onSelect={(activity) => setSelectedId(activity.id)}
            selectedId={selectedActivity?.id}
          />
          <hr className="text-muted" />
          <WordleBuilder activity={selectedActivity} />
        </div>
      }
      section2={
        selectedActivity ? (
          <WordlePreview
            key={`${selectedActivity.id}-${selectedActivity.wordId}-${selectedActivity.maxGuesses}`}
            config={activityToWordleConfig(selectedActivity)}
          />
        ) : (
          <p className="text-sm text-muted">
            Load a saved activity to play the preview.
          </p>
        )
      }
    />
  );
}
