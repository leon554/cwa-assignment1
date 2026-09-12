import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePhonemeWordCreation } from "@/lib/api/validation";
import type { PhonemeWordBody } from "@/lib/api/types";
import { createNextResErr, handlePrismaError, readJsonBody, status } from "@/lib/api-utils";

export async function GET() {
  try {
    const words = await prisma.phonemeWord.findMany();
    return NextResponse.json(words, status());
  } catch (error) {
    return handlePrismaError(error, "Word");
  }
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body === null) {
    return createNextResErr("Request body must be valid JSON");
  }

  const validationResult = validatePhonemeWordCreation(body)
  if(!validationResult.success){
    return NextResponse.json(validationResult.body, validationResult.status);
  }

  const { englishWord, phonemes } = body as unknown as PhonemeWordBody;

  try {
    const word = await prisma.phonemeWord.create({
      data: { englishWord, phonemes },
    });
    return NextResponse.json(word, status(201));
  } catch (error) {
    return handlePrismaError(error, "Word");
  }
}
