"use client";

import { useEffect, useState } from "react";
import LabeledInput from "../shared/LabeledInput";
import PhonemeKeyboard from "../phoneme/PhonemeKeyboard";
import { createPhonemeWord, updatePhonemeWord } from "@/service/api-service";
import { ApiError } from "@/service/api-service";
import LabeledSelect from "../shared/LabeledSelect";
import ActionButton from "../shared/ActionButton";
import { PhonemeWord } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";


export default function WordCreator() {
    const [englishWord, setEnglishWord] = useState("")
    const [phonemes, setPhonemes] = useState<string[]>([])
    const [create, setCreate] = useState(true)
    const [selectedWord, setSelectedWord] = useState<null | PhonemeWord>(null)
    const [saving, setSaving] = useState(false)

    const WC = useWords()

    useEffect(() => {
        if(create || !selectedWord) return
        setEnglishWord(selectedWord.englishWord)
        setPhonemes(selectedWord.phonemes)

    }, [selectedWord])

    function validate(){
        if(!englishWord || phonemes.length === 0){
            alert("Both text boxes need to have values")
            return false
        }
        return true
    }

    async function createWord(){
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
            if (error instanceof ApiError) alert(error.message);
        }
        setSaving(false)
    }

     async function updateWord(){
        if(!selectedWord){
            alert("Select a word to update")
            return
        }
        if(!validate()) return

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
            if (error instanceof ApiError) alert(error.message);
        }
        setSaving(false)
    }

    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
                Create New Word
            </h3>
            <div>
                <div className="flex flex-col gap-3">
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
                        disabled={saving}
                    />
                    <ActionButton
                        onClick={() => create ? createWord() : updateWord()}
                        label={create ? "Create Word" : "Update Word"}
                        loading={saving}
                        disabled={WC.wordsLoading}
                    />
                </div>
            </div>
        </div>
    )
}
