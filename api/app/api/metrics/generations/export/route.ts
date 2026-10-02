import { NextResponse } from "next/server";
import { createNextResErr, handlePrismaError } from "@/lib/api-utils";
import { parseGenerationQuery } from "@/lib/api/validation";
import { exportGenerationsCsv } from "@/lib/services/metrics";

export async function GET(request: Request) {
  const parsed = parseGenerationQuery(new URL(request.url).searchParams);
  if (!parsed.success) {
    return createNextResErr(parsed.body.error, parsed.status.status);
  }

  try {
    const csv = await exportGenerationsCsv(parsed.query.filters);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="generations.csv"',
      },
    });
  } catch (error) {
    return handlePrismaError(error, "Generation log");
  }
}
