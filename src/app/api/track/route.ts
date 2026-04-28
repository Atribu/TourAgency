import { NextResponse } from "next/server";
import { trackDemoEvent } from "@/lib/demo-store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.name) {
    return NextResponse.json(
      { ok: false, message: "missing_event_name" },
      { status: 400 },
    );
  }

  const event = await trackDemoEvent(body.name, body.payload ?? {});

  return NextResponse.json({
    ok: true,
    event: event.name,
    receivedAt: event.createdAt,
  });
}
