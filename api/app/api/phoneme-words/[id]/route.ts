import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseId, handlePrismaError, createNextResErr, readJsonBody, status } from "@/lib/api-utils";
import { validatePhonemeWordUpdate } from "@/lib/api/validation";
import type { PhonemeWordBody } from "@/lib/api/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (id === null) {
    return createNextResErr("Invalid ID");
  }

  try {
    const word = await prisma.phonemeWord.findUnique({ where: { id } });

    if (!word) {
      return createNextResErr("Word Not Found", 404);
    }
    return NextResponse.json(word, status());
  } catch (error) {
    return handlePrismaError(error, "Word");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (id === null) {
    return createNextResErr("Invalid ID");
  }

  const body = await readJsonBody(request);
  if (body === null) {
    return createNextResErr("Request body must be valid JSON");
  }

  const validationResult = validatePhonemeWordUpdate(body)
  if(!validationResult.success) {
    return NextResponse.json(validationResult.body, validationResult.status);
  } 

  const { englishWord, phonemes } = body as unknown as Partial<PhonemeWordBody>;

  try {
    const word = await prisma.phonemeWord.update({
      where: { id },
      data: {
        ...(englishWord !== undefined && { englishWord }),
        ...(phonemes !== undefined && { phonemes }),
      },
    });
    return NextResponse.json(word, status());
  } catch (error) {
    return handlePrismaError(error, "Word");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (id === null) {
    return createNextResErr("Invalid ID");
  }

  try {
    await prisma.phonemeWord.delete({ where: { id } });
    return NextResponse.json({ success: true }, status());
  } catch (error) {
    return handlePrismaError(error, "Word");
  }
}
