import { NextResponse } from "next/server";
import { handlePrismaError, logApiError, status } from "@/lib/api-utils";
import { getSystemAlerts } from "@/lib/services/metrics";

export async function GET() {
  try {
    const alerts = await getSystemAlerts();
    return NextResponse.json(alerts, status());
  } catch (error) {
    logApiError(error, { route: "GET /api/metrics/system-alerts", ids: {} });
    return handlePrismaError(error, "System alert");
  }
}
