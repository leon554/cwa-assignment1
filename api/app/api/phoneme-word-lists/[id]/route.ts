import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await request.json();

  try {
    const list = await prisma.phonemeWordList.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.wordIds && { words: { set: body.wordIds.map((id: number) => ({ id })) } }),
      },
      include: { words: true },
    });
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }
}