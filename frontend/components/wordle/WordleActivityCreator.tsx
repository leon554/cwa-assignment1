"use client";

import { useEffect, useState } from "react";
import LabeledInput from "../shared/LabeledInput";
import LabeledSelect from "../shared/LabeledSelect";
import { createWordleActivity, updateWordleActivity, ApiError } from "@/service/api-service";
import { WordleActivity } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";

export default function WordleActivityCreator() {
    const [wordId, setWordId] = useState<number | null>(null);
    const [maxGuesses, setMaxGuesses] = useState("6");
    const [showEnglishWord, setShowEnglishWord] = useState(true);
    const [create, setCreate] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<null | WordleActivity>(null);

    const WC = useWords()

    useEffect(() => {
        if (create || !selectedActivity) return;
        setWordId(selectedActivity.wordId);
        setMaxGuesses(`${selectedActivity.maxGuesses}`);
        setShowEnglishWord(selectedActivity.showEnglishWord ?? false);
    }, [selectedActivity]);

    function validate() {
        if (!wordId) {
            alert("Select a word for the activity");
            return false;
        }
        if (!Number.isInteger(Number(maxGuesses)) || Number(maxGuesses) < 1) {
            alert("Max guesses must be a positive whole number");
            return false;
        }
        return true;
    }

    async function createActivity() {
        if (!validate()) return;

        WC.setLoading(true);
        try {
            await createWordleActivity({
                wordId: wordId!,
                maxGuesses: Number(maxGuesses),
                showEnglishWord,
            });
            WC.refreshWordleActivities();
            setWordId(null);
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        WC.setLoading(false);
    }

    async function updateActivity() {
        if (!selectedActivity) {
            alert("Select an activity to update");
            return;
        }
        if (!validate()) return;

        WC.setLoading(true);
        try {
            await updateWordleActivity(selectedActivity.id, {
                wordId: wordId!,
                maxGuesses: Number(maxGuesses),
                showEnglishWord,
            });
            WC.refreshWordleActivities();
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        WC.setLoading(false);
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                Create New Wordle Activity
            </h3>
            <div className="flex flex-col gap-3">
                <LabeledSelect
                    id="update-wordle"
                    label="Create Or Update Activity"
                    value={create ? "Create Activity" : "Update Activity"}
                    onChange={(value) => setCreate(value === "Create Activity")}
                    options={[
                        { value: "Create Activity", label: "Create Activity" },
                        { value: "Update Activity", label: "Update Activity" },
                    ]}
                />

                {!create && (
                    <LabeledSelect
                        id="wordle-activity-select"
                        label="Select Activity To Update"
                        value={selectedActivity?.id ?? ""}
                        onChange={(value) => {
                            const activity = WC.wordleActivities.find((a) => a.id === Number(value));
                            setSelectedActivity(activity ?? null);
                        }}
                        options={WC.wordleActivities.map((a) => ({
                            value: a.id,
                            label: `${a.word.phonemes.join(" ")} - ${a.word.englishWord}`,
                        }))}
                    />
                )}

                {WC.words.length === 0 ? (
                    <p className="text-sm text-muted">
                        No words available. Create a word on the Words page first.
                    </p>
                ) : (
                    <LabeledSelect
                        id="wordle-word-select"
                        label="Target Word"
                        value={wordId ?? ""}
                        onChange={(value) => setWordId(Number(value))}
                        options={WC.words.map((w) => ({
                            value: w.id,
                            label: `${w.phonemes.join(" ")} - ${w.englishWord}`,
                        }))}
                    />
                )}

                <LabeledInput
                    type="number"
                    title="Max Guesses"
                    value={maxGuesses}
                    setValue={(v) => setMaxGuesses(v)}
                />

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={showEnglishWord}
                        onChange={(e) => setShowEnglishWord(e.target.checked)}
                        className="rounded"
                    />
                    Show English word when answer is correct
                </label>

                <button
                    disabled={WC.loading || WC.words.length === 0}
                    onClick={() => (create ? createActivity() : updateActivity())}
                    className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                    {WC.loading ? "Saving..." : create ? "Create Activity" : "Update Activity"}
                </button>
            </div>
        </div>
    );
}
