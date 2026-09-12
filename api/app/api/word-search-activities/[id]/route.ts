import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseId, handlePrismaError, createNextResErr, readJsonBody, status } from "@/lib/api-utils";
import { validateWordSearchUpdate } from "@/lib/api/validation";
import type { WordSearchActivityBody } from "@/lib/api/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  
  if (id === null) {
    return createNextResErr("Invalid id");
  }

  try {
    const activity = await prisma.wordSearchActivity.findUnique({
      where: { id },
      include: { wordList: { include: { words: true } } },
    });

    if (!activity) {
      return createNextResErr("Word Search activity not found", 404);
    }

    return NextResponse.json(activity, status());
  } catch (error) {
    return handlePrismaError(error, "Word Search activity");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  
  if (id === null) {
    return createNextResErr("Invalid id");
  }

  const body = await readJsonBody(request);
  if (body === null) {
    return createNextResErr("Request body must be valid JSON");
  }

  const validationResult = validateWordSearchUpdate(body)
  if(!validationResult.success){
    return NextResponse.json(validationResult.body, validationResult.status)
  }

  try {
    if (body.wordListId !== undefined) {
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

    const activity = await prisma.wordSearchActivity.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  
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
