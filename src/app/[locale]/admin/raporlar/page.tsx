import type { Metadata } from "next";
import AdminPanel from "../_components/AdminPanel";
import { locales } from "@/lib/site";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Raporlar | book to tour Admin",
    description: "Performans, event, lead kanal ve Jolly tıklama raporları.",
  };
}

export default function AdminReportsPage({ params, searchParams }: PageProps) {
  return <AdminPanel params={params} searchParams={searchParams} section="reports" />;
}
