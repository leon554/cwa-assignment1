"use client";

import BuilderLayout from "@/components/shared/BuilderLayout";
import WordManager from "./WordManager";


export default function WordPageClient() {

  return (
    <BuilderLayout
      title="Phoneme Word Manager"
      section1={<WordManager />}
    />
  );
}
