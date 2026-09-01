import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const lists = await prisma.phonemeWordList.findMany({ include: { words: true } });
  return NextResponse.json(lists);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const list = await prisma.phonemeWordList.create({
    data: {
      name: body.name,
      words: body.wordIds ? { connect: body.wordIds.map((id: number) => ({ id })) } : undefined,
    },
    include: { words: true },
  });
  return NextResponse.json(list, { status: 201 });
}