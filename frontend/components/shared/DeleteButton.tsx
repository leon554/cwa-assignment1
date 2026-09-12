"use client";

import Spinner from "./Spinner";

type DeleteButtonProps = {
  onDelete: () => void;
  label: string;
  deleting?: boolean;
};

export default function DeleteButton({ onDelete, label, deleting = false }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={deleting}
      aria-label={label}
      title={label}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? (
        <Spinner size={14} />
      ) : (
        <svg
          viewBox="0 0 24 24"
          width={15}
          height={15}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      )}
    </button>
  );
}
