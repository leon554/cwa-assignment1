import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const word = await prisma.phonemeWord.findUnique({ where: { id } });
  if (!word) return NextResponse.json({ error: "Word not found" }, { status: 404 });

  return NextResponse.json(word);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  if (body.phonemes && !Array.isArray(body.phonemes)) {
    return NextResponse.json({ error: "phonemes must be an array" }, { status: 400 });
  }

  try {
    const word = await prisma.phonemeWord.update({
      where: { id },
      data: {
        ...(body.englishWord && { englishWord: body.englishWord }),
        ...(body.phonemes && { phonemes: body.phonemes }),
      },
    });
    return NextResponse.json(word);
  } catch {
    return NextResponse.json({ error: "Word not found" }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    await prisma.phonemeWord.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Word not found" }, { status: 404 });
  }
}