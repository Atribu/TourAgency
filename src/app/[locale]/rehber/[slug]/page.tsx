import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { blogPosts, getBlogBySlug } from "@/lib/catalog";
import { locales, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const isLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    blogPosts.map((post) => ({ locale, slug: post.slugs[locale] })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const post = getBlogBySlug(locale, slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title[locale]} | TourAgency`,
    description: post.summary[locale],
    openGraph: {
      title: post.title[locale],
      description: post.summary[locale],
      images: [post.image],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const post = getBlogBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  const copy = t(locale);

  return (
    <main className="bg-[var(--color-sand)]">
      <PageHero
        eyebrow={copy.nav.guide}
        image={post.image}
        summary={post.summary[locale]}
        title={post.title[locale]}
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_380px] lg:px-10">
        <article className="border border-black/10 bg-white p-6 shadow-sm">
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
          <div className="mt-6 grid gap-5">
            {post.body[locale].map((paragraph) => (
              <p className="text-lg leading-8 text-[var(--color-muted)]" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </article>
        <aside className="h-fit lg:sticky lg:top-24">
          <LeadForm locale={locale} />
        </aside>
      </section>
    </main>
  );
}
