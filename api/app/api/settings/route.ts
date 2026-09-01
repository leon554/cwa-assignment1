import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.globalSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const settings = await prisma.globalSettings.upsert({
    where: { id: 1 },
    update: {
      ...(body.theme && { theme: body.theme }),
      ...(body.layout && { layout: body.layout }),
    },
    create: { id: 1, ...body },
  });
  return NextResponse.json(settings);
}