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

export function validatePhonemeWordCreation(body: any): ValidationReturn {
  if (!body.englishWord || typeof body.englishWord !== "string") {
    return validationFailure("englishWord is required");
  }
  if (!Array.isArray(body.phonemes) || body.phonemes.length === 0) {
    return validationFailure("phonemes must be a non-empty array");
  }
  if (!body.phonemes.every((p: unknown) => typeof p === "string" && p.length > 0)) {
    return validationFailure("each phoneme must be a non-empty string");
  }
  return validationSuccess();
}

export function validatePhonemeWordUpdate(body: any): ValidationReturn {
  if (body.phonemes !== undefined && !Array.isArray(body.phonemes)) {
    return validationFailure("phonemes must be an array");
  }
  return validationSuccess();
}

export function validateWordListCreation(body: any): ValidationReturn {
  if (!body.name || typeof body.name !== "string") {
    return validationFailure("name is required");
  }
  if (body.wordIds !== undefined && !Array.isArray(body.wordIds)) {
    return validationFailure("wordIds must be an array");
  }
  return validationSuccess();
}

export function validateWordSearchCreation(body: any): ValidationReturn {
  if (!body.wordListId || typeof body.wordListId !== "number") {
    return validationFailure("wordListId is required and must be a number");
  }
  if (body.gridWidth !== undefined && (typeof body.gridWidth !== "number" || body.gridWidth < 1)) {
    return validationFailure("gridWidth must be a positive number");
  }
  if (body.gridHeight !== undefined && (typeof body.gridHeight !== "number" || body.gridHeight < 1)) {
    return validationFailure("gridHeight must be a positive number");
  }
  return validationSuccess();
}

export function validateWordleCreation(body: any): ValidationReturn {
  if (!body.wordId || typeof body.wordId !== "number") {
    return validationFailure("wordId is required and must be a number");
  }
  if (body.maxGuesses !== undefined && (typeof body.maxGuesses !== "number" || body.maxGuesses < 1)) {
    return validationFailure("maxGuesses must be a positive number");
  }
  if (body.showEnglishWord !== undefined && typeof body.showEnglishWord !== "boolean") {
    return validationFailure("showEnglishWord must be a boolean");
  }
  return validationSuccess();
}