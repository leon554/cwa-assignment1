import { createGeneration } from "@/service/api-service";
import type { ActivityTypeName } from "@/types/api-types";

type TrackGenerationOptions<T> = {
  activityType: ActivityTypeName;
  wordId?: number | null;
  wordListId?: number | null;
  run: () => T;
};

function failureMessage(result: unknown): string | null {
  if (
    result !== null &&
    typeof result === "object" &&
    "errorMessage" in result &&
    typeof result.errorMessage === "string" &&
    result.errorMessage.length > 0
  ) {
    return result.errorMessage;
  }
  return null;
}

function report<T>(
  options: TrackGenerationOptions<T>,
  startedAt: number,
  errorMessage: string | null,
) {
  const durationMs = Math.max(0, Math.round(performance.now() - startedAt));
  void createGeneration({
    activityType: options.activityType,
    status: errorMessage ? "FAILED" : "SUCCESS",
    errorMessage,
    durationMs,
    wordId: options.wordId,
    wordListId: options.wordListId,
  }).catch(() => {});
}

export function trackGeneration<T>(options: TrackGenerationOptions<T>): T {
  const startedAt = performance.now();
  try {
    const result = options.run();
    report(options, startedAt, failureMessage(result));
    return result;
  } catch (error) {
    report(options, startedAt, "HTML export failed");
    throw error;
  }
}
