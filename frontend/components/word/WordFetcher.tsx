'use client';

import { useEffect, useState } from "react";
import { deletePhonemeWord, getPhonemeWords } from "@/service/api-service";
import { PhonemeWord} from "@/types/api-types";
import { ApiError } from "@/service/api-service";
import { useWords } from "@/providers/WordsContext";


export default function WordFetcher() {
    const WC = useWords()
    
    async function deleteWord(id: number){
        WC.setLoading(true)
        try {
            await deletePhonemeWord(id)
            WC.refreshWords()
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        WC.setLoading(false)
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                Word List
            </h3>
            <div>
                {WC.loading ? 
                <p className="animate-pulse"> 
                    Loading...
                </p> : WC.words.length != 0 ? 
                <div className="flex gap-4 flex-wrap">
                    {WC.words.map((w, i) => {
                        return(
                            <p key={i} className="border px-2 rounded-md border-card-border hover:cursor-default">
                                {w.phonemes} - {w.englishWord} 
                                <span className="font-mono font-bold text-red-500 hover:cursor-pointer"
                                    onClick={() => deleteWord(w.id)}
                                >
                                    {" x"}
                                </span>
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
