import { formatPhonemeWord } from "@/lib/phonemes";

type PhonemeWordDisplayProps = {
  phonemes: string[];
  english?: string;
  label?: string;
};

export default function PhonemeWordDisplay({phonemes, english, label = "Phoneme word",}: PhonemeWordDisplayProps) {
  return (
    <div className="rounded-lg border border-card-border bg-background p-4">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="font-mono text-2xl font-bold tracking-wide">
        {formatPhonemeWord(phonemes)}
      </p>
      {english && (
        <p className="mt-2 text-sm text-muted">
          English: <span className="font-semibold text-foreground">{english}</span>
        </p>
      )}
    </div>
  );
}
