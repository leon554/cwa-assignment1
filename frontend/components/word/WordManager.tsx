"use client";

import { ApiError, getPhonemeWord, getPhonemeWords } from "@/service/api-service";
import { PhonemeWord } from "@/types/api-types";
import { useEffect, useState } from "react";
import WordCreator from "./WordCreator";
import WordFetcher from "./WordFetcher";
import { PhonemeWordList } from "@/types/api-types";

interface Props{
    loading: boolean,
    setLoading: (loading: boolean) => void
    update: number
    setUpdate: (num: number) => void
    words: PhonemeWord[],
}
export default function WordManager({loading, setLoading, update, setUpdate, words} : Props) {

    return (
        <div className="flex flex-col gap-5">
            <WordFetcher 
                loading={loading} 
                setLoading={setLoading} 
                update={update} 
                setUpdate={setUpdate}
                words={words}
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
