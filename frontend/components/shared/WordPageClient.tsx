"use client";

import BuilderLayout from "@/components/shared/BuilderLayout";
import WordManager from "../word/WordManager";
import WordListManager from "../wordlist/WordListManager";

export default function WordPageClient() {
    return (
        <BuilderLayout
            title="Phoneme Word Manager"
            section1={<WordManager/>}
            section2={<WordListManager/>}
        />
    );
}
