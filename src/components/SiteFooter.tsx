import Link from "next/link";
import { categories, campaigns, legalPages } from "@/lib/catalog";
import { siteConfig, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = t(locale);

  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center bg-[var(--color-ink)] text-sm font-black text-white">
              {siteConfig.logoMark}
            </span>
            <div>
              <p className="font-black text-[var(--color-ink)]">
                {siteConfig.name}
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                {siteConfig.tagline}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--color-muted)]">
            {copy.footer.notice}
          </p>
          <div className="mt-5 grid gap-2 text-sm text-[var(--color-muted)]">
            <span>{siteConfig.phoneDisplay}</span>
            <span>{siteConfig.email}</span>
            <span>{siteConfig.tursabCertificate}</span>
          </div>
        </div>

        <FooterColumn title={copy.nav.tours}>
          {categories.map((category) => (
            <Link href={`/${locale}/${category.slugs[locale]}`} key={category.id}>
              {category.title[locale]}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title={copy.nav.campaigns}>
          {campaigns.map((campaign) => (
            <Link
              href={`/${locale}/kampanyalar/${campaign.slugs[locale]}`}
              key={campaign.id}
            >
              {campaign.title[locale]}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title={copy.footer.legal}>
          {legalPages.slice(0, 6).map((page) => (
            <Link href={`/${locale}/${page.slugs[locale]}`} key={page.id}>
              {page.title[locale]}
            </Link>
          ))}
        </FooterColumn>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-coral)]">
        {title}
      </h2>
      <div className="mt-4 grid gap-2 text-sm text-[var(--color-muted)]">
        {children}
      </div>
    </div>
  );
}
