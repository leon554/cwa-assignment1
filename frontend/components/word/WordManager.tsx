"use client";

import { ApiError, getPhonemeWord, getPhonemeWords } from "@/service/api-service";
import { PhonemeWord } from "@/types/api-types";
import { useEffect, useState } from "react";
import WordCreator from "./WordCreator";
import WordFetcher from "./WordFetcher";

export default function WordManager() {
    const [loading, setLoading] = useState(false)
    const [update, setUpdate] = useState(0)
    const [words, setWords] = useState<PhonemeWord[]>([])

    return (
        <div className="flex flex-col gap-5">
            <WordFetcher 
                loading={loading} 
                setLoading={setLoading} 
                update={update} 
                setUpdate={setUpdate}
                words={words}
                setWords={setWords}
            />
            <hr className="text-muted"/>
            <WordCreator 
                loading={loading} 
                setLoading={setLoading} 
                setUpdate={setUpdate}
                words={words}
            />
        </div>
    )
}
