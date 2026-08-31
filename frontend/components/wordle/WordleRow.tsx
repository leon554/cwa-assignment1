import type { TileState } from "@/lib/wordle/types";

const tileClasses: Record<TileState, string> = {
  empty: "border-card-border bg-[var(--tile-empty)]",
  filled: "border-primary bg-card",
  correct: "border-[var(--tile-correct)] bg-[var(--tile-correct)] text-white",
  present: "border-[var(--tile-present)] bg-[var(--tile-present)] text-white",
  absent: "border-[var(--tile-absent)] bg-[var(--tile-absent)] text-white",
};

type WordleRowProps = {
  phonemes: string[];
  states: TileState[];
  wordLength: number;
  animate?: boolean;
};

export default function WordleRow({
  phonemes,
  states,
  wordLength,
  animate = false,
}: WordleRowProps) {
  return (
    <div className="flex gap-1.5" role="row">
      {Array.from({ length: wordLength }).map((_, i) => {
        const phoneme = phonemes[i] ?? "";
        const state = states[i] ?? "empty";
        return (
          <div
            key={i}
            role="gridcell"
            aria-label={phoneme ? `Phoneme ${phoneme}` : "Empty cell"}
            className={`flex h-12 w-12 items-center justify-center rounded border-2 font-mono text-sm font-bold transition-colors sm:h-14 sm:w-14 sm:text-base ${tileClasses[state]} ${animate ? "animate-[flip_0.5s_ease]" : ""}`}
          >
            {phoneme}
          </div>
        );
      })}
    </div>
  );
}
