import Link from "next/link";
import { categories, infoPages } from "@/lib/catalog";
import { localeLabels, locales, siteConfig, type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const domestic = categories.find((category) => category.id === "domestic");
  const international = categories.find(
    (category) => category.id === "international",
  );
  const visaFree = categories.find((category) => category.id === "visa-free");
  const about = infoPages.find((page) => page.id === "about");
  const contact = infoPages.find((page) => page.id === "contact");

  const navItems = [
    { href: `/${locale}`, label: copy.nav.home },
    { href: `/${locale}/turlar`, label: copy.nav.tours },
    {
      href: `/${locale}/${domestic?.slugs[locale] ?? "yurt-ici-turlari"}`,
      label: copy.nav.domestic,
    },
    {
      href: `/${locale}/${international?.slugs[locale] ?? "yurt-disi-turlari"}`,
      label: copy.nav.abroad,
    },
    {
      href: `/${locale}/${visaFree?.slugs[locale] ?? "vizesiz-turlar"}`,
      label: copy.nav.visaFree,
    },
    { href: `/${locale}/kampanyalar`, label: copy.nav.campaigns },
    { href: `/${locale}/rehber`, label: copy.nav.guide },
    {
      href: `/${locale}/${about?.slugs[locale] ?? "hakkimizda"}`,
      label: copy.nav.about,
    },
    {
      href: `/${locale}/${contact?.slugs[locale] ?? "iletisim"}`,
      label: copy.nav.contact,
    },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-[rgba(13,31,37,0.9)] text-white backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link className="flex shrink-0 items-center gap-3" href={`/${locale}`}>
          <span className="grid size-11 place-items-center border border-white/30 bg-white text-sm font-black text-[var(--color-ink)]">
            {siteConfig.logoMark}
          </span>
          <span>
            <span className="block text-base font-black leading-5">
              {siteConfig.name}
            </span>
            <span className="block text-xs text-white/70">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-semibold xl:flex">
          {navItems.map((item) => (
            <Link
              className="text-white/76 transition hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden border border-white/20 p-1 sm:flex">
            {locales.map((item) => (
              <Link
                className={`px-2 py-1 text-xs font-black ${
                  item === locale
                    ? "bg-white text-[var(--color-ink)]"
                    : "text-white/72"
                }`}
                href={`/${item}`}
                key={item}
              >
                {localeLabels[item]}
              </Link>
            ))}
          </div>
          <a className="button-header" href={siteConfig.whatsappHref}>
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
