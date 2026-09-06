'use client';

import { useEffect, useState } from "react";
import { deletePhonemeWord, getPhonemeWords } from "@/service/api-service";
import { PhonemeWord} from "@/types/api-types";
import { ApiError } from "@/service/api-service";

interface Props{
    loading: boolean,
    setLoading: (loading: boolean) => void
    update: number
    setUpdate: (num: number) => void
    words: PhonemeWord[],
}
export default function WordFetcher({loading, setLoading, update, setUpdate, words} : Props) {
    
    async function deleteWord(id: number){
        setLoading(true)
        try {
            await deletePhonemeWord(id)
            setUpdate(Math.random())
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setLoading(false)
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                Word List
            </h3>
            <div>
                {loading ? 
                <p className="animate-pulse"> 
                    Loading...
                </p> : words.length != 0 ? 
                <div className="flex gap-4 flex-wrap">
                    {words.map((w, i) => {
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
