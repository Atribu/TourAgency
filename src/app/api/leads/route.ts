import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.phone || body?.kvkk !== true) {
    return NextResponse.json(
      { ok: false, message: "missing_required_fields" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    id: `lead_${Date.now()}`,
    receivedAt: new Date().toISOString(),
  });
}
