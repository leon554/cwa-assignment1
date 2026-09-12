"use client";

import WordCreator from "./WordCreator";
import WordFetcher from "./WordFetcher";


export default function WordManager() {

    return (
        <div className="flex flex-col gap-5">
            <h3 className="text-lg font-semibold">Word Manager</h3>
            <WordFetcher/>
            <hr className="text-muted"/>
            <WordCreator/>
        </div>
    )
}
