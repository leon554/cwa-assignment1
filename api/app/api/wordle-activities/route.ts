import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNextResErr, handlePrismaError, readJsonBody, status } from "@/lib/api-utils";
import { validateWordleCreation } from "@/lib/api/validation";
import type { WordleActivityBody } from "@/lib/api/types";

export async function GET() {
  try {
    const activities = await prisma.wordleActivity.findMany({
      include: { word: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(activities, status());
  } catch (error) {
    return handlePrismaError(error, "Wordle activity");
  }
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body === null) {
    return createNextResErr("Request body must be valid JSON");
  }

  const validationResult = validateWordleCreation(body)
  if(!validationResult.success){
    return NextResponse.json(validationResult.body, validationResult.status)
  }

  const { name, wordId, maxGuesses, showEnglishWord } = body as unknown as WordleActivityBody;

  try {
    const wordExists = await prisma.phonemeWord.findUnique({ where: { id: wordId } });
    if (!wordExists) {
      return createNextResErr("Selected word does not exist");
    }

    const activity = await prisma.wordleActivity.create({
      data: {
        name: name.trim(),
        wordId,
        maxGuesses: maxGuesses ?? 6,
        showEnglishWord: showEnglishWord ?? null,
      },
      include: { word: true },
    });
    return NextResponse.json(activity, status(201));
  } catch (error) {
    return handlePrismaError(error, "Wordle activity");
  }
}
