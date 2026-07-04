import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createDemoTour, getAllToursWithDemo } from "@/lib/demo-store";
import type { Tour } from "@/lib/catalog";

const currencies: Tour["currency"][] = ["TRY", "EUR", "USD"];

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { ok: false, message: "unauthorized" },
      { status: 401 },
    );
  }

  const tours = await getAllToursWithDemo();
  return NextResponse.json({ ok: true, tours });
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { ok: false, message: "unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);

  if (!body?.title || !body?.slug || !body?.categoryId) {
    return NextResponse.json(
      { ok: false, message: "missing_required_fields" },
      { status: 400 },
    );
  }

  const currency = currencies.includes(body.currency) ? body.currency : "TRY";
  const priceFrom = Number(body.priceFrom);

  if (!Number.isFinite(priceFrom) || priceFrom <= 0) {
    return NextResponse.json(
      { ok: false, message: "invalid_price" },
      { status: 400 },
    );
  }

  const tour = await createDemoTour({
    categoryId: String(body.categoryId),
    currency,
    departures: String(body.departures ?? ""),
    durationDays: Number(body.durationDays ?? 4),
    durationNights: Number(body.durationNights ?? 3),
    featured: body.featured === undefined ? true : Boolean(body.featured),
    image: String(body.image ?? ""),
    jollyUrl: String(body.jollyUrl ?? ""),
    priceFrom,
    route: String(body.route ?? ""),
    slug: String(body.slug),
    summary: String(body.summary ?? ""),
    tags: String(body.tags ?? ""),
    title: String(body.title),
    transport: String(body.transport ?? ""),
    visa: String(body.visa ?? ""),
  });

  return NextResponse.json({ ok: true, tour });
}
