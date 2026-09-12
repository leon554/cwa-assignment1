import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNextResErr, handlePrismaError, readJsonBody, status } from "@/lib/api-utils";
import { validateGlobalSettingsUpdate } from "@/lib/api/validation";

export async function GET() {
  try {
    const settings = await prisma.globalSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
    return NextResponse.json(settings, status());
  } catch (error) {
    return handlePrismaError(error, "Settings");
  }
}

export async function PUT(request: Request) {
  const body = await readJsonBody(request);
  if (body === null) {
    return createNextResErr("Request body must be valid JSON");
  }

  const validationResult = validateGlobalSettingsUpdate(body);
  if (!validationResult.success) {
    return NextResponse.json(validationResult.body, validationResult.status);
  }

  // Named fields only. Spreading the raw body would let a caller push unknown
  // columns into Prisma and turn a bad request into a 500.
  const changes = {
    ...(body.theme !== undefined && { theme: body.theme }),
    ...(body.layout !== undefined && { layout: body.layout }),
  };

  try {
    const settings = await prisma.globalSettings.upsert({
      where: { id: 1 },
      update: changes,
      create: { id: 1, ...changes },
    });
    return NextResponse.json(settings, status());
  } catch (error) {
    return handlePrismaError(error, "Settings");
  }
}
