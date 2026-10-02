import { NextResponse } from "next/server";
import { handlePrismaError, logApiError, status } from "@/lib/api-utils";
import { getMetricsSummary } from "@/lib/services/metrics";

export async function GET() {
  try {
    const summary = await getMetricsSummary();
    return NextResponse.json(summary, status());
  } catch (error) {
    logApiError(error, { route: "GET /api/metrics/summary", ids: {} });
    return handlePrismaError(error, "Metrics summary");
  }
}
