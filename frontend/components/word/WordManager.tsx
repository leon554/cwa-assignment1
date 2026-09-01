"use client";

import { ApiError, getPhonemeWord, getPhonemeWords } from "@/service/api-service";
import { PhonemeWord } from "@/types/api-types";
import { useEffect, useState } from "react";

export default function WordManager() {
    const [loading, setLoading] = useState(false)
    const [words, setWords] = useState<PhonemeWord[]>([])

    useEffect(() => {
        const run = async () => {
            setLoading(true)
            try {
                const words = await getPhonemeWords()
                setWords(words)
            } catch (error) {
               if (error instanceof ApiError) alert(error.message);
            }
            setLoading(false)
        }
        run()
    }, [])

    return (
        <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted">
                Word List
            </h3>
            <div>
                {loading ? 
                <p className="animate-pulse"> 
                    Loading...
                </p> : words.length != 0 ? 
                <>
                    {words.map(w => {
                        return(
                            <p>
                                {w.phonemes} - {w.englishWord}
                            </p>
                        )
                    })}
                </>:
                <p>
                    No words
                </p>}
            </div>
        </div>
    )
}
