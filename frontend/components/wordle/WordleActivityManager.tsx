"use client";

import { WordleActivity } from "@/types/api-types";
import WordleActivityCreator from "./WordleActivityCreator";
import WordleActivityFetcher from "./WordleActivityFetcher";

interface Props {
    onSelect: (activity: WordleActivity) => void;
    selectedId?: number;
}

export default function WordleActivityManager({ onSelect, selectedId }: Props) {
    return (
        <div className="flex flex-col gap-5">
            <WordleActivityFetcher onSelect={onSelect} selectedId={selectedId} />
            <hr className="text-muted" />
            <WordleActivityCreator />
        </div>
    );
}
