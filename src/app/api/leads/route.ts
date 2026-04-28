import { NextResponse } from "next/server";
import { createDemoLead } from "@/lib/demo-store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.phone || body?.kvkk !== true) {
    return NextResponse.json(
      { ok: false, message: "missing_required_fields" },
      { status: 400 },
    );
  }

  const lead = await createDemoLead(body);

  return NextResponse.json({
    ok: true,
    id: lead.id,
    lead,
    receivedAt: lead.createdAt,
  });
}
