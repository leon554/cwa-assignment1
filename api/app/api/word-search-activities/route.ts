import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateWordSearchCreation } from "@/lib/api/validation";
import { createNextResErr, status } from "@/lib/api-utils";

export async function GET() {
  const activities = await prisma.wordSearchActivity.findMany({
    include: { wordList: { include: { words: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(activities, status());
}

export async function POST(request: Request) {
  const body = await request.json();

  const validationResult = validateWordSearchCreation(body)
  if(!validationResult.success){
    return NextResponse.json(validationResult.body, validationResult.status)
  }

  const wordList = await prisma.phonemeWordList.findUnique({
    where: { id: body.wordListId },
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
      wordListId: body.wordListId,
      gridWidth: body.gridWidth ?? 15,
      gridHeight: body.gridHeight ?? 15,
    },
    include: { wordList: { include: { words: true } } },
  });
  return NextResponse.json(activity, status(201));
}