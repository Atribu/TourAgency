import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { blogPosts } from "@/lib/catalog";
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
    title: `${copy.nav.guide} | TourAgency`,
    description: copy.sections.guide,
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = t(locale);

  return (
    <main className="bg-[var(--color-sand)]">
      <PageHero
        eyebrow={copy.nav.guide}
        summary="Vizesiz rotalar, bayram planlaması, destinasyon dönemleri ve tur seçimi için rehber içerikleri."
        title={copy.sections.guide}
      />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <SectionHeader title={copy.sections.guide} />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              className="overflow-hidden border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              href={`/${locale}/rehber/${post.slugs[locale]}`}
              key={post.id}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  alt={post.title[locale]}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  src={post.image}
                  unoptimized
                />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {post.tags[locale].map((tag) => (
                    <span
                      className="bg-[var(--color-sand)] px-2 py-1 text-xs font-black text-[var(--color-coral)]"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="mt-4 text-2xl font-black">
                  {post.title[locale]}
                </h2>
                <p className="mt-3 leading-7 text-[var(--color-muted)]">
                  {post.summary[locale]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
