"use client";

import { useEffect, useState } from "react";
import LabeledInput from "../shared/LabeledInput";
import PhonemeKeyboard from "../phoneme/PhonemeKeyboard";
import { createPhonemeWord, updatePhonemeWord } from "@/service/api-service";
import { ApiError } from "@/service/api-service";
import LabeledSelect from "../shared/LabeledSelect";
import { PhonemeWord } from "@/types/api-types";
import { useWords } from "@/providers/WordsContext";


export default function WordCreator() {
    const [englishWord, setEnglishWord] = useState("")
    const [phonemes, setPhonemes] = useState("")
    const [create, setCreate] = useState(true)
    const [selectedWord, setSelectedWord] = useState<null | PhonemeWord>(null)

    const WC = useWords()

    useEffect(() => {
        if(create || !selectedWord) return
        setEnglishWord(selectedWord.englishWord)
        setPhonemes(selectedWord.phonemes.join(""))

    }, [selectedWord])

    async function createWord(){
        if(!englishWord || !phonemes){
            alert("Both text boxes need to have values")
            return
        }

        WC.setLoading(true)
        try {
            await createPhonemeWord({
                englishWord,
                phonemes: phonemes.split("")
            })
            WC.refreshWords()
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        WC.setLoading(false)
    }

     async function updateWord(){
        if(!englishWord || !phonemes){
            alert("Both text boxes need to have values")
            return
        }

        WC.setLoading(true)
        try {
            await updatePhonemeWord(
                selectedWord!.id,
                {
                    englishWord: englishWord, 
                    phonemes: phonemes.split("")
                }
            )
            WC.refreshWords()
        } catch (error) {
            if (error instanceof ApiError) alert(error.message);
        }
        WC.setLoading(false)
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
                        value={selectedWord ? JSON.stringify(selectedWord) : ""}
                        onChange={(value) => setSelectedWord(JSON.parse(value))}
                        options={WC.words.map(w => ({
                            value: JSON.stringify(w),
                            label: `${w.phonemes.join("")} - ${w.englishWord}`
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
                        value={phonemes}
                        setValue={v => {}}
                    />
                    <PhonemeKeyboard
                        onKeyPress={v => setPhonemes(p => p + v)}
                        onBackspace={() => setPhonemes(p => p.slice(0, p.length-1))}
                        onEnter={() => create ? createWord() : updateWord()}
                    />
                </div>
            </div>
        </div>
    )
}
