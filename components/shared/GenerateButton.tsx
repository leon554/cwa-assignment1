"use client";

type GenerateButtonProps = {
  onGenerate: () => void;
  label?: string;
  disabled?: boolean;
};

export default function GenerateButton({onGenerate, label = "Generate HTML", disabled = false}: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={disabled}
      className="mt-4 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}
