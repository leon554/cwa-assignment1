import { NextResponse } from "next/server";
import { handlePrismaError, status } from "@/lib/api-utils";
import { getAlerts } from "@/lib/services/metrics";

export async function GET() {
  try {
    const alerts = await getAlerts();
    return NextResponse.json(alerts, status());
  } catch (error) {
    return handlePrismaError(error, "Generation alert");
  }
}
