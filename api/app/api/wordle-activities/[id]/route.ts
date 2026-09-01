import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseId, handlePrismaError, status, createNextResErr } from "@/lib/api-utils";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) {
    return createNextResErr("Invalid id");
  }

  const activity = await prisma.wordleActivity.findUnique({
    where: { id },
    include: { word: true },
  });

  if (!activity) {
    return createNextResErr("Wordle activity not found", 404);
  }

  return NextResponse.json(activity, status());
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) {
    return createNextResErr("Invalid id");
  }

  const body = await request.json();

  if (body.wordId !== undefined) {
    if (typeof body.wordId !== "number") {
      return createNextResErr("wordId must be a number");
    }
    const wordExists = await prisma.phonemeWord.findUnique({ where: { id: body.wordId } });
    if (!wordExists) {
      return createNextResErr("Selected word does not exist");
    }
  }
  if (body.maxGuesses !== undefined && (typeof body.maxGuesses !== "number" || body.maxGuesses < 1)) {
    return createNextResErr("maxGuesses must be a positive number");
  }

  try {
    const activity = await prisma.wordleActivity.update({
      where: { id },
      data: {
        ...(body.wordId !== undefined && { wordId: body.wordId }),
        ...(body.maxGuesses !== undefined && { maxGuesses: body.maxGuesses }),
        ...(body.showEnglishWord !== undefined && { showEnglishWord: body.showEnglishWord }),
      },
      include: { word: true },
    });
    return NextResponse.json(activity, status());
  } catch (error) {
    return handlePrismaError(error, "Wordle activity");
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) {
    return createNextResErr("Invalid id");
  }

  try {
    await prisma.wordleActivity.delete({ where: { id } });
    return NextResponse.json({ success: true }, status());
  } catch (error) {
    return handlePrismaError(error, "Wordle activity");
  }
}