"use client";

import WordListCreator from "./WordListCreator";
import WordListFetcher from "./WordlistFetcher";

export default function WordListManager() {
    return (
        <div className="flex flex-col gap-5">
            <h3 className="text-lg font-semibold">Word List Manager</h3>
            <WordListFetcher/>
            <hr className="text-muted" />
            <WordListCreator />
        </div>
    );
}
