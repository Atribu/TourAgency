import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { TourCard } from "@/components/TourCard";
import {
  allLandingPages,
  getLandingBySlug,
  getToursForLanding,
  legalPages,
} from "@/lib/catalog";
import { locales, siteConfig, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

type PageProps = {
  params: Promise<{ locale: string; pageSlug: string }>;
};

const isLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    allLandingPages.map((page) => ({
      locale,
      pageSlug: page.slugs[locale],
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, pageSlug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const page = getLandingBySlug(locale, pageSlug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.seoTitle?.[locale] ?? page.title[locale]} | TourAgency`,
    description: page.seoDescription?.[locale] ?? page.summary[locale],
    alternates: {
      canonical: `/${locale}/${page.slugs[locale]}`,
      languages: Object.fromEntries(
        locales.map((item) => [item, `/${item}/${page.slugs[item]}`]),
      ),
    },
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { locale, pageSlug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const page = getLandingBySlug(locale, pageSlug);

  if (!page) {
    notFound();
  }

  const copy = t(locale);
  const pageTours = getToursForLanding(page);
  const showLeadForm = page.kind === "lead" || page.id === "contact";

  return (
    <main className="bg-[var(--color-sand)]">
      <PageHero
        eyebrow={page.kind}
        image={page.image}
        summary={page.summary[locale]}
        title={page.title[locale]}
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <div className="grid gap-8">
          <article className="border border-black/10 bg-white p-5 shadow-sm">
            <div className="grid gap-4">
              {page.body[locale].map((paragraph) => (
                <p className="leading-8 text-[var(--color-muted)]" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            {page.kind === "legal" ? (
              <div className="mt-6 border border-black/10 bg-[var(--color-sand)] p-4 text-sm leading-7 text-[var(--color-muted)]">
                {copy.footer.notice}
              </div>
            ) : null}
          </article>

          {pageTours.length ? (
            <section>
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
            </section>
          ) : null}

          {showLeadForm ? <LeadForm locale={locale} /> : null}
        </div>

        <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
          <div className="border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">{copy.sections.trust}</h2>
            <div className="mt-4 grid gap-3 text-sm text-[var(--color-muted)]">
              <Info label="Jolly" value={siteConfig.defaultJollyUrl} />
              <Info label={copy.labels.phone} value={siteConfig.phoneDisplay} />
              <Info label="WhatsApp" value={siteConfig.whatsappDisplay} />
              <Info label="TÜRSAB" value={siteConfig.tursabCertificate} />
            </div>
          </div>

          <div className="border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">{copy.footer.legal}</h2>
            <div className="mt-4 grid gap-2 text-sm font-bold text-[var(--color-muted)]">
              {legalPages.slice(0, 5).map((legal) => (
                <a href={`/${locale}/${legal.slugs[locale]}`} key={legal.id}>
                  {legal.title[locale]}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black/10 bg-[var(--color-sand)] p-3">
      <p className="font-black text-[var(--color-ink)]">{label}</p>
      <p className="mt-1 break-words">{value}</p>
    </div>
  );
}
