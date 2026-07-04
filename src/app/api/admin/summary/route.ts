import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getAllToursWithDemo, readDemoStore } from "@/lib/demo-store";
import { allLandingPages, campaigns, categories } from "@/lib/catalog";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { ok: false, message: "unauthorized" },
      { status: 401 },
    );
  }

  const [store, tours] = await Promise.all([readDemoStore(), getAllToursWithDemo()]);
  const soldLeads = store.leads.filter(
    (lead) => lead.status === "Satışa döndü",
  ).length;

  return NextResponse.json({
    ok: true,
    summary: {
      activeTours: tours.length,
      categories: categories.length,
      campaigns: campaigns.length,
      leads: store.leads.length,
      soldLeads,
      pages: allLandingPages.length,
      events: store.events.length,
    },
  });
}
