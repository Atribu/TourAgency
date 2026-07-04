import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { TourCard } from "@/components/TourCard";
import { campaigns, categories, destinations } from "@/lib/catalog";
import { getAllToursWithDemo } from "@/lib/demo-store";
import { locales, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

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
    title: `${copy.nav.tours} | book to tour`,
    description: `${copy.nav.tours} - ${copy.filters.category}, ${copy.filters.departure}, ${copy.filters.period} ve ${copy.filters.price} seçenekleriyle tur arayın.`,
    alternates: {
      canonical: `/${locale}/turlar`,
    },
  };
}

function paramValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function ToursPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const filters = (await searchParams) ?? {};

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = t(locale);
  const emptyMessage = {
    tr: "Seçili filtrelerle eşleşen tur bulunamadı. Filtreleri temizleyip tekrar deneyebilirsiniz.",
    en: "No tours match the selected filters. Clear the filters and try again.",
    de: "Keine Reisen passen zu den gewählten Filtern. Löschen Sie die Filter und versuchen Sie es erneut.",
    ru: "По выбранным фильтрам туры не найдены. Очистите фильтры и попробуйте снова.",
  }[locale];
  const allTours = await getAllToursWithDemo();
  const selectedCategory = paramValue(filters, "category");
  const selectedDestination = paramValue(filters, "destination");
  const selectedCampaign = paramValue(filters, "campaign");
  const selectedDeparture = paramValue(filters, "departure");
  const selectedTransport = paramValue(filters, "transport");
  const selectedVisa = paramValue(filters, "visa");
  const sort = paramValue(filters, "sort");
  const maxPrice = Number(paramValue(filters, "maxPrice") || 0);
  const maxDuration = Number(paramValue(filters, "maxDuration") || 0);
  const filteredTours = allTours
    .filter((tour) => {
      const matchesCategory =
        !selectedCategory || tour.categoryIds.includes(selectedCategory);
      const matchesDestination =
        !selectedDestination || tour.destinationIds.includes(selectedDestination);
      const matchesCampaign =
        !selectedCampaign || tour.campaignIds.includes(selectedCampaign);
      const matchesDeparture =
        !selectedDeparture ||
        tour.departures[locale].some((departure) => departure === selectedDeparture);
      const matchesTransport =
        !selectedTransport || tour.transport[locale] === selectedTransport;
      const matchesVisa = !selectedVisa || tour.visa[locale] === selectedVisa;
      const matchesPrice = !maxPrice || tour.priceFrom <= maxPrice;
      const matchesDuration = !maxDuration || tour.durationDays <= maxDuration;
      return (
        matchesCategory &&
        matchesDestination &&
        matchesCampaign &&
        matchesDeparture &&
        matchesTransport &&
        matchesVisa &&
        matchesPrice &&
        matchesDuration
      );
    })
    .sort((left, right) => {
      if (sort === "lowestPrice") return left.priceFrom - right.priceFrom;
      if (sort === "nearestDate") {
        return (left.dates[0]?.start ?? "").localeCompare(right.dates[0]?.start ?? "");
      }
      return Number(right.featured) - Number(left.featured);
    });
  const departures = Array.from(new Set(allTours.flatMap((tour) => tour.departures[locale]))).sort();
  const transports = Array.from(new Set(allTours.map((tour) => tour.transport[locale]))).sort();
  const visas = Array.from(new Set(allTours.map((tour) => tour.visa[locale]))).sort();

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
          <form className="mt-5 grid gap-3" method="get">
            <Select defaultValue={selectedCategory} label={copy.filters.category} name="category">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.title[locale]}</option>
              ))}
            </Select>
            <Select defaultValue={selectedDestination} label={copy.filters.destination} name="destination">
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>{destination.title[locale]}</option>
              ))}
            </Select>
            <Select defaultValue={selectedCampaign} label={copy.filters.period} name="campaign">
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>{campaign.title[locale]}</option>
              ))}
            </Select>
            <Select defaultValue={selectedDeparture} label={copy.filters.departure} name="departure">
              {departures.map((departure) => (
                <option key={departure} value={departure}>{departure}</option>
              ))}
            </Select>
            <Select defaultValue={selectedTransport} label={copy.filters.transport} name="transport">
              {transports.map((transport) => (
                <option key={transport} value={transport}>{transport}</option>
              ))}
            </Select>
            <Select defaultValue={selectedVisa} label={copy.filters.visa} name="visa">
              {visas.map((visa) => (
                <option key={visa} value={visa}>{visa}</option>
              ))}
            </Select>
            <label className="grid gap-2">
              <span className="text-sm font-black text-[var(--color-ink)]">{copy.filters.price}</span>
              <input className="field-input" defaultValue={maxPrice || ""} min="0" name="maxPrice" placeholder="Maksimum fiyat" type="number" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-black text-[var(--color-ink)]">{copy.filters.duration}</span>
              <input className="field-input" defaultValue={maxDuration || ""} min="0" name="maxDuration" placeholder="Maksimum gün" type="number" />
            </label>
            <Select defaultValue={sort} label={copy.filters.sort} name="sort">
              <option value="recommended">{copy.filters.recommended}</option>
              <option value="lowestPrice">{copy.filters.lowestPrice}</option>
              <option value="nearestDate">{copy.filters.nearestDate}</option>
            </Select>
            <button className="button-primary" type="submit">
              {copy.actions.search}
            </button>
            <Link className="button-secondary !border-black/15 !text-[var(--color-ink)]" href={`/${locale}/turlar`}>
              {copy.actions.reset}
            </Link>
          </form>
        </aside>

        <div>
          <SectionHeader
            eyebrow={copy.sections.featured}
            title={copy.nav.tours}
            summary={`${filteredTours.length}/${allTours.length} tur gösteriliyor. Filtreler fiyat, süre, kalkış, ulaşım, vize ve dönem alanlarına göre çalışır.`}
          />
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {filteredTours.length ? (
              filteredTours.map((tour) => (
                <TourCard key={tour.id} locale={locale} tour={tour} />
              ))
            ) : (
              <div className="border border-black/10 bg-white p-6 text-sm font-bold text-[var(--color-muted)] xl:col-span-2">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Select({
  defaultValue,
  label,
  name,
  children,
}: {
  defaultValue?: string;
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-[var(--color-ink)]">{label}</span>
      <select className="field-input" defaultValue={defaultValue ?? ""} name={name}>
        <option value="">
          {label}
        </option>
        {children}
      </select>
    </label>
  );
}
