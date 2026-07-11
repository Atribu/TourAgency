import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { PageViewTracker } from "@/components/PageViewTracker";
import { SectionHeader } from "@/components/SectionHeader";
import { TourCard } from "@/components/TourCard";
import { TrackedOutboundLink } from "@/components/TrackedOutboundLink";
import { formatPrice, tours } from "@/lib/catalog";
import {
  getAllToursWithDemo,
  getTourBySlugWithDemo,
  readDemoStore,
} from "@/lib/demo-store";
import { locales, siteConfig, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";
import { trackingEvents } from "@/lib/tracking";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const isLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export const dynamic = "force-dynamic";

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

  const tour = await getTourBySlugWithDemo(locale, slug);

  if (!tour) {
    return {};
  }

  return {
    title: `${tour.title[locale]} | book to tour`,
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

  const tour = await getTourBySlugWithDemo(locale, slug);

  if (!tour) {
    notFound();
  }

  const copy = t(locale);
  const [allTours, store] = await Promise.all([
    getAllToursWithDemo(),
    readDemoStore(),
  ]);
  const settings = store.settings;
  const detailCopy = getDetailCopy(locale);
  const gallery = (tour.gallery?.length ? tour.gallery : [tour.image]).slice(0, 4);
  const salesBadges =
    tour.salesBadges?.[locale] ?? detailCopy.salesBadges;
  const highlights = tour.highlights?.[locale] ?? detailCopy.highlights;
  const pickupPoints = tour.pickupPoints?.[locale] ?? detailCopy.pickupPoints;
  const cancellationPolicy =
    tour.cancellationPolicy?.[locale] ?? detailCopy.cancellationPolicy;
  const nearestDate = tour.dates[0];
  const similarTours = allTours
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
      name: settings.siteName || "book to tour",
      url: siteConfig.baseUrl,
    },
  };

  return (
    <main className="bg-[var(--color-sand)]">
      <PageViewTracker
        eventName={trackingEvents.tourView}
        payload={{
          locale,
          tourId: tour.id,
          tourTitle: tour.title[locale],
        }}
      />
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

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 py-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
          {salesBadges.map((item) => (
            <SalesPoint eyebrow={detailCopy.assurance} key={item} label={item} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_380px] lg:px-10">
        <div className="grid gap-8">
          <section className="grid gap-3 sm:grid-cols-2">
            {gallery.map((image, index) => (
              <div
                className={index === 0 ? "relative min-h-72 overflow-hidden border border-black/10 sm:col-span-2" : "relative min-h-48 overflow-hidden border border-black/10"}
                key={`${image}-${index}`}
              >
                <Image
                  alt={`${tour.title[locale]} ${index + 1}`}
                  className="object-cover"
                  fill
                  priority={index === 0}
                  sizes={index === 0 ? "(min-width: 1024px) 760px, 100vw" : "(min-width: 1024px) 380px, 100vw"}
                  src={image}
                  unoptimized
                />
              </div>
            ))}
          </section>

          <ContentPanel title={copy.sections.overview}>
            <p className="leading-8 text-[var(--color-muted)]">
              {tour.description[locale]}
            </p>
            <p className="mt-4 font-bold text-[var(--color-ink)]">
              {copy.labels.route}: {tour.route[locale]}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div className="border border-black/10 bg-[var(--color-sand)] p-3 text-sm font-bold" key={item}>
                  {item}
                </div>
              ))}
            </div>
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
            <div className="grid gap-3">
              {tour.dates.map((date) => (
                <div
                  className="grid gap-3 border border-black/10 bg-[var(--color-sand)] p-4 md:grid-cols-[1fr_auto_auto]"
                  key={date.start}
                >
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-muted)]">
                      {copy.labels.date}
                    </p>
                    <p className="mt-1 font-black">{date.start} / {date.end}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {date.availability[locale]}
                    </p>
                  </div>
                  <div className="md:text-right">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-muted)]">
                      {copy.labels.priceFrom}
                    </p>
                    <p className="mt-1 font-black">
                      {formatPrice(date.price, date.currency)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <TrackedOutboundLink
                      className="button-secondary !min-h-10 !border-black/15 !px-3 !text-[var(--color-ink)]"
                      eventName={trackingEvents.jollyClick}
                      href={date.jollyUrl ?? tour.jollyUrl}
                      payload={{
                        dateStart: date.start,
                        locale,
                        source: "date_card",
                        tourId: tour.id,
                        tourTitle: tour.title[locale],
                      }}
                      rel="noopener noreferrer sponsored"
                      target="_blank"
                    >
                      {copy.actions.jolly}
                    </TrackedOutboundLink>
                    <Link
                      className="button-primary !min-h-10 !px-3"
                      href={`/${locale}/${getLeadSlug(locale)}`}
                    >
                      {copy.actions.request}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </ContentPanel>

          <ContentPanel title={detailCopy.pickupTitle}>
            <div className="grid gap-2 sm:grid-cols-2">
              {pickupPoints.map((item) => (
                <div className="border border-black/10 bg-[var(--color-sand)] p-3 text-sm font-bold" key={item}>
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-4 border border-black/10 bg-white p-4 text-sm leading-6 text-[var(--color-muted)]">
              {cancellationPolicy}
            </p>
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
            {nearestDate ? (
              <div className="mt-4 border border-black/10 bg-[var(--color-sand)] p-3 text-sm">
                <p className="font-black">{detailCopy.nearestDate}</p>
                <p className="mt-1 text-[var(--color-muted)]">
                  {nearestDate.start} / {nearestDate.end}
                </p>
                <p className="mt-1 font-bold text-[var(--color-coral)]">
                  {nearestDate.availability[locale]}
                </p>
              </div>
            ) : null}
            <div className="mt-5 grid gap-3">
              <Link className="button-primary" href={`/${locale}/${getLeadSlug(locale)}`}>
                {copy.actions.request}
              </Link>
              <TrackedOutboundLink
                className="button-secondary !border-black/15 !text-[var(--color-ink)]"
                eventName={trackingEvents.whatsappClick}
                href={getWhatsappHref(settings.whatsapp)}
                payload={{
                  locale,
                  source: "booking_panel",
                  tourId: tour.id,
                  tourTitle: tour.title[locale],
                }}
              >
                {copy.actions.whatsapp}
              </TrackedOutboundLink>
              <TrackedOutboundLink
                className="button-secondary !border-black/15 !text-[var(--color-ink)]"
                eventName={trackingEvents.jollyClick}
                href={tour.jollyUrl}
                payload={{
                  locale,
                  source: "booking_panel",
                  tourId: tour.id,
                  tourTitle: tour.title[locale],
                }}
                rel="noopener noreferrer sponsored"
                target="_blank"
              >
                {copy.actions.jolly}
              </TrackedOutboundLink>
            </div>
          </div>
          <LeadForm
            currency={tour.currency}
            locale={locale}
            priceFrom={tour.priceFrom}
            tourDates={tour.dates.map((date) => ({
              availability: date.availability[locale],
              currency: date.currency,
              end: date.end,
              price: date.price,
              start: date.start,
            }))}
            tourTitle={tour.title[locale]}
          />
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

function SalesPoint({ eyebrow, label }: { eyebrow: string; label: string }) {
  return (
    <div className="border border-black/10 bg-[var(--color-sand)] p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-coral)]">
        {eyebrow}
      </p>
      <p className="mt-1 text-sm font-black text-[var(--color-ink)]">{label}</p>
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

function getWhatsappHref(value?: string) {
  const digits = value?.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : siteConfig.whatsappHref;
}

function getDetailCopy(locale: Locale) {
  return {
    tr: {
      assurance: "Güven",
      cancellationPolicy:
        "İptal, değişiklik ve kesin ödeme koşulları Jolly / satış danışmanı sürecinde teyit edilir.",
      highlights: [
        "Tarih ve kontenjan takibi",
        "WhatsApp hızlı teklif",
        "Net dahil / hariç anlatımı",
      ],
      nearestDate: "En yakın hareket",
      pickupPoints: [
        "Hareket noktaları danışmanla netleşir",
        "Ek kalkış seçenekleri talebe göre kontrol edilir",
      ],
      pickupTitle: "Hareket Noktaları ve Güvence",
      salesBadges: [
        "Jolly ödeme yönlendirmesi",
        "Danışman destekli rezervasyon",
        "Güvenli ön talep",
        "4 dilde iletişim",
      ],
    },
    en: {
      assurance: "Trust",
      cancellationPolicy:
        "Cancellation, change and final payment terms are confirmed during the Jolly / consultant process.",
      highlights: [
        "Date and availability follow-up",
        "Fast WhatsApp quote",
        "Clear included / excluded details",
      ],
      nearestDate: "Nearest departure",
      pickupPoints: [
        "Pickup points are confirmed with the consultant",
        "Extra departure options are checked on request",
      ],
      pickupTitle: "Pickup Points and Assurance",
      salesBadges: [
        "Jolly payment redirection",
        "Consultant-assisted booking",
        "Secure request flow",
        "4-language communication",
      ],
    },
    de: {
      assurance: "Vertrauen",
      cancellationPolicy:
        "Storno-, Änderungs- und Zahlungsbedingungen werden im Jolly-/Beratungsprozess bestätigt.",
      highlights: [
        "Termin- und Verfügbarkeitsprüfung",
        "Schnelles WhatsApp-Angebot",
        "Klare Inklusiv-/Exklusivleistungen",
      ],
      nearestDate: "Nächste Abfahrt",
      pickupPoints: [
        "Abfahrtsorte werden mit der Beratung bestätigt",
        "Weitere Optionen werden auf Anfrage geprüft",
      ],
      pickupTitle: "Abfahrtsorte und Sicherheit",
      salesBadges: [
        "Jolly-Zahlungsweiterleitung",
        "Buchung mit Beratung",
        "Sichere Anfrage",
        "Kommunikation in 4 Sprachen",
      ],
    },
    ru: {
      assurance: "Гарантия",
      cancellationPolicy:
        "Условия отмены, изменений и финальной оплаты подтверждаются через Jolly / консультанта.",
      highlights: [
        "Контроль дат и мест",
        "Быстрое предложение в WhatsApp",
        "Понятно включено / не включено",
      ],
      nearestDate: "Ближайший выезд",
      pickupPoints: [
        "Места отправления подтверждаются консультантом",
        "Дополнительные варианты проверяются по запросу",
      ],
      pickupTitle: "Места отправления и гарантии",
      salesBadges: [
        "Оплата через Jolly",
        "Бронирование с консультантом",
        "Безопасная заявка",
        "Связь на 4 языках",
      ],
    },
  }[locale];
}
