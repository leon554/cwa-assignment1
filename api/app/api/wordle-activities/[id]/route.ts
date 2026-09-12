import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseId, handlePrismaError, readJsonBody, status, createNextResErr } from "@/lib/api-utils";
import { validateWordleUpdate } from "@/lib/api/validation";
import type { WordleActivityBody } from "@/lib/api/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (id === null) {
    return createNextResErr("Invalid id");
  }

  try {
    const activity = await prisma.wordleActivity.findUnique({
      where: { id },
      include: { word: true },
    });

    if (!activity) {
      return createNextResErr("Wordle activity not found", 404);
    }

    return NextResponse.json(activity, status());
  } catch (error) {
    return handlePrismaError(error, "Wordle activity");
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

  const validationResult = validateWordleUpdate(body)
  if(!validationResult.success){
    return NextResponse.json(validationResult.body, validationResult.status)
  }

  const { name, wordId, maxGuesses, showEnglishWord } = body as unknown as Partial<WordleActivityBody>;

  try {
    if (wordId !== undefined) {
      const wordExists = await prisma.phonemeWord.findUnique({ where: { id: wordId } });
      if (!wordExists) {
        return createNextResErr("Selected word does not exist");
      }
    }

    const activity = await prisma.wordleActivity.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(wordId !== undefined && { wordId }),
        ...(maxGuesses !== undefined && { maxGuesses }),
        ...(showEnglishWord !== undefined && { showEnglishWord }),
      },
      include: { word: true },
    });
    return NextResponse.json(activity, status());
  } catch (error) {
    return handlePrismaError(error, "Wordle activity");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

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
