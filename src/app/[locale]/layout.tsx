import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CookieConsent } from "@/components/CookieConsent";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { readDemoStore } from "@/lib/demo-store";
import { locales, type Locale } from "@/lib/site";
import "../globals.css";

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export const metadata: Metadata = {
  title: "TourAgency",
  description: "Çok dilli tur satış ve ön talep platformu.",
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const store = await readDemoStore();

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full">
        <SiteHeader locale={locale as Locale} settings={store.settings} />
        {children}
        <SiteFooter locale={locale as Locale} settings={store.settings} />
        <CookieConsent locale={locale as Locale} />
      </body>
    </html>
  );
}
