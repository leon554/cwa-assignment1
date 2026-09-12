"use client";

import { useEffect } from "react";
import { deletePhonemeWordList, getPhonemeWordLists, ApiError } from "@/service/api-service";
import { PhonemeWordList } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";

export default function WordListFetcher() {
    const WC = useWords()

    async function deleteList(id: number) {
        WC.setLoading(true);
        try {
            await deletePhonemeWordList(id);
            WC.refreshWordLists()
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        WC.setLoading(false);
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                Word Lists
            </h3>
            <div>
                {WC.loading ? (
                <p className="animate-pulse">Loading...</p>
                ) : WC.wordLists.length !== 0 ? (
                <div className="flex flex-col gap-2">
                    {WC.wordLists.map((list) => (
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