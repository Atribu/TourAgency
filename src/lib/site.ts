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
  name: "TourAgency",
  logoMark: "TA",
  tagline: "Tatilin sıcak tarafı",
  baseUrl: "https://example.com",
  defaultJollyUrl: "https://www.jollytur.com/",
  phoneDisplay: "+90 555 000 00 00",
  phoneHref: "tel:+905550000000",
  whatsappDisplay: "+90 555 000 00 00",
  whatsappHref: "https://wa.me/905550000000",
  email: "info@example.com",
  address: "Acenta adresi sonradan eklenecek",
  tursabCertificate: "TÜRSAB belge bilgisi sonradan eklenecek",
  agencyTitle: "Acenta unvanı sonradan eklenecek",
};
