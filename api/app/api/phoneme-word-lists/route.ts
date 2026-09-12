import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateWordListCreation } from "@/lib/api/validation";
import type { WordListBody } from "@/lib/api/types";
import { createNextResErr, handlePrismaError, readJsonBody, status } from "@/lib/api-utils";

export async function GET() {
  try {
    const lists = await prisma.phonemeWordList.findMany({ include: { words: true } });
    return NextResponse.json(lists, status());
  } catch (error) {
    return handlePrismaError(error, "Word list");
  }
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body === null) {
    return createNextResErr("Request body must be valid JSON");
  }

  const validationResult = validateWordListCreation(body)
  if(!validationResult.success){
    return NextResponse.json(validationResult.body, validationResult.status)
  }

  const { name, wordIds } = body as unknown as WordListBody;

  try {
    const list = await prisma.phonemeWordList.create({
      data: {
        name,
        words: wordIds ? { connect: wordIds.map((wid) => ({ id: wid })) } : undefined,
      },
      include: { words: true },
    });
    return NextResponse.json(list, status(201));
  } catch (error) {
    return handlePrismaError(error, "Word list");
  }
}
