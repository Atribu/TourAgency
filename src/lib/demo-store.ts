import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  allLandingPages,
  getLandingBySlug,
  getTourBySlug,
  tours,
  type LandingPage,
  type Tour,
} from "./catalog";
import {
  type DemoContactRequest,
  type DemoContactStatus,
  type DemoEvent,
  type DemoFaqItem,
  type DemoItineraryItem,
  type DemoLead,
  type DemoLeadStatus,
  type DemoLeadTimelineEntry,
  type DemoManagedPage,
  type DemoManagedPageKind,
  type DemoStore,
  type DemoTour,
  type DemoTourDate,
  type DemoUser,
  type DemoUserRole,
} from "./demo-types";
import { locales, siteConfig, type Locale } from "./site";

type LocalizedStringInput = string | Partial<Record<Locale, string>>;
type LocalizedListInput = string | Partial<Record<Locale, string>>;

const storeDir = path.join(process.cwd(), ".demo-data");
const storeFile = path.join(storeDir, "touragency-store.json");

const now = () => new Date().toISOString();

const seededLeads: DemoLead[] = [
  {
    id: "lead_demo_ayse",
    name: "Ayşe Demir",
    phone: "+90 555 111 22 33",
    email: "ayse.demir@booktotour.demo",
    travelers: "2",
    preferredDate: "2026-07",
    note: "2 kişi, Temmuz ilk haftası, İstanbul çıkışlı.",
    locale: "tr",
    tourTitle: "Karadeniz Rüyası Turu",
    sourcePath: "/tr/turlar/karadeniz-ruyasi-turu",
    kvkk: true,
    marketing: false,
    jollyNotice: true,
    channel: "Telefon",
    owner: "Satış danışmanı",
    lastContactAt: "",
    nextFollowUpAt: "2026-07-04",
    internalNote: "İlk arama öncelikli.",
    timeline: [
      {
        id: "timeline_demo_ayse_1",
        type: "not",
        text: "Talep web formu üzerinden geldi.",
        owner: "Sistem",
        createdAt: "2026-04-22T09:00:00.000Z",
      },
    ],
    status: "Yeni",
    createdAt: "2026-04-22T09:00:00.000Z",
    updatedAt: "2026-04-22T09:00:00.000Z",
  },
  {
    id: "lead_demo_murat",
    name: "Murat Kaya",
    phone: "+90 555 333 44 55",
    email: "murat.kaya@booktotour.demo",
    travelers: "4",
    preferredDate: "Kurban Bayramı",
    note: "Bayram dönemi için aile kontenjanı soruyor.",
    locale: "tr",
    tourTitle: "Vizesiz Balkan Turu",
    sourcePath: "utm_source=instagram&utm_campaign=bayram",
    kvkk: true,
    marketing: true,
    jollyNotice: true,
    channel: "WhatsApp",
    owner: "Satış danışmanı",
    lastContactAt: "2026-04-22",
    nextFollowUpAt: "2026-07-05",
    internalNote: "Aile kontenjanı ve çocuk fiyatı kontrol edilecek.",
    timeline: [
      {
        id: "timeline_demo_murat_1",
        type: "durum",
        text: "Teklif verildi durumuna alındı.",
        owner: "Satış danışmanı",
        createdAt: "2026-04-22T09:20:00.000Z",
      },
    ],
    status: "Teklif verildi",
    createdAt: "2026-04-22T09:15:00.000Z",
    updatedAt: "2026-04-22T09:20:00.000Z",
  },
  {
    id: "lead_demo_elena",
    name: "Elena Petrova",
    phone: "+7 900 000 00 00",
    email: "elena.petrova@booktotour.demo",
    travelers: "2",
    preferredDate: "August",
    note: "Rusça dönüş istedi, WhatsApp uygun.",
    locale: "ru",
    tourTitle: "Dubai & Abu Dabi Turu",
    sourcePath: "/ru/tury-v-dubai",
    kvkk: true,
    marketing: true,
    jollyNotice: true,
    channel: "WhatsApp",
    owner: "Satış danışmanı",
    lastContactAt: "2026-04-22",
    nextFollowUpAt: "2026-07-04",
    internalNote: "Rusça dönüş yapılacak.",
    timeline: [
      {
        id: "timeline_demo_elena_1",
        type: "whatsapp",
        text: "WhatsApp üzerinden Rusça dönüş planlandı.",
        owner: "Satış danışmanı",
        createdAt: "2026-04-22T10:10:00.000Z",
      },
    ],
    status: "Takipte",
    createdAt: "2026-04-22T10:00:00.000Z",
    updatedAt: "2026-04-22T10:10:00.000Z",
  },
];

const seededContacts: DemoContactRequest[] = [
  {
    id: "contact_demo_1",
    name: "Deniz Arslan",
    phone: "+90 555 222 33 44",
    email: "deniz.arslan@booktotour.demo",
    subject: "Genel tur danışmanlığı",
    message: "Ailem için yaz döneminde kısa yurt dışı turu önerisi istiyorum.",
    locale: "tr",
    status: "Yeni",
    createdAt: "2026-04-22T10:30:00.000Z",
    updatedAt: "2026-04-22T10:30:00.000Z",
  },
];

const seededUsers: DemoUser[] = [
  {
    id: "user_demo_admin",
    name: "Admin Kullanıcı",
    email: "admin@booktotour.demo",
    role: "Yönetici",
    active: true,
    createdAt: "2026-04-22T08:00:00.000Z",
    updatedAt: "2026-04-22T08:00:00.000Z",
  },
  {
    id: "user_demo_sales",
    name: "Satış Danışmanı",
    email: "sales@booktotour.demo",
    role: "Satış danışmanı",
    active: true,
    createdAt: "2026-04-22T08:05:00.000Z",
    updatedAt: "2026-04-22T08:05:00.000Z",
  },
];

function createEmptyStore(): DemoStore {
  return {
    version: 1,
    settings: {
      siteName: siteConfig.name,
      logoMark: siteConfig.logoMark,
      phone: siteConfig.phoneDisplay,
      whatsapp: siteConfig.whatsappDisplay,
      email: siteConfig.email,
      jollyUrl: siteConfig.defaultJollyUrl,
      tursabCertificate: siteConfig.tursabCertificate,
    },
    leads: seededLeads,
    tours: [],
    managedPages: [],
    contacts: seededContacts,
    users: seededUsers,
    events: [],
  };
}

export async function readDemoStore(): Promise<DemoStore> {
  await mkdir(storeDir, { recursive: true });

  try {
    const raw = await readFile(storeFile, "utf8");
    const store = normalizeStore(JSON.parse(raw) as Partial<DemoStore>);
    await writeDemoStore(store);
    return store;
  } catch {
    const store = createEmptyStore();
    await writeDemoStore(store);
    return store;
  }
}

function normalizeStore(store: Partial<DemoStore>): DemoStore {
  const empty = createEmptyStore();

  return {
    version: 1,
    settings: {
      ...empty.settings,
      ...(store.settings ?? {}),
    },
    leads: (store.leads ?? empty.leads).map((lead) => ({
      ...lead,
      channel: lead.channel ?? "Telefon",
      owner: lead.owner ?? "Satış danışmanı",
      lastContactAt: lead.lastContactAt ?? "",
      nextFollowUpAt: lead.nextFollowUpAt ?? "",
      internalNote: lead.internalNote ?? "",
      timeline:
        lead.timeline ??
        [
          {
            id: randomUUID(),
            type: "not",
            text: "Talep demo store'a aktarıldı.",
            owner: "Sistem",
            createdAt: lead.createdAt ?? now(),
          },
        ],
    })),
    tours: (store.tours ?? []).map((tour) => ({
      ...tour,
      description: tour.description ?? tour.summary,
      gallery: tour.gallery?.length ? tour.gallery : defaultGallery(tour.image),
      salesBadges:
        tour.salesBadges ??
        localizedList(undefined, ["Jolly ödeme yönlendirmesi", "Danışman destekli rezervasyon"]),
      highlights:
        tour.highlights ??
        localizedList(undefined, ["Net rota anlatımı", "Tarih ve kontenjan takibi", "WhatsApp destek"]),
      pickupPoints:
        tour.pickupPoints ??
        localizedList(undefined, ["İstanbul merkez hareket", "Ek hareket noktaları danışmanla netleşir"]),
      cancellationPolicy:
        tour.cancellationPolicy ??
        localizedText(
          undefined,
          "İptal, değişiklik ve kesin ödeme koşulları Jolly / satış danışmanı sürecinde teyit edilir.",
        ),
      itinerary: tour.itinerary ?? defaultItinerary(),
      included: tour.included ?? localizedList(undefined, ["Danışmanlık", "Jolly yönlendirme"]),
      excluded: tour.excluded ?? localizedList(undefined, ["Kişisel harcamalar"]),
      notes:
        tour.notes ??
        localizedList(undefined, ["Fiyat ve kontenjan satış danışmanı tarafından teyit edilir."]),
      faqs: tour.faqs ?? defaultFaqs(),
      dates:
        tour.dates?.length
          ? tour.dates
          : [
              {
                id: randomUUID(),
                start: "2026-06-01",
                end: "2026-06-04",
                price: tour.priceFrom,
                currency: tour.currency,
                availability: {
                  tr: "Demo kontenjan",
                  en: "Demo availability",
                  de: "Demo-Verfügbarkeit",
                  ru: "Демо наличие",
                },
                jollyUrl: tour.jollyUrl,
              },
            ],
    })),
    managedPages: (store.managedPages ?? empty.managedPages).map((page) => ({
      ...page,
      seoTitle: page.seoTitle ?? page.title,
      seoDescription: page.seoDescription ?? page.summary,
      canonical:
        page.canonical ??
        ({
          tr: "",
          en: "",
          de: "",
          ru: "",
        } satisfies Record<Locale, string>),
      ogImage: page.ogImage ?? "",
      keywords: page.keywords ?? [],
      noIndex: Boolean(page.noIndex),
    })),
    contacts: store.contacts ?? empty.contacts,
    users: store.users ?? empty.users,
    events: store.events ?? empty.events,
  };
}

export async function writeDemoStore(store: DemoStore) {
  await mkdir(storeDir, { recursive: true });
  await writeFile(storeFile, JSON.stringify(store, null, 2));
}

export async function createDemoLead(
  payload: Partial<Omit<DemoLead, "id" | "status" | "createdAt" | "updatedAt">>,
) {
  const store = await readDemoStore();
  const timestamp = now();
  const lead: DemoLead = {
    id: randomUUID(),
    name: String(payload.name ?? ""),
    phone: String(payload.phone ?? ""),
    email: String(payload.email ?? ""),
    travelers: String(payload.travelers ?? ""),
    preferredDate: String(payload.preferredDate ?? ""),
    note: String(payload.note ?? ""),
    locale: (payload.locale ?? "tr") as Locale,
    tourTitle: payload.tourTitle ?? null,
    sourcePath: String(payload.sourcePath ?? ""),
    kvkk: Boolean(payload.kvkk),
    marketing: Boolean(payload.marketing),
    jollyNotice: Boolean(payload.jollyNotice),
    channel: String(payload.channel ?? "Telefon"),
    owner: String(payload.owner ?? "Satış danışmanı"),
    lastContactAt: String(payload.lastContactAt ?? ""),
    nextFollowUpAt: String(payload.nextFollowUpAt ?? ""),
    internalNote: String(payload.internalNote ?? ""),
    timeline: [
      {
        id: randomUUID(),
        type: "not",
        text: "Yeni talep oluşturuldu.",
        owner: "Sistem",
        createdAt: timestamp,
      },
    ],
    status: "Yeni",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.leads.unshift(lead);
  await writeDemoStore(store);
  return lead;
}

export async function updateDemoLeadStatus(
  id: string,
  status: DemoLeadStatus,
) {
  const store = await readDemoStore();
  const lead = store.leads.find((item) => item.id === id);

  if (!lead) {
    return null;
  }

  if (lead.status !== status) {
    lead.timeline = [
      {
        id: randomUUID(),
        type: "durum",
        text: `${lead.status} durumundan ${status} durumuna alındı.`,
        owner: lead.owner || "Satış danışmanı",
        createdAt: now(),
      },
      ...(lead.timeline ?? []),
    ];
  }
  lead.status = status;
  lead.updatedAt = now();
  await writeDemoStore(store);
  return lead;
}

export async function updateDemoLead(input: {
  id: string;
  name: string;
  phone: string;
  email: string;
  travelers: string;
  preferredDate: string;
  note: string;
  channel: string;
  owner: string;
  lastContactAt: string;
  nextFollowUpAt: string;
  internalNote: string;
  status: DemoLeadStatus;
}) {
  const store = await readDemoStore();
  const lead = store.leads.find((item) => item.id === input.id);

  if (!lead) {
    return null;
  }

  const previousStatus = lead.status;
  Object.assign(lead, {
    name: input.name,
    phone: input.phone,
    email: input.email,
    travelers: input.travelers,
    preferredDate: input.preferredDate,
    note: input.note,
    channel: input.channel,
    owner: input.owner,
    lastContactAt: input.lastContactAt,
    nextFollowUpAt: input.nextFollowUpAt,
    internalNote: input.internalNote,
    status: input.status,
    updatedAt: now(),
  });

  if (previousStatus !== input.status) {
    lead.timeline = [
      {
        id: randomUUID(),
        type: "durum",
        text: `${previousStatus} durumundan ${input.status} durumuna alındı.`,
        owner: input.owner || "Satış danışmanı",
        createdAt: now(),
      },
      ...(lead.timeline ?? []),
    ];
  }
  await writeDemoStore(store);
  return lead;
}

export async function addDemoLeadTimeline(input: {
  id: string;
  owner: string;
  text: string;
  type: DemoLeadTimelineEntry["type"];
}) {
  const store = await readDemoStore();
  const lead = store.leads.find((item) => item.id === input.id);

  if (!lead || !input.text.trim()) {
    return null;
  }

  lead.timeline = [
    {
      id: randomUUID(),
      type: input.type,
      text: input.text.trim(),
      owner: input.owner.trim() || lead.owner || "Satış danışmanı",
      createdAt: now(),
    },
    ...(lead.timeline ?? []),
  ];
  lead.updatedAt = now();
  await writeDemoStore(store);
  return lead;
}

export async function deleteDemoLead(id: string) {
  const store = await readDemoStore();
  const initialLength = store.leads.length;
  store.leads = store.leads.filter((lead) => lead.id !== id);
  await writeDemoStore(store);
  return store.leads.length !== initialLength;
}

export async function createDemoTour(input: {
  title: LocalizedStringInput;
  slug: LocalizedStringInput;
  summary?: LocalizedStringInput;
  description?: LocalizedStringInput;
  image?: string;
  priceFrom: number;
  currency: Tour["currency"];
  categoryId: string;
  durationDays?: number;
  durationNights?: number;
  departures?: LocalizedStringInput;
  transport?: LocalizedStringInput;
  visa?: LocalizedStringInput;
  route?: LocalizedStringInput;
  tags?: LocalizedStringInput;
  itinerary?: LocalizedListInput;
  included?: LocalizedListInput;
  excluded?: LocalizedListInput;
  notes?: LocalizedListInput;
  faqs?: LocalizedListInput;
  gallery?: string;
  salesBadges?: LocalizedListInput;
  highlights?: LocalizedListInput;
  pickupPoints?: LocalizedListInput;
  cancellationPolicy?: LocalizedStringInput;
  featured?: boolean;
  jollyUrl?: string;
}) {
  const store = await readDemoStore();
  const timestamp = now();
  const title = localizedText(input.title, "Yeni tur");
  const summary = localizedText(
    input.summary,
    "Admin panelden eklenen tur. Detay içerikleri yönetim panelinden zenginleştirilebilir.",
  );

  const tour: DemoTour = {
    id: randomUUID(),
    slugs: localizedSlugs(input.slug, title),
    title,
    summary,
    description: localizedText(input.description, summary),
    image:
      input.image?.trim() ||
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    gallery: splitMediaList(input.gallery).length
      ? splitMediaList(input.gallery)
      : defaultGallery(input.image),
    categoryIds: [input.categoryId],
    campaignIds: ["early-booking"],
    destinationIds: [],
    priceFrom: input.priceFrom,
    currency: input.currency,
    durationDays: input.durationDays || 4,
    durationNights: input.durationNights || 3,
    departures: localizedList(input.departures, ["İstanbul"]),
    transport: localizedText(input.transport, "Uçak / Otobüs"),
    visa: localizedText(input.visa, "Tur koşullarına göre"),
    route: localizedText(input.route, "Rota bilgisi satış danışmanı tarafından netleştirilir."),
    tags: localizedList(input.tags, ["Yeni", "Öne çıkan"]),
    salesBadges: localizedList(input.salesBadges, [
      "Jolly ödeme yönlendirmesi",
      "Danışman destekli rezervasyon",
      "Güvenli ön talep",
    ]),
    highlights: localizedList(input.highlights, [
      "Tarih ve kontenjan takibi",
      "Net dahil / hariç bilgisi",
      "WhatsApp hızlı teklif",
    ]),
    pickupPoints: localizedList(input.pickupPoints, [
      "İstanbul merkez hareket",
      "Ek hareket noktaları danışmanla netleşir",
    ]),
    cancellationPolicy: localizedText(
      input.cancellationPolicy,
      "İptal, değişiklik ve kesin ödeme koşulları Jolly / satış danışmanı sürecinde teyit edilir.",
    ),
    itinerary: localizedItinerary(input.itinerary, defaultItinerary()),
    included: localizedList(input.included, ["Danışmanlık", "Jolly yönlendirme", "Ön talep takibi"]),
    excluded: localizedList(input.excluded, ["Kişisel harcamalar", "Ekstra hizmetler"]),
    notes: localizedList(input.notes, ["Fiyat ve kontenjan satış danışmanı tarafından teyit edilir."]),
    faqs: localizedFaqs(input.faqs, defaultFaqs()),
    featured: input.featured ?? true,
    active: true,
    jollyUrl: input.jollyUrl || siteConfig.defaultJollyUrl,
    dates: [
      {
        id: randomUUID(),
        start: "2026-06-01",
        end: "2026-06-04",
        price: input.priceFrom,
        currency: input.currency,
        availability: {
          tr: "Demo kontenjan",
          en: "Demo availability",
          de: "Demo-Verfügbarkeit",
          ru: "Демо наличие",
        },
        jollyUrl: input.jollyUrl || siteConfig.defaultJollyUrl,
      },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.tours.unshift(tour);
  await writeDemoStore(store);
  return demoTourToTour(tour);
}

export async function updateDemoTour(input: {
  id: string;
  title: LocalizedStringInput;
  slug: LocalizedStringInput;
  summary: LocalizedStringInput;
  description: LocalizedStringInput;
  image: string;
  priceFrom: number;
  currency: Tour["currency"];
  categoryId: string;
  durationDays: number;
  durationNights: number;
  departures: LocalizedStringInput;
  transport: LocalizedStringInput;
  visa: LocalizedStringInput;
  route: LocalizedStringInput;
  tags: LocalizedStringInput;
  itinerary: LocalizedListInput;
  included: LocalizedListInput;
  excluded: LocalizedListInput;
  notes: LocalizedListInput;
  faqs: LocalizedListInput;
  gallery: string;
  salesBadges: LocalizedListInput;
  highlights: LocalizedListInput;
  pickupPoints: LocalizedListInput;
  cancellationPolicy: LocalizedStringInput;
  featured: boolean;
  jollyUrl: string;
  active: boolean;
}) {
  const store = await readDemoStore();
  const tour = store.tours.find((item) => item.id === input.id);

  if (!tour) {
    return null;
  }

  tour.title = localizedText(input.title, tour.title);
  tour.slugs = localizedSlugs(input.slug, tour.title);
  tour.summary = localizedText(input.summary, tour.summary);
  tour.description = localizedText(input.description, tour.description ?? tour.summary);
  tour.image = input.image || tour.image;
  tour.gallery = splitMediaList(input.gallery).length
    ? splitMediaList(input.gallery)
    : defaultGallery(tour.image);
  tour.priceFrom = input.priceFrom;
  tour.currency = input.currency;
  tour.categoryIds = [input.categoryId];
  tour.durationDays = input.durationDays || tour.durationDays;
  tour.durationNights = input.durationNights || tour.durationNights;
  tour.departures = localizedList(input.departures, tour.departures.tr);
  tour.transport = localizedText(input.transport, tour.transport.tr);
  tour.visa = localizedText(input.visa, tour.visa.tr);
  tour.route = localizedText(input.route, tour.route.tr);
  tour.tags = localizedList(input.tags, tour.tags.tr);
  tour.salesBadges = localizedList(input.salesBadges, tour.salesBadges ?? []);
  tour.highlights = localizedList(input.highlights, tour.highlights ?? []);
  tour.pickupPoints = localizedList(input.pickupPoints, tour.pickupPoints ?? []);
  tour.cancellationPolicy = localizedText(
    input.cancellationPolicy,
    tour.cancellationPolicy ??
      "İptal, değişiklik ve kesin ödeme koşulları Jolly / satış danışmanı sürecinde teyit edilir.",
  );
  tour.itinerary = localizedItinerary(input.itinerary, tour.itinerary ?? defaultItinerary());
  tour.included = localizedList(input.included, tour.included ?? ["Danışmanlık"]);
  tour.excluded = localizedList(input.excluded, tour.excluded ?? ["Kişisel harcamalar"]);
  tour.notes = localizedList(input.notes, tour.notes ?? []);
  tour.faqs = localizedFaqs(input.faqs, tour.faqs ?? defaultFaqs());
  tour.featured = input.featured;
  tour.jollyUrl = input.jollyUrl || siteConfig.defaultJollyUrl;
  tour.active = input.active;
  tour.updatedAt = now();
  if (tour.dates[0]) {
    tour.dates[0].price = input.priceFrom;
    tour.dates[0].currency = input.currency;
    tour.dates[0].jollyUrl = tour.jollyUrl;
  }

  await writeDemoStore(store);
  return demoTourToTour(tour);
}

export async function deleteDemoTour(id: string) {
  const store = await readDemoStore();
  const initialLength = store.tours.length;
  store.tours = store.tours.filter((tour) => tour.id !== id);
  await writeDemoStore(store);
  return store.tours.length !== initialLength;
}

export async function createDemoTourDate(input: {
  tourId: string;
  start: string;
  end: string;
  price: number;
  currency: Tour["currency"];
  availability: LocalizedStringInput;
  jollyUrl: string;
}) {
  const store = await readDemoStore();
  const tour = store.tours.find((item) => item.id === input.tourId);

  if (!tour) {
    return null;
  }

  const date: DemoTourDate = {
    id: randomUUID(),
    start: input.start,
    end: input.end,
    price: input.price,
    currency: input.currency,
    availability: localizedText(input.availability, "Sınırlı kontenjan"),
    jollyUrl: input.jollyUrl || tour.jollyUrl,
  };

  tour.dates.push(date);
  tour.updatedAt = now();
  await writeDemoStore(store);
  return date;
}

export async function updateDemoTourDate(input: {
  tourId: string;
  dateId: string;
  start: string;
  end: string;
  price: number;
  currency: Tour["currency"];
  availability: LocalizedStringInput;
  jollyUrl: string;
}) {
  const store = await readDemoStore();
  const tour = store.tours.find((item) => item.id === input.tourId);
  const date = tour?.dates.find((item) => item.id === input.dateId);

  if (!tour || !date) {
    return null;
  }

  Object.assign(date, {
    start: input.start,
    end: input.end,
    price: input.price,
    currency: input.currency,
    availability: localizedText(input.availability, date.availability),
    jollyUrl: input.jollyUrl || tour.jollyUrl,
  });
  tour.updatedAt = now();
  await writeDemoStore(store);
  return date;
}

export async function deleteDemoTourDate(tourId: string, dateId: string) {
  const store = await readDemoStore();
  const tour = store.tours.find((item) => item.id === tourId);

  if (!tour) {
    return false;
  }

  const initialLength = tour.dates.length;
  tour.dates = tour.dates.filter((date) => date.id !== dateId);
  tour.updatedAt = now();
  await writeDemoStore(store);
  return tour.dates.length !== initialLength;
}

export async function updateDemoSettings(input: {
  siteName: string;
  logoMark: string;
  phone: string;
  whatsapp: string;
  email: string;
  jollyUrl: string;
  tursabCertificate: string;
}) {
  const store = await readDemoStore();
  store.settings = input;
  await writeDemoStore(store);
  return store.settings;
}

export async function createDemoManagedPage(input: {
  kind: DemoManagedPageKind;
  title: LocalizedStringInput;
  slug: LocalizedStringInput;
  summary: LocalizedStringInput;
  seoTitle?: LocalizedStringInput;
  seoDescription?: LocalizedStringInput;
  canonical?: LocalizedStringInput;
  ogImage?: string;
  keywords?: string;
  noIndex?: boolean;
}) {
  const store = await readDemoStore();
  const timestamp = now();
  const title = localizedText(input.title, "Yeni SEO sayfası");
  const summary = localizedText(
    input.summary,
    "Admin panelden eklenen SEO landing sayfası.",
  );
  const page: DemoManagedPage = {
    id: randomUUID(),
    kind: input.kind,
    slugs: localizedSlugs(input.slug, title),
    title,
    summary,
    seoTitle: localizedText(input.seoTitle, title.tr),
    seoDescription: localizedText(input.seoDescription, summary.tr),
    canonical: localizedText(input.canonical, ""),
    ogImage: input.ogImage?.trim() ?? "",
    keywords: localizedList(input.keywords, []).tr,
    noIndex: Boolean(input.noIndex),
    active: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.managedPages.unshift(page);
  await writeDemoStore(store);
  return page;
}

export async function updateDemoManagedPage(input: {
  id: string;
  kind: DemoManagedPageKind;
  title: LocalizedStringInput;
  slug: LocalizedStringInput;
  summary: LocalizedStringInput;
  seoTitle?: LocalizedStringInput;
  seoDescription?: LocalizedStringInput;
  canonical?: LocalizedStringInput;
  ogImage?: string;
  keywords?: string;
  noIndex?: boolean;
  active: boolean;
}) {
  const store = await readDemoStore();
  const page = store.managedPages.find((item) => item.id === input.id);

  if (!page) {
    return null;
  }

  page.kind = input.kind;
  page.title = localizedText(input.title, page.title);
  page.slugs = localizedSlugs(input.slug, page.title);
  page.summary = localizedText(input.summary, page.summary);
  page.seoTitle = localizedText(input.seoTitle, page.title.tr);
  page.seoDescription = localizedText(input.seoDescription, page.summary.tr);
  page.canonical = localizedText(input.canonical, "");
  page.ogImage = input.ogImage?.trim() ?? "";
  page.keywords = localizedList(input.keywords, []).tr;
  page.noIndex = Boolean(input.noIndex);
  page.active = input.active;
  page.updatedAt = now();
  await writeDemoStore(store);
  return page;
}

export async function deleteDemoManagedPage(id: string) {
  const store = await readDemoStore();
  const initialLength = store.managedPages.length;
  store.managedPages = store.managedPages.filter((page) => page.id !== id);
  await writeDemoStore(store);
  return store.managedPages.length !== initialLength;
}

export async function createDemoContact(input: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  locale: Locale;
}) {
  const store = await readDemoStore();
  const timestamp = now();
  const contact: DemoContactRequest = {
    id: randomUUID(),
    ...input,
    status: "Yeni",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.contacts.unshift(contact);
  await writeDemoStore(store);
  return contact;
}

export async function updateDemoContact(input: {
  id: string;
  status: DemoContactStatus;
  message: string;
}) {
  const store = await readDemoStore();
  const contact = store.contacts.find((item) => item.id === input.id);

  if (!contact) {
    return null;
  }

  contact.status = input.status;
  contact.message = input.message;
  contact.updatedAt = now();
  await writeDemoStore(store);
  return contact;
}

export async function deleteDemoContact(id: string) {
  const store = await readDemoStore();
  const initialLength = store.contacts.length;
  store.contacts = store.contacts.filter((contact) => contact.id !== id);
  await writeDemoStore(store);
  return store.contacts.length !== initialLength;
}

export async function createDemoUser(input: {
  name: string;
  email: string;
  role: DemoUserRole;
}) {
  const store = await readDemoStore();
  const timestamp = now();
  const user: DemoUser = {
    id: randomUUID(),
    ...input,
    active: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.users.unshift(user);
  await writeDemoStore(store);
  return user;
}

export async function updateDemoUser(input: {
  id: string;
  name: string;
  email: string;
  role: DemoUserRole;
  active: boolean;
}) {
  const store = await readDemoStore();
  const user = store.users.find((item) => item.id === input.id);

  if (!user) {
    return null;
  }

  Object.assign(user, {
    name: input.name,
    email: input.email,
    role: input.role,
    active: input.active,
    updatedAt: now(),
  });
  await writeDemoStore(store);
  return user;
}

export async function deleteDemoUser(id: string) {
  const store = await readDemoStore();
  const initialLength = store.users.length;
  store.users = store.users.filter((user) => user.id !== id);
  await writeDemoStore(store);
  return store.users.length !== initialLength;
}

export async function trackDemoEvent(
  name: string,
  payload: DemoEvent["payload"] = {},
) {
  const store = await readDemoStore();
  const event: DemoEvent = {
    id: randomUUID(),
    name,
    payload,
    createdAt: now(),
  };

  store.events.unshift(event);
  store.events = store.events.slice(0, 500);
  await writeDemoStore(store);
  return event;
}

export async function getAllToursWithDemo() {
  const store = await readDemoStore();
  return [
    ...store.tours.filter((tour) => tour.active).map(demoTourToTour),
    ...tours,
  ];
}

export async function getTourBySlugWithDemo(locale: Locale, slug: string) {
  const staticTour = getTourBySlug(locale, slug);

  if (staticTour) {
    return staticTour;
  }

  const store = await readDemoStore();
  const demoTour = store.tours.find(
    (tour) => tour.active && tour.slugs[locale] === slug,
  );

  return demoTour ? demoTourToTour(demoTour) : undefined;
}

export async function getToursForLandingWithDemo(page: LandingPage) {
  const allTours = await getAllToursWithDemo();

  if (page.linkedTourIds?.length) {
    return allTours.filter((tour) => page.linkedTourIds?.includes(tour.id));
  }

  if (page.kind === "category") {
    return allTours.filter((tour) => tour.categoryIds.includes(page.id));
  }

  if (page.kind === "campaign") {
    return allTours.filter((tour) => tour.campaignIds.includes(page.id));
  }

  if (page.kind === "destination") {
    return allTours.filter((tour) => tour.destinationIds.includes(page.id));
  }

  return [];
}

export async function getAllLandingPagesWithDemo() {
  const store = await readDemoStore();
  return [
    ...store.managedPages
      .filter((page) => page.active)
      .map(demoManagedPageToLandingPage),
    ...allLandingPages,
  ];
}

export async function getLandingBySlugWithDemo(locale: Locale, slug: string) {
  const staticPage = getLandingBySlug(locale, slug);

  if (staticPage) {
    return staticPage;
  }

  const store = await readDemoStore();
  const page = store.managedPages.find(
    (item) => item.active && item.slugs[locale] === slug,
  );

  return page ? demoManagedPageToLandingPage(page) : undefined;
}

export function demoTourToTour(demoTour: DemoTour): Tour {
  return {
    id: demoTour.id,
    slugs: demoTour.slugs,
    title: demoTour.title,
    summary: demoTour.summary,
    description: demoTour.description ?? demoTour.summary,
    image: demoTour.image,
    gallery: demoTour.gallery?.length ? demoTour.gallery : defaultGallery(demoTour.image),
    categoryIds: demoTour.categoryIds,
    campaignIds: demoTour.campaignIds,
    destinationIds: demoTour.destinationIds,
    priceFrom: demoTour.priceFrom,
    currency: demoTour.currency,
    durationDays: demoTour.durationDays,
    durationNights: demoTour.durationNights,
    departures: demoTour.departures,
    transport: demoTour.transport,
    visa: demoTour.visa,
    route: demoTour.route,
    tags: demoTour.tags,
    salesBadges:
      demoTour.salesBadges ??
      localizedList(undefined, ["Jolly ödeme yönlendirmesi", "Danışman destekli rezervasyon"]),
    highlights:
      demoTour.highlights ??
      localizedList(undefined, ["Net rota anlatımı", "Tarih ve kontenjan takibi"]),
    pickupPoints:
      demoTour.pickupPoints ??
      localizedList(undefined, ["Hareket noktaları danışmanla netleşir"]),
    cancellationPolicy:
      demoTour.cancellationPolicy ??
      localizedText(
        undefined,
        "İptal, değişiklik ve kesin ödeme koşulları Jolly / satış danışmanı sürecinde teyit edilir.",
      ),
    featured: demoTour.featured,
    jollyUrl: demoTour.jollyUrl,
    itinerary: demoTour.itinerary ?? defaultItinerary(),
    included: demoTour.included ?? localizedList(undefined, ["Danışmanlık", "Jolly yönlendirme", "Ön talep takibi"]),
    excluded: demoTour.excluded ?? localizedList(undefined, ["Kişisel harcamalar", "Ekstra hizmetler"]),
    notes: demoTour.notes ?? localizedList(undefined, ["Demo turdur; fiyat ve içerik gerçek Jolly linkiyle netleşir."]),
    faqs: demoTour.faqs ?? defaultFaqs(),
    dates:
      demoTour.dates.length > 0
        ? demoTour.dates
        : [
            {
              start: "2026-06-01",
              end: "2026-06-04",
              price: demoTour.priceFrom,
              currency: demoTour.currency,
              availability: {
                tr: "Demo kontenjan",
                en: "Demo availability",
                de: "Demo-Verfügbarkeit",
                ru: "Демо наличие",
              },
              jollyUrl: demoTour.jollyUrl,
            },
          ],
  };
}

function demoManagedPageToLandingPage(page: DemoManagedPage): LandingPage {
  const kind = page.kind === "blog" ? "info" : page.kind;

  return {
    id: page.id,
    kind,
    slugs: page.slugs,
    title: page.title,
    summary: page.summary,
    body: {
      tr: [
        page.summary.tr ||
          "Bu SEO sayfası admin panelinden oluşturuldu. Detay metinleri sonraki içerik adımında genişletilecek.",
      ],
      en: [
        page.summary.en ||
          "This SEO page was created from the admin panel. Details will be expanded in the next content step.",
      ],
      de: [
        page.summary.de ||
          "Diese SEO-Seite wurde im Adminbereich erstellt. Details werden im nächsten Inhaltsschritt ergänzt.",
      ],
      ru: [
        page.summary.ru ||
          "Эта SEO-страница создана в админ-панели. Детали будут расширены на следующем этапе контента.",
      ],
    },
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    canonical: page.canonical,
    ogImage: page.ogImage || undefined,
    keywords: page.keywords,
    noIndex: page.noIndex,
  };
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function localizedText(
  value: LocalizedStringInput | undefined,
  fallback: string | Record<Locale, string>,
) {
  const fallbackByLocale =
    typeof fallback === "string"
      ? Object.fromEntries(locales.map((locale) => [locale, fallback]))
      : fallback;

  if (typeof value === "string" || value === undefined) {
    const text = value?.trim();
    const primaryText = text || fallbackByLocale.tr;
    return Object.fromEntries(
      locales.map((locale) => [locale, primaryText || fallbackByLocale[locale] || ""]),
    ) as Record<Locale, string>;
  }

  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      value[locale]?.trim() || fallbackByLocale[locale] || fallbackByLocale.tr || "",
    ]),
  ) as Record<Locale, string>;
}

function localizedSlugs(
  value: LocalizedStringInput | undefined,
  fallbackTitle: Record<Locale, string>,
) {
  if (typeof value === "string" || value === undefined) {
    const primarySlug = slugify(value || fallbackTitle.tr || "sayfa");
    return Object.fromEntries(
      locales.map((locale) => [locale, primarySlug || slugify(fallbackTitle[locale])]),
    ) as Record<Locale, string>;
  }

  return Object.fromEntries(
    locales.map((locale) => {
      const source = value[locale]?.trim() || fallbackTitle[locale] || fallbackTitle.tr || "sayfa";
      return [locale, slugify(source)];
    }),
  ) as Record<Locale, string>;
}

function localizedList(
  value: LocalizedStringInput | undefined,
  fallback: string[] | Record<Locale, string[]>,
) {
  const fallbackByLocale = Array.isArray(fallback)
    ? Object.fromEntries(locales.map((locale) => [locale, fallback]))
    : fallback;

  if (typeof value === "string" || value === undefined) {
    const items = splitList(value);
    const primaryList = items.length ? items : fallbackByLocale.tr;
    return Object.fromEntries(
      locales.map((locale) => [
        locale,
        primaryList.length ? primaryList : fallbackByLocale[locale] || [],
      ]),
    ) as Record<Locale, string[]>;
  }

  return Object.fromEntries(
    locales.map((locale) => {
      const items = splitList(value[locale]);
      return [
        locale,
        items.length ? items : fallbackByLocale[locale] || fallbackByLocale.tr || [],
      ];
    }),
  ) as Record<Locale, string[]>;
}

function localizedItinerary(
  value: LocalizedListInput | undefined,
  fallback: Record<Locale, DemoItineraryItem[]>,
) {
  if (typeof value === "string" || value === undefined) {
    const items = splitItinerary(value);
    const primaryItems = items.length ? items : fallback.tr;
    return Object.fromEntries(
      locales.map((locale) => [
        locale,
        primaryItems.length ? primaryItems : fallback[locale] || [],
      ]),
    ) as Record<Locale, DemoItineraryItem[]>;
  }

  return Object.fromEntries(
    locales.map((locale) => {
      const items = splitItinerary(value[locale]);
      return [locale, items.length ? items : fallback[locale] || fallback.tr || []];
    }),
  ) as Record<Locale, DemoItineraryItem[]>;
}

function localizedFaqs(
  value: LocalizedListInput | undefined,
  fallback: Record<Locale, DemoFaqItem[]>,
) {
  if (typeof value === "string" || value === undefined) {
    const items = splitFaqs(value);
    const primaryItems = items.length ? items : fallback.tr;
    return Object.fromEntries(
      locales.map((locale) => [
        locale,
        primaryItems.length ? primaryItems : fallback[locale] || [],
      ]),
    ) as Record<Locale, DemoFaqItem[]>;
  }

  return Object.fromEntries(
    locales.map((locale) => {
      const items = splitFaqs(value[locale]);
      return [locale, items.length ? items : fallback[locale] || fallback.tr || []];
    }),
  ) as Record<Locale, DemoFaqItem[]>;
}

function splitItinerary(value: string | undefined) {
  return (
    value
      ?.split(/\n+/)
      .map((line, index) => {
        const [day, title, ...textParts] = line.split("|").map((part) => part.trim());
        const text = textParts.join(" | ");

        if (!day && !title && !text) {
          return null;
        }

        return {
          day: day || `${index + 1}. Gün`,
          title: title || "Program",
          text: text || title || day || "Program detayı",
        };
      })
      .filter(Boolean) ?? []
  ) as DemoItineraryItem[];
}

function splitFaqs(value: string | undefined) {
  return (
    value
      ?.split(/\n+/)
      .map((line) => {
        const [question, ...answerParts] = line.split("|").map((part) => part.trim());
        const answer = answerParts.join(" | ");

        if (!question && !answer) {
          return null;
        }

        return {
          question: question || "Soru",
          answer: answer || "Yanıt admin panelden tamamlanacak.",
        };
      })
      .filter(Boolean) ?? []
  ) as DemoFaqItem[];
}

function splitMediaList(value: string | undefined) {
  return (
    value
      ?.split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.startsWith("http")) ?? []
  );
}

function defaultGallery(image?: string) {
  return [
    image,
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
  ]
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index) as string[];
}

function defaultItinerary() {
  return {
    tr: [
      {
        day: "1. Gün",
        title: "Program hazırlanıyor",
        text: "Bu turun gün gün programı admin panelden tamamlanacak.",
      },
    ],
    en: [
      {
        day: "Day 1",
        title: "Program in progress",
        text: "The day-by-day program will be completed from the admin panel.",
      },
    ],
    de: [
      {
        day: "Tag 1",
        title: "Programm in Bearbeitung",
        text: "Das Tagesprogramm wird im Admin ergänzt.",
      },
    ],
    ru: [
      {
        day: "День 1",
        title: "Программа готовится",
        text: "Программа по дням будет заполнена в админке.",
      },
    ],
  } satisfies Record<Locale, DemoItineraryItem[]>;
}

function defaultFaqs() {
  return {
    tr: [
      {
        question: "Bu tur yayında mı?",
        answer: "Demo modda yayındadır; gerçek içerik admin panelden tamamlanacaktır.",
      },
    ],
    en: [
      {
        question: "Is this tour live?",
        answer: "It is live in demo mode; real content will be completed in admin.",
      },
    ],
    de: [
      {
        question: "Ist diese Reise live?",
        answer: "Sie ist im Demo-Modus live; echte Inhalte folgen im Admin.",
      },
    ],
    ru: [
      {
        question: "Тур опубликован?",
        answer: "Он опубликован в демо-режиме; реальные данные добавляются в админке.",
      },
    ],
  } satisfies Record<Locale, DemoFaqItem[]>;
}

function splitList(value: string | undefined) {
  return (
    value
      ?.split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  );
}
