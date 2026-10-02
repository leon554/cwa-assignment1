import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNextResErr, handlePrismaError, readJsonBody, status } from "@/lib/api-utils";
import { validateGeneration } from "@/lib/api/validation";
import type { GenerationLogBody } from "@/lib/api/types";
import { recordGeneration } from "@/lib/services/metrics";

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body === null) {
    return createNextResErr("Request body must be valid JSON");
  }

  const validationResult = validateGeneration(body);
  if (!validationResult.success) {
    return createNextResErr(validationResult.body.error, validationResult.status.status);
  }

  const input = body as unknown as GenerationLogBody;

  try {
    if (input.wordId != null) {
      const word = await prisma.phonemeWord.findUnique({ where: { id: input.wordId } });
      if (!word) return createNextResErr("Selected word does not exist");
    }
    if (input.wordListId != null) {
      const list = await prisma.phonemeWordList.findUnique({ where: { id: input.wordListId } });
      if (!list) return createNextResErr("Selected word list does not exist");
    }

    const log = await recordGeneration(input);
    return NextResponse.json(log, status(201));
  } catch (error) {
    return handlePrismaError(error, "Generation log");
  }
}
