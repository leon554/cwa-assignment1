import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { status } from "@/lib/api-utils";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "connected" }, status());
  } catch {
    return NextResponse.json({ status: "error", db: "unreachable" }, status(503));
  }
}