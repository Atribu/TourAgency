import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import {
  getAllLandingPagesWithDemo,
  getToursForLandingWithDemo,
} from "@/lib/demo-store";
import { locales, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const isLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const copy = t(locale);

  return {
    title: `${copy.nav.campaigns} | TourAgency`,
    description: copy.sections.campaigns,
  };
}

export default async function CampaignsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = t(locale);
  const allCampaigns = (await getAllLandingPagesWithDemo()).filter(
    (page) => page.kind === "campaign",
  );
  const campaignCounts = await Promise.all(
    allCampaigns.map(async (campaign) => ({
      id: campaign.id,
      count: (await getToursForLandingWithDemo(campaign)).length,
    })),
  );

  return (
    <main className="bg-[var(--color-sand)]">
      <PageHero
        eyebrow={copy.nav.campaigns}
        summary={copy.footer.notice}
        title={copy.sections.campaigns}
      />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <SectionHeader
          title={copy.sections.campaigns}
          summary="Bayram, yaz, erken rezervasyon, sömestir ve hafta sonu dönemlerini ayrı SEO sayfalarıyla yöneteceğiz."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {allCampaigns.map((campaign) => (
            <Link
              className="grid gap-4 border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              href={`/${locale}/kampanyalar/${campaign.slugs[locale]}`}
              key={campaign.id}
            >
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-coral)]">
                {campaignCounts.find((item) => item.id === campaign.id)?.count ?? 0}{" "}
                {copy.nav.tours}
              </p>
              <h2 className="text-2xl font-black">{campaign.title[locale]}</h2>
              <p className="leading-7 text-[var(--color-muted)]">
                {campaign.summary[locale]}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
