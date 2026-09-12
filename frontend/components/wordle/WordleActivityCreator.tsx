"use client";

import { useEffect, useState } from "react";
import LabeledInput from "../shared/LabeledInput";
import LabeledSelect from "../shared/LabeledSelect";
import ActionButton from "../shared/ActionButton";
import { createWordleActivity, updateWordleActivity, ApiError } from "@/service/api-service";
import { WordleActivity } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";

export default function WordleActivityCreator() {
    const [name, setName] = useState("");
    const [wordId, setWordId] = useState<number | null>(null);
    const [maxGuesses, setMaxGuesses] = useState("6");
    const [showEnglishWord, setShowEnglishWord] = useState(true);
    const [create, setCreate] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<null | WordleActivity>(null);
    const [saving, setSaving] = useState(false);

    const WC = useWords()
    const cannotUpdate = !create && WC.wordleActivities.length === 0

    useEffect(() => {
        if (create || !selectedActivity) return;
        setName(selectedActivity.name);
        setWordId(selectedActivity.wordId);
        setMaxGuesses(`${selectedActivity.maxGuesses}`);
        setShowEnglishWord(selectedActivity.showEnglishWord ?? false);
    }, [selectedActivity]);

    function validate() {
        if (!name.trim()) {
            alert("Give the activity a name");
            return false;
        }
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

        setSaving(true);
        try {
            await createWordleActivity({
                name: name.trim(),
                wordId: wordId!,
                maxGuesses: Number(maxGuesses),
                showEnglishWord,
            });
            WC.refreshWordleActivities();
            setName("");
            setWordId(null);
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setSaving(false);
    }

    async function updateActivity() {
        if (!selectedActivity) {
            alert("Select an activity to update");
            return;
        }
        if (!validate()) return;

        setSaving(true);
        try {
            await updateWordleActivity(selectedActivity.id, {
                name: name.trim(),
                wordId: wordId!,
                maxGuesses: Number(maxGuesses),
                showEnglishWord,
            });
            WC.refreshWordleActivities();
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setSaving(false);
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                {create ? "Create New Wordle Activity" : "Update Existing Wordle Activity"}
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

                {cannotUpdate ? (
                    <p role="status" className="text-sm text-muted">
                        No Wordle activities saved yet. Create one first before you can update.
                    </p>
                ) : (
                <>
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
                            label: a.name,
                        }))}
                    />
                )}

                <LabeledInput
                    type="text"
                    title="Activity Name"
                    value={name}
                    setValue={(v) => setName(v)}
                />

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

                <ActionButton
                    onClick={() => (create ? createActivity() : updateActivity())}
                    label={create ? "Create Activity" : "Update Activity"}
                    loading={saving}
                    disabled={WC.wordleActivitiesLoading || WC.words.length === 0}
                />
                </>
                )}
            </div>
        </div>
    );
}
