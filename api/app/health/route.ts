import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { status } from "@/lib/api-utils";

export async function GET() {
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "connected", uptime, timestamp }, status());
  } catch {
    return NextResponse.json(
      { status: "degraded", db: "unreachable", uptime, timestamp },
      status(503),
    );
  }
}