import { NextResponse } from "next/server";
import { readDemoStore, updateDemoLeadStatus } from "@/lib/demo-store";
import type { DemoLeadStatus } from "@/lib/demo-types";

const statuses: DemoLeadStatus[] = [
  "Yeni",
  "Arandı",
  "Ulaşılamadı",
  "Teklif verildi",
  "Takipte",
  "Satışa döndü",
  "İptal / olumsuz",
];

export async function GET() {
  const store = await readDemoStore();
  return NextResponse.json({ ok: true, leads: store.leads });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.id || !statuses.includes(body.status)) {
    return NextResponse.json(
      { ok: false, message: "invalid_lead_update" },
      { status: 400 },
    );
  }

  const lead = await updateDemoLeadStatus(String(body.id), body.status);

  if (!lead) {
    return NextResponse.json(
      { ok: false, message: "lead_not_found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, lead });
}
