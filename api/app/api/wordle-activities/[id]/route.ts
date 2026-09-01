import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const activity = await prisma.wordleActivity.findUnique({
    where: { id },
    include: { word: true },
  });
  if (!activity) return NextResponse.json({ error: "Wordle activity not found" }, { status: 404 });

  return NextResponse.json(activity);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();

  if (body.wordId !== undefined) {
    if (typeof body.wordId !== "number") {
      return NextResponse.json({ error: "wordId must be a number" }, { status: 400 });
    }
    const wordExists = await prisma.phonemeWord.findUnique({ where: { id: body.wordId } });
    if (!wordExists) {
      return NextResponse.json({ error: "Selected word does not exist" }, { status: 400 });
    }
  }
  if (body.maxGuesses !== undefined && (typeof body.maxGuesses !== "number" || body.maxGuesses < 1)) {
    return NextResponse.json({ error: "maxGuesses must be a positive number" }, { status: 400 });
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
    return NextResponse.json(activity);
  } catch {
    return NextResponse.json({ error: "Wordle activity not found" }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    await prisma.wordleActivity.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Wordle activity not found" }, { status: 404 });
  }
}