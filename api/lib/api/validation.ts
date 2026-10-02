import { ActivityType, GenerationStatus } from "@prisma/client";
import type { RequestBody } from "./types";

export interface ValidationSuccess {
  success: true;
}

export interface ValidationFailure {
  success: false;
  body: {error: string};
  status: {status: number};
}

export type ValidationReturn = ValidationSuccess | ValidationFailure;

function validationSuccess(): ValidationSuccess {
  return { success: true };
}

function validationFailure(error: string, status: number = 400): ValidationFailure {
  return { success: false, body: {error}, status: {status} };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}


function validatePhonemeArray(phonemes: unknown): ValidationReturn {
  if (!Array.isArray(phonemes) || phonemes.length === 0) {
    return validationFailure("phonemes must be a non-empty array");
  }
  if (!phonemes.every((p: unknown) => isNonEmptyString(p))) {
    return validationFailure("each phoneme must be a non-empty string");
  }
  return validationSuccess();
}

export function validatePhonemeWordCreation(body: RequestBody): ValidationReturn {
  if (!isNonEmptyString(body.englishWord)) {
    return validationFailure("englishWord is required");
  }
  return validatePhonemeArray(body.phonemes);
}

export function validatePhonemeWordUpdate(body: RequestBody): ValidationReturn {
  if (body.englishWord !== undefined && !isNonEmptyString(body.englishWord)) {
    return validationFailure("englishWord must be a non-empty string");
  }
  if (body.phonemes !== undefined) {
    return validatePhonemeArray(body.phonemes);
  }
  return validationSuccess();
}

export function validateWordListCreation(body: RequestBody): ValidationReturn {
  if (!isNonEmptyString(body.name)) {
    return validationFailure("name is required");
  }
  return validateWordIds(body.wordIds);
}

export function validateWordListUpdate(body: RequestBody): ValidationReturn {
  if (body.name !== undefined && !isNonEmptyString(body.name)) {
    return validationFailure("name must be a non-empty string");
  }
  return validateWordIds(body.wordIds);
}

function validateWordIds(wordIds: unknown): ValidationReturn {
  if (wordIds === undefined) return validationSuccess();
  if (!Array.isArray(wordIds)) {
    return validationFailure("wordIds must be an array");
  }
  if (!wordIds.every((id: unknown) => Number.isInteger(id) && (id as number) > 0)) {
    return validationFailure("each wordId must be a positive integer");
  }
  return validationSuccess();
}

export function validateWordSearchCreation(body: RequestBody): ValidationReturn {
  if (!isNonEmptyString(body.name)) {
    return validationFailure("name is required");
  }
  if (!body.wordListId || typeof body.wordListId !== "number") {
    return validationFailure("wordListId is required and must be a number");
  }
  return validateWordSearchFields(body);
}

export type WordSearchUpdateData = {
  name?: string;
  wordListId?: number;
  gridWidth?: number;
  gridHeight?: number;
};

export type WordSearchUpdateResult =
  | { success: true; data: WordSearchUpdateData }
  | ValidationFailure;

export function validateWordSearchUpdate(body: RequestBody): WordSearchUpdateResult {
  const data: WordSearchUpdateData = {};
  if (body.name !== undefined) {
    if (!isNonEmptyString(body.name)) {
      return validationFailure("name must be a non-empty string");
    }
    data.name = body.name;
  }
  if (body.wordListId !== undefined) {
    if (typeof body.wordListId !== "number") {
      return validationFailure("wordListId must be a number");
    }
    data.wordListId = body.wordListId;
  }
  if (body.gridWidth !== undefined) {
    if (typeof body.gridWidth !== "number" || body.gridWidth < 1) {
      return validationFailure("gridWidth must be a positive number");
    }
    data.gridWidth = body.gridWidth;
  }
  if (body.gridHeight !== undefined) {
    if (typeof body.gridHeight !== "number" || body.gridHeight < 1) {
      return validationFailure("gridHeight must be a positive number");
    }
    data.gridHeight = body.gridHeight;
  }
  return { success: true, data };
}

function validateWordSearchFields(body: RequestBody): ValidationReturn {
  if (body.gridWidth !== undefined && (typeof body.gridWidth !== "number" || body.gridWidth < 1)) {
    return validationFailure("gridWidth must be a positive number");
  }
  if (body.gridHeight !== undefined && (typeof body.gridHeight !== "number" || body.gridHeight < 1)) {
    return validationFailure("gridHeight must be a positive number");
  }
  return validationSuccess();
}

export function validateWordleCreation(body: RequestBody): ValidationReturn {
  if (!isNonEmptyString(body.name)) {
    return validationFailure("name is required");
  }
  if (!body.wordId || typeof body.wordId !== "number") {
    return validationFailure("wordId is required and must be a number");
  }
  return validateWordleFields(body);
}

export function validateWordleUpdate(body: RequestBody): ValidationReturn {
  if (body.name !== undefined && !isNonEmptyString(body.name)) {
    return validationFailure("name must be a non-empty string");
  }
  if (body.wordId !== undefined && typeof body.wordId !== "number") {
    return validationFailure("wordId must be a number");
  }
  return validateWordleFields(body);
}

function validateWordleFields(body: RequestBody): ValidationReturn {
  if (body.maxGuesses !== undefined && (typeof body.maxGuesses !== "number" || body.maxGuesses < 1)) {
    return validationFailure("maxGuesses must be a positive number");
  }
  if (body.showEnglishWord !== undefined && typeof body.showEnglishWord !== "boolean") {
    return validationFailure("showEnglishWord must be a boolean");
  }
  return validationSuccess();
}

function isActivityType(value: unknown): boolean {
  return value === "WORDLE" || value === "WORD_SEARCH";
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function validateOptionalId(value: unknown, field: string): ValidationReturn {
  if (value === undefined || value === null) return validationSuccess();
  if (!isPositiveInteger(value)) {
    return validationFailure(`${field} must be a positive integer`);
  }
  return validationSuccess();
}

export function validateGeneration(body: RequestBody): ValidationReturn {
  if (!isActivityType(body.activityType)) {
    return validationFailure("activityType must be either 'WORDLE' or 'WORD_SEARCH'");
  }
  if (body.status !== "SUCCESS" && body.status !== "FAILED") {
    return validationFailure("status must be either 'SUCCESS' or 'FAILED'");
  }
  if (!isNonNegativeInteger(body.durationMs)) {
    return validationFailure("durationMs must be a non-negative integer");
  }
  if (
    body.errorMessage !== undefined &&
    body.errorMessage !== null &&
    typeof body.errorMessage !== "string"
  ) {
    return validationFailure("errorMessage must be a string");
  }
  const wordIdResult = validateOptionalId(body.wordId, "wordId");
  if (!wordIdResult.success) return wordIdResult;
  return validateOptionalId(body.wordListId, "wordListId");
}

export function validatePageView(body: RequestBody): ValidationReturn {
  if (!isNonEmptyString(body.route)) {
    return validationFailure("route is required");
  }
  if (!isNonNegativeInteger(body.durationSeconds)) {
    return validationFailure("durationSeconds must be a non-negative integer");
  }
  return validationSuccess();
}

export function validateActivityEvent(body: RequestBody): ValidationReturn {
  if (!isActivityType(body.activityType)) {
    return validationFailure("activityType must be either 'WORDLE' or 'WORD_SEARCH'");
  }
  if (body.action !== "CREATED" && body.action !== "UPDATED" && body.action !== "DELETED") {
    return validationFailure("action must be either 'CREATED', 'UPDATED', or 'DELETED'");
  }
  return validationSuccess();
}

export type GlobalSettingsUpdateData = {
  theme?: "light" | "dark";
  layout?: "comfortable" | "compact";
};

export type GlobalSettingsUpdateResult =
  | { success: true; data: GlobalSettingsUpdateData }
  | ValidationFailure;

export function validateGlobalSettingsUpdate(body: RequestBody): GlobalSettingsUpdateResult {
  const data: GlobalSettingsUpdateData = {};
  if (body.theme !== undefined) {
    if (body.theme !== "light" && body.theme !== "dark") {
      return validationFailure("theme must be either 'light' or 'dark'");
    }
    data.theme = body.theme;
  }
  if (body.layout !== undefined) {
    if (body.layout !== "comfortable" && body.layout !== "compact") {
      return validationFailure("layout must be either 'comfortable' or 'compact'");
    }
    data.layout = body.layout;
  }
  return { success: true, data };
}

export type ParsedGenerationQuery = {
  filters: {
    activityType?: ActivityType;
    status?: GenerationStatus;
    from?: Date;
    to?: Date;
  };
  page: number;
  pageSize: number;
};

export type GenerationQueryResult =
  | { success: true; query: ParsedGenerationQuery }
  | ValidationFailure;

function parseEnumParam<T extends string>(
  value: string | null,
  allowed: readonly T[],
  field: string,
): { ok: true; value?: T } | ValidationFailure {
  if (value === null || value.trim() === "") return { ok: true };
  if (!allowed.includes(value as T)) {
    return validationFailure(`${field} must be one of ${allowed.join(", ")}`);
  }
  return { ok: true, value: value as T };
}

function parseDateParam(
  value: string | null,
  field: string,
): { ok: true; value?: Date } | ValidationFailure {
  if (value === null || value.trim() === "") return { ok: true };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return validationFailure(`${field} must be a valid date`);
  }
  return { ok: true, value: date };
}

function parsePositiveInt(
  value: string | null,
  field: string,
  fallback: number,
  max?: number,
): { ok: true; value: number } | ValidationFailure {
  if (value === null || value.trim() === "") return { ok: true, value: fallback };
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || (max !== undefined && parsed > max)) {
    const limit = max === undefined ? "1 or greater" : `from 1 to ${max}`;
    return validationFailure(`${field} must be an integer ${limit}`);
  }
  return { ok: true, value: parsed };
}

export function parseGenerationQuery(params: URLSearchParams): GenerationQueryResult {
  const activityType = parseEnumParam(
    params.get("activityType"),
    [ActivityType.WORDLE, ActivityType.WORD_SEARCH],
    "activityType",
  );
  if (!("ok" in activityType)) return activityType;

  const status = parseEnumParam(
    params.get("status"),
    [GenerationStatus.SUCCESS, GenerationStatus.FAILED],
    "status",
  );
  if (!("ok" in status)) return status;

  const from = parseDateParam(params.get("from"), "from");
  if (!("ok" in from)) return from;

  const to = parseDateParam(params.get("to"), "to");
  if (!("ok" in to)) return to;

  const page = parsePositiveInt(params.get("page"), "page", 1);
  if (!("ok" in page)) return page;

  const pageSize = parsePositiveInt(params.get("pageSize"), "pageSize", 20, 100);
  if (!("ok" in pageSize)) return pageSize;

  return {
    success: true,
    query: {
      filters: {
        activityType: activityType.value,
        status: status.value,
        from: from.value,
        to: to.value,
      },
      page: page.value,
      pageSize: pageSize.value,
    },
  };
}