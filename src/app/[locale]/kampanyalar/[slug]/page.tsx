import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { TourCard } from "@/components/TourCard";
import { campaigns } from "@/lib/catalog";
import {
  getLandingBySlugWithDemo,
  getToursForLandingWithDemo,
} from "@/lib/demo-store";
import { locales, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const isLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    campaigns.map((campaign) => ({ locale, slug: campaign.slugs[locale] })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const page = await getLandingBySlugWithDemo(locale, slug);

  if (!page || page.kind !== "campaign") {
    return {};
  }

  return {
    title: `${page.title[locale]} | TourAgency`,
    description: page.summary[locale],
  };
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const page = await getLandingBySlugWithDemo(locale, slug);

  if (!page || page.kind !== "campaign") {
    notFound();
  }

  const copy = t(locale);
  const pageTours = await getToursForLandingWithDemo(page);

  return (
    <main className="bg-[var(--color-sand)]">
      <PageHero
        eyebrow={copy.nav.campaigns}
        image={page.image}
        summary={page.summary[locale]}
        title={page.title[locale]}
      />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-4 border border-black/10 bg-white p-5 shadow-sm">
          {page.body[locale].map((paragraph) => (
            <p className="leading-8 text-[var(--color-muted)]" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-10">
          <SectionHeader
            eyebrow={copy.nav.tours}
            title={page.title[locale]}
            summary={page.summary[locale]}
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {pageTours.map((tour) => (
              <TourCard key={tour.id} locale={locale} tour={tour} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
