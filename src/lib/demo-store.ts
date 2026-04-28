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
  type DemoLead,
  type DemoLeadStatus,
  type DemoManagedPage,
  type DemoManagedPageKind,
  type DemoStore,
  type DemoTour,
  type DemoTourDate,
  type DemoUser,
  type DemoUserRole,
} from "./demo-types";
import { siteConfig, type Locale } from "./site";

const storeDir = path.join(process.cwd(), ".demo-data");
const storeFile = path.join(storeDir, "touragency-store.json");

const now = () => new Date().toISOString();

const seededLeads: DemoLead[] = [
  {
    id: "lead_demo_ayse",
    name: "Ayşe Demir",
    phone: "+90 555 111 22 33",
    email: "ayse@example.com",
    travelers: "2",
    preferredDate: "2026-07",
    note: "2 kişi, Temmuz ilk haftası, İstanbul çıkışlı.",
    locale: "tr",
    tourTitle: "Karadeniz Rüyası Turu",
    sourcePath: "/tr/turlar/karadeniz-ruyasi-turu",
    kvkk: true,
    marketing: false,
    jollyNotice: true,
    status: "Yeni",
    createdAt: "2026-04-22T09:00:00.000Z",
    updatedAt: "2026-04-22T09:00:00.000Z",
  },
  {
    id: "lead_demo_murat",
    name: "Murat Kaya",
    phone: "+90 555 333 44 55",
    email: "murat@example.com",
    travelers: "4",
    preferredDate: "Kurban Bayramı",
    note: "Bayram dönemi için aile kontenjanı soruyor.",
    locale: "tr",
    tourTitle: "Vizesiz Balkan Turu",
    sourcePath: "utm_source=instagram&utm_campaign=bayram",
    kvkk: true,
    marketing: true,
    jollyNotice: true,
    status: "Teklif verildi",
    createdAt: "2026-04-22T09:15:00.000Z",
    updatedAt: "2026-04-22T09:20:00.000Z",
  },
  {
    id: "lead_demo_elena",
    name: "Elena Petrova",
    phone: "+7 900 000 00 00",
    email: "elena@example.com",
    travelers: "2",
    preferredDate: "August",
    note: "Rusça dönüş istedi, WhatsApp uygun.",
    locale: "ru",
    tourTitle: "Dubai & Abu Dabi Turu",
    sourcePath: "/ru/tury-v-dubai",
    kvkk: true,
    marketing: true,
    jollyNotice: true,
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
    email: "deniz@example.com",
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
    email: "admin@example.com",
    role: "Yönetici",
    active: true,
    createdAt: "2026-04-22T08:00:00.000Z",
    updatedAt: "2026-04-22T08:00:00.000Z",
  },
  {
    id: "user_demo_sales",
    name: "Satış Danışmanı",
    email: "sales@example.com",
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
    leads: store.leads ?? empty.leads,
    tours: (store.tours ?? []).map((tour) => ({
      ...tour,
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
    managedPages: store.managedPages ?? empty.managedPages,
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
  status: DemoLeadStatus;
}) {
  const store = await readDemoStore();
  const lead = store.leads.find((item) => item.id === input.id);

  if (!lead) {
    return null;
  }

  Object.assign(lead, {
    name: input.name,
    phone: input.phone,
    email: input.email,
    travelers: input.travelers,
    preferredDate: input.preferredDate,
    note: input.note,
    status: input.status,
    updatedAt: now(),
  });
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
  title: string;
  slug: string;
  summary?: string;
  priceFrom: number;
  currency: Tour["currency"];
  categoryId: string;
  jollyUrl?: string;
}) {
  const store = await readDemoStore();
  const timestamp = now();
  const slug = slugify(input.slug || input.title);
  const title = input.title.trim();
  const summary =
    input.summary?.trim() ||
    "Admin panelden eklenen demo tur. Detay içerikleri sonradan tamamlanacak.";

  const tour: DemoTour = {
    id: randomUUID(),
    slugs: {
      tr: slug,
      en: `${slug}-en`,
      de: `${slug}-de`,
      ru: `${slug}-ru`,
    },
    title: {
      tr: title,
      en: `${title} EN`,
      de: `${title} DE`,
      ru: `${title} RU`,
    },
    summary: {
      tr: summary,
      en: summary,
      de: summary,
      ru: summary,
    },
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    categoryIds: [input.categoryId],
    campaignIds: ["early-booking"],
    destinationIds: [],
    priceFrom: input.priceFrom,
    currency: input.currency,
    durationDays: 4,
    durationNights: 3,
    departures: {
      tr: ["İstanbul"],
      en: ["Istanbul"],
      de: ["Istanbul"],
      ru: ["Стамбул"],
    },
    transport: {
      tr: "Uçak / Otobüs",
      en: "Flight / Coach",
      de: "Flug / Bus",
      ru: "Рейс / автобус",
    },
    visa: {
      tr: "Tur koşullarına göre",
      en: "Depends on tour conditions",
      de: "Je nach Reisebedingungen",
      ru: "По условиям тура",
    },
    route: {
      tr: "Rota admin panelden tamamlanacak",
      en: "Route will be completed in admin",
      de: "Route wird im Admin ergänzt",
      ru: "Маршрут будет заполнен в админке",
    },
    tags: {
      tr: ["Demo", "Yeni"],
      en: ["Demo", "New"],
      de: ["Demo", "Neu"],
      ru: ["Демо", "Новый"],
    },
    featured: true,
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
  title: string;
  slug: string;
  summary: string;
  priceFrom: number;
  currency: Tour["currency"];
  categoryId: string;
  jollyUrl: string;
  active: boolean;
}) {
  const store = await readDemoStore();
  const tour = store.tours.find((item) => item.id === input.id);

  if (!tour) {
    return null;
  }

  const slug = slugify(input.slug || input.title);
  tour.title.tr = input.title;
  tour.slugs.tr = slug;
  tour.summary.tr = input.summary;
  tour.priceFrom = input.priceFrom;
  tour.currency = input.currency;
  tour.categoryIds = [input.categoryId];
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
  availability: string;
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
    availability: {
      tr: input.availability,
      en: input.availability,
      de: input.availability,
      ru: input.availability,
    },
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
  availability: string;
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
    availability: {
      tr: input.availability,
      en: input.availability,
      de: input.availability,
      ru: input.availability,
    },
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
  title: string;
  slug: string;
  summary: string;
}) {
  const store = await readDemoStore();
  const timestamp = now();
  const slug = slugify(input.slug || input.title);
  const page: DemoManagedPage = {
    id: randomUUID(),
    kind: input.kind,
    slugs: {
      tr: slug,
      en: `${slug}-en`,
      de: `${slug}-de`,
      ru: `${slug}-ru`,
    },
    title: {
      tr: input.title,
      en: `${input.title} EN`,
      de: `${input.title} DE`,
      ru: `${input.title} RU`,
    },
    summary: {
      tr: input.summary,
      en: input.summary,
      de: input.summary,
      ru: input.summary,
    },
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
  title: string;
  slug: string;
  summary: string;
  active: boolean;
}) {
  const store = await readDemoStore();
  const page = store.managedPages.find((item) => item.id === input.id);

  if (!page) {
    return null;
  }

  page.kind = input.kind;
  page.title.tr = input.title;
  page.slugs.tr = slugify(input.slug || input.title);
  page.summary.tr = input.summary;
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
    description: {
      tr: demoTour.summary.tr,
      en: demoTour.summary.en,
      de: demoTour.summary.de,
      ru: demoTour.summary.ru,
    },
    image: demoTour.image,
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
    featured: demoTour.featured,
    jollyUrl: demoTour.jollyUrl,
    itinerary: {
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
    },
    included: {
      tr: ["Danışmanlık", "Jolly yönlendirme", "Ön talep takibi"],
      en: ["Consultation", "Jolly redirect", "Request tracking"],
      de: ["Beratung", "Jolly-Weiterleitung", "Anfrageverfolgung"],
      ru: ["Консультация", "Переход Jolly", "Отслеживание заявки"],
    },
    excluded: {
      tr: ["Kişisel harcamalar", "Ekstra hizmetler"],
      en: ["Personal expenses", "Extra services"],
      de: ["Persönliche Ausgaben", "Zusatzleistungen"],
      ru: ["Личные расходы", "Дополнительные услуги"],
    },
    notes: {
      tr: ["Demo turdur; fiyat ve içerik gerçek Jolly linkiyle netleşir."],
      en: ["Demo tour; price and content are finalized with the real Jolly link."],
      de: ["Demo-Reise; Preis und Inhalt werden mit dem Jolly-Link finalisiert."],
      ru: ["Демо-тур; цена и контент уточняются через реальную ссылку Jolly."],
    },
    faqs: {
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
    },
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
    seoTitle: page.title,
    seoDescription: page.summary,
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
