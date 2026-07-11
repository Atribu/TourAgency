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
  formatPrice,
} from "@/lib/catalog";
import { getAllToursWithDemo, readDemoStore } from "@/lib/demo-store";
import { homeContent } from "@/lib/home-content";
import { localeLabels, locales, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
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
  const growthCopy = getHomeGrowthCopy(locale);
  const [allTours, store] = await Promise.all([
    getAllToursWithDemo(),
    readDemoStore(),
  ]);
  const featuredTours = allTours.filter((tour) => tour.featured).slice(0, 4);
  const bestValueTours = [...allTours]
    .sort((left, right) => left.priceFrom - right.priceFrom)
    .slice(0, 3);
  const visaFreeTours = allTours
    .filter((tour) => tour.categoryIds.includes("visa-free"))
    .slice(0, 3);

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
          eyebrow={growthCopy.seasonEyebrow}
          title={growthCopy.seasonTitle}
          summary={growthCopy.seasonSummary}
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {bestValueTours.map((tour) => (
            <Link
              className="group border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              href={`/${locale}/turlar/${tour.slugs[locale]}`}
              key={tour.id}
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-coral)]">
                {growthCopy.bestValue}
              </p>
              <h3 className="mt-3 text-2xl font-black">{tour.title[locale]}</h3>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">
                {tour.summary[locale]}
              </p>
              <p className="mt-4 text-lg font-black text-[var(--color-ink)]">
                {formatPrice(tour.priceFrom, tour.currency)}
              </p>
            </Link>
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

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <SectionHeader
              eyebrow={growthCopy.visaEyebrow}
              title={growthCopy.visaTitle}
              summary={growthCopy.visaSummary}
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {campaigns.slice(0, 5).map((campaign) => (
                <Link
                  className="border border-black/10 bg-[var(--color-sand)] px-3 py-2 text-sm font-black"
                  href={`/${locale}/kampanyalar/${campaign.slugs[locale]}`}
                  key={campaign.id}
                >
                  {campaign.title[locale]}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            {visaFreeTours.map((tour) => (
              <Link
                className="grid gap-3 border border-black/10 bg-[var(--color-sand)] p-4 sm:grid-cols-[1fr_auto]"
                href={`/${locale}/turlar/${tour.slugs[locale]}`}
                key={tour.id}
              >
                <div>
                  <h3 className="font-black">{tour.title[locale]}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                    {tour.route[locale]}
                  </p>
                </div>
                <strong className="text-[var(--color-coral)]">
                  {formatPrice(tour.priceFrom, tour.currency)}
                </strong>
              </Link>
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
              {store.settings.siteName} satış akışı
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

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <SectionHeader
            eyebrow={growthCopy.proofEyebrow}
            title={growthCopy.proofTitle}
            summary={growthCopy.proofSummary}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {growthCopy.proofs.map((item) => (
              <div className="border border-black/10 bg-[var(--color-sand)] p-5" key={item.title}>
                <p className="text-2xl font-black text-[var(--color-coral)]">
                  {item.value}
                </p>
                <h3 className="mt-3 font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  {item.text}
                </p>
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

function getHomeGrowthCopy(locale: Locale) {
  return {
    tr: {
      bestValue: "Fiyat avantajı",
      proofEyebrow: "Satış Güveni",
      proofSummary:
        "Ön talep, danışman görüşmesi ve Jolly ödeme yönlendirmesiyle süreç anlaşılır kalır.",
      proofTitle: "Karar vermeyi kolaylaştıran açık süreç",
      proofs: [
        {
          text: "Tur, tarih ve kontenjan soruları satış danışmanı tarafından netleştirilir.",
          title: "Danışman destekli akış",
          value: "1:1",
        },
        {
          text: "TR, EN, DE ve RU içerik mimarisiyle farklı pazarlara hazır yapı.",
          title: "Çok dilli satış",
          value: "4 dil",
        },
        {
          text: "Ödeme adımı Jolly yönlendirmesiyle ilerleyecek şekilde konumlandı.",
          title: "Güvenli ödeme yolu",
          value: "Jolly",
        },
      ],
      seasonEyebrow: "Sezon Fırsatları",
      seasonSummary:
        "Fiyat avantajı, rota netliği ve hızlı teklif potansiyeli yüksek turları öne çıkarıyoruz.",
      seasonTitle: "Bugün incelenmesi gereken turlar",
      visaEyebrow: "Hızlı Karar",
      visaSummary:
        "Vizesiz ve kampanyalı rotalar, ön talep sonrası hızlı teklif süreci için güçlü giriş noktasıdır.",
      visaTitle: "Vizesiz ve kampanyalı rota akışı",
    },
    en: {
      bestValue: "Best value",
      proofEyebrow: "Sales Trust",
      proofSummary:
        "The process stays clear with request, consultant follow-up and Jolly payment redirection.",
      proofTitle: "A clear process that helps guests decide",
      proofs: [
        {
          text: "Tour, date and availability questions are clarified by a consultant.",
          title: "Consultant-led flow",
          value: "1:1",
        },
        {
          text: "TR, EN, DE and RU content architecture is ready for multiple markets.",
          title: "Multilingual sales",
          value: "4 langs",
        },
        {
          text: "The payment step is positioned to continue through Jolly redirection.",
          title: "Trusted payment route",
          value: "Jolly",
        },
      ],
      seasonEyebrow: "Season Picks",
      seasonSummary:
        "Tours with strong price, clear routing and fast quote potential are highlighted.",
      seasonTitle: "Tours worth checking today",
      visaEyebrow: "Fast Decision",
      visaSummary:
        "Visa-free and campaign routes are strong entry points for a quick quote flow.",
      visaTitle: "Visa-free and campaign route flow",
    },
    de: {
      bestValue: "Preisvorteil",
      proofEyebrow: "Vertrauen",
      proofSummary:
        "Anfrage, Beratung und Jolly-Zahlungsweiterleitung halten den Ablauf klar.",
      proofTitle: "Ein klarer Ablauf für schnellere Entscheidungen",
      proofs: [
        {
          text: "Fragen zu Reise, Termin und Verfügbarkeit werden durch Beratung geklärt.",
          title: "Beratungsflow",
          value: "1:1",
        },
        {
          text: "TR, EN, DE und RU Inhalte sind für mehrere Märkte vorbereitet.",
          title: "Mehrsprachiger Verkauf",
          value: "4 Sp.",
        },
        {
          text: "Der Zahlungsschritt ist für die Weiterleitung zu Jolly positioniert.",
          title: "Sicherer Zahlungsweg",
          value: "Jolly",
        },
      ],
      seasonEyebrow: "Saisonangebote",
      seasonSummary:
        "Reisen mit Preisvorteil, klarer Route und schnellem Angebot werden hervorgehoben.",
      seasonTitle: "Reisen, die heute interessant sind",
      visaEyebrow: "Schnelle Entscheidung",
      visaSummary:
        "Visafreie und Aktionsrouten sind starke Einstiegspunkte für schnelle Angebote.",
      visaTitle: "Visafreie und Aktionsrouten",
    },
    ru: {
      bestValue: "Выгодная цена",
      proofEyebrow: "Доверие",
      proofSummary:
        "Заявка, связь с консультантом и оплата через Jolly делают процесс понятным.",
      proofTitle: "Понятный процесс для быстрого решения",
      proofs: [
        {
          text: "Вопросы по туру, датам и местам уточняются консультантом.",
          title: "Поддержка консультанта",
          value: "1:1",
        },
        {
          text: "Структура контента TR, EN, DE и RU готова для разных рынков.",
          title: "Продажи на языках",
          value: "4 языка",
        },
        {
          text: "Этап оплаты настроен как переход к инфраструктуре Jolly.",
          title: "Надежный путь оплаты",
          value: "Jolly",
        },
      ],
      seasonEyebrow: "Сезонные варианты",
      seasonSummary:
        "Выделяем туры с сильной ценой, понятным маршрутом и быстрым предложением.",
      seasonTitle: "Туры, которые стоит посмотреть сегодня",
      visaEyebrow: "Быстрый выбор",
      visaSummary:
        "Безвизовые и акционные маршруты хорошо подходят для быстрого предложения.",
      visaTitle: "Безвизовые и акционные маршруты",
    },
  }[locale];
}
