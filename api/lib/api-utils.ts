import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function handlePrismaError(error: unknown, entityName: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: `${entityName} not found` }, { status: 404 });
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: `${entityName} is referenced by an existing activity and cannot be deleted` },
        { status: 409 }
      );
    }
  }
  return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
}

export function createNextResErr(error: string, status: number = 400) {
  return NextResponse.json({ error }, { status });
}

export function status(status: number = 200){
  return {status}
}