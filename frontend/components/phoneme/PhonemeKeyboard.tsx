import { PHONEME_KEYBOARD_ROWS } from "@/lib/phonemes";
import PhonemeKeyButton from "./PhonemeKey";

type PhonemeKeyboardProps = {
  onKeyPress: (symbol: string) => void;
  onBackspace?: () => void;
  onEnter?: () => void;
  keyStates?: Record<string, "correct" | "present" | "absent">;
  disabled?: boolean;
};

export default function PhonemeKeyboard({onKeyPress, onBackspace, onEnter, keyStates = {}, disabled = false,}: PhonemeKeyboardProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <div
        className="flex flex-wrap justify-center items-center gap-1.5"
        role="group"
        aria-label="Phoneme keyboard"
      >
        {PHONEME_KEYBOARD_ROWS.flat().map((phoneme, rowIndex) => (
          <PhonemeKeyButton
            key={phoneme.symbol}
            phoneme={phoneme}
            onClick={() => onKeyPress(phoneme.symbol)}
            disabled={disabled}
            size="sm"
            state={keyStates[phoneme.symbol] ?? "default"}
          />
        ))}
      </div>
      <div>
        {(onEnter || onBackspace) && (
          <div className="mt-1 flex gap-2">
            {onEnter && (
              <button
                type="button"
                onClick={onEnter}
                disabled={disabled}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
              >
                Enter
              </button>
            )}
            {onBackspace && (
              <button
                type="button"
                onClick={onBackspace}
                disabled={disabled}
                aria-label="Delete last phoneme"
                className="rounded-md border border-card-border bg-card px-4 py-2 text-sm font-semibold hover:bg-background disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
