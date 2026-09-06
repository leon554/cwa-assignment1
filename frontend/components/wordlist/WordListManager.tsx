"use client";

import { useState } from "react";
import { PhonemeWordList, PhonemeWord } from "@/types/api-types";
import WordListCreator from "./WordListCreator";
import WordListFetcher from "./WordlistFetcher";

interface Props{
    loading: boolean,
    setLoading: (loading: boolean) => void
    update: number
    setUpdate: (num: number) => void
    words: PhonemeWord[],
}
export default function WordListManager({loading, setLoading, update, setUpdate, words} : Props) {
  const [wordLists, setWordLists] = useState<PhonemeWordList[]>([]);

  return (
    <div className="flex flex-col gap-5">
      <WordListFetcher
        loading={loading}
        setLoading={setLoading}
        update={update}
        setUpdate={setUpdate}
        wordLists={wordLists}
        setWordLists={setWordLists}
      />
      <hr className="text-muted" />
      <WordListCreator
        loading={loading}
        setLoading={setLoading}
        setUpdate={setUpdate}
        wordLists={wordLists}
        words={words}
      />
    </div>
  );
}