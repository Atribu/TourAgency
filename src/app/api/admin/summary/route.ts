import { NextResponse } from "next/server";
import { getAllToursWithDemo, readDemoStore } from "@/lib/demo-store";
import { allLandingPages, campaigns, categories } from "@/lib/catalog";

export async function GET() {
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
