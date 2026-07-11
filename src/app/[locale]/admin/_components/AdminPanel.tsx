import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { clearAdminSession, getAdminSession } from "@/lib/admin-auth";
import {
  allLandingPages,
  campaigns,
  categories,
  destinations,
  formatPrice,
  type Tour,
} from "@/lib/catalog";
import {
  addDemoLeadTimeline,
  createDemoContact,
  createDemoManagedPage,
  createDemoTour,
  createDemoTourDate,
  createDemoUser,
  deleteDemoContact,
  deleteDemoLead,
  deleteDemoManagedPage,
  deleteDemoTour,
  deleteDemoTourDate,
  deleteDemoUser,
  demoTourToTour,
  getAllToursWithDemo,
  readDemoStore,
  updateDemoContact,
  updateDemoLead,
  updateDemoLeadStatus,
  updateDemoManagedPage,
  updateDemoSettings,
  updateDemoTour,
  updateDemoTourDate,
  updateDemoUser,
} from "@/lib/demo-store";
import { getDatabaseStatus } from "@/lib/database";
import type {
  DemoContactStatus,
  DemoLead,
  DemoLeadStatus,
  DemoManagedPageKind,
  DemoUserRole,
} from "@/lib/demo-types";
import { locales, type Locale } from "@/lib/site";

type PageProps = {
  params: Promise<{ locale: string }>;
};

type AdminSearchParams = Record<string, string | string[] | undefined>;

export type AdminSection =
  | "dashboard"
  | "leads"
  | "tours"
  | "seo"
  | "settings"
  | "reports"
  | "launch";

type AdminPanelProps = PageProps & {
  searchParams?: Promise<AdminSearchParams>;
  section?: AdminSection;
};

const isLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

const leadStatuses: DemoLeadStatus[] = [
  "Yeni",
  "Arandı",
  "Ulaşılamadı",
  "Teklif verildi",
  "Takipte",
  "Satışa döndü",
  "İptal / olumsuz",
];

const contactStatuses: DemoContactStatus[] = [
  "Yeni",
  "Yanıtlandı",
  "Takipte",
  "Kapandı",
];

const leadChannels = ["Telefon", "WhatsApp", "E-posta", "Form"] as const;

const managedPageKinds: DemoManagedPageKind[] = [
  "category",
  "campaign",
  "destination",
  "info",
  "legal",
  "blog",
];

const userRoles: DemoUserRole[] = [
  "Yönetici",
  "Satış danışmanı",
  "İçerik editörü",
];

const currencies = ["TRY", "EUR", "USD"] as const;

function readLocalizedFormText(formData: FormData, name: string) {
  const legacyValue = String(formData.get(name) ?? "");

  return Object.fromEntries(
    locales.map((item) => [
      item,
      String(formData.get(`${name}_${item}`) ?? legacyValue),
    ]),
  ) as Record<Locale, string>;
}

function localizedListText(value: Record<Locale, string[]>) {
  return Object.fromEntries(
    locales.map((item) => [item, value[item].join(", ")]),
  ) as Record<Locale, string>;
}

function localizedItineraryText(
  value: Record<Locale, Array<{ day: string; title: string; text: string }>>,
) {
  return Object.fromEntries(
    locales.map((item) => [
      item,
      value[item].map((entry) => `${entry.day} | ${entry.title} | ${entry.text}`).join("\n"),
    ]),
  ) as Record<Locale, string>;
}

function localizedFaqText(
  value: Record<Locale, Array<{ question: string; answer: string }>>,
) {
  return Object.fromEntries(
    locales.map((item) => [
      item,
      value[item].map((entry) => `${entry.question} | ${entry.answer}`).join("\n"),
    ]),
  ) as Record<Locale, string>;
}

function searchValue(params: AdminSearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function normalizedSearch(value: string) {
  return value.trim().toLocaleLowerCase("tr");
}

function textMatches(query: string, values: Array<string | null | undefined>) {
  if (!query) {
    return true;
  }

  return values.some((value) =>
    normalizedSearch(String(value ?? "")).includes(query),
  );
}

function hasContent(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(hasContent);
  }

  if (value && typeof value === "object") {
    return Object.values(value).some(hasContent);
  }

  return String(value ?? "").trim().length > 0;
}

function languageCompletion(fields: unknown[]) {
  const total = fields.length * locales.length;

  if (!total) {
    return 100;
  }

  const completed = locales.reduce(
    (sum, locale) =>
      sum +
      fields.filter((field) => {
        if (!field || typeof field !== "object") {
          return false;
        }

        return hasContent((field as Partial<Record<Locale, unknown>>)[locale]);
      }).length,
    0,
  );

  return Math.round((completed / total) * 100);
}

function tourLanguageScore(tour: Tour) {
  return languageCompletion([
    tour.title,
    tour.slugs,
    tour.summary,
    tour.description,
    tour.route,
    tour.tags,
    tour.salesBadges,
    tour.highlights,
    tour.pickupPoints,
    tour.cancellationPolicy,
    tour.itinerary,
    tour.included,
    tour.excluded,
    tour.notes,
    tour.faqs,
  ]);
}

function seoIssueList(input: {
  canonical: string;
  keywordCount: number;
  noIndex: boolean;
  ogImage: string;
  summary: string;
  title: string;
}) {
  const issues: string[] = [];
  const titleLength = input.title.trim().length;
  const summaryLength = input.summary.trim().length;

  if (titleLength < 28) issues.push("Meta başlık kısa");
  if (titleLength > 68) issues.push("Meta başlık uzun");
  if (summaryLength < 70) issues.push("Meta açıklama kısa");
  if (summaryLength > 170) issues.push("Meta açıklama uzun");
  if (!input.canonical.trim()) issues.push("Canonical eksik");
  if (!input.ogImage.trim()) issues.push("OG görsel eksik");
  if (!input.keywordCount) issues.push("Keyword yok");
  if (input.noIndex) issues.push("Noindex aktif");

  return issues;
}

function seoScoreForIssues(issues: string[]) {
  return Math.max(0, 100 - issues.length * 14);
}

function averageScore(values: number[]) {
  if (!values.length) {
    return 100;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

const navItems = [
  { href: "", label: "Dashboard", section: "dashboard" },
  { href: "/talepler", label: "Ön Talepler", section: "leads" },
  { href: "/turlar", label: "Turlar", section: "tours" },
  { href: "/seo", label: "SEO & İçerik", section: "seo" },
  { href: "/ayarlar", label: "Ayarlar", section: "settings" },
  { href: "/raporlar", label: "Raporlar", section: "reports" },
  { href: "/yayin", label: "Yayın", section: "launch" },
] satisfies Array<{ href: string; label: string; section: AdminSection }>;

const sectionMeta = {
  dashboard: {
    eyebrow: "Dashboard",
    title: "Yönetim Merkezi",
  },
  leads: {
    eyebrow: "Satış Akışı",
    title: "Ön Talep CRM",
  },
  tours: {
    eyebrow: "Tur Operasyonu",
    title: "Tur, Tarih ve Fiyat Yönetimi",
  },
  seo: {
    eyebrow: "İçerik ve SEO",
    title: "SEO & Sayfa Yönetimi",
  },
  settings: {
    eyebrow: "Operasyon",
    title: "Ayarlar, Mesajlar ve Kullanıcılar",
  },
  reports: {
    eyebrow: "Raporlar",
    title: "Performans ve Analitik",
  },
  launch: {
    eyebrow: "Yayın",
    title: "Canlıya Hazırlık",
  },
} satisfies Record<AdminSection, { eyebrow: string; title: string }>;

const adminSectionPaths = [
  "",
  "/talepler",
  "/turlar",
  "/seo",
  "/ayarlar",
  "/raporlar",
  "/yayin",
];

function revalidateAdminPaths(locale: string) {
  adminSectionPaths.forEach((path) => {
    revalidatePath(`/${locale}/admin${path}`);
  });
}

async function logoutAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await clearAdminSession();
  redirect(`/${locale}/admin/login`);
}

async function createTourAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  const title = readLocalizedFormText(formData, "title");
  const slug = readLocalizedFormText(formData, "slug");
  const summary = readLocalizedFormText(formData, "summary");
  const image = String(formData.get("image") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const jollyUrl = String(formData.get("jollyUrl") ?? "");
  const currency = String(formData.get("currency") ?? "TRY") as
    | "TRY"
    | "EUR"
    | "USD";
  const priceFrom = Number(formData.get("priceFrom") ?? 0);

  if (title.tr && slug.tr && categoryId && priceFrom > 0) {
    await createDemoTour({
      categoryId,
      currency,
      departures: readLocalizedFormText(formData, "departures"),
      durationDays: Number(formData.get("durationDays") ?? 4),
      durationNights: Number(formData.get("durationNights") ?? 3),
      featured: formData.get("featured") === "on",
      gallery: String(formData.get("gallery") ?? ""),
      image,
      cancellationPolicy: readLocalizedFormText(formData, "cancellationPolicy"),
      description: readLocalizedFormText(formData, "description"),
      excluded: readLocalizedFormText(formData, "excluded"),
      faqs: readLocalizedFormText(formData, "faqs"),
      highlights: readLocalizedFormText(formData, "highlights"),
      included: readLocalizedFormText(formData, "included"),
      itinerary: readLocalizedFormText(formData, "itinerary"),
      jollyUrl,
      notes: readLocalizedFormText(formData, "notes"),
      pickupPoints: readLocalizedFormText(formData, "pickupPoints"),
      priceFrom,
      route: readLocalizedFormText(formData, "route"),
      salesBadges: readLocalizedFormText(formData, "salesBadges"),
      slug,
      summary,
      tags: readLocalizedFormText(formData, "tags"),
      title,
      transport: readLocalizedFormText(formData, "transport"),
      visa: readLocalizedFormText(formData, "visa"),
    });
  }

  revalidateAdminPaths(locale);
  revalidatePath(`/${locale}/turlar`);
  revalidatePath(`/${locale}`);
}

async function updateLeadStatusAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "Yeni") as DemoLeadStatus;
  const locale = String(formData.get("locale") ?? "tr");

  if (id) {
    await updateDemoLeadStatus(id, status);
  }

  revalidateAdminPaths(locale);
}

async function updateLeadAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await updateDemoLead({
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    travelers: String(formData.get("travelers") ?? ""),
    preferredDate: String(formData.get("preferredDate") ?? ""),
    note: String(formData.get("note") ?? ""),
    channel: String(formData.get("channel") ?? "Telefon"),
    owner: String(formData.get("owner") ?? "Satış danışmanı"),
    lastContactAt: String(formData.get("lastContactAt") ?? ""),
    nextFollowUpAt: String(formData.get("nextFollowUpAt") ?? ""),
    internalNote: String(formData.get("internalNote") ?? ""),
    status: String(formData.get("status") ?? "Yeni") as DemoLeadStatus,
  });
  revalidateAdminPaths(locale);
}

async function deleteLeadAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoLead(String(formData.get("id") ?? ""));
  revalidateAdminPaths(locale);
}

async function addLeadTimelineAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await addDemoLeadTimeline({
    id: String(formData.get("id") ?? ""),
    owner: String(formData.get("owner") ?? "Satış danışmanı"),
    text: String(formData.get("timelineText") ?? ""),
    type: String(formData.get("timelineType") ?? "not") as "not" | "arama" | "whatsapp" | "eposta" | "durum",
  });
  revalidateAdminPaths(locale);
}

async function updateTourAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  const id = String(formData.get("id") ?? "");
  await updateDemoTour({
    id,
    title: readLocalizedFormText(formData, "title"),
    slug: readLocalizedFormText(formData, "slug"),
    summary: readLocalizedFormText(formData, "summary"),
    description: readLocalizedFormText(formData, "description"),
    image: String(formData.get("image") ?? ""),
    gallery: String(formData.get("gallery") ?? ""),
    priceFrom: Number(formData.get("priceFrom") ?? 0),
    currency: String(formData.get("currency") ?? "TRY") as "TRY" | "EUR" | "USD",
    categoryId: String(formData.get("categoryId") ?? ""),
    durationDays: Number(formData.get("durationDays") ?? 0),
    durationNights: Number(formData.get("durationNights") ?? 0),
    departures: readLocalizedFormText(formData, "departures"),
    transport: readLocalizedFormText(formData, "transport"),
    visa: readLocalizedFormText(formData, "visa"),
    route: readLocalizedFormText(formData, "route"),
    tags: readLocalizedFormText(formData, "tags"),
    salesBadges: readLocalizedFormText(formData, "salesBadges"),
    highlights: readLocalizedFormText(formData, "highlights"),
    pickupPoints: readLocalizedFormText(formData, "pickupPoints"),
    cancellationPolicy: readLocalizedFormText(formData, "cancellationPolicy"),
    itinerary: readLocalizedFormText(formData, "itinerary"),
    included: readLocalizedFormText(formData, "included"),
    excluded: readLocalizedFormText(formData, "excluded"),
    notes: readLocalizedFormText(formData, "notes"),
    faqs: readLocalizedFormText(formData, "faqs"),
    featured: formData.get("featured") === "on",
    jollyUrl: String(formData.get("jollyUrl") ?? ""),
    active: formData.get("active") === "on",
  });
  revalidateAdminPaths(locale);
  revalidatePath(`/${locale}/turlar`);
  revalidatePath(`/${locale}`);
}

async function deleteTourAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoTour(String(formData.get("id") ?? ""));
  revalidateAdminPaths(locale);
  revalidatePath(`/${locale}/turlar`);
  revalidatePath(`/${locale}`);
}

async function createDateAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await createDemoTourDate({
    tourId: String(formData.get("tourId") ?? ""),
    start: String(formData.get("start") ?? ""),
    end: String(formData.get("end") ?? ""),
    price: Number(formData.get("price") ?? 0),
    currency: String(formData.get("currency") ?? "TRY") as "TRY" | "EUR" | "USD",
    availability: readLocalizedFormText(formData, "availability"),
    jollyUrl: String(formData.get("jollyUrl") ?? ""),
  });
  revalidateAdminPaths(locale);
  revalidatePath(`/${locale}/turlar`);
}

async function updateDateAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await updateDemoTourDate({
    tourId: String(formData.get("tourId") ?? ""),
    dateId: String(formData.get("dateId") ?? ""),
    start: String(formData.get("start") ?? ""),
    end: String(formData.get("end") ?? ""),
    price: Number(formData.get("price") ?? 0),
    currency: String(formData.get("currency") ?? "TRY") as "TRY" | "EUR" | "USD",
    availability: readLocalizedFormText(formData, "availability"),
    jollyUrl: String(formData.get("jollyUrl") ?? ""),
  });
  revalidateAdminPaths(locale);
  revalidatePath(`/${locale}/turlar`);
}

async function deleteDateAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoTourDate(
    String(formData.get("tourId") ?? ""),
    String(formData.get("dateId") ?? ""),
  );
  revalidateAdminPaths(locale);
  revalidatePath(`/${locale}/turlar`);
}

async function updateSettingsAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await updateDemoSettings({
    siteName: String(formData.get("siteName") ?? ""),
    logoMark: String(formData.get("logoMark") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    email: String(formData.get("email") ?? ""),
    jollyUrl: String(formData.get("jollyUrl") ?? ""),
    tursabCertificate: String(formData.get("tursabCertificate") ?? ""),
  });
  revalidateAdminPaths(locale);
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/turlar`);
}

async function createPageAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await createDemoManagedPage({
    kind: String(formData.get("kind") ?? "info") as DemoManagedPageKind,
    title: readLocalizedFormText(formData, "title"),
    slug: readLocalizedFormText(formData, "slug"),
    summary: readLocalizedFormText(formData, "summary"),
    seoTitle: readLocalizedFormText(formData, "seoTitle"),
    seoDescription: readLocalizedFormText(formData, "seoDescription"),
    canonical: readLocalizedFormText(formData, "canonical"),
    ogImage: String(formData.get("ogImage") ?? ""),
    keywords: String(formData.get("keywords") ?? ""),
    noIndex: formData.get("noIndex") === "on",
  });
  revalidateAdminPaths(locale);
}

async function updatePageAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await updateDemoManagedPage({
    id: String(formData.get("id") ?? ""),
    kind: String(formData.get("kind") ?? "info") as DemoManagedPageKind,
    title: readLocalizedFormText(formData, "title"),
    slug: readLocalizedFormText(formData, "slug"),
    summary: readLocalizedFormText(formData, "summary"),
    seoTitle: readLocalizedFormText(formData, "seoTitle"),
    seoDescription: readLocalizedFormText(formData, "seoDescription"),
    canonical: readLocalizedFormText(formData, "canonical"),
    ogImage: String(formData.get("ogImage") ?? ""),
    keywords: String(formData.get("keywords") ?? ""),
    noIndex: formData.get("noIndex") === "on",
    active: formData.get("active") === "on",
  });
  revalidateAdminPaths(locale);
}

async function deletePageAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoManagedPage(String(formData.get("id") ?? ""));
  revalidateAdminPaths(locale);
}

async function createContactAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr") as Locale;
  await createDemoContact({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    locale,
  });
  revalidateAdminPaths(locale);
}

async function updateContactAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await updateDemoContact({
    id: String(formData.get("id") ?? ""),
    status: String(formData.get("status") ?? "Yeni") as DemoContactStatus,
    message: String(formData.get("message") ?? ""),
  });
  revalidateAdminPaths(locale);
}

async function deleteContactAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoContact(String(formData.get("id") ?? ""));
  revalidateAdminPaths(locale);
}

async function createUserAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await createDemoUser({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? "Satış danışmanı") as DemoUserRole,
  });
  revalidateAdminPaths(locale);
}

async function updateUserAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await updateDemoUser({
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? "Satış danışmanı") as DemoUserRole,
    active: formData.get("active") === "on",
  });
  revalidateAdminPaths(locale);
}

async function deleteUserAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoUser(String(formData.get("id") ?? ""));
  revalidateAdminPaths(locale);
}

export default async function AdminPanel({
  params,
  searchParams,
  section = "dashboard",
}: AdminPanelProps) {
  const { locale } = await params;
  const filters = (await searchParams) ?? {};

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getAdminSession();
  const activeMeta = sectionMeta[section];
  const query = normalizedSearch(searchValue(filters, "q"));
  const statusFilter = searchValue(filters, "status");
  const channelFilter = searchValue(filters, "channel");
  const categoryFilter = searchValue(filters, "category");
  const sortFilter = searchValue(filters, "sort");
  const kindFilter = searchValue(filters, "kind");

  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const [store, allTours] = await Promise.all([
    readDemoStore(),
    getAllToursWithDemo(),
  ]);
  const databaseStatus = getDatabaseStatus();
  const leads = store.leads;
  const today = new Date().toISOString().slice(0, 10);
  const visibleLeads = leads
    .filter((lead) => {
      const matchesStatus = !statusFilter || lead.status === statusFilter;
      const matchesChannel = !channelFilter || lead.channel === channelFilter;
      return (
        matchesStatus &&
        matchesChannel &&
        textMatches(query, [
          lead.name,
          lead.phone,
          lead.email,
          lead.tourTitle,
          lead.note,
          lead.sourcePath,
          lead.owner,
        ])
      );
    })
    .sort((left, right) => {
      const leftDue = left.nextFollowUpAt && left.nextFollowUpAt <= today ? 1 : 0;
      const rightDue = right.nextFollowUpAt && right.nextFollowUpAt <= today ? 1 : 0;
      if (leftDue !== rightDue) return rightDue - leftDue;
      return leadScore(right) - leadScore(left);
    });
  const leadCount = leads.length;
  const soldLeads = leads.filter((lead) => lead.status === "Satışa döndü").length;
  const conversionRate = leadCount ? Math.round((soldLeads / leadCount) * 100) : 0;
  const dueFollowUps = leads.filter(
    (lead) => lead.nextFollowUpAt && lead.nextFollowUpAt <= today,
  ).length;
  const highScoreLeads = leads.filter((lead) => leadScore(lead) >= 82).length;
  const whatsappLeads = leads.filter((lead) => lead.channel === "WhatsApp").length;
  const utmLeads = leads.filter((lead) => lead.sourcePath.includes("utm_")).length;
  const tourViewEvents = store.events.filter((event) => event.name === "tour_view");
  const tourViews = tourViewEvents.length;
  const jollyEvents = store.events.filter((event) => event.name === "jolly_click");
  const jollyClicks = jollyEvents.length;
  const jollyByTour = Array.from(
    jollyEvents.reduce((map, event) => {
      const tourTitle = String(event.payload.tourTitle ?? "Bilinmeyen tur");
      map.set(tourTitle, (map.get(tourTitle) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5);
  const whatsappClicks = store.events.filter(
    (event) => event.name === "whatsapp_click",
  ).length;
  const formEvents = store.events.filter((event) => event.name === "lead_submit").length;
  const sevenDaysAgo =
    new Date(`${today}T00:00:00.000Z`).getTime() - 6 * 24 * 60 * 60 * 1000;
  const recentEventCount = store.events.filter(
    (event) => new Date(event.createdAt).getTime() >= sevenDaysAgo,
  ).length;
  const viewToLeadRate = tourViews
    ? Math.round((Math.max(formEvents, leads.length) / tourViews) * 100)
    : 0;
  const jollyClickRate = tourViews ? Math.round((jollyClicks / tourViews) * 100) : 0;
  const mediaReadyTours = allTours.filter(
    (tour) =>
      tour.image &&
      ((tour.gallery?.length ?? 0) >= 3 ||
        !store.tours.some((demoTour) => demoTour.id === tour.id)),
  ).length;
  const salesContentReadyTours = allTours.filter(
    (tour) =>
      (tour.highlights?.[locale]?.length ?? 0) >= 2 &&
      (tour.salesBadges?.[locale]?.length ?? 0) >= 2,
  ).length;
  const eventsByName = Array.from(
    store.events.reduce((map, event) => {
      map.set(event.name, (map.get(event.name) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6);
  const eventsByLocale = Array.from(
    store.events.reduce((map, event) => {
      const eventLocale = String(event.payload.locale ?? "bilinmiyor").toUpperCase();
      map.set(eventLocale, (map.get(eventLocale) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  ).sort((left, right) => right[1] - left[1]);
  const leadsByChannel = Array.from(
    leads.reduce((map, lead) => {
      map.set(lead.channel, (map.get(lead.channel) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  ).sort((left, right) => right[1] - left[1]);
  const latestEvents = store.events.slice(0, 8);
  const adminSecret = process.env.ADMIN_AUTH_SECRET ?? "";
  const hasProductionSecret =
    adminSecret.length >= 24 && adminSecret !== "change-this-secret-before-production";
  const hasAdminPassword = Boolean(process.env.ADMIN_PASSWORD);
  const hasRealJollyUrl = store.settings.jollyUrl.startsWith("http");
  const hasTursabPlaceholder = ["sonra", "placeholder", "belge alanı", "bekleniyor"].some(
    (word) => store.settings.tursabCertificate.toLocaleLowerCase("tr").includes(word),
  );
  const hasContactPlaceholders = ["000", "555 000", "example", "demo"].some((word) =>
    `${store.settings.phone} ${store.settings.whatsapp} ${store.settings.email}`
      .toLocaleLowerCase("tr")
      .includes(word),
  );
	  const launchChecks = [
    {
      description: "ADMIN_AUTH_SECRET güçlü ve özel bir değer olmalı.",
      label: "Admin oturum gizliği",
      ready: hasProductionSecret,
    },
    {
      description: "ADMIN_PASSWORD canlı ortamda özel olarak verilmiş olmalı.",
      label: "Admin şifresi",
      ready: hasAdminPassword,
    },
    {
      description: "Demo mod çalışır; canlıda PostgreSQL bağlantısı önerilir.",
      label: "Veri kaynağı",
      ready: databaseStatus.mode === "postgres" && databaseStatus.configured,
    },
    {
      description: "Tur detay ve tarih butonları geçerli Jolly linkine yönlenmeli.",
      label: "Jolly yönlendirmesi",
      ready: hasRealJollyUrl,
    },
    {
      description: "Gerçek telefon, WhatsApp ve e-posta bilgileri girilmeli.",
      label: "İletişim bilgileri",
      ready: !hasContactPlaceholders,
    },
    {
      description: "TÜRSAB belge numarası ve doğrulama alanı canlıya çıkmadan doldurulmalı.",
      label: "TÜRSAB alanı",
      ready: Boolean(store.settings.tursabCertificate) && !hasTursabPlaceholder,
    },
    {
      description: "TR/EN/DE/RU route ve içerik alanları aktif durumda.",
      label: "4 dil mimarisi",
      ready: locales.length === 4,
    },
    {
      description: "Tur, landing, canonical ve sitemap üretimi kontrol edildi.",
      label: "SEO altyapısı",
      ready: store.managedPages.length + allLandingPages.length > 0,
    },
    {
      description: "Tur detaylarında kapak/galeri görselleri ve satış vurguları hazır olmalı.",
      label: "Medya ve satış içeriği",
      ready: mediaReadyTours === allTours.length && salesContentReadyTours > 0,
    },
    {
      description: "Ön talep formu ve CRM pipeline demo store üzerinden çalışıyor.",
      label: "Talep akışı",
      ready: leadCount > 0,
    },
    {
      description: "/api/health endpoint'i izleme sistemleri için hazır.",
      label: "Health endpoint",
      ready: true,
	    },
	  ];
	  const databaseMigrationSteps = [
	    {
	      description: "docs/database-schema.sql içinde canlı PostgreSQL tablo taslağı hazır.",
	      label: "Şema dosyası",
	      ready: true,
	    },
	    {
	      description: "DATABASE_URL tanımlandığında demo store yerine SQL katmanına geçilebilir.",
	      label: "Bağlantı ayarı",
	      ready: databaseStatus.configured,
	    },
	    {
	      description: "Demo lead, tur ve sayfa kayıtları export/import scriptine bağlanacak.",
	      label: "Demo veri aktarımı",
	      ready: databaseStatus.mode === "postgres",
	    },
	  ];
	  const operationChecks = [
	    {
	      description: "Ön talep ve event endpointlerinde basit rate-limit aktif.",
	      label: "Form koruması",
	      ready: true,
	    },
	    {
	      description: "Lead endpointi payload, telefon ve KVKK doğrulaması yapıyor.",
	      label: "Veri doğrulama",
	      ready: true,
	    },
	    {
	      description: "Tracking kayıtları demo store içinde son 500 event ile sınırlanıyor.",
	      label: "Event sınırı",
	      ready: true,
	    },
	  ];
	  const launchReadyCount = launchChecks.filter((check) => check.ready).length;
  const demoTourById = new Map(store.tours.map((tour) => [tour.id, tour]));
  const adminTours = [
    ...store.tours.map((tour) => demoTourToTour(tour)),
    ...allTours.filter((tour) => !demoTourById.has(tour.id)),
  ]
    .filter((tour) => {
      const demoTour = demoTourById.get(tour.id);
      const matchesCategory = !categoryFilter || tour.categoryIds.includes(categoryFilter);
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active" && demoTour?.active !== false) ||
        (statusFilter === "passive" && demoTour?.active === false) ||
        (statusFilter === "catalog" && !demoTour);
      return (
        matchesCategory &&
        matchesStatus &&
        textMatches(query, [
          tour.title[locale],
          tour.summary[locale],
          tour.route[locale],
          tour.tags[locale].join(" "),
          tour.categoryIds.join(" "),
        ])
      );
    })
    .sort((left, right) => {
      if (sortFilter === "price_asc") return left.priceFrom - right.priceFrom;
      if (sortFilter === "price_desc") return right.priceFrom - left.priceFrom;
      if (sortFilter === "duration_asc") return left.durationDays - right.durationDays;
      return left.title[locale].localeCompare(right.title[locale], "tr");
    });
  const managedPageCount = store.managedPages.length + allLandingPages.length;
  const allSeoPreviewPages = [
    ...store.managedPages.map((page) => {
      const path =
        page.kind === "campaign"
          ? `/${locale}/kampanyalar/${page.slugs[locale]}`
          : `/${locale}/${page.slugs[locale]}`;
      const summary = page.seoDescription[locale] || page.summary[locale];
      const title = page.seoTitle[locale] || page.title[locale];
      const canonical = page.canonical[locale] || path;
      const issues = seoIssueList({
        canonical,
        keywordCount: page.keywords.length,
        noIndex: page.noIndex,
        ogImage: page.ogImage,
        summary,
        title,
      });

      return {
        canonical,
        id: page.id,
        issues,
        keywordCount: page.keywords.length,
        kind: page.kind,
        languageScore: languageCompletion([
          page.title,
          page.slugs,
          page.summary,
          page.seoTitle,
          page.seoDescription,
          page.canonical,
        ]),
        noIndex: page.noIndex,
        ogImage: page.ogImage,
        path,
        score: seoScoreForIssues(issues),
        status: page.active ? "Yayında" : "Pasif",
        summary,
        title,
      };
    }),
    ...allLandingPages.map((page) => {
      const path =
        page.kind === "campaign"
          ? `/${locale}/kampanyalar/${page.slugs[locale]}`
          : `/${locale}/${page.slugs[locale]}`;
      const summary = page.seoDescription?.[locale] ?? page.summary[locale];
      const title = page.seoTitle?.[locale] ?? page.title[locale];
      const canonical = page.canonical?.[locale] || path;
      const keywordCount = page.keywords?.length ?? 0;
      const ogImage = page.ogImage ?? page.image ?? "";
      const noIndex = Boolean(page.noIndex);
      const issues = seoIssueList({
        canonical,
        keywordCount,
        noIndex,
        ogImage,
        summary,
        title,
      });

      return {
        canonical,
        id: page.id,
        issues,
        keywordCount,
        kind: page.kind,
        languageScore: languageCompletion([
          page.title,
          page.slugs,
          page.summary,
          page.seoTitle,
          page.seoDescription,
          page.canonical,
        ]),
        noIndex,
        ogImage,
        path,
        score: seoScoreForIssues(issues),
        status: "Hazır",
        summary,
        title,
      };
    }),
  ].filter((page) => {
    const matchesKind = !kindFilter || page.kind === kindFilter;
    return matchesKind && textMatches(query, [page.title, page.summary, page.path]);
  });
  const seoPreviewPages = allSeoPreviewPages.slice(0, 10);
  const seoOpenIssueCount = allSeoPreviewPages.reduce(
    (sum, page) => sum + page.issues.length,
    0,
  );
  const seoAverageScore = averageScore(allSeoPreviewPages.map((page) => page.score));
  const seoLanguageAverage = averageScore(
    allSeoPreviewPages.map((page) => page.languageScore),
  );
  const seoActionItems = allSeoPreviewPages
    .filter((page) => page.issues.length)
    .slice(0, 5);
  const seoOpportunities = [...categories, ...campaigns, ...destinations]
    .map((page) => ({
      keyword: `${page.title.tr.toLocaleLowerCase("tr")} ${page.kind === "destination" ? "tur programı" : "tur fiyatları"}`,
      path:
        page.kind === "campaign"
          ? `/${locale}/kampanyalar/${page.slugs[locale]}`
          : `/${locale}/${page.slugs[locale]}`,
      priority:
        page.kind === "campaign"
          ? "Sezon"
          : page.kind === "destination"
            ? "Rota"
            : "Kategori",
      title: page.title[locale],
    }))
    .slice(0, 8);
  const visibleContacts = store.contacts.filter((contact) =>
    textMatches(query, [
      contact.name,
      contact.phone,
      contact.email,
      contact.subject,
      contact.message,
      contact.status,
    ]),
  );
  const visibleUsers = store.users.filter((user) =>
    textMatches(query, [user.name, user.email, user.role]),
  );

  return (
    <main className="admin-shell min-h-screen bg-[#f4f6f8] text-[#172026]">
      <div className="grid min-h-screen lg:grid-cols-[236px_1fr]">
        <aside className="border-r border-[#dde3ea] bg-[#28374f] text-white">
          <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
            <span className="grid size-9 place-items-center bg-[#ff9900] text-xs font-black text-[#28374f]">
              {store.settings.logoMark}
            </span>
            <div>
              <p className="text-sm font-black leading-5">{store.settings.siteName}</p>
              <p className="text-xs text-white/58">Acenta Yönetim Paneli</p>
            </div>
          </div>
          <nav className="grid gap-1 p-3">
            {navItems.map((item) => {
              const active = item.section === section;

              return (
                <Link
                  className={`flex items-center justify-between border border-transparent px-3 py-2 text-sm font-bold transition ${
                    active
                      ? "border-white/10 bg-white/[0.08] text-white"
                      : "text-white/72 hover:border-white/10 hover:bg-white/8 hover:text-white"
                  }`}
                  href={`/${locale}/admin${item.href}`}
                  key={`${item.href}-${item.label}`}
                >
                  <span>{item.label}</span>
                  {active ? <span className="text-[#f6b44b]">Aktif</span> : null}
                </Link>
              );
            })}
          </nav>
          <div className="m-3 border border-white/10 bg-white/[0.06] p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#f6b44b]">
              Demo Mod
            </p>
            <p className="mt-2 text-xs leading-5 text-white/72">
              Bu panel database olmadan çalışır. Kayıtlar proje içindeki
              <span className="font-black"> .demo-data </span>
              klasöründe tutulur; sonra aynı API katmanı gerçek database yapısına bağlanır.
            </p>
          </div>
          <div className="m-3 border border-white/10 bg-white/[0.06] p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#f6b44b]">
              Oturum
            </p>
            <p className="mt-2 break-words text-xs font-black">{session.name}</p>
            <p className="mt-1 break-all text-xs text-white/62">{session.email}</p>
            <p className="mt-1 text-xs text-white/62">{session.role}</p>
            <form action={logoutAction} className="mt-3">
              <input name="locale" type="hidden" value={locale} />
              <button className="admin-btn-light w-full !border-white/20 !bg-white/10 !text-white" type="submit">
                Çıkış Yap
              </button>
            </form>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[#dde3ea] bg-white/92 backdrop-blur">
            <div className="flex min-h-14 flex-col gap-2 px-4 py-2 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#e85d3f]">
                  {activeMeta.eyebrow}
                </p>
                <h1 className="text-xl font-black">{activeMeta.title}</h1>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  className="admin-input !min-h-9 min-w-0 sm:w-72"
                  placeholder="Tur, müşteri, kategori veya sayfa ara"
                />
                <Link className="admin-btn-light" href={`/${locale}`}>
                  Siteyi Gör
                </Link>
                <Link className="admin-btn" href={`/${locale}/admin/turlar#yeni-tur-formu`}>
                  Yeni Tur Ekle
                </Link>
              </div>
            </div>
          </header>

          <div className="grid gap-4 px-4 py-4 xl:px-5">
            {section === "dashboard" ? (
              <>
                <section
                  className="scroll-mt-24 grid gap-4 md:grid-cols-2 2xl:grid-cols-4"
                  id="dashboard"
                >
                  <MetricCard
                    accent="coral"
                    label="Aktif Tur"
                    sub="Katalog + eklenen turlar"
                    value={String(allTours.length)}
                  />
                  <MetricCard
                    accent="teal"
                    label="Ön Talep"
                    sub="Dosya tabanlı kaydediliyor"
                    value={String(leadCount)}
                  />
                  <MetricCard
                    accent="gold"
                    label="Dönüşüm"
                    sub="Satışa dönen talep oranı"
                    value={`%${conversionRate}`}
                  />
                  <MetricCard
                    accent="ink"
                    label="SEO Sayfası"
                    sub="Hazır + admin içerikleri"
                    value={String(managedPageCount)}
                  />
                  <MetricCard
                    accent={databaseStatus.mode === "demo" ? "gold" : "teal"}
                    label="Veri Kaynağı"
                    sub={databaseStatus.message}
                    value={databaseStatus.mode === "demo" ? "Demo" : "SQL"}
                  />
                </section>
                <section className="grid gap-4 xl:grid-cols-3">
                  <Panel eyebrow="Medya" title="Görsel ve İçerik Sağlığı">
                    <ReportRow label="Galeri / kapak hazır tur" value={`${mediaReadyTours}/${allTours.length}`} />
                    <ReportRow label="Satış vurgusu tamamlanan tur" value={`${salesContentReadyTours}/${allTours.length}`} />
                    <ReportRow label="Dil içerik ortalaması" value={`%${averageScore(allTours.map(tourLanguageScore))}`} />
                  </Panel>
                  <Panel eyebrow="Analitik" title="Dönüşüm Kısayolu">
                    <ReportRow label="Tur görüntüleme" value={String(tourViews)} />
                    <ReportRow label="Görüntüleme > talep" value={`%${viewToLeadRate}`} />
                    <ReportRow label="Görüntüleme > Jolly" value={`%${jollyClickRate}`} />
                  </Panel>
                  <Panel eyebrow="Satış" title="Bugünün Öncelikleri">
                    <ReportRow label="Takip zamanı gelen" value={String(dueFollowUps)} />
                    <ReportRow label="Yüksek skor lead" value={String(highScoreLeads)} />
                    <ReportRow label="WhatsApp lead" value={String(whatsappLeads)} />
                  </Panel>
                </section>
              </>
            ) : null}

            {section === "leads" || section === "tours" ? (
              <section className="grid gap-4 2xl:grid-cols-[1.25fr_0.75fr]">
                {section === "leads" ? (
                  <Panel eyebrow="Satış Akışı" id="on-talepler" title="Ön Talep CRM" action="Canlı">
                <AdminToolbar defaultQuery={searchValue(filters, "q")} resetHref={`/${locale}/admin/talepler`}>
                  <select className="admin-input !min-h-9" defaultValue={statusFilter} name="status">
                    <option value="">Tüm durumlar</option>
                    {leadStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <select className="admin-input !min-h-9" defaultValue={channelFilter} name="channel">
                    <option value="">Tüm kanallar</option>
                    {leadChannels.map((channel) => (
                      <option key={channel} value={channel}>
                        {channel}
                      </option>
                    ))}
                  </select>
                </AdminToolbar>
                <div className="mb-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                  <CrmSummary label="Takip bekleyen" value={String(dueFollowUps)} />
                  <CrmSummary label="WhatsApp kanalı" value={String(whatsappLeads)} />
                  <CrmSummary label="UTM talep" value={String(utmLeads)} />
                  <CrmSummary label="Yüksek skor" value={String(highScoreLeads)} />
                  <CrmSummary label="Satışa dönen" value={String(soldLeads)} />
                </div>
                <div className="grid min-w-0 gap-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {leadStatuses.map((status) => (
                    <PipelineColumn
                      key={status}
                      leads={visibleLeads.filter((lead) => lead.status === status)}
                      locale={locale}
                      status={status}
                    />
                  ))}
                </div>
                  </Panel>
                ) : null}

                {section === "tours" ? (
                  <Panel eyebrow="Hızlı İşlem" title="Yeni Tur Formu">
                <form action={createTourAction} className="grid gap-2" id="yeni-tur-formu">
                  <input name="locale" type="hidden" value={locale} />
                  <LocalizedAdminField
                    label="Tur adı"
                    name="title"
                    placeholder="Tur adı"
                    requiredTr
                  />
                  <LocalizedAdminField
                    label="Slug"
                    name="slug"
                    placeholder="karadeniz-ruyasi-turu"
                    requiredTr
                  />
                  <LocalizedAdminField
                    label="Kısa açıklama"
                    multiline
                    name="summary"
                    placeholder="Kısa açıklama"
                  />
                  <LocalizedAdminField
                    label="Detay açıklaması"
                    multiline
                    name="description"
                    placeholder="Tur detay metni"
                  />
                  <input
                    className="admin-input"
                    name="image"
                    placeholder="Kapak görseli URL"
                  />
                  <textarea
                    className="admin-input min-h-20 resize-y"
                    name="gallery"
                    placeholder="Galeri görselleri, her satıra bir URL"
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      className="admin-input"
                      min="1"
                      name="priceFrom"
                      placeholder="Başlangıç fiyatı"
                      required
                      type="number"
                    />
                    <select className="admin-input" defaultValue="TRY" name="currency">
                      <option>TRY</option>
                      <option>EUR</option>
                      <option>USD</option>
                    </select>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      className="admin-input"
                      min="1"
                      name="durationDays"
                      placeholder="Gün"
                      type="number"
                    />
                    <input
                      className="admin-input"
                      min="0"
                      name="durationNights"
                      placeholder="Gece"
                      type="number"
                    />
                  </div>
                  <LocalizedAdminField
                    label="Kalkış noktaları"
                    name="departures"
                    placeholder="İstanbul, Ankara"
                  />
                  <LocalizedAdminField
                    label="Ulaşım"
                    name="transport"
                    placeholder="Uçak / Otobüs"
                  />
                  <LocalizedAdminField
                    label="Vize durumu"
                    name="visa"
                    placeholder="Vize durumu"
                  />
                  <LocalizedAdminField
                    label="Rota özeti"
                    multiline
                    name="route"
                    placeholder="Rota özeti"
                  />
                  <LocalizedAdminField
                    label="Etiketler"
                    name="tags"
                    placeholder="Vizesiz, Yaz, Aile"
                  />
                  <LocalizedAdminField
                    label="Satış rozetleri"
                    multiline
                    name="salesBadges"
                    placeholder="Jolly ödeme yönlendirmesi, Danışman destekli rezervasyon"
                  />
                  <LocalizedAdminField
                    label="Neden bu tur?"
                    multiline
                    name="highlights"
                    placeholder="Hızlı teklif, güçlü rota, kontenjan takibi"
                  />
                  <LocalizedAdminField
                    label="Hareket noktaları"
                    multiline
                    name="pickupPoints"
                    placeholder="İstanbul Avrupa, Kadıköy, Ankara"
                  />
                  <LocalizedAdminField
                    label="İptal ve güvence metni"
                    multiline
                    name="cancellationPolicy"
                    placeholder="İptal, değişiklik ve ödeme koşulları danışman tarafından teyit edilir."
                  />
                  <LocalizedAdminField
                    label="Gün gün program"
                    multiline
                    name="itinerary"
                    placeholder="1. Gün | Başlık | Program metni"
                  />
                  <LocalizedAdminField
                    label="Dahil olanlar"
                    multiline
                    name="included"
                    placeholder="Her satıra veya virgülle hizmet"
                  />
                  <LocalizedAdminField
                    label="Dahil olmayanlar"
                    multiline
                    name="excluded"
                    placeholder="Her satıra veya virgülle hizmet"
                  />
                  <LocalizedAdminField
                    label="Önemli notlar"
                    multiline
                    name="notes"
                    placeholder="Her satıra not"
                  />
                  <LocalizedAdminField
                    label="Sık sorulan sorular"
                    multiline
                    name="faqs"
                    placeholder="Soru | Yanıt"
                  />
                  <input
                    className="admin-input"
                    name="jollyUrl"
                    placeholder="Jolly yönlendirme linki"
                  />
                  <select className="admin-input" defaultValue="" name="categoryId" required>
                    <option value="" disabled>
                      Kategori seç
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title[locale]}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#47535f]">
                    <input defaultChecked name="featured" type="checkbox" />
                    Öne çıkan tur olarak göster
                  </label>
                  <button className="admin-btn" type="submit">
                    Kaydet ve Yayında Göster
                  </button>
                </form>
                  </Panel>
                ) : null}
              </section>
            ) : null}

            {section === "tours" ? (
              <Panel
              eyebrow="Tur Yönetimi"
              id="turlar"
              title="Turlar"
              action={`${adminTours.length} kayıt`}
            >
              <AdminToolbar defaultQuery={searchValue(filters, "q")} resetHref={`/${locale}/admin/turlar`}>
                <select className="admin-input !min-h-9" defaultValue={categoryFilter} name="category">
                  <option value="">Tüm kategoriler</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title[locale]}
                    </option>
                  ))}
                </select>
                <select className="admin-input !min-h-9" defaultValue={statusFilter} name="status">
                  <option value="">Tüm kayıtlar</option>
                  <option value="active">Yayında</option>
                  <option value="passive">Pasif</option>
                  <option value="catalog">Hazır katalog</option>
                </select>
                <select className="admin-input !min-h-9" defaultValue={sortFilter} name="sort">
                  <option value="">Ada göre</option>
                  <option value="price_asc">Fiyat artan</option>
                  <option value="price_desc">Fiyat azalan</option>
                  <option value="duration_asc">Süre artan</option>
                </select>
              </AdminToolbar>
              <div className="min-w-0">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Tur</th>
                      <th>Kategori</th>
                      <th>Fiyat</th>
                      <th>Tarih</th>
                      <th>Dil</th>
                      <th>Performans</th>
                      <th>Durum</th>
                      <th>Aksiyon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminTours.map((tour, index) => {
                      const demoTour = demoTourById.get(tour.id);
                      const languageScore = tourLanguageScore(tour);

                      return (
                        <tr key={tour.id}>
                          <td data-label="Tur">
                            <div className="flex items-center gap-3">
                              <Image
                                alt=""
                                className="size-12 border border-[#dde3ea] object-cover"
                                height={48}
                                src={tour.image}
                                unoptimized
                                width={48}
                              />
                              <div>
                                <strong>{tour.title[locale]}</strong>
                                <span>/{locale}/turlar/{tour.slugs[locale]}</span>
                              </div>
                            </div>
                          </td>
                          <td data-label="Kategori">{tour.categoryIds.join(", ")}</td>
                          <td data-label="Fiyat">{formatPrice(tour.priceFrom, tour.currency)}</td>
                          <td data-label="Tarih">{tour.dates.length} tarih</td>
                          <td data-label="Dil">
                            <LanguageCompleteness score={languageScore} />
                          </td>
                          <td data-label="Performans">
                            <Progress value={Math.max(36, 88 - index * 7)} />
                          </td>
                          <td data-label="Durum">
                            <StatusBadge tone={demoTour?.active === false ? "amber" : "green"}>
                              {demoTour?.active === false ? "Pasif" : "Yayında"}
                            </StatusBadge>
                          </td>
                          <td data-label="Aksiyon">
                            {demoTour ? (
                              <div className="grid min-w-0 gap-2">
                                <details className="border border-[#dde3ea] bg-[#f8fafc] p-3">
                                  <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.1em] text-[#172026]">
                                    Düzenle
                                  </summary>
                                  <form action={updateTourAction} className="mt-3 grid gap-2">
                                    <input name="id" type="hidden" value={demoTour.id} />
                                    <input name="locale" type="hidden" value={locale} />
                                    <LocalizedAdminField
                                      label="Tur adı"
                                      name="title"
                                      placeholder="Tur adı"
                                      requiredTr
                                      values={demoTour.title}
                                    />
                                    <LocalizedAdminField
                                      label="Slug"
                                      name="slug"
                                      placeholder="tur-slug"
                                      requiredTr
                                      values={demoTour.slugs}
                                    />
                                    <LocalizedAdminField
                                      label="Kısa açıklama"
                                      multiline
                                      name="summary"
                                      placeholder="Kısa açıklama"
                                      values={demoTour.summary}
                                    />
                                    <LocalizedAdminField
                                      label="Detay açıklaması"
                                      multiline
                                      name="description"
                                      placeholder="Tur detay metni"
                                      values={demoTour.description}
                                    />
                                    <input
                                      className="admin-input !min-h-9"
                                      defaultValue={demoTour.image}
                                      name="image"
                                      placeholder="Kapak görseli URL"
                                    />
                                    <textarea
                                      className="admin-input min-h-20 resize-y"
                                      defaultValue={demoTour.gallery.join("\n")}
                                      name="gallery"
                                      placeholder="Galeri görselleri, her satıra bir URL"
                                    />
                                    <div className="grid gap-2 sm:grid-cols-2">
                                      <input
                                        className="admin-input !min-h-9"
                                        defaultValue={demoTour.priceFrom}
                                        min="1"
                                        name="priceFrom"
                                        type="number"
                                      />
                                      <select
                                        className="admin-input !min-h-9"
                                        defaultValue={demoTour.currency}
                                        name="currency"
                                      >
                                        {currencies.map((currency) => (
                                          <option key={currency}>{currency}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                      <input
                                        className="admin-input !min-h-9"
                                        defaultValue={demoTour.durationDays}
                                        min="1"
                                        name="durationDays"
                                        placeholder="Gün"
                                        type="number"
                                      />
                                      <input
                                        className="admin-input !min-h-9"
                                        defaultValue={demoTour.durationNights}
                                        min="0"
                                        name="durationNights"
                                        placeholder="Gece"
                                        type="number"
                                      />
                                    </div>
                                    <select
                                      className="admin-input !min-h-9"
                                      defaultValue={demoTour.categoryIds[0] ?? ""}
                                      name="categoryId"
                                      required
                                    >
                                      {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                          {category.title[locale]}
                                        </option>
                                      ))}
                                    </select>
                                    <LocalizedAdminField
                                      label="Kalkış noktaları"
                                      name="departures"
                                      placeholder="Kalkış noktaları"
                                      values={localizedListText(demoTour.departures)}
                                    />
                                    <LocalizedAdminField
                                      label="Ulaşım"
                                      name="transport"
                                      placeholder="Ulaşım"
                                      values={demoTour.transport}
                                    />
                                    <LocalizedAdminField
                                      label="Vize durumu"
                                      name="visa"
                                      placeholder="Vize durumu"
                                      values={demoTour.visa}
                                    />
                                    <LocalizedAdminField
                                      label="Rota özeti"
                                      multiline
                                      name="route"
                                      placeholder="Rota özeti"
                                      values={demoTour.route}
                                    />
                                    <LocalizedAdminField
                                      label="Etiketler"
                                      name="tags"
                                      placeholder="Etiketler"
                                      values={localizedListText(demoTour.tags)}
                                    />
                                    <LocalizedAdminField
                                      label="Satış rozetleri"
                                      multiline
                                      name="salesBadges"
                                      placeholder="Satış rozetleri"
                                      values={localizedListText(demoTour.salesBadges)}
                                    />
                                    <LocalizedAdminField
                                      label="Neden bu tur?"
                                      multiline
                                      name="highlights"
                                      placeholder="Öne çıkan satış argümanları"
                                      values={localizedListText(demoTour.highlights)}
                                    />
                                    <LocalizedAdminField
                                      label="Hareket noktaları"
                                      multiline
                                      name="pickupPoints"
                                      placeholder="Hareket noktaları"
                                      values={localizedListText(demoTour.pickupPoints)}
                                    />
                                    <LocalizedAdminField
                                      label="İptal ve güvence metni"
                                      multiline
                                      name="cancellationPolicy"
                                      placeholder="İptal ve güvence metni"
                                      values={demoTour.cancellationPolicy}
                                    />
                                    <LocalizedAdminField
                                      label="Gün gün program"
                                      multiline
                                      name="itinerary"
                                      placeholder="1. Gün | Başlık | Program metni"
                                      values={localizedItineraryText(demoTour.itinerary)}
                                    />
                                    <LocalizedAdminField
                                      label="Dahil olanlar"
                                      multiline
                                      name="included"
                                      placeholder="Her satıra veya virgülle hizmet"
                                      values={localizedListText(demoTour.included)}
                                    />
                                    <LocalizedAdminField
                                      label="Dahil olmayanlar"
                                      multiline
                                      name="excluded"
                                      placeholder="Her satıra veya virgülle hizmet"
                                      values={localizedListText(demoTour.excluded)}
                                    />
                                    <LocalizedAdminField
                                      label="Önemli notlar"
                                      multiline
                                      name="notes"
                                      placeholder="Her satıra not"
                                      values={localizedListText(demoTour.notes)}
                                    />
                                    <LocalizedAdminField
                                      label="Sık sorulan sorular"
                                      multiline
                                      name="faqs"
                                      placeholder="Soru | Yanıt"
                                      values={localizedFaqText(demoTour.faqs)}
                                    />
                                    <input
                                      className="admin-input !min-h-9"
                                      defaultValue={demoTour.jollyUrl}
                                      name="jollyUrl"
                                      placeholder="Jolly linki"
                                    />
                                    <label className="flex items-center gap-2 text-sm font-bold text-[#47535f]">
                                      <input
                                        defaultChecked={demoTour.active}
                                        name="active"
                                        type="checkbox"
                                      />
                                      Yayında göster
                                    </label>
                                    <label className="flex items-center gap-2 text-sm font-bold text-[#47535f]">
                                      <input
                                        defaultChecked={demoTour.featured}
                                        name="featured"
                                        type="checkbox"
                                      />
                                      Öne çıkar
                                    </label>
                                    <button className="admin-btn" type="submit">
                                      Turu Güncelle
                                    </button>
                                  </form>
                                </details>
                                <div className="flex flex-wrap gap-2">
                                  <Link
                                    className="admin-icon-btn"
                                    href={`/${locale}/turlar/${tour.slugs[locale]}`}
                                  >
                                    Gör
                                  </Link>
                                  <form action={deleteTourAction}>
                                    <input name="id" type="hidden" value={demoTour.id} />
                                    <input name="locale" type="hidden" value={locale} />
                                    <button className="admin-icon-btn text-[#d94d31]" type="submit">
                                      Sil
                                    </button>
                                  </form>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                <StatusBadge tone="blue">Hazır katalog</StatusBadge>
                                <Link
                                  className="admin-icon-btn"
                                  href={`/${locale}/turlar/${tour.slugs[locale]}`}
                                >
                                  Gör
                                </Link>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              </Panel>
            ) : null}

            {section === "tours" ? (
              <section className="grid gap-4 2xl:grid-cols-[0.85fr_1.15fr]">
              <Panel eyebrow="Tarih & Fiyat" id="tarih-fiyat" title="Kontenjan Takibi">
                <div className="grid gap-3">
                  <form action={createDateAction} className="grid gap-2 border border-[#dde3ea] bg-[#f8fafc] p-3">
                    <input name="locale" type="hidden" value={locale} />
                    <p className="font-black">Yeni tarih / kontenjan ekle</p>
                    <select className="admin-input" defaultValue="" name="tourId" required>
                      <option disabled value="">
                        Demo tur seç
                      </option>
                      {store.tours.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                          {tour.title[locale]}
                        </option>
                      ))}
                    </select>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input className="admin-input" name="start" required type="date" />
                      <input className="admin-input" name="end" required type="date" />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        className="admin-input"
                        min="1"
                        name="price"
                        placeholder="Fiyat"
                        required
                        type="number"
                      />
                      <select className="admin-input" defaultValue="TRY" name="currency">
                        {currencies.map((currency) => (
                          <option key={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>
                    <LocalizedAdminField
                      label="Kontenjan durumu"
                      name="availability"
                      placeholder="Müsait / Son kontenjan / Dolu"
                    />
                    <input className="admin-input" name="jollyUrl" placeholder="Tarihe özel Jolly linki" />
                    <button className="admin-btn" disabled={!store.tours.length} type="submit">
                      Tarih Ekle
                    </button>
                  </form>

                  {store.tours.length ? (
                    store.tours.map((tour) => (
                      <div className="border border-[#dde3ea] bg-white p-3" key={tour.id}>
                        <p className="font-black">{tour.title[locale]}</p>
                        <div className="mt-2 grid gap-2">
                          {tour.dates.map((date) => (
                            <details className="border border-[#dde3ea] bg-[#f8fafc] p-3" key={date.id}>
                              <summary className="cursor-pointer">
                                <span className="font-black">
                                  {date.start} / {date.end}
                                </span>
                                <span className="ml-2 text-sm font-bold text-[#64717d]">
                                  {formatPrice(date.price, date.currency)}
                                </span>
                              </summary>
                              <form action={updateDateAction} className="mt-3 grid gap-2">
                                <input name="locale" type="hidden" value={locale} />
                                <input name="tourId" type="hidden" value={tour.id} />
                                <input name="dateId" type="hidden" value={date.id} />
                                <div className="grid gap-2 sm:grid-cols-2">
                                  <input
                                    className="admin-input"
                                    defaultValue={date.start}
                                    name="start"
                                    required
                                    type="date"
                                  />
                                  <input
                                    className="admin-input"
                                    defaultValue={date.end}
                                    name="end"
                                    required
                                    type="date"
                                  />
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  <input
                                    className="admin-input"
                                    defaultValue={date.price}
                                    min="1"
                                    name="price"
                                    type="number"
                                  />
                                  <select
                                    className="admin-input"
                                    defaultValue={date.currency}
                                    name="currency"
                                  >
                                    {currencies.map((currency) => (
                                      <option key={currency}>{currency}</option>
                                    ))}
                                  </select>
                                </div>
                                <LocalizedAdminField
                                  label="Kontenjan durumu"
                                  name="availability"
                                  placeholder="Kontenjan durumu"
                                  values={date.availability}
                                />
                                <input
                                  className="admin-input"
                                  defaultValue={date.jollyUrl}
                                  name="jollyUrl"
                                  placeholder="Jolly linki"
                                />
                                <div className="flex flex-wrap gap-2">
                                  <button className="admin-btn" type="submit">
                                    Güncelle
                                  </button>
                                  <button
                                    className="admin-icon-btn text-[#d94d31]"
                                    formAction={deleteDateAction}
                                    formNoValidate
                                    type="submit"
                                  >
                                    Sil
                                  </button>
                                </div>
                              </form>
                            </details>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="border border-dashed border-[#c7d0da] bg-white p-3 text-sm text-[#64717d]">
                      Tarih yönetimi için önce demo tur ekleyin.
                    </div>
                  )}
                </div>
              </Panel>
              </section>
            ) : null}

            {section === "seo" ? (
              <section className="grid gap-4">
              <Panel eyebrow="İçerik ve SEO" id="sayfa-yonetimi" title="Sayfa Yönetimi">
                <div className="grid gap-4">
                  <AdminToolbar defaultQuery={searchValue(filters, "q")} resetHref={`/${locale}/admin/seo`}>
                    <select className="admin-input !min-h-9" defaultValue={kindFilter} name="kind">
                      <option value="">Tüm sayfa türleri</option>
                      {managedPageKinds.map((kind) => (
                        <option key={kind} value={kind}>
                          {kind}
                        </option>
                      ))}
                    </select>
                  </AdminToolbar>
                  <form action={createPageAction} className="grid min-w-0 gap-2 border border-[#dde3ea] bg-[#f8fafc] p-3 md:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)]">
                    <input name="locale" type="hidden" value={locale} />
                    <select className="admin-input" defaultValue="info" name="kind">
                      {managedPageKinds.map((kind) => (
                        <option key={kind} value={kind}>
                          {kind}
                        </option>
                      ))}
                    </select>
                    <div className="md:col-span-2">
                      <LocalizedAdminField
                        label="Sayfa başlığı"
                        name="title"
                        placeholder="Sayfa başlığı"
                        requiredTr
                      />
                    </div>
                    <div className="md:col-span-3">
                      <LocalizedAdminField
                        label="Slug"
                        name="slug"
                        placeholder="sayfa-slug"
                        requiredTr
                      />
                    </div>
                    <div className="md:col-span-3">
                      <LocalizedAdminField
                        label="Sayfa özeti"
                        multiline
                        name="summary"
                        placeholder="SEO özeti / kısa açıklama"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <LocalizedAdminField
                        label="Meta başlık"
                        name="seoTitle"
                        placeholder="Meta başlık"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <LocalizedAdminField
                        label="Meta açıklama"
                        multiline
                        name="seoDescription"
                        placeholder="Meta açıklama"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <LocalizedAdminField
                        label="Canonical"
                        name="canonical"
                        placeholder="Canonical URL"
                      />
                    </div>
                    <input
                      className="admin-input md:col-span-3"
                      name="ogImage"
                      placeholder="Open Graph görsel URL"
                    />
                    <input
                      className="admin-input md:col-span-3"
                      name="keywords"
                      placeholder="Anahtar kelimeler, virgülle ayırın"
                    />
                    <label className="flex items-center gap-2 text-sm font-bold text-[#47535f] md:col-span-3">
                      <input name="noIndex" type="checkbox" />
                      Noindex olarak işaretle
                    </label>
                    <button className="admin-btn md:col-span-3" type="submit">
                      Sayfa Kaydı Oluştur
                    </button>
                  </form>

                  <div className="grid min-w-0 gap-2 md:grid-cols-2">
                    {store.managedPages.map((page) => (
                      <div className="border border-[#dde3ea] bg-white p-3" key={page.id}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-black">{page.title[locale]}</p>
                            <p className="mt-1 text-sm text-[#64717d]">
                              /{locale}/{page.slugs[locale]}
                            </p>
                          </div>
                          <StatusBadge tone={page.active ? "green" : "amber"}>
                            {page.active ? "Aktif" : "Pasif"}
                          </StatusBadge>
                        </div>
                        <form action={updatePageAction} className="mt-4 grid gap-2">
                          <input name="id" type="hidden" value={page.id} />
                          <input name="locale" type="hidden" value={locale} />
                          <select className="admin-input" defaultValue={page.kind} name="kind">
                            {managedPageKinds.map((kind) => (
                              <option key={kind} value={kind}>
                                {kind}
                              </option>
                            ))}
                          </select>
                          <LocalizedAdminField
                            label="Sayfa başlığı"
                            name="title"
                            placeholder="Sayfa başlığı"
                            requiredTr
                            values={page.title}
                          />
                          <LocalizedAdminField
                            label="Slug"
                            name="slug"
                            placeholder="sayfa-slug"
                            requiredTr
                            values={page.slugs}
                          />
                          <LocalizedAdminField
                            label="Sayfa özeti"
                            multiline
                            name="summary"
                            placeholder="SEO özeti / kısa açıklama"
                            values={page.summary}
                          />
                          <LocalizedAdminField
                            label="Meta başlık"
                            name="seoTitle"
                            placeholder="Meta başlık"
                            values={page.seoTitle}
                          />
                          <LocalizedAdminField
                            label="Meta açıklama"
                            multiline
                            name="seoDescription"
                            placeholder="Meta açıklama"
                            values={page.seoDescription}
                          />
                          <LocalizedAdminField
                            label="Canonical"
                            name="canonical"
                            placeholder="Canonical URL"
                            values={page.canonical}
                          />
                          <input
                            className="admin-input"
                            defaultValue={page.ogImage}
                            name="ogImage"
                            placeholder="Open Graph görsel URL"
                          />
                          <input
                            className="admin-input"
                            defaultValue={page.keywords.join(", ")}
                            name="keywords"
                            placeholder="Anahtar kelimeler"
                          />
                          <label className="flex items-center gap-2 text-sm font-bold text-[#47535f]">
                            <input defaultChecked={page.noIndex} name="noIndex" type="checkbox" />
                            Noindex
                          </label>
                          <label className="flex items-center gap-2 text-sm font-bold text-[#47535f]">
                            <input defaultChecked={page.active} name="active" type="checkbox" />
                            Aktif
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <button className="admin-btn" type="submit">
                              Güncelle
                            </button>
                            <button
                              className="admin-icon-btn text-[#d94d31]"
                              formAction={deletePageAction}
                              formNoValidate
                              type="submit"
                            >
                              Sil
                            </button>
                          </div>
                        </form>
                      </div>
                    ))}

                    {[...categories, ...campaigns, ...destinations]
                      .slice(0, 10)
                      .map((page) => (
                        <div
                          className="border border-[#dde3ea] bg-[#f8fafc] p-3"
                          key={page.id}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-black">{page.title[locale]}</p>
                              <p className="mt-1 text-sm text-[#64717d]">
                                /{locale}/{page.slugs[locale]}
                              </p>
                            </div>
                            <StatusBadge tone="blue">Hazır {page.kind}</StatusBadge>
                          </div>
                          <div className="mt-4 grid grid-cols-4 gap-1">
                            {locales.map((item) => (
                              <span
                                className="border border-[#dde3ea] bg-white py-1 text-center text-xs font-black"
                                key={item}
                              >
                                {item.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Panel>

              <Panel eyebrow="SEO" id="seo" title="SEO Kontrol Merkezi" action="Aktif">
              <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <form
                  action={createPageAction}
                  className="grid h-fit min-w-0 gap-3 border border-[#dde3ea] bg-[#f8fafc] p-3"
                >
                  <input name="locale" type="hidden" value={locale} />
                  <p className="font-black">Yeni SEO landing sayfası</p>
                  <select className="admin-input" defaultValue="info" name="kind">
                    {managedPageKinds.map((kind) => (
                      <option key={kind} value={kind}>
                        {kind}
                      </option>
                    ))}
                  </select>
                  <LocalizedAdminField
                    label="Sayfa adı"
                    name="title"
                    placeholder="Meta başlık / sayfa adı"
                    requiredTr
                  />
                  <LocalizedAdminField
                    label="Slug"
                    name="slug"
                    placeholder="seo-url-slug"
                    requiredTr
                  />
                  <LocalizedAdminField
                    label="Sayfa giriş metni"
                    multiline
                    name="summary"
                    placeholder="Meta açıklama ve sayfa giriş metni"
                  />
                  <LocalizedAdminField
                    label="SEO title"
                    name="seoTitle"
                    placeholder="SEO title"
                  />
                  <LocalizedAdminField
                    label="SEO description"
                    multiline
                    name="seoDescription"
                    placeholder="SEO description"
                  />
                  <LocalizedAdminField
                    label="Canonical"
                    name="canonical"
                    placeholder="Canonical URL"
                  />
                  <input
                    className="admin-input"
                    name="ogImage"
                    placeholder="Open Graph görsel URL"
                  />
                  <input
                    className="admin-input"
                    name="keywords"
                    placeholder="Anahtar kelimeler"
                  />
                  <label className="flex items-center gap-2 text-sm font-bold text-[#47535f]">
                    <input name="noIndex" type="checkbox" />
                    Noindex olarak işaretle
                  </label>
                  <button className="admin-btn" type="submit">
                    SEO Sayfasını Yayına Hazırla
                  </button>
                </form>

	                <div className="grid min-w-0 gap-2">
	                  <div className="grid gap-2 md:grid-cols-3">
	                    <SeoStat label="SEO ortalama" value={`%${seoAverageScore}`} />
	                    <SeoStat label="Dil tamamlığı" value={`%${seoLanguageAverage}`} />
	                    <SeoStat label="Açık kontrol" value={`${seoOpenIssueCount} konu`} />
	                  </div>
	                  <ReportBox title="SEO Üretim Kuyruğu">
	                    {seoActionItems.length ? (
	                      seoActionItems.map((page) => (
	                        <ReportRow
	                          key={`seo-action-${page.id}`}
	                          label={`${page.title} · ${page.issues.slice(0, 2).join(", ")}`}
	                          value={`%${page.score}`}
	                        />
	                      ))
	                    ) : (
	                      <EmptyReportText>Filtrelenen sayfalarda açık SEO kontrolü yok.</EmptyReportText>
	                    )}
	                  </ReportBox>
	                  <ReportBox title="Landing Fırsatları">
	                    {seoOpportunities.map((item) => (
	                      <ReportRow
	                        key={`${item.priority}-${item.path}`}
	                        label={`${item.title} · ${item.keyword}`}
	                        value={item.priority}
	                      />
	                    ))}
	                  </ReportBox>
	                  <div className="grid gap-2">
	                    {seoPreviewPages.map((page) => (
                      <div
                        className="grid min-w-0 gap-3 overflow-hidden border border-[#dde3ea] bg-white p-3 md:grid-cols-[minmax(0,1fr)_auto]"
                        key={`${page.status}-${page.id}`}
                      >
                        <div className="min-w-0">
                          <p className="break-words font-black">{page.title}</p>
                          <p className="mt-1 break-all text-sm font-bold text-[#64717d]">
                            {page.path}
                          </p>
                          <p className="mt-1 break-all text-xs font-bold text-[#7c8792]">
                            Canonical: {page.canonical}
                          </p>
	                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#64717d]">
	                            {page.summary}
	                          </p>
	                          {page.issues.length ? (
	                            <p className="mt-2 text-xs font-bold text-[#b87300]">
	                              Kontrol: {page.issues.slice(0, 3).join(", ")}
	                            </p>
	                          ) : null}
	                        </div>
	                        <div className="flex flex-wrap items-start gap-2 md:justify-end">
	                          <StatusBadge tone={page.score >= 80 ? "green" : "amber"}>
	                            SEO %{page.score}
	                          </StatusBadge>
	                          <StatusBadge tone={page.languageScore >= 95 ? "green" : "amber"}>
	                            Dil %{page.languageScore}
	                          </StatusBadge>
	                          <StatusBadge tone={page.status === "Pasif" ? "amber" : "green"}>
	                            {page.status}
	                          </StatusBadge>
                          <StatusBadge tone={page.noIndex ? "amber" : "green"}>
                            {page.noIndex ? "Noindex" : "Index"}
                          </StatusBadge>
                          <StatusBadge tone={page.ogImage ? "blue" : "amber"}>
                            {page.ogImage ? "OG hazır" : "OG eksik"}
                          </StatusBadge>
                          <StatusBadge tone={page.keywordCount ? "blue" : "amber"}>
                            {page.keywordCount ? `${page.keywordCount} keyword` : "Keyword yok"}
                          </StatusBadge>
                          <StatusBadge tone="blue">{page.kind}</StatusBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
              </section>
            ) : null}

            {section === "settings" || section === "reports" || section === "launch" ? (
              <section className="grid gap-3 2xl:grid-cols-3">
              {section === "settings" ? (
                <>
                <Panel eyebrow="Ayarlar" id="ayarlar" title="Site Bilgileri">
                <AdminToolbar defaultQuery={searchValue(filters, "q")} resetHref={`/${locale}/admin/ayarlar`} />
                <form action={updateSettingsAction} className="grid gap-2">
                  <input name="locale" type="hidden" value={locale} />
                  <label className="grid gap-1 text-sm font-black">
                    Site adı
                    <input
                      className="admin-input"
                      defaultValue={store.settings.siteName}
                      name="siteName"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-black">
                    Logo metni
                    <input
                      className="admin-input"
                      defaultValue={store.settings.logoMark}
                      name="logoMark"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-black">
                    Telefon
                    <input
                      className="admin-input"
                      defaultValue={store.settings.phone}
                      name="phone"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-black">
                    WhatsApp
                    <input
                      className="admin-input"
                      defaultValue={store.settings.whatsapp}
                      name="whatsapp"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-black">
                    E-posta
                    <input
                      className="admin-input"
                      defaultValue={store.settings.email}
                      name="email"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-black">
                    Genel Jolly yönlendirme linki
                    <input
                      className="admin-input"
                      defaultValue={store.settings.jollyUrl}
                      name="jollyUrl"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-black">
                    TÜRSAB belge alanı
                    <input
                      className="admin-input"
                      defaultValue={store.settings.tursabCertificate}
                      name="tursabCertificate"
                    />
                  </label>
                  <button className="admin-btn" type="submit">
                    Site Bilgilerini Kaydet
                  </button>
                </form>
                <div className="mt-4 border border-[#dde3ea] bg-[#f8fafc] p-3">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d17a00]">
                    Veri Kaynağı
                  </p>
                  <p className="mt-2 font-black">{databaseStatus.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#64717d]">
                    {databaseStatus.message}
                  </p>
                </div>
              </Panel>

              <Panel
                eyebrow="İletişim"
                id="mesaj-talepleri"
                title="Mesaj Talepleri"
                action={`${visibleContacts.length}/${store.contacts.length} kayıt`}
              >
                <div className="grid gap-2">
                  <form action={createContactAction} className="grid gap-2 border border-[#dde3ea] bg-[#f8fafc] p-3">
                    <input name="locale" type="hidden" value={locale} />
                    <input className="admin-input" name="name" placeholder="Ad soyad" required />
                    <input className="admin-input" name="phone" placeholder="Telefon" />
                    <input className="admin-input" name="email" placeholder="E-posta" />
                    <input className="admin-input" name="subject" placeholder="Konu" required />
                    <textarea
                      className="admin-input min-h-16 resize-y"
                      name="message"
                      placeholder="Mesaj"
                    />
                    <button className="admin-btn" type="submit">
                      Mesaj Talebi Ekle
                    </button>
                  </form>

                  {visibleContacts.map((contact) => (
                    <div className="border border-[#dde3ea] bg-white p-3" key={contact.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{contact.name}</p>
                          <p className="mt-1 text-sm text-[#64717d]">{contact.subject}</p>
                          <p className="mt-1 text-xs font-bold text-[#64717d]">
                            {contact.phone || "Telefon yok"} · {contact.email || "E-posta yok"}
                          </p>
                        </div>
                        <StatusBadge tone={contact.status === "Kapandı" ? "amber" : "green"}>
                          {contact.status}
                        </StatusBadge>
                      </div>
                      <form action={updateContactAction} className="mt-3 grid gap-2">
                        <input name="id" type="hidden" value={contact.id} />
                        <input name="locale" type="hidden" value={locale} />
                        <select
                          className="admin-input"
                          defaultValue={contact.status}
                          name="status"
                        >
                          {contactStatuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                        <textarea
                          className="admin-input min-h-16 resize-y"
                          defaultValue={contact.message}
                          name="message"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button className="admin-btn" type="submit">
                            Güncelle
                          </button>
                          <button
                            className="admin-icon-btn text-[#d94d31]"
                            formAction={deleteContactAction}
                            formNoValidate
                            type="submit"
                          >
                            Sil
                          </button>
                        </div>
                      </form>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel
                eyebrow="Yetki"
                id="kullanici-rolleri"
                title="Kullanıcı Rolleri"
                action={`${visibleUsers.length}/${store.users.length} kullanıcı`}
              >
                <div className="grid gap-2">
                  <form action={createUserAction} className="grid gap-2 border border-[#dde3ea] bg-[#f8fafc] p-3">
                    <input name="locale" type="hidden" value={locale} />
                    <input className="admin-input" name="name" placeholder="Ad soyad" required />
                    <input className="admin-input" name="email" placeholder="E-posta" required />
                    <select className="admin-input" defaultValue="Satış danışmanı" name="role">
                      {userRoles.map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>
                    <button className="admin-btn" type="submit">
                      Kullanıcı Ekle
                    </button>
                  </form>

                  {visibleUsers.map((user) => (
                    <form
                      action={updateUserAction}
                      className="grid gap-2 border border-[#dde3ea] bg-white p-3"
                      key={user.id}
                    >
                      <input name="id" type="hidden" value={user.id} />
                      <input name="locale" type="hidden" value={locale} />
                      <input className="admin-input" defaultValue={user.name} name="name" />
                      <input className="admin-input" defaultValue={user.email} name="email" />
                      <select className="admin-input" defaultValue={user.role} name="role">
                        {userRoles.map((role) => (
                          <option key={role}>{role}</option>
                        ))}
                      </select>
                      <label className="flex items-center gap-2 text-sm font-bold text-[#47535f]">
                        <input defaultChecked={user.active} name="active" type="checkbox" />
                        Aktif kullanıcı
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button className="admin-btn" type="submit">
                          Güncelle
                        </button>
                        <button
                          className="admin-icon-btn text-[#d94d31]"
                          formAction={deleteUserAction}
                          formNoValidate
                          type="submit"
                        >
                          Sil
                        </button>
                      </div>
                    </form>
                  ))}
                </div>
              </Panel>
                </>
              ) : null}

              {section === "launch" ? (
                <Panel
                action={`${launchReadyCount}/${launchChecks.length} hazır`}
                eyebrow="Yayın"
                id="canliya-hazirlik"
                title="Canlıya Hazırlık"
              >
	                <div className="grid gap-2">
	                  {launchChecks.map((check) => (
	                    <LaunchCheckRow
                      description={check.description}
                      key={check.label}
                      label={check.label}
                      ready={check.ready}
	                    />
	                  ))}
	                </div>
	                <div className="mt-4 grid gap-3 xl:grid-cols-2">
	                  <ReportBox title="Database Geçişi">
	                    {databaseMigrationSteps.map((step) => (
	                      <LaunchCheckRow
	                        description={step.description}
	                        key={step.label}
	                        label={step.label}
	                        ready={step.ready}
	                      />
	                    ))}
	                  </ReportBox>
	                  <ReportBox title="Canlı Operasyon">
	                    {operationChecks.map((check) => (
	                      <LaunchCheckRow
	                        description={check.description}
	                        key={check.label}
	                        label={check.label}
	                        ready={check.ready}
	                      />
	                    ))}
	                  </ReportBox>
	                </div>
	                <div className="mt-4 border border-[#dde3ea] bg-[#f8fafc] p-3">
	                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d17a00]">
                    Health Check
                  </p>
                  <p className="mt-2 break-all text-sm font-bold text-[#64717d]">
                    /api/health
                  </p>
                </div>
                </Panel>
              ) : null}

              {section === "reports" ? (
                <Panel eyebrow="Raporlar" id="raporlar" title="Performans">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ReportRow label="Tur detay görüntüleme" value={String(tourViews)} />
                  <ReportRow label="Son 7 gün event" value={String(recentEventCount)} />
                  <ReportRow label="Jolly tıklaması" value={String(jollyClicks)} />
                  <ReportRow label="WhatsApp tıklaması" value={String(whatsappClicks)} />
                  <ReportRow label="Form gönderimi" value={String(Math.max(formEvents, leads.length))} />
                  <ReportRow label="UTM kaynaklı talep" value={String(utmLeads)} />
                  <ReportRow label="Görüntüleme > talep" value={`%${viewToLeadRate}`} />
                  <ReportRow label="Görüntüleme > Jolly" value={`%${jollyClickRate}`} />
                </div>
                <div className="mt-4 grid gap-3 xl:grid-cols-2">
                  <ReportBox title="Jolly Tıklama Kırılımı">
                    {jollyByTour.length ? (
                      jollyByTour.map(([tourTitle, count]) => (
                        <ReportRow key={tourTitle} label={tourTitle} value={String(count)} />
                      ))
                    ) : (
                      <EmptyReportText>Henüz Jolly tıklaması kaydedilmedi.</EmptyReportText>
                    )}
                  </ReportBox>
                  <ReportBox title="Lead Kanal Kırılımı">
                    {leadsByChannel.length ? (
                      leadsByChannel.map(([channel, count]) => (
                        <ReportRow key={channel} label={channel} value={String(count)} />
                      ))
                    ) : (
                      <EmptyReportText>Henüz kanal verisi yok.</EmptyReportText>
                    )}
                  </ReportBox>
                  <ReportBox title="Event Türleri">
                    {eventsByName.length ? (
                      eventsByName.map(([eventName, count]) => (
                        <ReportRow key={eventName} label={eventName} value={String(count)} />
                      ))
                    ) : (
                      <EmptyReportText>Henüz event kaydı yok.</EmptyReportText>
                    )}
                  </ReportBox>
                  <ReportBox title="Dil Kırılımı">
                    {eventsByLocale.length ? (
                      eventsByLocale.map(([eventLocale, count]) => (
                        <ReportRow key={eventLocale} label={eventLocale} value={String(count)} />
                      ))
                    ) : (
                      <EmptyReportText>Henüz dil bazlı event yok.</EmptyReportText>
                    )}
                  </ReportBox>
                </div>
                <ReportBox className="mt-5" title="Son Eventler">
                  {latestEvents.length ? (
                    latestEvents.map((event) => (
                      <div
                        className="grid gap-2 border border-[#dde3ea] bg-white p-3 text-sm md:grid-cols-[160px_minmax(0,1fr)_auto]"
                        key={event.id}
                      >
                        <strong>{event.name}</strong>
                        <span className="min-w-0 break-words text-[#64717d]">
                          {formatEventPayload(event.payload)}
                        </span>
                        <span className="text-xs font-bold text-[#64717d]">
                          {formatAdminDate(event.createdAt)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyReportText>Henüz event yok.</EmptyReportText>
                  )}
                </ReportBox>
                </Panel>
              ) : null}
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "coral" | "teal" | "gold" | "ink";
}) {
  const colors = {
    coral: "bg-[#fff0eb] text-[#d94d31]",
    teal: "bg-[#e9f7f7] text-[#0f8b8d]",
    gold: "bg-[#fff5df] text-[#b87300]",
    ink: "bg-[#edf1f5] text-[#172026]",
  };

  return (
    <div className="border border-[#dde3ea] bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#64717d]">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black">{value}</p>
          <p className="mt-1 text-xs text-[#64717d]">{sub}</p>
        </div>
        <span className={`grid size-9 place-items-center text-xs font-black ${colors[accent]}`}>
          {value.slice(0, 2)}
        </span>
      </div>
    </div>
  );
}

function Panel({
  eyebrow,
  id,
  title,
  action,
  children,
}: {
  eyebrow: string;
  id?: string;
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="scroll-mt-24 border border-[#dde3ea] bg-white shadow-sm"
      id={id}
    >
      <div className="flex flex-col gap-2 border-b border-[#dde3ea] px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#e85d3f]">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-black">{title}</h2>
        </div>
        {action ? (
          <span className="admin-btn-light">{action}</span>
        ) : null}
      </div>
      <div className="p-3">{children}</div>
    </section>
  );
}

function AdminToolbar({
  children,
  defaultQuery,
  resetHref,
}: {
  children?: React.ReactNode;
  defaultQuery: string;
  resetHref: string;
}) {
  return (
    <form className="mb-3 grid gap-2 border border-[#dde3ea] bg-[#f8fafc] p-3 md:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_repeat(3,minmax(120px,170px))_auto]" method="get">
      <input
        className="admin-input !min-h-9"
        defaultValue={defaultQuery}
        name="q"
        placeholder="Ara"
      />
      {children}
      <div className="flex flex-wrap gap-2 xl:justify-end">
        <button className="admin-btn" type="submit">
          Filtrele
        </button>
        <Link className="admin-btn-light" href={resetHref}>
          Sıfırla
        </Link>
      </div>
    </form>
  );
}

function LocalizedAdminField({
  label,
  multiline = false,
  name,
  placeholder,
  requiredTr = false,
  values,
}: {
  label: string;
  multiline?: boolean;
  name: string;
  placeholder?: string;
  requiredTr?: boolean;
  values?: Partial<Record<Locale, string>>;
}) {
  return (
    <div className="grid gap-2 border border-[#dde3ea] bg-white p-2.5">
      <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#64717d]">
        {label}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {locales.map((item) => {
          const fieldName = `${name}_${item}`;
          const fieldPlaceholder = `${placeholder ?? label} ${item.toUpperCase()}`;

          return multiline ? (
            <textarea
              className="admin-input min-h-16 resize-y"
              defaultValue={values?.[item] ?? ""}
              key={fieldName}
              name={fieldName}
              placeholder={fieldPlaceholder}
              required={requiredTr && item === "tr"}
            />
          ) : (
            <input
              className="admin-input !min-h-9"
              defaultValue={values?.[item] ?? ""}
              key={fieldName}
              name={fieldName}
              placeholder={fieldPlaceholder}
              required={requiredTr && item === "tr"}
            />
          );
        })}
      </div>
    </div>
  );
}

function PipelineColumn({
  status,
  leads,
  locale,
}: {
  status: DemoLeadStatus;
  leads: DemoLead[];
  locale: Locale;
}) {
  return (
    <div className="min-h-60 min-w-0 border border-[#dde3ea] bg-[#f8fafc] p-2.5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="break-words text-sm font-black">{status}</h3>
        <span className="bg-white px-2 py-1 text-xs font-black text-[#64717d]">
          {leads.length}
        </span>
      </div>
      <div className="grid gap-2">
        {leads.length ? (
          leads.map((lead) => (
            <div className="min-w-0 border border-[#dde3ea] bg-white p-2.5" key={lead.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="break-words text-sm font-black">{lead.name}</p>
                  <p className="mt-1 break-words text-xs text-[#64717d]">
                    {lead.tourTitle ?? "Genel talep"}
                  </p>
                </div>
                <div className="grid justify-items-end gap-1">
                  <span className="bg-[#fff0eb] px-2 py-1 text-xs font-black text-[#d94d31]">
                    {leadScore(lead)}
                  </span>
                  <span className={`px-2 py-1 text-[10px] font-black uppercase ${leadTemperatureClass(lead)}`}>
                    {leadTemperature(lead)}
                  </span>
                </div>
              </div>
              <p className="mt-2 break-words text-xs leading-5 text-[#64717d]">{lead.note}</p>
              <p className="mt-2 border border-[#dde3ea] bg-[#f8fafc] p-2 text-xs font-bold text-[#172026]">
                Önerilen aksiyon: {leadNextAction(lead)}
              </p>
              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                <CrmInfo label="Kanal" value={lead.channel || "Telefon"} />
                <CrmInfo label="Sorumlu" value={lead.owner || "Satış danışmanı"} />
                <CrmInfo label="Son temas" value={lead.lastContactAt || "Yok"} />
                <CrmInfo label="Takip" value={lead.nextFollowUpAt || "Plan yok"} />
              </div>
              {lead.internalNote ? (
                <p className="mt-2 border border-[#dde3ea] bg-[#f8fafc] p-2 text-xs leading-5 text-[#64717d]">
                  {lead.internalNote}
                </p>
              ) : null}
              <div className="mt-2 grid gap-1 text-xs font-bold text-[#64717d]">
                <span className="break-words">{lead.phone || "Telefon yok"}</span>
                <span className="break-all">{lead.email || "E-posta yok"}</span>
                <span>
                  {lead.travelers || "Kişi sayısı yok"} kişi ·{" "}
                  {lead.preferredDate || "Tarih belirsiz"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-xs font-bold text-[#64717d]">
                <span>{lead.locale.toUpperCase()}</span>
                <span className="min-w-0 break-all text-right">{lead.sourcePath || "direct"}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {lead.phone ? (
                  <>
                    <a className="admin-icon-btn" href={phoneHref(lead.phone)}>
                      Ara
                    </a>
                    <a className="admin-icon-btn" href={whatsappHref(lead.phone)}>
                      WhatsApp
                    </a>
                    <a
                      className="admin-icon-btn"
                      href={whatsappSalesHref(lead)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Satış Mesajı
                    </a>
                  </>
                ) : null}
                {lead.email ? (
                  <a className="admin-icon-btn" href={`mailto:${lead.email}`}>
                    E-posta
                  </a>
                ) : null}
              </div>
              <form action={updateLeadStatusAction} className="mt-2 grid gap-2">
                <input name="id" type="hidden" value={lead.id} />
                <input name="locale" type="hidden" value={locale} />
                <select
                  className="admin-input !min-h-9 !py-1 text-xs"
                  defaultValue={lead.status}
                  name="status"
                >
                  {leadStatuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <button className="admin-icon-btn" type="submit">
                  Durumu Kaydet
                </button>
              </form>
              <details className="mt-2 border border-[#dde3ea] bg-[#f8fafc] p-2.5">
                <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.1em]">
                  Zaman çizelgesi
                </summary>
                <div className="mt-2 grid gap-2">
                  {(lead.timeline ?? []).slice(0, 4).map((entry) => (
                    <div className="border border-[#dde3ea] bg-white p-2" key={entry.id}>
                      <div className="flex items-center justify-between gap-2 text-[11px] font-black uppercase tracking-[0.08em] text-[#64717d]">
                        <span>{entry.type}</span>
                        <span>{formatAdminDate(entry.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-[#172026]">{entry.text}</p>
                      <p className="mt-1 text-[11px] font-bold text-[#64717d]">{entry.owner}</p>
                    </div>
                  ))}
                  <form action={addLeadTimelineAction} className="grid gap-2">
                    <input name="id" type="hidden" value={lead.id} />
                    <input name="locale" type="hidden" value={locale} />
                    <input name="owner" type="hidden" value={lead.owner || "Satış danışmanı"} />
                    <select className="admin-input !min-h-9" defaultValue="not" name="timelineType">
                      <option value="not">Not</option>
                      <option value="arama">Arama</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="eposta">E-posta</option>
                    </select>
                    <textarea
                      className="admin-input min-h-16 resize-y"
                      name="timelineText"
                      placeholder="Yeni takip notu"
                    />
                    <button className="admin-icon-btn" type="submit">
                      Not Ekle
                    </button>
                  </form>
                </div>
              </details>
              <details className="mt-2 border border-[#dde3ea] bg-[#f8fafc] p-2.5">
                <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.1em]">
                  Mesaj şablonları
                </summary>
                <div className="mt-2 grid gap-2">
                  {leadMessageTemplates(lead).map((template) => (
                    <div className="border border-[#dde3ea] bg-white p-2" key={template.title}>
                      <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#64717d]">
                        {template.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#172026]">{template.text}</p>
                    </div>
                  ))}
                </div>
              </details>
              <details className="mt-2 border border-[#dde3ea] bg-[#f8fafc] p-2.5">
                <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.1em]">
                  Talebi düzenle
                </summary>
                <form action={updateLeadAction} className="mt-2 grid gap-2">
                  <input name="id" type="hidden" value={lead.id} />
                  <input name="locale" type="hidden" value={locale} />
                  <input
                    className="admin-input !min-h-9"
                    defaultValue={lead.name}
                    name="name"
                    placeholder="Ad soyad"
                  />
                  <input
                    className="admin-input !min-h-9"
                    defaultValue={lead.phone}
                    name="phone"
                    placeholder="Telefon"
                  />
                  <input
                    className="admin-input !min-h-9"
                    defaultValue={lead.email}
                    name="email"
                    placeholder="E-posta"
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      className="admin-input !min-h-9"
                      defaultValue={lead.travelers}
                      name="travelers"
                      placeholder="Kişi"
                    />
                    <input
                      className="admin-input !min-h-9"
                      defaultValue={lead.preferredDate}
                      name="preferredDate"
                      placeholder="Tercih tarihi"
                    />
                  </div>
                  <select className="admin-input !min-h-9" defaultValue={lead.status} name="status">
                    {leadStatuses.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      className="admin-input !min-h-9"
                      defaultValue={lead.channel}
                      name="channel"
                    >
                      {leadChannels.map((channel) => (
                        <option key={channel}>{channel}</option>
                      ))}
                    </select>
                    <input
                      className="admin-input !min-h-9"
                      defaultValue={lead.owner}
                      name="owner"
                      placeholder="Sorumlu"
                    />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      className="admin-input !min-h-9"
                      defaultValue={lead.lastContactAt}
                      name="lastContactAt"
                      type="date"
                    />
                    <input
                      className="admin-input !min-h-9"
                      defaultValue={lead.nextFollowUpAt}
                      name="nextFollowUpAt"
                      type="date"
                    />
                  </div>
                  <textarea
                    className="admin-input min-h-16 resize-y"
                    defaultValue={lead.note}
                    name="note"
                    placeholder="Not"
                  />
                  <textarea
                    className="admin-input min-h-16 resize-y"
                    defaultValue={lead.internalNote}
                    name="internalNote"
                    placeholder="İç not"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button className="admin-btn" type="submit">
                      Güncelle
                    </button>
                    <button
                      className="admin-icon-btn text-[#d94d31]"
                      formAction={deleteLeadAction}
                      formNoValidate
                      type="submit"
                    >
                      Sil
                    </button>
                  </div>
                </form>
              </details>
            </div>
          ))
        ) : (
          <div className="border border-dashed border-[#c7d0da] bg-white p-3 text-sm text-[#64717d]">
            Bu aşamada talep yok.
          </div>
        )}
      </div>
    </div>
  );
}

function leadScore(lead: DemoLead) {
  let score = 58;
  if (lead.phone) score += 12;
  if (lead.email) score += 8;
  if (lead.tourTitle) score += 10;
  if (lead.marketing) score += 5;
  if (lead.preferredDate) score += 7;
  if (lead.nextFollowUpAt) score += 4;
  return Math.min(score, 99);
}

function leadTemperature(lead: DemoLead) {
  if (lead.nextFollowUpAt && lead.nextFollowUpAt <= new Date().toISOString().slice(0, 10)) {
    return "Acil";
  }

  if (leadScore(lead) >= 82) {
    return "Sıcak";
  }

  if (lead.status === "Teklif verildi" || lead.status === "Takipte") {
    return "Takip";
  }

  return "Normal";
}

function leadTemperatureClass(lead: DemoLead) {
  const temperature = leadTemperature(lead);

  if (temperature === "Acil") return "bg-[#fff0eb] text-[#d94d31]";
  if (temperature === "Sıcak") return "bg-[#e9f7ef] text-[#14783f]";
  if (temperature === "Takip") return "bg-[#fff5df] text-[#b87300]";
  return "bg-[#edf1f5] text-[#64717d]";
}

function leadNextAction(lead: DemoLead) {
  if (lead.status === "Yeni") return "İlk arama ve uygun tarih teyidi";
  if (lead.status === "Ulaşılamadı") return "WhatsApp mesajı + 24 saat sonra tekrar arama";
  if (lead.status === "Teklif verildi") return "Kontenjan ve fiyat son geçerlilik bilgisi paylaş";
  if (lead.status === "Takipte") return "Karar tarihi sor ve Jolly yönlendirme adımını anlat";
  if (lead.status === "Satışa döndü") return "Satış notunu kapat ve kaynak bilgisini rapora işle";
  if (lead.status === "İptal / olumsuz") return "Olumsuz nedenini not al, yeniden pazarlama iznini kontrol et";
  return "Görüşme sonucuna göre durumu güncelle";
}

function leadMessageTemplates(lead: DemoLead) {
  const tourText = lead.tourTitle ? `${lead.tourTitle} için` : "tur talebiniz için";
  const dateText = lead.preferredDate ? ` ${lead.preferredDate} dönemi özelinde` : "";

  return [
    {
      text: `Merhaba ${lead.name}, book to tour'dan yazıyorum. ${tourText}${dateText} uygun tarih, kontenjan ve ödeme adımlarını birlikte netleştirebiliriz.`,
      title: "İlk temas",
    },
    {
      text: `Merhaba ${lead.name}, size ilettiğimiz tur teklifi için kontenjanı tekrar kontrol edebilirim. Uygunsa Jolly ödeme yönlendirmesiyle süreci tamamlayabiliriz.`,
      title: "Teklif takip",
    },
    {
      text: `Merhaba ${lead.name}, ulaşamadığım için buradan bilgi bırakıyorum. Müsait olduğunuzda dönüş yaparsanız tarih ve kişi sayısına göre en uygun alternatifi paylaşayım.`,
      title: "Ulaşılamadı",
    },
  ];
}

function CrmInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#dde3ea] bg-[#f8fafc] p-1.5">
      <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#64717d]">
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-black text-[#172026]">
        {value}
      </p>
    </div>
  );
}

function CrmSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#dde3ea] bg-[#f8fafc] p-2.5">
      <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#64717d]">
        {label}
      </p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}

function phoneHref(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? `tel:+${digits}` : "#";
}

function whatsappHref(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

function whatsappSalesHref(lead: DemoLead) {
  const digits = lead.phone.replace(/\D/g, "");
  const message = [
    `Merhaba ${lead.name}, book to tour'dan yazıyorum.`,
    lead.tourTitle ? `${lead.tourTitle} talebiniz için size bilgi vermek isterim.` : "Tur talebiniz için size bilgi vermek isterim.",
    lead.preferredDate ? `Tercih ettiğiniz dönem: ${lead.preferredDate}.` : "",
    lead.travelers ? `Katılımcı bilgisi: ${lead.travelers}.` : "",
    "Uygun tarih, kontenjan ve ödeme adımlarını birlikte netleştirebiliriz.",
  ]
    .filter(Boolean)
    .join(" ");

  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : "#";
}

function LanguageCompleteness({ score }: { score: number }) {
  return (
    <div className="grid gap-1">
      <div className="flex flex-wrap gap-1">
        {locales.map((locale) => (
          <span
            className="grid size-6 place-items-center bg-[#e9f7f7] text-[9px] font-black text-[#0f8b8d]"
            key={locale}
          >
            {locale.toUpperCase()}
          </span>
        ))}
      </div>
      <span className="text-xs font-black text-[#64717d]">%{score}</span>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div>
      <div className="h-2 bg-[#e8edf2]">
        <div
          className="h-2 bg-[#0f8b8d]"
          style={{ width: `${Math.max(8, value)}%` }}
        />
      </div>
      <p className="mt-1 text-xs font-bold text-[#64717d]">{value}% doluluk</p>
    </div>
  );
}

function StatusBadge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "green" | "amber" | "blue";
}) {
  const tones = {
    green: "bg-[#e9f7ef] text-[#14783f]",
    amber: "bg-[#fff5df] text-[#b87300]",
    blue: "bg-[#edf1ff] text-[#3156b3]",
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-black ${tones[tone]}`}>
      {children}
    </span>
  );
}

function SeoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#dde3ea] bg-[#f8fafc] p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#64717d]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black text-[#172026]">{value}</p>
    </div>
  );
}

function LaunchCheckRow({
  description,
  label,
  ready,
}: {
  description: string;
  label: string;
  ready: boolean;
}) {
  return (
    <div className="grid gap-2 border border-[#dde3ea] bg-[#f8fafc] p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <p className="text-sm font-black text-[#172026]">{label}</p>
        <p className="mt-1 text-xs leading-5 text-[#64717d]">{description}</p>
      </div>
      <StatusBadge tone={ready ? "green" : "amber"}>
        {ready ? "Hazır" : "Kontrol"}
      </StatusBadge>
    </div>
  );
}

function ReportBox({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <div className={`border border-[#dde3ea] bg-[#f8fafc] p-3 ${className}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#d17a00]">
        {title}
      </p>
      <div className="mt-2 grid gap-1">{children}</div>
    </div>
  );
}

function EmptyReportText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[#64717d]">{children}</p>;
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#dde3ea] py-2 last:border-b-0">
      <span className="min-w-0 break-words text-sm font-bold text-[#64717d]">{label}</span>
      <strong className="shrink-0">{value}</strong>
    </div>
  );
}

function formatEventPayload(
  payload: Record<string, string | number | boolean | null>,
) {
  const visibleEntries = Object.entries(payload)
    .filter(([, value]) => value !== null && value !== "")
    .slice(0, 4);

  if (!visibleEntries.length) {
    return "Payload yok";
  }

  return visibleEntries
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(" · ");
}

function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}
