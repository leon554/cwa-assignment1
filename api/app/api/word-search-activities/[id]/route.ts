import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const activity = await prisma.wordSearchActivity.findUnique({
    where: { id },
    include: { wordList: { include: { words: true } } },
  });
  if (!activity) return NextResponse.json({ error: "Word Search activity not found" }, { status: 404 });

  return NextResponse.json(activity);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();

  if (body.wordListId !== undefined) {
    if (typeof body.wordListId !== "number") {
      return NextResponse.json({ error: "wordListId must be a number" }, { status: 400 });
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
  }
  if (body.gridWidth !== undefined && (typeof body.gridWidth !== "number" || body.gridWidth < 1)) {
    return NextResponse.json({ error: "gridWidth must be a positive number" }, { status: 400 });
  }
  if (body.gridHeight !== undefined && (typeof body.gridHeight !== "number" || body.gridHeight < 1)) {
    return NextResponse.json({ error: "gridHeight must be a positive number" }, { status: 400 });
  }

  try {
    const activity = await prisma.wordSearchActivity.update({
      where: { id },
      data: {
        ...(body.wordListId !== undefined && { wordListId: body.wordListId }),
        ...(body.gridWidth !== undefined && { gridWidth: body.gridWidth }),
        ...(body.gridHeight !== undefined && { gridHeight: body.gridHeight }),
      },
      include: { wordList: { include: { words: true } } },
    });
    return NextResponse.json(activity);
  } catch {
    return NextResponse.json({ error: "Word Search activity not found" }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    await prisma.wordSearchActivity.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Word Search activity not found" }, { status: 404 });
  }
}