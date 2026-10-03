"use client";

import { useState } from "react";
import { deleteWordSearchActivity, ApiError } from "@/service/api-service";
import { WordSearchActivity } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";
import SavedActivityList from "../shared/SavedActivityList";

interface Props {
    onSelect: (activity: WordSearchActivity) => void;
    selectedId?: number;
}

export default function WordSearchActivityFetcher({ onSelect, selectedId }: Props) {
    const WC = useWords()
    const [deletingId, setDeletingId] = useState<number | null>(null)

    async function deleteActivity(id: number) {
        setDeletingId(id)
        try {
            await deleteWordSearchActivity(id)
            WC.refreshWordSearchActivities()
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setDeletingId(null)
    }

    return (
        <SavedActivityList
            title="Saved Word Search Activities"
            loading={WC.wordSearchActivitiesLoading}
            items={WC.wordSearchActivities}
            emptyMessage="No saved activities"
            selectedId={selectedId}
            deletingId={deletingId}
            onDelete={deleteActivity}
            onSelect={onSelect}
            actionsClassName="flex items-center justify-between gap-2"
            details={(activity) => (
                <p className="text-sm text-muted">
                    {activity.wordList.name}, {activity.gridWidth} x {activity.gridHeight} grid,{" "}
                    {activity.wordList.words.length} words
                </p>
            )}
        />
    )
}
