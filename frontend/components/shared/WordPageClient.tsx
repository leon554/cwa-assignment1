"use client";

import BuilderLayout from "@/components/shared/BuilderLayout";
import WordManager from "../word/WordManager";
import WordListManager from "../wordlist/WordListManager";
import { useEffect, useState } from "react";
import { PhonemeWord } from "@/types/api-types";
import { ApiError } from "@/service/api-service";
import { getPhonemeWords } from "@/service/api-service";

export default function WordPageClient() {
    const [loading, setLoading] = useState(false)
    const [update, setUpdate] = useState(0)
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
    }, [update])

    return (
        <BuilderLayout
            title="Phoneme Word Manager"
            section1={<WordManager
                loading={loading} 
                setLoading={setLoading} 
                update={update} 
                setUpdate={setUpdate}
                words={words} 
            />}
            section2={<WordListManager
                words={words}
                loading={loading} 
                setLoading={setLoading} 
                update={update} 
                setUpdate={setUpdate}
            />}
        />
    );
}
