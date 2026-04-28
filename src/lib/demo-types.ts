import type { Locale } from "./site";
import type { Tour } from "./catalog";

export type DemoLeadStatus =
  | "Yeni"
  | "Arandı"
  | "Ulaşılamadı"
  | "Teklif verildi"
  | "Takipte"
  | "Satışa döndü"
  | "İptal / olumsuz";

export type DemoLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  travelers: string;
  preferredDate: string;
  note: string;
  locale: Locale;
  tourTitle: string | null;
  sourcePath: string;
  kvkk: boolean;
  marketing: boolean;
  jollyNotice: boolean;
  status: DemoLeadStatus;
  createdAt: string;
  updatedAt: string;
};

export type DemoTour = {
  id: string;
  slugs: Record<Locale, string>;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  image: string;
  categoryIds: string[];
  campaignIds: string[];
  destinationIds: string[];
  priceFrom: number;
  currency: Tour["currency"];
  durationDays: number;
  durationNights: number;
  departures: Record<Locale, string[]>;
  transport: Record<Locale, string>;
  visa: Record<Locale, string>;
  route: Record<Locale, string>;
  tags: Record<Locale, string[]>;
  featured: boolean;
  active: boolean;
  jollyUrl: string;
  dates: DemoTourDate[];
  createdAt: string;
  updatedAt: string;
};

export type DemoTourDate = {
  id: string;
  start: string;
  end: string;
  price: number;
  currency: Tour["currency"];
  availability: Record<Locale, string>;
  jollyUrl: string;
};

export type DemoManagedPageKind =
  | "category"
  | "campaign"
  | "destination"
  | "info"
  | "legal"
  | "blog";

export type DemoManagedPage = {
  id: string;
  kind: DemoManagedPageKind;
  slugs: Record<Locale, string>;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DemoContactStatus = "Yeni" | "Yanıtlandı" | "Takipte" | "Kapandı";

export type DemoContactRequest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  locale: Locale;
  status: DemoContactStatus;
  createdAt: string;
  updatedAt: string;
};

export type DemoUserRole = "Yönetici" | "Satış danışmanı" | "İçerik editörü";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: DemoUserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DemoEvent = {
  id: string;
  name: string;
  payload: Record<string, string | number | boolean | null>;
  createdAt: string;
};

export type DemoSettings = {
  siteName: string;
  logoMark: string;
  phone: string;
  whatsapp: string;
  email: string;
  jollyUrl: string;
  tursabCertificate: string;
};

export type DemoStore = {
  version: 1;
  settings: DemoSettings;
  leads: DemoLead[];
  tours: DemoTour[];
  managedPages: DemoManagedPage[];
  contacts: DemoContactRequest[];
  users: DemoUser[];
  events: DemoEvent[];
};
