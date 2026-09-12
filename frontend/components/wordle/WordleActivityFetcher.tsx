"use client";

import { deleteWordleActivity, ApiError } from "@/service/api-service";
import { WordleActivity } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";

interface Props {
    onSelect: (activity: WordleActivity) => void;
    selectedId?: number;
}

export default function WordleActivityFetcher({ onSelect, selectedId }: Props) {
    const WC = useWords()

    async function deleteActivity(id: number) {
        WC.setLoading(true)
        try {
            await deleteWordleActivity(id)
            WC.refreshWordleActivities()
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        WC.setLoading(false)
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                Saved Wordle Activities
            </h3>
            <div>
                {WC.loading ?
                <p className="animate-pulse">
                    Loading...
                </p> : WC.wordleActivities.length != 0 ?
                <div className="flex flex-col gap-2">
                    {WC.wordleActivities.map((a) => (
                        <div
                            key={a.id}
                            className={`border px-2 py-1 rounded-md ${a.id === selectedId ? "border-primary" : "border-card-border"}`}
                        >
                            <p className="font-semibold">
                                {a.word.phonemes.join(" ")} - {a.word.englishWord}
                                <span
                                    className="ml-2 font-mono font-bold text-red-500 hover:cursor-pointer"
                                    onClick={() => deleteActivity(a.id)}
                                >
                                    {" x"}
                                </span>
                            </p>
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
