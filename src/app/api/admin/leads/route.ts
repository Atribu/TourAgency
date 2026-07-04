import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
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
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { ok: false, message: "unauthorized" },
      { status: 401 },
    );
  }

  const store = await readDemoStore();
  return NextResponse.json({ ok: true, leads: store.leads });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { ok: false, message: "unauthorized" },
      { status: 401 },
    );
  }

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
