"use client";

import { WordSearchActivity } from "@/types/api-types";
import WordSearchActivityCreator from "./WordSearchActivityCreator";
import WordSearchActivityFetcher from "./WordSearchActivityFetcher";

interface Props {
    onSelect: (activity: WordSearchActivity) => void;
    selectedId?: number;
}

export default function WordSearchActivityManager({ onSelect, selectedId }: Props) {
    return (
        <div className="flex flex-col gap-5">
            <WordSearchActivityFetcher onSelect={onSelect} selectedId={selectedId} />
            <hr className="text-muted" />
            <WordSearchActivityCreator />
        </div>
    );
}
