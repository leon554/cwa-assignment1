"use client";

import type { ReactNode } from "react";
import DeleteButton from "./DeleteButton";
import LoadingRow from "./LoadingRow";

export const scrollListClass = "max-h-50 overflow-y-scroll scrollbar-none";

type SavedActivity = {
  id: number;
  name: string;
};

type SavedActivityListProps<T extends SavedActivity> = {
  title: string;
  loading: boolean;
  items: T[];
  emptyMessage: string;
  selectedId?: number;
  deletingId: number | null;
  onDelete: (id: number) => void;
  onSelect: (item: T) => void;
  actionsClassName: string;
  details: (item: T) => ReactNode;
};

export default function SavedActivityList<T extends SavedActivity>({
  title,
  loading,
  items,
  emptyMessage,
  selectedId,
  deletingId,
  onDelete,
  onSelect,
  actionsClassName,
  details,
}: SavedActivityListProps<T>) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted">
        {title}
      </h3>
      <div>
        {loading ? (
          <LoadingRow />
        ) : items.length != 0 ? (
          <div className={`flex flex-col gap-2 ${scrollListClass}`}>
            {items.map((item) => (
              <div
                key={item.id}
                className={`border px-2 py-1 rounded-md ${item.id === selectedId ? "border-primary" : "border-card-border"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{item.name}</p>
                  <div className={actionsClassName}>
                    <DeleteButton
                      onDelete={() => onDelete(item.id)}
                      deleting={deletingId === item.id}
                      label={`Delete ${item.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      className="rounded-md border border-card-border px-2 py-1 text-xs font-medium hover:bg-background"
                    >
                      {item.id === selectedId ? "Loaded" : "Load"}
                    </button>
                  </div>
                </div>
                {details(item)}
              </div>
            ))}
          </div>
        ) : (
          <p>
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}
