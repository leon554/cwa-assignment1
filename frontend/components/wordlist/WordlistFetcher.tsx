"use client";

import { useState } from "react";
import { deletePhonemeWordList, ApiError } from "@/service/api-service";
import { useWords } from "@/providers/WordsContext";
import DeleteButton from "../shared/DeleteButton";
import LoadingRow from "../shared/LoadingRow";

export default function WordListFetcher() {
    const WC = useWords()
    const [deletingId, setDeletingId] = useState<number | null>(null)

    async function deleteList(id: number) {
        setDeletingId(id);
        try {
            await deletePhonemeWordList(id);
            WC.refreshWordLists()
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setDeletingId(null);
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                Word Lists
            </h3>
            <div>
                {WC.wordListsLoading ? (
                <LoadingRow/>
                ) : WC.wordLists.length !== 0 ? (
                <div className="flex flex-col gap-2">
                    {WC.wordLists.map((list) => (
                    <div
                        key={list.id}
                        className="border px-2 py-1 rounded-md border-card-border"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold">{list.name}</p>
                            <DeleteButton
                                onDelete={() => deleteList(list.id)}
                                deleting={deletingId === list.id}
                                label={`Delete ${list.name}`}
                            />
                        </div>
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
