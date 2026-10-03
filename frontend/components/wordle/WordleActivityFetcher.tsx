"use client";

import { useState } from "react";
import { deleteWordleActivity, ApiError } from "@/service/api-service";
import { WordleActivity } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";
import SavedActivityList from "../shared/SavedActivityList";

interface Props {
    onSelect: (activity: WordleActivity) => void;
    selectedId?: number;
}

export default function WordleActivityFetcher({ onSelect, selectedId }: Props) {
    const WC = useWords()
    const [deletingId, setDeletingId] = useState<number | null>(null)

    async function deleteActivity(id: number) {
        setDeletingId(id)
        try {
            await deleteWordleActivity(id)
            WC.refreshWordleActivities()
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setDeletingId(null)
    }

    return (
        <SavedActivityList
            title="Saved Wordle Activities"
            loading={WC.wordleActivitiesLoading}
            items={WC.wordleActivities}
            emptyMessage="No saved activities"
            selectedId={selectedId}
            deletingId={deletingId}
            onDelete={deleteActivity}
            onSelect={onSelect}
            actionsClassName="flex items-center gap-1"
            details={(activity) => (
                <>
                    <p className="text-sm text-muted">
                        {activity.word.phonemes.join(" ")} - {activity.word.englishWord}
                    </p>
                    <p className="text-sm text-muted">
                        {activity.maxGuesses} guesses
                        {activity.showEnglishWord ? ", shows English word" : ""}
                    </p>
                </>
            )}
        />
    )
}
