import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseId, handlePrismaError, readJsonBody, status, createNextResErr } from "@/lib/api-utils";
import { validateWordListUpdate } from "@/lib/api/validation";
import type { WordListBody } from "@/lib/api/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  
  if (id === null) {
    return createNextResErr("Invalid id");
  }

  try {
    const list = await prisma.phonemeWordList.findUnique({
      where: { id },
      include: { words: true },
    });

    if (!list) {
      return createNextResErr("Word list not found", 404);
    }

    return NextResponse.json(list, status());
  } catch (error) {
    return handlePrismaError(error, "Word list");
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

  const validationResult = validateWordListUpdate(body)
  if(!validationResult.success){
    return NextResponse.json(validationResult.body, validationResult.status)
  }

  const { name, wordIds } = body as unknown as Partial<WordListBody>;

  try {
    const list = await prisma.phonemeWordList.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(wordIds !== undefined && { words: { set: wordIds.map((wid) => ({ id: wid })) } }),
      },
      include: { words: true },
    });
    return NextResponse.json(list, status());
  } catch (error) {
    return handlePrismaError(error, "Word list");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (id === null) {
    return createNextResErr("Invalid id");
  }

  try {
    await prisma.phonemeWordList.delete({ where: { id } });
    return NextResponse.json({ success: true }, status());
  } catch (error) {
    return handlePrismaError(error, "Word list");
  }
}
