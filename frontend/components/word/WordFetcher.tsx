'use client';

import { useState } from "react";
import { deletePhonemeWord } from "@/service/api-service";
import { ApiError } from "@/service/api-service";
import { useWords } from "@/providers/WordsContext";
import DeleteButton from "../shared/DeleteButton";
import LoadingRow from "../shared/LoadingRow";


export default function WordFetcher() {
    const WC = useWords()
    const [deletingId, setDeletingId] = useState<number | null>(null)

    async function deleteWord(id: number){
        setDeletingId(id)
        try {
            await deletePhonemeWord(id)
            WC.refreshWords()
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setDeletingId(null)
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                Word List
            </h3>
            <div>
                {WC.wordsLoading ? 
                <LoadingRow/> : WC.words.length != 0 ? 
                <div className="flex gap-4 flex-wrap">
                    {WC.words.map((w) => {
                        return(
                            <p key={w.id} className="flex items-center gap-1 border pl-2 pr-1 rounded-md border-card-border hover:cursor-default">
                                {w.phonemes.join(" ")} - {w.englishWord}
                                <DeleteButton
                                    onDelete={() => deleteWord(w.id)}
                                    deleting={deletingId === w.id}
                                    label={`Delete ${w.englishWord}`}
                                />
                            </p>
                        )
                    })}
                </div>:
                <p>
                    No words
                </p>}
            </div>
        </div>
    )
}
