"use client";

import { useEffect, useState } from "react";
import LabeledInput from "../shared/LabeledInput";
import LabeledSelect from "../shared/LabeledSelect";
import ActionButton from "../shared/ActionButton";
import { createPhonemeWordList, updatePhonemeWordList, ApiError,} from "@/service/api-service";
import { PhonemeWordList, PhonemeWord } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";


export default function WordListCreator() {
    const [name, setName] = useState("");
    const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);
    const [create, setCreate] = useState(true);
    const [selectedList, setSelectedList] = useState<null | PhonemeWordList>(null);
    const [saving, setSaving] = useState(false);

    const WC = useWords()

    useEffect(() => {
        if (create || !selectedList) return;
        setName(selectedList.name);
        setSelectedWordIds(selectedList.words.map((w) => w.id));
    }, [selectedList]);

    function toggleWord(id: number) {
        setSelectedWordIds((prev) =>
            prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id]
        );
    }

    async function createList() {
        if (!name) {
            alert("Name is required");
            return;
        }

        setSaving(true);
        try {
            await createPhonemeWordList({
                name,
                wordIds: selectedWordIds,
            });
            WC.refreshWordLists()
            setName("");
            setSelectedWordIds([]);
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setSaving(false);
    }

    async function updateList() {
        if (!name || !selectedList) {
            alert("Name is required");
            return;
        }

        setSaving(true);
        try {
            await updatePhonemeWordList(selectedList.id, {
                name,
                wordIds: selectedWordIds,
            });
            WC.refreshWordLists()
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        setSaving(false);
    }

    return (
        <div>
        <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
            {create ? "Create New Word List" : "Update Existing Word List"}
        </h3>
        <div className="flex flex-col gap-3">
            <LabeledSelect
            id="update-list"
            label="Create Or Update List"
            value={create ? "Create List" : "Update List"}
            onChange={(value) => setCreate(value === "Create List")}
            options={[
                { value: "Create List", label: "Create List" },
                { value: "Update List", label: "Update List" },
            ]}
            />

            {!create && (
            <LabeledSelect
                id="listselect"
                label="Select List To Update"
                value={selectedList?.id ?? ""}
                onChange={(value) => {
                    const list = WC.wordLists.find((l) => l.id === Number(value));
                    setSelectedList(list ?? null);
                }}
                options={WC.wordLists.map((l) => ({
                    value: l.id,
                    label: l.name,
                }))}
            />
            )}

            <LabeledInput
            type="text"
            title="List Name"
            value={name}
            setValue={(v) => setName(v)}
            />

            <div>
            <label className="mb-1 block text-sm font-medium">Words</label>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border border-card-border rounded-md p-2">
                {WC.words.length === 0 ? (
                <p className="text-sm text-muted">No words available</p>
                ) : (
                WC.words.map((w) => (
                    <label key={w.id} className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={selectedWordIds.includes(w.id)}
                        onChange={() => toggleWord(w.id)}
                        className="rounded"
                    />
                    {w.phonemes.join("")} - {w.englishWord}
                    </label>
                ))
                )}
            </div>
            </div>

            <ActionButton
            onClick={() => (create ? createList() : updateList())}
            label={create ? "Create List" : "Update List"}
            loading={saving}
            disabled={WC.wordListsLoading}
            />
        </div>
        </div>
    );
}