import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNextResErr, status } from "@/lib/api-utils";
import { validateWordleCreation } from "@/lib/api/validation";

export async function GET() {
  const activities = await prisma.wordleActivity.findMany({
    include: { word: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(activities, status());
}

export async function POST(request: Request) {
  const body = await request.json();

  const validationResult = validateWordleCreation(body)
  if(!validationResult.success){
    return NextResponse.json(validationResult.body, validationResult.status)
  }

  const wordExists = await prisma.phonemeWord.findUnique({ where: { id: body.wordId } });
  if (!wordExists) {
    return createNextResErr("Selected word does not exist");
  }

  const activity = await prisma.wordleActivity.create({
    data: {
      wordId: body.wordId,
      maxGuesses: body.maxGuesses ?? 6,
      showEnglishWord: body.showEnglishWord ?? null,
    },
    include: { word: true },
  });
  return NextResponse.json(activity, status(201));
}