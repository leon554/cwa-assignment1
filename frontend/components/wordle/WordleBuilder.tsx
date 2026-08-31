"use client";

import PhonemeWordDisplay from "@/components/phoneme/PhonemeWordDisplay";
import GenerateButton from "@/components/shared/GenerateButton";
import { downloadHtmlFile } from "@/lib/html-export/download";
import { generateWordleHtml } from "@/lib/html-export/wordle-template";
import { WORDLE_PRESETS } from "@/lib/phoneme-words";
import type { WordleConfig } from "@/lib/wordle/types";
import { useState } from "react";

type WordleBuilderProps = {
  onConfigChange: (config: WordleConfig) => void;
};

export default function WordleBuilder({ onConfigChange }: WordleBuilderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [maxGuesses, setMaxGuesses] = useState(6);
  const [showEnglishOnWin, setShowEnglishOnWin] = useState(true);

  const selectedWord = WORDLE_PRESETS[selectedIndex];

  function getConfig(): WordleConfig {
    return {
      targetPhonemes: selectedWord.phonemes,
      englishWord: selectedWord.english,
      maxGuesses,
      showEnglishOnWin,
    };
  }

  function handleWordChange(index: number) {
    setSelectedIndex(index);
    const word = WORDLE_PRESETS[index];
    onConfigChange({
      targetPhonemes: word.phonemes,
      englishWord: word.english,
      maxGuesses,
      showEnglishOnWin,
    });
  }

  function handleGuessesChange(value: number) {
    setMaxGuesses(value);
    onConfigChange({
      ...getConfig(),
      maxGuesses: value,
    });
  }

  function handleEnglishToggle(checked: boolean) {
    setShowEnglishOnWin(checked);
    onConfigChange({
      ...getConfig(),
      showEnglishOnWin: checked,
    });
  }

  function handleGenerate() {
    const config = getConfig();
    const html = generateWordleHtml(config);
    downloadHtmlFile(html, `phoneme-wordle-${config.englishWord}.html`);
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="word-select" className="mb-1 block text-sm font-medium">
          Target word
        </label>
        <select
          id="word-select"
          value={selectedIndex}
          onChange={(e) => handleWordChange(Number(e.target.value))}
          className="w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm"
        >
          {WORDLE_PRESETS.map((word, i) => (
            <option key={word.english} value={i}>
              {word.english} — {word.phonemes.join(" ")}
            </option>
          ))}
        </select>
      </div>

      <PhonemeWordDisplay
        phonemes={selectedWord.phonemes}
        english={selectedWord.english}
      />

      <div>
        <label htmlFor="max-guesses" className="mb-1 block text-sm font-medium">
          Max guesses
        </label>
        <input
          id="max-guesses"
          type="number"
          min={3}
          max={10}
          value={maxGuesses}
          onChange={(e) => handleGuessesChange(Number(e.target.value))}
          className="w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showEnglishOnWin}
          onChange={(e) => handleEnglishToggle(e.target.checked)}
          className="rounded"
        />
        Show English word when answer is correct
      </label>

      <GenerateButton onGenerate={handleGenerate} label="Generate Wordle HTML" />
    </div>
  );
}
