import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { SectionHeader } from "@/components/SectionHeader";
import { TourCard } from "@/components/TourCard";
import {
  blogPosts,
  campaigns,
  categories,
  destinations,
  tours,
} from "@/lib/catalog";
import { homeContent } from "@/lib/home-content";
import { localeLabels, locales, siteConfig, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
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

  const content = homeContent[locale];

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((item) => [item, `/${item}`])),
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      type: "website",
    },
  };
}

export default async function LocaleHome({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const content = homeContent[locale];
  const copy = t(locale);
  const featuredTours = tours.filter((tour) => tour.featured).slice(0, 4);

  return (
    <main className="min-h-screen bg-[var(--color-sand)] text-[var(--color-ink)]">
      <section className="relative overflow-hidden border-b border-black/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(13, 31, 37, 0.88) 0%, rgba(13, 31, 37, 0.62) 46%, rgba(13, 31, 37, 0.18) 100%), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80')",
          }}
        />
        <div className="relative mx-auto grid min-h-[700px] w-full max-w-7xl items-end gap-10 px-5 pb-10 pt-28 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-36">
          <div className="max-w-3xl pb-2 text-white">
            <div className="mb-6 inline-flex border border-white/35 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur">
              {content.hero.eyebrow}
            </div>
            <h1 className="text-balance text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
              {content.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86">
              {content.hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary" href={`/${locale}/turlar`}>
                {content.hero.primary}
              </Link>
              <Link
                className="button-secondary"
                href={`/${locale}/${getLeadSlug(locale)}`}
              >
                {content.hero.secondary}
              </Link>
            </div>
          </div>

          <div className="border border-white/25 bg-white p-4 shadow-2xl shadow-black/20 sm:p-5">
            <div className="grid gap-3">
              <label className="field-label" htmlFor="destination">
                {content.hero.searchPlaceholder}
              </label>
              <input
                className="field-input"
                id="destination"
                placeholder={content.hero.destinationExamples}
                type="text"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <select className="field-input" defaultValue="">
                  <option value="" disabled>
                    {content.hero.departure}
                  </option>
                  {content.hero.departureOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <select className="field-input" defaultValue="">
                  <option value="" disabled>
                    {content.hero.tourType}
                  </option>
                  {content.hero.tourTypeOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <select className="field-input" defaultValue="">
                  <option value="" disabled>
                    {content.hero.period}
                  </option>
                  {content.hero.periodOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <Link className="button-primary w-full" href={`/${locale}/turlar`}>
                {content.hero.search}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 py-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
          {Object.values(content.trust).map((item) => (
            <div
              className="border border-black/10 bg-[var(--color-sand)] px-4 py-4 text-sm font-semibold text-[var(--color-ink)]"
              key={item}
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <SectionHeader
          eyebrow={copy.sections.categories}
          title={copy.sections.categories}
          summary={content.meta.description}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 4).map((category) => (
            <Link
              className="group border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              href={`/${locale}/${category.slugs[locale]}`}
              key={category.id}
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-coral)]">
                {localeLabels[locale]}
              </p>
              <h3 className="mt-3 text-2xl font-black">
                {category.title[locale]}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                {category.summary[locale]}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <SectionHeader
            eyebrow={copy.sections.featured}
            title={copy.sections.featured}
            summary={content.hero.description}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} locale={locale} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <SectionHeader
          eyebrow={copy.sections.campaigns}
          title={copy.sections.campaigns}
          summary={copy.footer.notice}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {campaigns.map((campaign) => (
            <Link
              className="border border-black/10 bg-white p-4 shadow-sm"
              href={`/${locale}/kampanyalar/${campaign.slugs[locale]}`}
              key={campaign.id}
            >
              <h3 className="text-lg font-black">{campaign.title[locale]}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {campaign.summary[locale]}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-ink)] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
              {copy.sections.trust}
            </p>
            <h2 className="mt-3 text-3xl font-black">
              {siteConfig.name} satış akışı
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.planning.items.map((item) => (
              <div
                className="border border-white/15 bg-white/[0.06] p-4"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <SectionHeader
            eyebrow={copy.sections.guide}
            title={copy.sections.guide}
            summary={content.lead.description}
          />
          <div className="mt-8 grid gap-3">
            {destinations.slice(0, 4).map((destination) => (
              <Link
                className="border border-black/10 bg-white p-4 font-bold text-[var(--color-ink)]"
                href={`/${locale}/${destination.slugs[locale]}`}
                key={destination.id}
              >
                {destination.title[locale]}
              </Link>
            ))}
            {blogPosts.slice(0, 2).map((post) => (
              <Link
                className="border border-black/10 bg-white p-4 font-bold text-[var(--color-ink)]"
                href={`/${locale}/rehber/${post.slugs[locale]}`}
                key={post.id}
              >
                {post.title[locale]}
              </Link>
            ))}
          </div>
        </div>
        <LeadForm locale={locale} />
      </section>
    </main>
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
