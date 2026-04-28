import { NextResponse } from "next/server";
import { createDemoTour, getAllToursWithDemo } from "@/lib/demo-store";
import type { Tour } from "@/lib/catalog";

const currencies: Tour["currency"][] = ["TRY", "EUR", "USD"];

export async function GET() {
  const tours = await getAllToursWithDemo();
  return NextResponse.json({ ok: true, tours });
}

export async function POST(request: Request) {
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
    jollyUrl: String(body.jollyUrl ?? ""),
    priceFrom,
    slug: String(body.slug),
    summary: String(body.summary ?? ""),
    title: String(body.title),
  });

  return NextResponse.json({ ok: true, tour });
}
