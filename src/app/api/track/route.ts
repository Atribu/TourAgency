import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.name) {
    return NextResponse.json(
      { ok: false, message: "missing_event_name" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    event: body.name,
    receivedAt: new Date().toISOString(),
  });
}
