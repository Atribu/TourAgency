import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { TourCard } from "@/components/TourCard";
import { campaigns, categories, destinations, tours } from "@/lib/catalog";
import { locales, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const isLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

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
    title: `${copy.nav.tours} | TourAgency`,
    description: `${copy.nav.tours} - ${copy.filters.category}, ${copy.filters.departure}, ${copy.filters.period} ve ${copy.filters.price} seçenekleriyle tur arayın.`,
    alternates: {
      canonical: `/${locale}/turlar`,
    },
  };
}

export default async function ToursPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = t(locale);

  return (
    <main className="bg-[var(--color-sand)]">
      <PageHero
        eyebrow={copy.nav.tours}
        summary={`${copy.filters.category}, ${copy.filters.departure}, ${copy.filters.period}, ${copy.filters.transport} ve ${copy.filters.price} alanlarıyla doğru turu hızlıca bulun.`}
        title={copy.nav.tours}
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[320px_1fr] lg:px-10">
        <aside className="h-fit border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">{copy.filters.title}</h2>
          <div className="mt-5 grid gap-3">
            <Select label={copy.filters.category}>
              {categories.map((category) => (
                <option key={category.id}>{category.title[locale]}</option>
              ))}
            </Select>
            <Select label={copy.filters.destination}>
              {destinations.map((destination) => (
                <option key={destination.id}>{destination.title[locale]}</option>
              ))}
            </Select>
            <Select label={copy.filters.period}>
              {campaigns.map((campaign) => (
                <option key={campaign.id}>{campaign.title[locale]}</option>
              ))}
            </Select>
            <Select label={copy.filters.departure}>
              <option>İstanbul</option>
              <option>Ankara</option>
              <option>İzmir</option>
            </Select>
            <Select label={copy.filters.transport}>
              <option>{tours[0].transport[locale]}</option>
              <option>{tours[2].transport[locale]}</option>
              <option>{tours[3].transport[locale]}</option>
            </Select>
            <Select label={copy.filters.sort}>
              <option>{copy.filters.recommended}</option>
              <option>{copy.filters.lowestPrice}</option>
              <option>{copy.filters.nearestDate}</option>
            </Select>
            <button className="button-primary" type="button">
              {copy.actions.search}
            </button>
            <button className="button-secondary !border-black/15 !text-[var(--color-ink)]" type="button">
              {copy.actions.reset}
            </button>
          </div>
        </aside>

        <div>
          <SectionHeader
            eyebrow={copy.sections.featured}
            title={copy.nav.tours}
            summary={`${tours.length} tur kartı, çok dilli veri modeli ve Jolly/ön talep aksiyonlarıyla hazırlandı.`}
          />
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {tours.map((tour) => (
              <TourCard key={tour.id} locale={locale} tour={tour} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Select({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-[var(--color-ink)]">{label}</span>
      <select className="field-input" defaultValue="">
        <option value="" disabled>
          {label}
        </option>
        {children}
      </select>
    </label>
  );
}
