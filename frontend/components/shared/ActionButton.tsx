"use client";

import Spinner from "./Spinner";

type ActionButtonProps = {
  onClick: () => void;
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function ActionButton({
  onClick,
  label,
  loadingLabel = "Saving...",
  loading = false,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading && <Spinner size={15} />}
      {loading ? loadingLabel : label}
    </button>
  );
}
