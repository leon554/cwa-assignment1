"use client";

import BuilderLayout from "@/components/shared/BuilderLayout";
import WordleBuilder from "@/components/wordle/WordleBuilder";
import WordlePreview from "@/components/wordle/WordlePreview";
import { DEFAULT_WORDLE_WORD } from "@/lib/phoneme-words";
import type { WordleConfig } from "@/lib/wordle/types";
import { useState } from "react";
import WordManager from "./WordManager";

const initialConfig: WordleConfig = {
  targetPhonemes: DEFAULT_WORDLE_WORD.phonemes,
  englishWord: DEFAULT_WORDLE_WORD.english,
  maxGuesses: 6,
  showEnglishOnWin: true,
};

export default function WordPageClient() {

  return (
    <BuilderLayout
      title="Phoneme Word Manager"
      section1={<WordManager />}
    />
  );
}
