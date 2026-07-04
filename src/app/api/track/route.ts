import { NextResponse } from "next/server";
import { trackDemoEvent } from "@/lib/demo-store";
import {
  checkRateLimit,
  cleanPayload,
  cleanString,
  getClientKey,
  readJsonBody,
} from "@/lib/request-guard";

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(getClientKey(request, "track"), 80, 60_000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, message: "too_many_requests" },
      {
        headers: { "retry-after": String(rateLimit.retryAfter) },
        status: 429,
      },
    );
  }

  const parsed = await readJsonBody(request, 8_000);

  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, message: parsed.message },
      { status: parsed.status },
    );
  }

  const body = parsed.data as Record<string, unknown>;
  const eventName = cleanString(body.name, 80);

  if (!eventName) {
    return NextResponse.json(
      { ok: false, message: "missing_event_name" },
      { status: 400 },
    );
  }

  const event = await trackDemoEvent(eventName, cleanPayload(body.payload));

  return NextResponse.json({
    ok: true,
    event: event.name,
    receivedAt: event.createdAt,
  });
}
