import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const words = await prisma.phonemeWord.findMany();
  return NextResponse.json(words);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.englishWord || typeof body.englishWord !== "string") {
    return NextResponse.json({ error: "englishWord is required" }, { status: 400 });
  }
  if (!Array.isArray(body.phonemes) || body.phonemes.length === 0) {
    return NextResponse.json({ error: "phonemes must be a non-empty array" }, { status: 400 });
  }
  if (!body.phonemes.every((p: unknown) => typeof p === "string" && p.length > 0)) {
    return NextResponse.json({ error: "each phoneme must be a non-empty string" }, { status: 400 });
  }

  try {
    const word = await prisma.phonemeWord.create({
      data: { englishWord: body.englishWord, phonemes: body.phonemes },
    });
    return NextResponse.json(word, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create word" }, { status: 500 });
  }
}