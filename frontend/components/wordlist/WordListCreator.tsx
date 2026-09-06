"use client";

import { useEffect, useState } from "react";
import LabeledInput from "../shared/LabeledInput";
import LabeledSelect from "../shared/LabeledSelect";
import {
  createPhonemeWordList,
  updatePhonemeWordList,
  ApiError,
} from "@/service/api-service";
import { PhonemeWordList, PhonemeWord } from "@/types/api-types";

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setUpdate: (num: number) => void;
  wordLists: PhonemeWordList[];
  words: PhonemeWord[];
}

export default function WordListCreator({
  loading,
  setLoading,
  setUpdate,
  wordLists,
  words,
}: Props) {
  const [name, setName] = useState("");
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);
  const [create, setCreate] = useState(true);
  const [selectedList, setSelectedList] = useState<null | PhonemeWordList>(null);

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

    setLoading(true);
    try {
      await createPhonemeWordList({
        name,
        wordIds: selectedWordIds,
      });
      setUpdate(Math.random());
      setName("");
      setSelectedWordIds([]);
    } catch (error) {
      if (error instanceof ApiError) alert(error.message);
    }
    setLoading(false);
  }

  async function updateList() {
    if (!name || !selectedList) {
      alert("Name is required");
      return;
    }

    setLoading(true);
    try {
      await updatePhonemeWordList(selectedList.id, {
        name,
        wordIds: selectedWordIds,
      });
      setUpdate(Math.random());
    } catch (error) {
      if (error instanceof ApiError) alert(error.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
        Create New Word List
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
              const list = wordLists.find((l) => l.id === Number(value));
              setSelectedList(list ?? null);
            }}
            options={wordLists.map((l) => ({
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
            {words.length === 0 ? (
              <p className="text-sm text-muted">No words available</p>
            ) : (
              words.map((w) => (
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

        <button
          disabled={loading}
          onClick={() => (create ? createList() : updateList())}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : create ? "Create List" : "Update List"}
        </button>
      </div>
    </div>
  );
}