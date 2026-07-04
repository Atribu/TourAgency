export const locales = ["tr", "en", "de", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeLabels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  de: "DE",
  ru: "RU",
};

export const siteConfig = {
  name: "book to tour",
  logoMark: "BT",
  tagline: "Tatilin sıcak tarafı",
  baseUrl: "https://www.booktotour.com",
  defaultJollyUrl: "https://www.jollytur.com/",
  phoneDisplay: "+90 850 000 00 00",
  phoneHref: "tel:+908500000000",
  whatsappDisplay: "+90 850 000 00 00",
  whatsappHref: "https://wa.me/908500000000",
  email: "info@booktotour.com",
  address: "İstanbul, Türkiye",
  tursabCertificate: "TÜRSAB belge alanı hazırlanıyor",
  agencyTitle: "book to tour Turizm",
};
