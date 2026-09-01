import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateWordListCreation } from "@/lib/api/validation";
import { status } from "@/lib/api-utils";

export async function GET() {
  const lists = await prisma.phonemeWordList.findMany({ include: { words: true } });
  return NextResponse.json(lists, status());
}

export async function POST(request: Request) {
  const body = await request.json();

  const validationResult = validateWordListCreation(body)
  if(!validationResult.success){
    return NextResponse.json(validationResult.body, validationResult.status)
  }

  const list = await prisma.phonemeWordList.create({
    data: {
      name: body.name,
      words: body.wordIds ? { connect: body.wordIds.map((wid: number) => ({ id: wid })) } : undefined,
    },
    include: { words: true },
  });
  return NextResponse.json(list, status(201));
}