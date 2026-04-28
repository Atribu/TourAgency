import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import {
  allLandingPages,
  campaigns,
  categories,
  destinations,
  formatPrice,
} from "@/lib/catalog";
import {
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

const navItems = [
  { href: "#dashboard", label: "Dashboard" },
  { href: "#on-talepler", label: "Ön Talepler" },
  { href: "#turlar", label: "Turlar" },
  { href: "#tarih-fiyat", label: "Tarih & Fiyat" },
  { href: "#sayfa-yonetimi", label: "İçerikler" },
  { href: "#sayfa-yonetimi", label: "Kategoriler" },
  { href: "#sayfa-yonetimi", label: "Kampanyalar" },
  { href: "#seo", label: "SEO" },
  { href: "#ayarlar", label: "Ayarlar" },
  { href: "#raporlar", label: "Raporlar" },
];

export const dynamic = "force-dynamic";

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

  return {
    title: "Admin Panel | TourAgency",
    description:
      "Tur, kategori, kampanya, ön talep, içerik, SEO ve site ayarları yönetimi.",
  };
}

async function createTourAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const summary = String(formData.get("summary") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const jollyUrl = String(formData.get("jollyUrl") ?? "");
  const currency = String(formData.get("currency") ?? "TRY") as
    | "TRY"
    | "EUR"
    | "USD";
  const priceFrom = Number(formData.get("priceFrom") ?? 0);

  if (title && slug && categoryId && priceFrom > 0) {
    await createDemoTour({
      categoryId,
      currency,
      jollyUrl,
      priceFrom,
      slug,
      summary,
      title,
    });
  }

  revalidatePath(`/${locale}/admin`);
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

  revalidatePath(`/${locale}/admin`);
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
    status: String(formData.get("status") ?? "Yeni") as DemoLeadStatus,
  });
  revalidatePath(`/${locale}/admin`);
}

async function deleteLeadAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoLead(String(formData.get("id") ?? ""));
  revalidatePath(`/${locale}/admin`);
}

async function updateTourAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  const id = String(formData.get("id") ?? "");
  await updateDemoTour({
    id,
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    priceFrom: Number(formData.get("priceFrom") ?? 0),
    currency: String(formData.get("currency") ?? "TRY") as "TRY" | "EUR" | "USD",
    categoryId: String(formData.get("categoryId") ?? ""),
    jollyUrl: String(formData.get("jollyUrl") ?? ""),
    active: formData.get("active") === "on",
  });
  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}/turlar`);
  revalidatePath(`/${locale}`);
}

async function deleteTourAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoTour(String(formData.get("id") ?? ""));
  revalidatePath(`/${locale}/admin`);
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
    availability: String(formData.get("availability") ?? "Müsait"),
    jollyUrl: String(formData.get("jollyUrl") ?? ""),
  });
  revalidatePath(`/${locale}/admin`);
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
    availability: String(formData.get("availability") ?? "Müsait"),
    jollyUrl: String(formData.get("jollyUrl") ?? ""),
  });
  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}/turlar`);
}

async function deleteDateAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoTourDate(
    String(formData.get("tourId") ?? ""),
    String(formData.get("dateId") ?? ""),
  );
  revalidatePath(`/${locale}/admin`);
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
  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/turlar`);
}

async function createPageAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await createDemoManagedPage({
    kind: String(formData.get("kind") ?? "info") as DemoManagedPageKind,
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    summary: String(formData.get("summary") ?? ""),
  });
  revalidatePath(`/${locale}/admin`);
}

async function updatePageAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await updateDemoManagedPage({
    id: String(formData.get("id") ?? ""),
    kind: String(formData.get("kind") ?? "info") as DemoManagedPageKind,
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    active: formData.get("active") === "on",
  });
  revalidatePath(`/${locale}/admin`);
}

async function deletePageAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoManagedPage(String(formData.get("id") ?? ""));
  revalidatePath(`/${locale}/admin`);
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
  revalidatePath(`/${locale}/admin`);
}

async function updateContactAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await updateDemoContact({
    id: String(formData.get("id") ?? ""),
    status: String(formData.get("status") ?? "Yeni") as DemoContactStatus,
    message: String(formData.get("message") ?? ""),
  });
  revalidatePath(`/${locale}/admin`);
}

async function deleteContactAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoContact(String(formData.get("id") ?? ""));
  revalidatePath(`/${locale}/admin`);
}

async function createUserAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await createDemoUser({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? "Satış danışmanı") as DemoUserRole,
  });
  revalidatePath(`/${locale}/admin`);
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
  revalidatePath(`/${locale}/admin`);
}

async function deleteUserAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  await deleteDemoUser(String(formData.get("id") ?? ""));
  revalidatePath(`/${locale}/admin`);
}

export default async function AdminPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const [store, allTours] = await Promise.all([
    readDemoStore(),
    getAllToursWithDemo(),
  ]);
  const leads = store.leads;
  const leadCount = leads.length;
  const soldLeads = leads.filter((lead) => lead.status === "Satışa döndü").length;
  const conversionRate = leadCount ? Math.round((soldLeads / leadCount) * 100) : 0;
  const jollyClicks = store.events.filter((event) => event.name === "jolly_click").length;
  const whatsappClicks = store.events.filter(
    (event) => event.name === "whatsapp_click",
  ).length;
  const formEvents = store.events.filter((event) => event.name === "lead_submit").length;
  const demoTourById = new Map(store.tours.map((tour) => [tour.id, tour]));
  const adminTours = [
    ...store.tours.map((tour) => demoTourToTour(tour)),
    ...allTours.filter((tour) => !demoTourById.has(tour.id)),
  ];
  const managedPageCount = store.managedPages.length + allLandingPages.length;
  const seoPreviewPages = [
    ...store.managedPages.map((page) => ({
      id: page.id,
      kind: page.kind,
      path:
        page.kind === "campaign"
          ? `/${locale}/kampanyalar/${page.slugs[locale]}`
          : `/${locale}/${page.slugs[locale]}`,
      status: page.active ? "Yayında" : "Pasif",
      summary: page.summary[locale],
      title: page.title[locale],
    })),
    ...allLandingPages.map((page) => ({
      id: page.id,
      kind: page.kind,
      path:
        page.kind === "campaign"
          ? `/${locale}/kampanyalar/${page.slugs[locale]}`
          : `/${locale}/${page.slugs[locale]}`,
      status: "Hazır",
      summary: page.summary[locale],
      title: page.title[locale],
    })),
  ].slice(0, 10);

  return (
    <main className="admin-shell min-h-screen bg-[#f4f6f8] text-[#172026]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-[#dde3ea] bg-[#101820] text-white">
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
            <span className="grid size-11 place-items-center bg-[#ff6b4a] text-sm font-black">
              {store.settings.logoMark}
            </span>
            <div>
              <p className="font-black leading-5">{store.settings.siteName}</p>
              <p className="text-xs text-white/58">Acenta Yönetim Paneli</p>
            </div>
          </div>
          <nav className="grid gap-1 p-4">
            {navItems.map((item, index) => (
              <a
                className={`flex items-center justify-between border border-transparent px-4 py-3 text-sm font-bold transition ${
                  index === 0
                    ? "border-white/10 bg-white/[0.08] text-white"
                    : "text-white/72 hover:border-white/10 hover:bg-white/8 hover:text-white"
                }`}
                href={item.href}
                key={`${item.href}-${item.label}`}
              >
                <span>{item.label}</span>
                {index === 0 ? <span className="text-[#f6b44b]">Aktif</span> : null}
              </a>
            ))}
          </nav>
          <div className="m-4 border border-white/10 bg-white/[0.06] p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f6b44b]">
              Demo Mod
            </p>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Bu panel database olmadan çalışır. Kayıtlar proje içindeki
              <span className="font-black"> .demo-data </span>
              klasöründe tutulur; sonra aynı API katmanı gerçek database yapısına bağlanır.
            </p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[#dde3ea] bg-white/92 backdrop-blur">
            <div className="flex min-h-20 flex-col gap-4 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#e85d3f]">
                  Dashboard
                </p>
                <h1 className="text-3xl font-black">Yönetim Merkezi</h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  className="admin-input min-w-0 sm:w-72"
                  placeholder="Tur, müşteri, kategori veya sayfa ara"
                />
                <Link className="admin-btn-light" href={`/${locale}`}>
                  Siteyi Gör
                </Link>
                <a className="admin-btn" href="#yeni-tur-formu">
                  Yeni Tur Ekle
                </a>
              </div>
            </div>
          </header>

          <div className="grid gap-6 px-5 py-6 xl:px-8">
            <section
              className="scroll-mt-24 grid gap-4 md:grid-cols-2 2xl:grid-cols-4"
              id="dashboard"
            >
              <MetricCard
                accent="coral"
                label="Aktif Tur"
                sub="Demo + hazır katalog"
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
            </section>

            <section className="grid gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
              <Panel eyebrow="Satış Akışı" id="on-talepler" title="Ön Talep CRM" action="Canlı">
                <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {leadStatuses.map((status) => (
                    <PipelineColumn
                      key={status}
                      leads={leads.filter((lead) => lead.status === status)}
                      locale={locale}
                      status={status}
                    />
                  ))}
                </div>
              </Panel>

              <Panel eyebrow="Hızlı İşlem" title="Yeni Tur Formu">
                <form action={createTourAction} className="grid gap-3" id="yeni-tur-formu">
                  <input name="locale" type="hidden" value={locale} />
                  <input
                    className="admin-input"
                    name="title"
                    placeholder="Tur adı TR"
                    required
                  />
                  <input
                    className="admin-input"
                    name="slug"
                    placeholder="Slug: karadeniz-ruyasi-turu"
                    required
                  />
                  <textarea
                    className="admin-input min-h-24 resize-y"
                    name="summary"
                    placeholder="Kısa açıklama"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
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
                  <button className="admin-btn" type="submit">
                    Kaydet ve Yayında Göster
                  </button>
                </form>
              </Panel>
            </section>

            <Panel
              eyebrow="Tur Yönetimi"
              id="turlar"
              title="Turlar"
              action={`${adminTours.length} kayıt`}
            >
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

                      return (
                        <tr key={tour.id}>
                          <td data-label="Tur">
                            <div className="flex items-center gap-3">
                              <Image
                                alt=""
                                className="size-14 border border-[#dde3ea] object-cover"
                                height={56}
                                src={tour.image}
                                unoptimized
                                width={56}
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
                            <LanguageDots />
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
                                    <input
                                      className="admin-input !min-h-10"
                                      defaultValue={demoTour.title.tr}
                                      name="title"
                                      placeholder="Tur adı"
                                      required
                                    />
                                    <input
                                      className="admin-input !min-h-10"
                                      defaultValue={demoTour.slugs.tr}
                                      name="slug"
                                      placeholder="Slug"
                                      required
                                    />
                                    <textarea
                                      className="admin-input min-h-20 resize-y"
                                      defaultValue={demoTour.summary.tr}
                                      name="summary"
                                      placeholder="Kısa açıklama"
                                    />
                                    <div className="grid gap-2 sm:grid-cols-2">
                                      <input
                                        className="admin-input !min-h-10"
                                        defaultValue={demoTour.priceFrom}
                                        min="1"
                                        name="priceFrom"
                                        type="number"
                                      />
                                      <select
                                        className="admin-input !min-h-10"
                                        defaultValue={demoTour.currency}
                                        name="currency"
                                      >
                                        {currencies.map((currency) => (
                                          <option key={currency}>{currency}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <select
                                      className="admin-input !min-h-10"
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
                                    <input
                                      className="admin-input !min-h-10"
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

            <section className="grid gap-6 2xl:grid-cols-[0.85fr_1.15fr]">
              <Panel eyebrow="Tarih & Fiyat" id="tarih-fiyat" title="Kontenjan Takibi">
                <div className="grid gap-3">
                  <form action={createDateAction} className="grid gap-2 border border-[#dde3ea] bg-[#f8fafc] p-4">
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
                    <input
                      className="admin-input"
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
                      <div className="border border-[#dde3ea] bg-white p-4" key={tour.id}>
                        <p className="font-black">{tour.title[locale]}</p>
                        <div className="mt-3 grid gap-3">
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
                                <input
                                  className="admin-input"
                                  defaultValue={date.availability.tr}
                                  name="availability"
                                  placeholder="Kontenjan durumu"
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
                    <div className="border border-dashed border-[#c7d0da] bg-white p-4 text-sm text-[#64717d]">
                      Tarih yönetimi için önce demo tur ekleyin.
                    </div>
                  )}
                </div>
              </Panel>

              <Panel eyebrow="İçerik ve SEO" id="sayfa-yonetimi" title="Sayfa Yönetimi">
                <div className="grid gap-4">
                  <form action={createPageAction} className="grid min-w-0 gap-2 border border-[#dde3ea] bg-[#f8fafc] p-4 md:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)]">
                    <input name="locale" type="hidden" value={locale} />
                    <select className="admin-input" defaultValue="info" name="kind">
                      {managedPageKinds.map((kind) => (
                        <option key={kind} value={kind}>
                          {kind}
                        </option>
                      ))}
                    </select>
                    <input className="admin-input" name="title" placeholder="Sayfa başlığı" required />
                    <input className="admin-input" name="slug" placeholder="sayfa-slug" required />
                    <textarea
                      className="admin-input min-h-20 resize-y md:col-span-3"
                      name="summary"
                      placeholder="SEO özeti / kısa açıklama"
                    />
                    <button className="admin-btn md:col-span-3" type="submit">
                      Sayfa Kaydı Oluştur
                    </button>
                  </form>

                  <div className="grid min-w-0 gap-3 md:grid-cols-2">
                    {store.managedPages.map((page) => (
                      <div className="border border-[#dde3ea] bg-white p-4" key={page.id}>
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
                          <input className="admin-input" defaultValue={page.title.tr} name="title" />
                          <input className="admin-input" defaultValue={page.slugs.tr} name="slug" />
                          <textarea
                            className="admin-input min-h-20 resize-y"
                            defaultValue={page.summary.tr}
                            name="summary"
                          />
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
                          className="border border-[#dde3ea] bg-[#f8fafc] p-4"
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
            </section>

            <Panel eyebrow="SEO" id="seo" title="SEO Kontrol Merkezi" action="Aktif">
              <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <form
                  action={createPageAction}
                  className="grid h-fit min-w-0 gap-3 border border-[#dde3ea] bg-[#f8fafc] p-4"
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
                  <input
                    className="admin-input"
                    name="title"
                    placeholder="Meta başlık / sayfa adı"
                    required
                  />
                  <input
                    className="admin-input"
                    name="slug"
                    placeholder="seo-url-slug"
                    required
                  />
                  <textarea
                    className="admin-input min-h-28 resize-y"
                    name="summary"
                    placeholder="Meta açıklama ve sayfa giriş metni"
                  />
                  <button className="admin-btn" type="submit">
                    SEO Sayfasını Yayına Hazırla
                  </button>
                </form>

                <div className="grid min-w-0 gap-3">
                  <div className="grid gap-3 md:grid-cols-3">
                    <SeoStat label="Dil yapısı" value="TR / EN / DE / RU" />
                    <SeoStat label="Sitemap" value="Dinamik" />
                    <SeoStat label="Canonical" value="Aktif" />
                  </div>
                  <div className="grid gap-2">
                    {seoPreviewPages.map((page) => (
                      <div
                        className="grid min-w-0 gap-3 overflow-hidden border border-[#dde3ea] bg-white p-4 md:grid-cols-[minmax(0,1fr)_auto]"
                        key={`${page.status}-${page.id}`}
                      >
                        <div className="min-w-0">
                          <p className="break-words font-black">{page.title}</p>
                          <p className="mt-1 break-all text-sm font-bold text-[#64717d]">
                            {page.path}
                          </p>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#64717d]">
                            {page.summary}
                          </p>
                        </div>
                        <div className="flex items-start gap-2 md:justify-end">
                          <StatusBadge tone={page.status === "Pasif" ? "amber" : "green"}>
                            {page.status}
                          </StatusBadge>
                          <StatusBadge tone="blue">{page.kind}</StatusBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            <section className="grid gap-6 2xl:grid-cols-3">
              <Panel eyebrow="Ayarlar" id="ayarlar" title="Site Bilgileri">
                <form action={updateSettingsAction} className="grid gap-3">
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
                    Geçici logo metni
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
              </Panel>

              <Panel
                eyebrow="İletişim"
                id="mesaj-talepleri"
                title="Mesaj Talepleri"
                action={`${store.contacts.length} kayıt`}
              >
                <div className="grid gap-3">
                  <form action={createContactAction} className="grid gap-2 border border-[#dde3ea] bg-[#f8fafc] p-4">
                    <input name="locale" type="hidden" value={locale} />
                    <input className="admin-input" name="name" placeholder="Ad soyad" required />
                    <input className="admin-input" name="phone" placeholder="Telefon" />
                    <input className="admin-input" name="email" placeholder="E-posta" />
                    <input className="admin-input" name="subject" placeholder="Konu" required />
                    <textarea
                      className="admin-input min-h-24 resize-y"
                      name="message"
                      placeholder="Mesaj"
                    />
                    <button className="admin-btn" type="submit">
                      Mesaj Talebi Ekle
                    </button>
                  </form>

                  {store.contacts.map((contact) => (
                    <div className="border border-[#dde3ea] bg-white p-4" key={contact.id}>
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
                          className="admin-input min-h-24 resize-y"
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
                action={`${store.users.length} kullanıcı`}
              >
                <div className="grid gap-3">
                  <form action={createUserAction} className="grid gap-2 border border-[#dde3ea] bg-[#f8fafc] p-4">
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

                  {store.users.map((user) => (
                    <form
                      action={updateUserAction}
                      className="grid gap-2 border border-[#dde3ea] bg-white p-4"
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

              <Panel eyebrow="Raporlar" id="raporlar" title="Performans">
                <ReportRow
                  label="Tur detay görüntüleme"
                  value={String(store.events.filter((event) => event.name === "tour_view").length)}
                />
                <ReportRow label="Jolly tıklaması" value={String(jollyClicks)} />
                <ReportRow label="WhatsApp tıklaması" value={String(whatsappClicks)} />
                <ReportRow label="Form gönderimi" value={String(Math.max(formEvents, leads.length))} />
                <ReportRow
                  label="UTM kaynaklı talep"
                  value={String(leads.filter((lead) => lead.sourcePath.includes("utm_")).length)}
                />
              </Panel>
            </section>
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
    <div className="border border-[#dde3ea] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#64717d]">
            {label}
          </p>
          <p className="mt-3 text-4xl font-black">{value}</p>
          <p className="mt-2 text-sm text-[#64717d]">{sub}</p>
        </div>
        <span className={`grid size-11 place-items-center text-sm font-black ${colors[accent]}`}>
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
      <div className="flex flex-col gap-3 border-b border-[#dde3ea] px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#e85d3f]">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-black">{title}</h2>
        </div>
        {action ? (
          <span className="admin-btn-light">{action}</span>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
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
    <div className="min-h-72 min-w-0 border border-[#dde3ea] bg-[#f8fafc] p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="break-words font-black">{status}</h3>
        <span className="bg-white px-2 py-1 text-xs font-black text-[#64717d]">
          {leads.length}
        </span>
      </div>
      <div className="grid gap-3">
        {leads.length ? (
          leads.map((lead) => (
            <div className="min-w-0 border border-[#dde3ea] bg-white p-3" key={lead.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-black">{lead.name}</p>
                  <p className="mt-1 break-words text-xs text-[#64717d]">
                    {lead.tourTitle ?? "Genel talep"}
                  </p>
                </div>
                <span className="bg-[#fff0eb] px-2 py-1 text-xs font-black text-[#d94d31]">
                  {leadScore(lead)}
                </span>
              </div>
              <p className="mt-3 break-words text-sm leading-5 text-[#64717d]">{lead.note}</p>
              <div className="mt-3 grid gap-1 text-xs font-bold text-[#64717d]">
                <span className="break-words">{lead.phone || "Telefon yok"}</span>
                <span className="break-all">{lead.email || "E-posta yok"}</span>
                <span>
                  {lead.travelers || "Kişi sayısı yok"} kişi ·{" "}
                  {lead.preferredDate || "Tarih belirsiz"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 text-xs font-bold text-[#64717d]">
                <span>{lead.locale.toUpperCase()}</span>
                <span className="min-w-0 break-all text-right">{lead.sourcePath || "direct"}</span>
              </div>
              <form action={updateLeadStatusAction} className="mt-3 grid gap-2">
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
              <details className="mt-3 border border-[#dde3ea] bg-[#f8fafc] p-3">
                <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.1em]">
                  Talebi düzenle
                </summary>
                <form action={updateLeadAction} className="mt-3 grid gap-2">
                  <input name="id" type="hidden" value={lead.id} />
                  <input name="locale" type="hidden" value={locale} />
                  <input
                    className="admin-input !min-h-10"
                    defaultValue={lead.name}
                    name="name"
                    placeholder="Ad soyad"
                  />
                  <input
                    className="admin-input !min-h-10"
                    defaultValue={lead.phone}
                    name="phone"
                    placeholder="Telefon"
                  />
                  <input
                    className="admin-input !min-h-10"
                    defaultValue={lead.email}
                    name="email"
                    placeholder="E-posta"
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      className="admin-input !min-h-10"
                      defaultValue={lead.travelers}
                      name="travelers"
                      placeholder="Kişi"
                    />
                    <input
                      className="admin-input !min-h-10"
                      defaultValue={lead.preferredDate}
                      name="preferredDate"
                      placeholder="Tercih tarihi"
                    />
                  </div>
                  <select className="admin-input !min-h-10" defaultValue={lead.status} name="status">
                    {leadStatuses.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <textarea
                    className="admin-input min-h-20 resize-y"
                    defaultValue={lead.note}
                    name="note"
                    placeholder="Not"
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
          <div className="border border-dashed border-[#c7d0da] bg-white p-4 text-sm text-[#64717d]">
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
  return Math.min(score, 99);
}

function LanguageDots() {
  return (
    <div className="flex gap-1">
      {locales.map((locale) => (
        <span
          className="grid size-7 place-items-center bg-[#e9f7f7] text-[10px] font-black text-[#0f8b8d]"
          key={locale}
        >
          {locale.toUpperCase()}
        </span>
      ))}
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
    <div className="border border-[#dde3ea] bg-[#f8fafc] p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#64717d]">
        {label}
      </p>
      <p className="mt-2 break-words font-black text-[#172026]">{value}</p>
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#dde3ea] py-3 last:border-b-0">
      <span className="text-sm font-bold text-[#64717d]">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
