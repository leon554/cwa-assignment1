"use client";

import { ApiError, getPhonemeWord, getPhonemeWords } from "@/service/api-service";
import { PhonemeWord } from "@/types/api-types";
import { useEffect, useState } from "react";
import WordCreator from "./WordCreator";
import WordFetcher from "./WordFetcher";
import { PhonemeWordList } from "@/types/api-types";


export default function WordManager() {

    return (
        <div className="flex flex-col gap-5">
            <WordFetcher/>
            <hr className="text-muted"/>
            <WordCreator/>
        </div>
    )
}
