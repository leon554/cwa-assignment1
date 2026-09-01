import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseId, handlePrismaError, createNextResErr, status } from "@/lib/api-utils";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) {
    return createNextResErr("Invalid id");
  }

  const activity = await prisma.wordSearchActivity.findUnique({
    where: { id },
    include: { wordList: { include: { words: true } } },
  });

  if (!activity) {
    return createNextResErr("Word Search activity not found", 404);
  }

  return NextResponse.json(activity, status());
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) {
    return createNextResErr("Invalid id");
  }

  const body = await request.json();

  if (body.wordListId !== undefined) {
    if (typeof body.wordListId !== "number") {
      return createNextResErr("wordListId must be a number");
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
  }

  if (body.gridWidth !== undefined && (typeof body.gridWidth !== "number" || body.gridWidth < 1)) {
    return createNextResErr("gridWidth must be a positive number");
  }
  if (body.gridHeight !== undefined && (typeof body.gridHeight !== "number" || body.gridHeight < 1)) {
    return createNextResErr("gridHeight must be a positive number");
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
    return NextResponse.json(activity, status());
  } catch (error) {
    return handlePrismaError(error, "Word Search activity");
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) {
    return createNextResErr("Invalid id");
  }

  try {
    await prisma.wordSearchActivity.delete({ where: { id } });
    return NextResponse.json({ success: true }, status());
  } catch (error) {
    return handlePrismaError(error, "Word Search activity");
  }
}