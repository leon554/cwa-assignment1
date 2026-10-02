import { NextResponse } from "next/server";
import { createNextResErr, handlePrismaError, logApiError, status } from "@/lib/api-utils";
import { validatePageView } from "@/lib/api/validation";
import type { PageViewBody, RequestBody } from "@/lib/api/types";
import { recordPageView } from "@/lib/services/metrics";

function readTextBody(text: string): RequestBody | null {
  try {
    const body: unknown = JSON.parse(text);
    if (body === null || typeof body !== "object" || Array.isArray(body)) return null;
    return body as RequestBody;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = readTextBody(await request.text());
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
    logApiError(error, { route: "POST /api/metrics/page-view", ids: {} });
    return handlePrismaError(error, "Page view");
  }
}
