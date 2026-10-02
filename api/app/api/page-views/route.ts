import { NextResponse } from "next/server";
import { createNextResErr, handlePrismaError, logApiError, readJsonBody, status } from "@/lib/api-utils";
import { validatePageView } from "@/lib/api/validation";
import type { PageViewBody } from "@/lib/api/types";
import { recordPageView } from "@/lib/services/metrics";

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body === null) {
    return createNextResErr("Request body must be valid JSON");
  }

  const validationResult = validatePageView(body);
  if (!validationResult.success) {
    return createNextResErr(validationResult.body.error, validationResult.status.status);
  }

  const input = body as unknown as PageViewBody;

  try {
    const view = await recordPageView(input);
    return NextResponse.json(view, status(201));
  } catch (error) {
    logApiError(error, { route: "POST /api/page-views", ids: {} });
    return handlePrismaError(error, "Page view");
  }
}
