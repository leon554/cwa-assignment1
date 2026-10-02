"use client";

import { useEffect, useState } from "react";
import LabeledInput from "../shared/LabeledInput";
import PhonemeKeyboard from "../phoneme/PhonemeKeyboard";
import AlertBanner from "../shared/AlertBanner";
import { createPhonemeWord, updatePhonemeWord } from "@/service/api-service";
import LabeledSelect from "../shared/LabeledSelect";
import { PhonemeWord } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";


export default function WordCreator() {
    const [englishWord, setEnglishWord] = useState("")
    const [phonemes, setPhonemes] = useState<string[]>([])
    const [create, setCreate] = useState(true)
    const [selectedWord, setSelectedWord] = useState<null | PhonemeWord>(null)
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    const WC = useWords()
    const cannotUpdate = !create && WC.words.length === 0

    useEffect(() => {
        if(create || !selectedWord) return
        setEnglishWord(selectedWord.englishWord)
        setPhonemes(selectedWord.phonemes)

    }, [selectedWord])

    function emptyWordMessage() {
        const missingEnglish = !englishWord
        const missingPhonemes = phonemes.length === 0
        if (missingEnglish && missingPhonemes) return "Enter an English word and at least one phoneme."
        if (missingEnglish) return "Enter an English word."
        if (missingPhonemes) return "Add at least one phoneme."
        return null
    }

    function validate(){
        return Boolean(englishWord) && phonemes.length > 0
    }

    function saveFailure(error: unknown) {
        setSaveError(error instanceof Error ? error.message : "Could not save the word")
    }

    async function createWord(){
        setSaveError(null)
        if(!validate()) return

        setSaving(true)
        try {
            await createPhonemeWord({
                englishWord,
                phonemes
            })
            WC.refreshWords()
            setEnglishWord("")
            setPhonemes([])
        } catch (error) {
            saveFailure(error)
        }
        setSaving(false)
    }

     async function updateWord(){
        setSaveError(null)
        if(!selectedWord || !validate()) return

        setSaving(true)
        try {
            await updatePhonemeWord(
                selectedWord.id,
                {
                    englishWord: englishWord,
                    phonemes
                }
            )
            WC.refreshWords()
        } catch (error) {
            saveFailure(error)
        }
        setSaving(false)
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                {create ? "Create New Word" : "Update Existing Word"}
            </h3>
            <div>
                <div className="flex flex-col gap-3">
                    {saveError && <AlertBanner variant="error">{saveError}</AlertBanner>}
                    <LabeledSelect
                        id="update"
                        label="Create Or Update Word"
                        value={create ? "Create Word" : "Update Word"}
                        onChange={(value) => setCreate(value == "Create Word")}
                        options={[
                            {value: "Create Word", label: "Create Word"}, 
                            {value: "Update Word", label: "Update Word"}
                        ]}
                    />
                    {cannotUpdate ? (
                    <AlertBanner variant="info">
                        No words saved yet. Create one first before you can update.
                    </AlertBanner>
                    ) : (
                    <>
                    {!create && !selectedWord && (
                    <AlertBanner variant="warning">Select a word to update.</AlertBanner>
                    )}
                    {emptyWordMessage() && (
                    <AlertBanner variant="warning">{emptyWordMessage()}</AlertBanner>
                    )}
                    {!create &&
                   <LabeledSelect
                        id="wordselect"
                        label="Select Word To Update"
                        value={selectedWord?.id ?? ""}
                        onChange={(value) => {
                            const word = WC.words.find(w => w.id === Number(value))
                            setSelectedWord(word ?? null)
                        }}
                        options={WC.words.map(w => ({
                            value: w.id,
                            label: `${w.phonemes.join(" ")} - ${w.englishWord}`
                        }))}
                    />
                    }
                    <LabeledInput
                        type="text"
                        title="English Word"
                        value={englishWord}
                        setValue={v => setEnglishWord(v)}
                    />
                     <LabeledInput
                        type="text"
                        title="Phenomes"
                        value={phonemes.join(" ")}
                        setValue={v => {}}
                    />
                    <PhonemeKeyboard
                        onKeyPress={v => setPhonemes(p => [...p, v])}
                        onBackspace={() => setPhonemes(p => p.slice(0, -1))}
                        onEnter={() => create ? createWord() : updateWord()}
                        enterLoading={saving}
                    />
                    </>
                    )}
                </div>
            </div>
        </div>
    )
}
