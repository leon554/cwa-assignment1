import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const activities = await prisma.wordSearchActivity.findMany({
    include: { wordList: { include: { words: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(activities);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.wordListId || typeof body.wordListId !== "number") {
    return NextResponse.json({ error: "wordListId is required and must be a number" }, { status: 400 });
  }
  if (body.gridWidth !== undefined && (typeof body.gridWidth !== "number" || body.gridWidth < 1)) {
    return NextResponse.json({ error: "gridWidth must be a positive number" }, { status: 400 });
  }
  if (body.gridHeight !== undefined && (typeof body.gridHeight !== "number" || body.gridHeight < 1)) {
    return NextResponse.json({ error: "gridHeight must be a positive number" }, { status: 400 });
  }

  const wordList = await prisma.phonemeWordList.findUnique({
    where: { id: body.wordListId },
    include: { words: true },
  });
  if (!wordList) {
    return NextResponse.json({ error: "Selected word list does not exist" }, { status: 400 });
  }
  if (wordList.words.length === 0) {
    return NextResponse.json({ error: "Word list must contain at least one word" }, { status: 400 });
  }

  try {
    const activity = await prisma.wordSearchActivity.create({
      data: {
        wordListId: body.wordListId,
        gridWidth: body.gridWidth ?? 15,
        gridHeight: body.gridHeight ?? 15,
      },
      include: { wordList: { include: { words: true } } },
    });
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create Word Search activity" }, { status: 500 });
  }
}