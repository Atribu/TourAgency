import { NextResponse } from "next/server";
import { getDatabaseStatus } from "@/lib/database";
import { readDemoStore } from "@/lib/demo-store";

export async function GET() {
  const [database, store] = await Promise.all([
    getDatabaseStatus(),
    readDemoStore(),
  ]);

  return NextResponse.json({
    ok: true,
    service: "book to tour",
    checkedAt: new Date().toISOString(),
    dataSource: {
      configured: database.configured,
      label: database.label,
      mode: database.mode,
    },
    counts: {
      contacts: store.contacts.length,
      events: store.events.length,
      leads: store.leads.length,
      managedPages: store.managedPages.length,
      tours: store.tours.length,
      users: store.users.length,
    },
  });
}
