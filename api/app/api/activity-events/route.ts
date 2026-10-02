import { NextResponse } from "next/server";
import { createNextResErr, handlePrismaError, logApiError, readJsonBody, status } from "@/lib/api-utils";
import { validateActivityEvent } from "@/lib/api/validation";
import type { ActivityEventBody } from "@/lib/api/types";
import { recordActivityEvent } from "@/lib/services/metrics";

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body === null) {
    return createNextResErr("Request body must be valid JSON");
  }

  const validationResult = validateActivityEvent(body);
  if (!validationResult.success) {
    return createNextResErr(validationResult.body.error, validationResult.status.status);
  }

  const input = body as unknown as ActivityEventBody;

  try {
    const event = await recordActivityEvent(input);
    return NextResponse.json(event, status(201));
  } catch (error) {
    logApiError(error, { route: "POST /api/activity-events", ids: {} });
    return handlePrismaError(error, "Activity event");
  }
}
