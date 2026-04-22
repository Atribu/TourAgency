import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { TourCard } from "@/components/TourCard";
import {
  formatPrice,
  getTourBySlug,
  tours,
} from "@/lib/catalog";
import { locales, siteConfig, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const isLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    tours.map((tour) => ({ locale, slug: tour.slugs[locale] })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const tour = getTourBySlug(locale, slug);

  if (!tour) {
    return {};
  }

  return {
    title: `${tour.title[locale]} | TourAgency`,
    description: tour.summary[locale],
    alternates: {
      canonical: `/${locale}/turlar/${tour.slugs[locale]}`,
      languages: Object.fromEntries(
        locales.map((item) => [item, `/${item}/turlar/${tour.slugs[item]}`]),
      ),
    },
    openGraph: {
      title: tour.title[locale],
      description: tour.summary[locale],
      images: [tour.image],
      type: "article",
    },
  };
}

export default async function TourDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const tour = getTourBySlug(locale, slug);

  if (!tour) {
    notFound();
  }

  const copy = t(locale);
  const similarTours = tours
    .filter((item) => item.id !== tour.id)
    .filter((item) =>
      item.categoryIds.some((category) => tour.categoryIds.includes(category)),
    )
    .slice(0, 2);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title[locale],
    description: tour.summary[locale],
    image: tour.image,
    touristType: tour.tags[locale],
    offers: {
      "@type": "Offer",
      price: tour.priceFrom,
      priceCurrency: tour.currency,
      availability: "https://schema.org/InStock",
      url: tour.jollyUrl,
    },
    itinerary: tour.itinerary[locale].map((day) => ({
      "@type": "ItemList",
      name: `${day.day} - ${day.title}`,
      description: day.text,
    })),
    provider: {
      "@type": "Organization",
      name: "TourAgency",
      url: siteConfig.baseUrl,
    },
  };

  return (
    <main className="bg-[var(--color-sand)]">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <PageHero
        eyebrow={tour.tags[locale].join(" / ")}
        image={tour.image}
        summary={tour.summary[locale]}
        title={tour.title[locale]}
      />

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 py-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-5 lg:px-10">
          <Meta label={copy.labels.priceFrom} value={formatPrice(tour.priceFrom, tour.currency)} />
          <Meta label={copy.labels.duration} value={`${tour.durationDays} gün / ${tour.durationNights} gece`} />
          <Meta label={copy.labels.departure} value={tour.departures[locale].join(", ")} />
          <Meta label={copy.labels.transport} value={tour.transport[locale]} />
          <Meta label={copy.labels.visa} value={tour.visa[locale]} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_380px] lg:px-10">
        <div className="grid gap-8">
          <ContentPanel title={copy.sections.overview}>
            <p className="leading-8 text-[var(--color-muted)]">
              {tour.description[locale]}
            </p>
            <p className="mt-4 font-bold text-[var(--color-ink)]">
              {copy.labels.route}: {tour.route[locale]}
            </p>
          </ContentPanel>

          <ContentPanel title={copy.sections.itinerary}>
            <div className="grid gap-3">
              {tour.itinerary[locale].map((day) => (
                <div
                  className="grid gap-2 border border-black/10 bg-[var(--color-sand)] p-4"
                  key={`${day.day}-${day.title}`}
                >
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-coral)]">
                    {day.day}
                  </p>
                  <h3 className="text-xl font-black">{day.title}</h3>
                  <p className="leading-7 text-[var(--color-muted)]">
                    {day.text}
                  </p>
                </div>
              ))}
            </div>
          </ContentPanel>

          <ContentPanel title={copy.sections.dates}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-[var(--color-sand)]">
                    <th className="p-3">{copy.labels.date}</th>
                    <th className="p-3">{copy.labels.priceFrom}</th>
                    <th className="p-3">{copy.labels.availability}</th>
                    <th className="p-3">Jolly</th>
                    <th className="p-3">{copy.actions.request}</th>
                  </tr>
                </thead>
                <tbody>
                  {tour.dates.map((date) => (
                    <tr className="border-b border-black/10" key={date.start}>
                      <td className="p-3 font-bold">
                        {date.start} / {date.end}
                      </td>
                      <td className="p-3">
                        {formatPrice(date.price, date.currency)}
                      </td>
                      <td className="p-3">{date.availability[locale]}</td>
                      <td className="p-3">
                        <a
                          className="font-black text-[var(--color-coral)]"
                          href={date.jollyUrl ?? tour.jollyUrl}
                          rel="noopener noreferrer sponsored"
                          target="_blank"
                        >
                          {copy.actions.jolly}
                        </a>
                      </td>
                      <td className="p-3">
                        <Link
                          className="font-black text-[var(--color-teal)]"
                          href={`/${locale}/${getLeadSlug(locale)}`}
                        >
                          {copy.actions.request}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ContentPanel>

          <div className="grid gap-6 lg:grid-cols-2">
            <ListPanel items={tour.included[locale]} title={copy.sections.included} />
            <ListPanel items={tour.excluded[locale]} title={copy.sections.excluded} />
          </div>

          <ListPanel items={tour.notes[locale]} title={copy.sections.notes} />

          <ContentPanel title={copy.sections.faq}>
            <div className="grid gap-3">
              {tour.faqs[locale].map((item) => (
                <details className="border border-black/10 bg-white p-4" key={item.question}>
                  <summary className="cursor-pointer font-black">
                    {item.question}
                  </summary>
                  <p className="mt-3 leading-7 text-[var(--color-muted)]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </ContentPanel>
        </div>

        <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
          <div className="border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-coral)]">
              {copy.labels.priceFrom}
            </p>
            <p className="mt-2 text-3xl font-black">
              {formatPrice(tour.priceFrom, tour.currency)}
            </p>
            <div className="mt-5 grid gap-3">
              <Link className="button-primary" href={`/${locale}/${getLeadSlug(locale)}`}>
                {copy.actions.request}
              </Link>
              <a className="button-secondary !border-black/15 !text-[var(--color-ink)]" href={siteConfig.whatsappHref}>
                {copy.actions.whatsapp}
              </a>
              <a className="button-secondary !border-black/15 !text-[var(--color-ink)]" href={tour.jollyUrl} rel="noopener noreferrer sponsored" target="_blank">
                {copy.actions.jolly}
              </a>
            </div>
          </div>
          <LeadForm locale={locale} tourTitle={tour.title[locale]} />
        </aside>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <SectionHeader title={copy.sections.similar} />
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {similarTours.map((item) => (
              <TourCard key={item.id} locale={locale} tour={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black/10 bg-[var(--color-sand)] p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-1 font-black text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

function ContentPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-black/10 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <ContentPanel title={title}>
      <ul className="grid gap-2">
        {items.map((item) => (
          <li className="border border-black/10 bg-[var(--color-sand)] p-3" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </ContentPanel>
  );
}

function getLeadSlug(locale: Locale) {
  return {
    tr: "on-talep",
    en: "request",
    de: "anfrage",
    ru: "zayavka",
  }[locale];
}
