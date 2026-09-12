import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateWordSearchCreation } from "@/lib/api/validation";
import type { WordSearchActivityBody } from "@/lib/api/types";
import { createNextResErr, handlePrismaError, readJsonBody, status } from "@/lib/api-utils";

export async function GET() {
  try {
    const activities = await prisma.wordSearchActivity.findMany({
      include: { wordList: { include: { words: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(activities, status());
  } catch (error) {
    return handlePrismaError(error, "Word Search activity");
  }
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body === null) {
    return createNextResErr("Request body must be valid JSON");
  }

  const validationResult = validateWordSearchCreation(body)
  if(!validationResult.success){
    return NextResponse.json(validationResult.body, validationResult.status)
  }

  const { name, wordListId, gridWidth, gridHeight } = body as unknown as WordSearchActivityBody;

  try {
    const wordList = await prisma.phonemeWordList.findUnique({
      where: { id: wordListId },
      include: { words: true },
    });

    if (!wordList) {
      return createNextResErr("Selected word list does not exist");
    }
    if (wordList.words.length === 0) {
      return createNextResErr("Word list must contain at least one word");
    }

    const activity = await prisma.wordSearchActivity.create({
      data: {
        name: name.trim(),
        wordListId,
        gridWidth: gridWidth ?? 15,
        gridHeight: gridHeight ?? 15,
      },
      include: { wordList: { include: { words: true } } },
    });
    return NextResponse.json(activity, status(201));
  } catch (error) {
    return handlePrismaError(error, "Word Search activity");
  }
}
