"use client";

import { useState } from "react";
import { PhonemeWordList, PhonemeWord } from "@/types/api-types";
import WordListCreator from "./WordListCreator";
import WordListFetcher from "./WordlistFetcher";

export default function WordListManager() {
    return (
        <div className="flex flex-col gap-5">
            <WordListFetcher/>
            <hr className="text-muted" />
            <WordListCreator />
        </div>
    );
}