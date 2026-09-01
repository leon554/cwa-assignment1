import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseId, handlePrismaError, createNextResErr, status } from "@/lib/api-utils";
import { validatePhonemeWordUpdate } from "@/lib/api/validation";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);

  if (id === null) {
    return createNextResErr("Invalid ID");
  }

  const word = await prisma.phonemeWord.findUnique({ where: { id } });

  if (!word) {
    return createNextResErr("Word Not Found", 404);
  }
  return NextResponse.json(word, status());
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) {
    return createNextResErr("Invalid ID");
  }

  const body = await request.json();
  const validationResult = validatePhonemeWordUpdate(body)
  if(!validationResult.success) {
    return NextResponse.json(validationResult.body, validationResult.status);
  } 

  try {
    const word = await prisma.phonemeWord.update({
      where: { id },
      data: {
        ...(body.englishWord && { englishWord: body.englishWord }),
        ...(body.phonemes && { phonemes: body.phonemes }),
      },
    });
    return NextResponse.json(word, status());
  } catch (error) {
    return handlePrismaError(error, "Word");
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
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