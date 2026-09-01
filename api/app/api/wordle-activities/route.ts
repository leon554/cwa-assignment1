import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const activities = await prisma.wordleActivity.findMany({ include: { word: true } });
  return NextResponse.json(activities);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.wordId || typeof body.wordId !== "number") {
    return NextResponse.json({ error: "wordId is required" }, { status: 400 });
  }

  const wordExists = await prisma.phonemeWord.findUnique({ where: { id: body.wordId } });
  if (!wordExists) {
    return NextResponse.json({ error: "Selected word does not exist" }, { status: 400 });
  }

  const activity = await prisma.wordleActivity.create({
    data: {
      wordId: body.wordId,
      maxGuesses: body.maxGuesses ?? 6,
      showEnglishWord: body.showEnglishWord ?? null,
    },
    include: { word: true },
  });
  return NextResponse.json(activity, { status: 201 });
}