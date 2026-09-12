"use client";

import {createContext, useContext, useEffect, useState, ReactNode,} from "react";
import { getPhonemeWords, getPhonemeWordLists, getWordleActivities, getWordSearchActivities, ApiError,} from "@/service/api-service";
import { PhonemeWord, PhonemeWordList, WordleActivity, WordSearchActivity } from "@/types/api-types";

interface WordsContextValue {
  words: PhonemeWord[];
  wordsLoading: boolean;
  refreshWords: () => void;

  wordLists: PhonemeWordList[];
  wordListsLoading: boolean;
  refreshWordLists: () => void;

  wordleActivities: WordleActivity[];
  wordleActivitiesLoading: boolean;
  refreshWordleActivities: () => void;

  wordSearchActivities: WordSearchActivity[];
  wordSearchActivitiesLoading: boolean;
  refreshWordSearchActivities: () => void;
}

const WordsContext = createContext<WordsContextValue | undefined>(undefined);

// Each collection owns its own loading flag so one request never blanks out
// the other lists. `fetchAll` must be a stable reference.
function useCollection<T>(fetchAll: () => Promise<T[]>) {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let active = true;
        const run = async () => {
            setLoading(true);
            try {
                const data = await fetchAll();
                if (active) setItems(data);
            } catch (error) {
                if (error instanceof ApiError) alert(error.message);
            }
            if (active) setLoading(false);
        };
        run();
        return () => {
            active = false;
        };
    }, [version]);

    return { items, loading, refresh: () => setVersion((v) => v + 1) };
}

export function WordsProvider({ children }: { children: ReactNode }) {
    const words = useCollection(getPhonemeWords);
    const wordLists = useCollection(getPhonemeWordLists);
    const wordleActivities = useCollection(getWordleActivities);
    const wordSearchActivities = useCollection(getWordSearchActivities);

    return (
        <WordsContext.Provider
        value={{
            words: words.items,
            wordsLoading: words.loading,
            refreshWords: words.refresh,

            wordLists: wordLists.items,
            wordListsLoading: wordLists.loading,
            refreshWordLists: wordLists.refresh,

            wordleActivities: wordleActivities.items,
            wordleActivitiesLoading: wordleActivities.loading,
            refreshWordleActivities: wordleActivities.refresh,

            wordSearchActivities: wordSearchActivities.items,
            wordSearchActivitiesLoading: wordSearchActivities.loading,
            refreshWordSearchActivities: wordSearchActivities.refresh,
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
