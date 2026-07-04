import { NextResponse } from "next/server";
import { createDemoLead } from "@/lib/demo-store";
import {
  checkRateLimit,
  cleanString,
  getClientKey,
  isLikelyPhone,
  readJsonBody,
} from "@/lib/request-guard";
import { locales, type Locale } from "@/lib/site";

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(getClientKey(request, "lead"), 8, 60_000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, message: "too_many_requests" },
      {
        headers: { "retry-after": String(rateLimit.retryAfter) },
        status: 429,
      },
    );
  }

  const parsed = await readJsonBody(request);

  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, message: parsed.message },
      { status: parsed.status },
    );
  }

  const body = parsed.data as Record<string, unknown>;
  const localeValue = cleanString(body.locale, 8);
  const locale = locales.includes(localeValue as Locale)
    ? (localeValue as Locale)
    : "tr";
  const name = cleanString(body.name, 120);
  const phone = cleanString(body.phone, 60);

  if (!name || !isLikelyPhone(phone) || body.kvkk !== true) {
    return NextResponse.json(
      { ok: false, message: "missing_required_fields" },
      { status: 400 },
    );
  }

  const lead = await createDemoLead({
    channel: cleanString(body.channel, 40) || "Form",
    email: cleanString(body.email, 160),
    internalNote: cleanString(body.internalNote, 360),
    jollyNotice: body.jollyNotice === true,
    kvkk: true,
    locale,
    marketing: body.marketing === true,
    name,
    note: cleanString(body.note, 1_200),
    phone,
    preferredDate: cleanString(body.preferredDate, 120),
    sourcePath: cleanString(body.sourcePath, 320),
    tourTitle: cleanString(body.tourTitle, 180) || null,
    travelers: cleanString(body.travelers, 120),
  });

  return NextResponse.json({
    ok: true,
    id: lead.id,
    lead,
    receivedAt: lead.createdAt,
  });
}
