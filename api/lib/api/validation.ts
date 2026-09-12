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

// Phonemes must survive as discrete symbols, since a single symbol such as "tʃ"
// spans more than one character.
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

export function validateWordSearchUpdate(body: RequestBody): ValidationReturn {
  if (body.name !== undefined && !isNonEmptyString(body.name)) {
    return validationFailure("name must be a non-empty string");
  }
  if (body.wordListId !== undefined && typeof body.wordListId !== "number") {
    return validationFailure("wordListId must be a number");
  }
  return validateWordSearchFields(body);
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

export function validateGlobalSettingsUpdate(body: RequestBody): ValidationReturn {
  if (body.theme !== undefined && body.theme !== "light" && body.theme !== "dark") {
    return validationFailure("theme must be either 'light' or 'dark'");
  }
  if (
    body.layout !== undefined &&
    body.layout !== "comfortable" &&
    body.layout !== "compact"
  ) {
    return validationFailure("layout must be either 'comfortable' or 'compact'");
  }
  return validationSuccess();
}