"use client";

import BuilderLayout from "@/components/shared/BuilderLayout";
import WordManager from "../word/WordManager";
import WordListManager from "../wordlist/WordListManager";
import { useEffect, useState } from "react";
import { PhonemeWord } from "@/types/api-types";
import { ApiError } from "@/service/api-service";
import { getPhonemeWords } from "@/service/api-service";

export default function WordPageClient() {
    return (
        <BuilderLayout
            title="Phoneme Word Manager"
            section1={<WordManager/>}
            section2={<WordListManager/>}
        />
    );
}
