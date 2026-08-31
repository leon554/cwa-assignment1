import type { PhonemeKey } from "@/lib/phonemes";

type PhonemeKeyProps = {
  phoneme: PhonemeKey;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md";
  state?: "default" | "correct" | "present" | "absent";
};

const stateClasses: Record<NonNullable<PhonemeKeyProps["state"]>, string> = {
  default: "bg-card border-card-border hover:bg-background",
  correct: "bg-[var(--tile-correct)] border-[var(--tile-correct)] text-white",
  present: "bg-[var(--tile-present)] border-[var(--tile-present)] text-white",
  absent: "bg-[var(--tile-absent)] border-[var(--tile-absent)] text-white",
};

export default function PhonemeKeyButton({phoneme, onClick, disabled = false, size = "md", state = "default",}: PhonemeKeyProps) {
  
  const sizeClass = size === "sm" ? "min-w-8 h-8 text-xs px-1" : "min-w-10 h-10 text-sm px-2";
  const hint = `/${phoneme.symbol}/ — ${phoneme.label} (${phoneme.hint})`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={hint}
      aria-label={hint}
      className={`group relative rounded-md border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass} ${stateClasses[state]}`}
    >
      <span className="font-mono">{phoneme.symbol}</span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background group-hover:block group-focus-visible:block"
      >
        {phoneme.label} ({phoneme.hint})
      </span>
    </button>
  );
}
