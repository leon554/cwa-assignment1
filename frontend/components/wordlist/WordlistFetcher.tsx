"use client";

import { useEffect } from "react";
import { deletePhonemeWordList, getPhonemeWordLists, ApiError } from "@/service/api-service";
import { PhonemeWordList } from "@/types/api-types";

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  update: number;
  setUpdate: (num: number) => void;
  wordLists: PhonemeWordList[];
  setWordLists: (wordLists: PhonemeWordList[]) => void;
}

export default function WordListFetcher({
  loading,
  setLoading,
  update,
  setUpdate,
  wordLists,
  setWordLists,
}: Props) {
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const lists = await getPhonemeWordLists();
        setWordLists(lists);
      } catch (error) {
        if (error instanceof ApiError) alert(error.message);
      }
      setLoading(false);
    };
    run();
  }, [update]);

  async function deleteList(id: number) {
    setLoading(true);
    try {
      await deletePhonemeWordList(id);
      setUpdate(Math.random());
    } catch (error) {
      if (error instanceof ApiError) alert(error.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
        Word List
      </h3>
      <div>
        {loading ? (
          <p className="animate-pulse">Loading...</p>
        ) : wordLists.length !== 0 ? (
          <div className="flex flex-col gap-2">
            {wordLists.map((list) => (
              <div
                key={list.id}
                className="border px-2 py-1 rounded-md border-card-border"
              >
                <p className="font-semibold">
                  {list.name}
                  <span
                    className="ml-2 font-mono font-bold text-red-500 hover:cursor-pointer"
                    onClick={() => deleteList(list.id)}
                  >
                    {" x"}
                  </span>
                </p>
                <p className="text-sm text-muted">
                  {list.words.map((w) => w.englishWord).join(", ") || "No words"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No word lists</p>
        )}
      </div>
    </div>
  );
}