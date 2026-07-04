import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getDatabaseStatus, pingDatabase } from "@/lib/database";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { ok: false, message: "unauthorized" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    database: getDatabaseStatus(),
  });
}

export async function POST() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { ok: false, message: "unauthorized" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    database: getDatabaseStatus(),
    ping: await pingDatabase(),
  });
}
