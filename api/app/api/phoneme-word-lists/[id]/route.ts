import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseId, handlePrismaError, status, createNextResErr } from "@/lib/api-utils";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) {
    return createNextResErr("Invalid id");
  }

  const list = await prisma.phonemeWordList.findUnique({
    where: { id },
    include: { words: true },
  });

  if (!list) {
    return createNextResErr("Word list not found", 404);
  }

  return NextResponse.json(list, status());
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) {
    return createNextResErr("Invalid id");
  }

  const body = await request.json();
  if (body.wordIds !== undefined && !Array.isArray(body.wordIds)) {
    return createNextResErr("wordIds must be an array", 400);
  }

  try {
    const list = await prisma.phonemeWordList.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.wordIds && { words: { set: body.wordIds.map((wid: number) => ({ id: wid })) } }),
      },
      include: { words: true },
    });
    return NextResponse.json(list, status());
  } catch (error) {
    return handlePrismaError(error, "Word list");
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
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