import type { ActivityTypeName } from "@/types/api-types";

export function activityLabel(activityType: ActivityTypeName) {
  return activityType === "WORDLE" ? "Wordle" : "Word Search";
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

export function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toISOString().replace("T", " ").slice(0, 16)} UTC`;
}
