"use client";

import { useEffect, useState } from "react";
import LabeledInput from "../shared/LabeledInput";
import LabeledSelect from "../shared/LabeledSelect";
import ActionButton from "../shared/ActionButton";
import { createWordSearchActivity, updateWordSearchActivity, ApiError } from "@/service/api-service";
import { WordSearchActivity } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";

export default function WordSearchActivityCreator() {
    const [name, setName] = useState("");
    const [wordListId, setWordListId] = useState<number | null>(null);
    const [gridWidth, setGridWidth] = useState("10");
    const [gridHeight, setGridHeight] = useState("10");
    const [create, setCreate] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<null | WordSearchActivity>(null);
    const [saving, setSaving] = useState(false);

    const WC = useWords()

    const selectedList = WC.wordLists.find((l) => l.id === wordListId);
    const emptyList = selectedList !== undefined && selectedList.words.length === 0;

    useEffect(() => {
        if (create || !selectedActivity) return;
        setName(selectedActivity.name);
        setWordListId(selectedActivity.wordListId);
        setGridWidth(`${selectedActivity.gridWidth}`);
        setGridHeight(`${selectedActivity.gridHeight}`);
    }, [selectedActivity]);

    function validate() {
        if (!name.trim()) {
            alert("Give the activity a name");
            return false;
        }
        if (!wordListId) {
            alert("Select a word list for the activity");
            return false;
        }
        if (emptyList) {
            alert("The selected word list has no words in it");
            return false;
        }
        if (!Number.isInteger(Number(gridWidth)) || Number(gridWidth) < 1) {
            alert("Grid width must be a positive whole number");
            return false;
        }
        if (!Number.isInteger(Number(gridHeight)) || Number(gridHeight) < 1) {
            alert("Grid height must be a positive whole number");
            return false;
        }
        return true;
    }

    async function createActivity() {
        if (!validate()) return;

        setSaving(true);
        try {
            await createWordSearchActivity({
                name: name.trim(),
                wordListId: wordListId!,
                gridWidth: Number(gridWidth),
                gridHeight: Number(gridHeight),
            });
            WC.refreshWordSearchActivities();
            setName("");
            setWordListId(null);
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
            await updateWordSearchActivity(selectedActivity.id, {
                name: name.trim(),
                wordListId: wordListId!,
                gridWidth: Number(gridWidth),
                gridHeight: Number(gridHeight),
            });
            WC.refreshWordSearchActivities();
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setSaving(false);
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                {create ? "Create New Word Search Activity" : "Update Existing Word Search Activity"}
            </h3>
            <div className="flex flex-col gap-3">
                <LabeledSelect
                    id="update-word-search"
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
                        id="word-search-activity-select"
                        label="Select Activity To Update"
                        value={selectedActivity?.id ?? ""}
                        onChange={(value) => {
                            const activity = WC.wordSearchActivities.find((a) => a.id === Number(value));
                            setSelectedActivity(activity ?? null);
                        }}
                        options={WC.wordSearchActivities.map((a) => ({
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

                {WC.wordLists.length === 0 ? (
                    <p className="text-sm text-muted">
                        No word lists available. Create a word list on the Words page first.
                    </p>
                ) : (
                    <LabeledSelect
                        id="word-search-list-select"
                        label="Word List"
                        value={wordListId ?? ""}
                        onChange={(value) => setWordListId(Number(value))}
                        options={WC.wordLists.map((l) => ({
                            value: l.id,
                            label: `${l.name} (${l.words.length} words)`,
                        }))}
                    />
                )}

                {emptyList && (
                    <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                        This word list has no words in it. Add words to it before saving.
                    </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <LabeledInput
                        type="number"
                        title="Grid Width"
                        value={gridWidth}
                        setValue={(v) => setGridWidth(v)}
                        min={5}
                        max={20}
                    />
                    <LabeledInput
                        type="number"
                        title="Grid Height"
                        value={gridHeight}
                        setValue={(v) => setGridHeight(v)}
                        min={5}
                        max={20}
                    />
                </div>

                <ActionButton
                    onClick={() => (create ? createActivity() : updateActivity())}
                    label={create ? "Create Activity" : "Update Activity"}
                    loading={saving}
                    disabled={WC.wordSearchActivitiesLoading || WC.wordLists.length === 0 || emptyList}
                />
            </div>
        </div>
    );
}
