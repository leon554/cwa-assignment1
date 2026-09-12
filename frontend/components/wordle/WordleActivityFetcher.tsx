"use client";

import { useState } from "react";
import { deleteWordleActivity, ApiError } from "@/service/api-service";
import { WordleActivity } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";
import DeleteButton from "../shared/DeleteButton";
import LoadingRow from "../shared/LoadingRow";

interface Props {
    onSelect: (activity: WordleActivity) => void;
    selectedId?: number;
}

export default function WordleActivityFetcher({ onSelect, selectedId }: Props) {
    const WC = useWords()
    const [deletingId, setDeletingId] = useState<number | null>(null)

    async function deleteActivity(id: number) {
        setDeletingId(id)
        try {
            await deleteWordleActivity(id)
            WC.refreshWordleActivities()
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setDeletingId(null)
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                Saved Wordle Activities
            </h3>
            <div>
                {WC.wordleActivitiesLoading ?
                <LoadingRow/> : WC.wordleActivities.length != 0 ?
                <div className="flex flex-col gap-2">
                    {WC.wordleActivities.map((a) => (
                        <div
                            key={a.id}
                            className={`border px-2 py-1 rounded-md ${a.id === selectedId ? "border-primary" : "border-card-border"}`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold">
                                    {a.word.phonemes.join(" ")} - {a.word.englishWord}
                                </p>
                                <DeleteButton
                                    onDelete={() => deleteActivity(a.id)}
                                    deleting={deletingId === a.id}
                                    label={`Delete activity for ${a.word.englishWord}`}
                                />
                            </div>
                            <p className="text-sm text-muted">
                                {a.maxGuesses} guesses
                                {a.showEnglishWord ? ", shows English word" : ""}
                            </p>
                            <button
                                type="button"
                                onClick={() => onSelect(a)}
                                className="mt-1 rounded-md border border-card-border px-2 py-1 text-xs font-medium hover:bg-background"
                            >
                                {a.id === selectedId ? "Loaded" : "Load"}
                            </button>
                        </div>
                    ))}
                </div>:
                <p>
                    No saved activities
                </p>}
            </div>
        </div>
    )
}
