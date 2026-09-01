import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePhonemeWordCreation } from "@/lib/api/validation";
import { status } from "@/lib/api-utils";

export async function GET() {
  const words = await prisma.phonemeWord.findMany();
  return NextResponse.json(words, status());
}

export async function POST(request: Request) {
  const body = await request.json();

  const validationResult = validatePhonemeWordCreation(body)
  if(!validationResult.success){
    return NextResponse.json(validationResult.body, validationResult.status);
  }

  const word = await prisma.phonemeWord.create({
    data: { englishWord: body.englishWord, phonemes: body.phonemes },
  });
  return NextResponse.json(word, status(201));
}