import { NextResponse } from "next/server";
import { handlePrismaError, logApiError, status } from "@/lib/api-utils";
import { getAlerts } from "@/lib/services/metrics";

export async function GET() {
  try {
    const alerts = await getAlerts();
    return NextResponse.json(alerts, status());
  } catch (error) {
    logApiError(error, { route: "GET /api/metrics/alerts", ids: {} });
    return handlePrismaError(error, "Generation alert");
  }
}
