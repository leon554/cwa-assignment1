import { NextResponse } from "next/server";
import { createNextResErr, handlePrismaError, status } from "@/lib/api-utils";
import { parseGenerationQuery } from "@/lib/api/validation";
import { getRecentGenerations } from "@/lib/services/metrics";

export async function GET(request: Request) {
  const parsed = parseGenerationQuery(new URL(request.url).searchParams);
  if (!parsed.success) {
    return createNextResErr(parsed.body.error, parsed.status.status);
  }

  try {
    const generations = await getRecentGenerations(parsed.query);
    return NextResponse.json(generations, status());
  } catch (error) {
    return handlePrismaError(error, "Generation log");
  }
}
