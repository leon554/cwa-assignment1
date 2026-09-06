"use client";

import {createContext, useContext, useEffect, useState, ReactNode,} from "react";
import { getPhonemeWords, getPhonemeWordLists, ApiError,} from "@/service/api-service";
import { PhonemeWord, PhonemeWordList } from "@/types/api-types";

interface WordsContextValue {
  loading: boolean;
  setLoading: (loading: boolean) => void;

  words: PhonemeWord[];
  refreshWords: () => void;

  wordLists: PhonemeWordList[];
  refreshWordLists: () => void;
}

const WordsContext = createContext<WordsContextValue | undefined>(undefined);

export function WordsProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(0);
    const [words, setWords] = useState<PhonemeWord[]>([]);

    const [wordListsUpdate, setWordListsUpdate] = useState(0);
    const [wordLists, setWordLists] = useState<PhonemeWordList[]>([]);

    useEffect(() => {
        const run = async () => {
        setLoading(true);
        try {
            const words = await getPhonemeWords();
            setWords(words);
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setLoading(false);
        };
        run();
    }, [update]);

    useEffect(() => {
        const run = async () => {
        setLoading(true);
        try {
            const lists = await getPhonemeWordLists();
            setWordLists(lists);
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setLoading(false);
        };
        run();
    }, [wordListsUpdate]);

    function refreshWords() {
        setUpdate(Math.random());
    }

    function refreshWordLists() {
        setWordListsUpdate(Math.random());
    }

    return (
        <WordsContext.Provider
        value={{
            loading,
            setLoading,
            words,
            refreshWords,
            wordLists,
            refreshWordLists,
        }}
        >
        {children}
        </WordsContext.Provider>
    );
}

export function useWords() {
    const context = useContext(WordsContext);
    if (context === undefined) {
        throw new Error("useWords must be used within a WordsProvider");
    }
    return context;
}