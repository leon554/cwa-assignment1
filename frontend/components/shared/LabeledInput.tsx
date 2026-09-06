"use client";

interface Props{
    type: "text" | "number"
    title: string
    value: string
    setValue: (value: string) => void
}

export default function LabeledInput({type, title, value, setValue}: Props) {
    return (
        <div>
            <label htmlFor="max-guesses" className="mb-1 block text-sm font-medium">
                {title}
            </label>
            <input
                id={title}
                type={type}
                min={3}
                max={10}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm"
            />
        </div>
    )
}
