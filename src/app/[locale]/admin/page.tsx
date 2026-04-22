import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allLandingPages,
  campaigns,
  categories,
  destinations,
  formatPrice,
  tours,
} from "@/lib/catalog";
import { locales, siteConfig, type Locale } from "@/lib/site";

type PageProps = {
  params: Promise<{ locale: string }>;
};

type LeadStatus =
  | "Yeni"
  | "Arandı"
  | "Teklif verildi"
  | "Takipte"
  | "Satışa döndü";

type Lead = {
  name: string;
  tour: string;
  phone: string;
  source: string;
  status: LeadStatus;
  language: string;
  score: number;
  note: string;
};

const isLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

const leads: Lead[] = [
  {
    name: "Ayşe Demir",
    tour: "Karadeniz Rüyası Turu",
    phone: "+90 555 111 22 33",
    source: "Google / organic",
    status: "Yeni",
    language: "TR",
    score: 92,
    note: "2 kişi, Temmuz ilk haftası, İstanbul çıkışlı.",
  },
  {
    name: "Murat Kaya",
    tour: "Vizesiz Balkan Turu",
    phone: "+90 555 333 44 55",
    source: "Instagram / bayram",
    status: "Teklif verildi",
    language: "TR",
    score: 81,
    note: "Bayram dönemi için aile kontenjanı soruyor.",
  },
  {
    name: "Elena Petrova",
    tour: "Dubai & Abu Dabi Turu",
    phone: "+7 900 000 00 00",
    source: "RU landing",
    status: "Takipte",
    language: "RU",
    score: 74,
    note: "Rusça dönüş istedi, WhatsApp uygun.",
  },
  {
    name: "Thomas Weber",
    tour: "İtalya Klasikleri Turu",
    phone: "+49 170 000 000",
    source: "DE / italy-tours",
    status: "Satışa döndü",
    language: "DE",
    score: 96,
    note: "Schengen süreci için evrak listesi gönderildi.",
  },
];

const navItems = [
  "Dashboard",
  "Turlar",
  "Tarih & Fiyat",
  "Ön Talepler",
  "Kategoriler",
  "Kampanyalar",
  "İçerikler",
  "SEO",
  "Raporlar",
  "Ayarlar",
];

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

export default async function AdminPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const activeTours = tours.length;
  const leadCount = leads.length;
  const soldLeads = leads.filter((lead) => lead.status === "Satışa döndü").length;
  const conversionRate = Math.round((soldLeads / leadCount) * 100);
  const pageCount = allLandingPages.length;

  return (
    <main className="admin-shell min-h-screen bg-[#f4f6f8] text-[#172026]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-[#dde3ea] bg-[#101820] text-white">
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
            <span className="grid size-11 place-items-center bg-[#ff6b4a] text-sm font-black">
              {siteConfig.logoMark}
            </span>
            <div>
              <p className="font-black leading-5">{siteConfig.name}</p>
              <p className="text-xs text-white/58">Acenta Yönetim Paneli</p>
            </div>
          </div>

          <nav className="grid gap-1 p-4">
            {navItems.map((item, index) => (
              <a
                className={`flex items-center justify-between border border-transparent px-4 py-3 text-sm font-bold transition ${
                  index === 0
                    ? "border-white/10 bg-white text-[#101820]"
                    : "text-white/72 hover:border-white/10 hover:bg-white/8 hover:text-white"
                }`}
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                key={item}
              >
                <span>{item}</span>
                {index === 0 ? <span>Aktif</span> : null}
              </a>
            ))}
          </nav>

          <div className="m-4 border border-white/10 bg-white/[0.06] p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f6b44b]">
              Durum
            </p>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Veriler şu an demo kaynaktan geliyor. Tasarım yayına yakın panel
              hissi için hazırlandı; sonraki adımda veritabanına bağlanacak.
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
                  className="admin-input min-w-72"
                  placeholder="Tur, müşteri, kategori veya sayfa ara"
                />
                <Link className="admin-btn-light" href={`/${locale}`}>
                  Siteyi Gör
                </Link>
                <button className="admin-btn" type="button">
                  Yeni Tur Ekle
                </button>
              </div>
            </div>
          </header>

          <div className="grid gap-6 px-5 py-6 xl:px-8">
            <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              <MetricCard
                accent="coral"
                label="Aktif Tur"
                sub="Yayında görünen tur sayısı"
                value={String(activeTours)}
              />
              <MetricCard
                accent="teal"
                label="Yeni Ön Talep"
                sub="Bugün takip edilecek müşteri"
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
                sub="Kategori, rota, yasal ve içerik"
                value={String(pageCount)}
              />
            </section>

            <section className="grid gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
              <Panel
                eyebrow="Satış Akışı"
                title="Ön Talep CRM"
                action="Tüm Talepler"
              >
                <div className="grid gap-3 xl:grid-cols-4">
                  {(["Yeni", "Arandı", "Teklif verildi", "Satışa döndü"] as LeadStatus[]).map(
                    (status) => (
                      <PipelineColumn
                        key={status}
                        leads={leads.filter((lead) => lead.status === status)}
                        status={status}
                      />
                    ),
                  )}
                </div>
              </Panel>

              <Panel eyebrow="Hızlı İşlem" title="Yeni Tur Formu">
                <div className="grid gap-3">
                  <input className="admin-input" placeholder="Tur adı TR" />
                  <input className="admin-input" placeholder="Slug: karadeniz-ruyasi-turu" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="admin-input" placeholder="Başlangıç fiyatı" />
                    <select className="admin-input" defaultValue="TRY">
                      <option>TRY</option>
                      <option>EUR</option>
                      <option>USD</option>
                    </select>
                  </div>
                  <input className="admin-input" placeholder="Jolly yönlendirme linki" />
                  <select className="admin-input" defaultValue="">
                    <option value="" disabled>
                      Kategori seç
                    </option>
                    {categories.map((category) => (
                      <option key={category.id}>{category.title[locale]}</option>
                    ))}
                  </select>
                  <button className="admin-btn" type="button">
                    Kaydet ve 4 Dili Tamamla
                  </button>
                </div>
              </Panel>
            </section>

            <Panel eyebrow="Tur Yönetimi" title="Turlar" action="Yeni Tur">
              <div className="overflow-x-auto">
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
                    {tours.map((tour, index) => (
                      <tr key={tour.id}>
                        <td>
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
                        <td>{tour.categoryIds.join(", ")}</td>
                        <td>{formatPrice(tour.priceFrom, tour.currency)}</td>
                        <td>{tour.dates.length} tarih</td>
                        <td>
                          <LanguageDots />
                        </td>
                        <td>
                          <Progress value={88 - index * 9} />
                        </td>
                        <td>
                          <StatusBadge tone="green">Yayında</StatusBadge>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button className="admin-icon-btn" type="button">
                              Düzenle
                            </button>
                            <Link
                              className="admin-icon-btn"
                              href={`/${locale}/turlar/${tour.slugs[locale]}`}
                            >
                              Gör
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <section className="grid gap-6 2xl:grid-cols-[0.85fr_1.15fr]">
              <Panel eyebrow="Tarih & Fiyat" title="Kontenjan Takibi">
                <div className="grid gap-3">
                  {tours.flatMap((tour) =>
                    tour.dates.map((date) => (
                      <div
                        className="grid gap-3 border border-[#dde3ea] bg-[#f8fafc] p-4 md:grid-cols-[1fr_auto_auto]"
                        key={`${tour.id}-${date.start}`}
                      >
                        <div>
                          <p className="font-black">{tour.title[locale]}</p>
                          <p className="mt-1 text-sm text-[#64717d]">
                            {date.start} / {date.end}
                          </p>
                        </div>
                        <strong>{formatPrice(date.price, date.currency)}</strong>
                        <StatusBadge tone={date.availability.tr === "Son kontenjan" ? "amber" : "green"}>
                          {date.availability[locale]}
                        </StatusBadge>
                      </div>
                    )),
                  )}
                </div>
              </Panel>

              <Panel eyebrow="İçerik ve SEO" title="Sayfa Yönetimi">
                <div className="grid gap-3 md:grid-cols-2">
                  {[...categories, ...campaigns, ...destinations]
                    .slice(0, 12)
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
                          <StatusBadge tone="blue">{page.kind}</StatusBadge>
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
              </Panel>
            </section>

            <section className="grid gap-6 2xl:grid-cols-3">
              <Panel eyebrow="Ayarlar" title="Site Bilgileri">
                <div className="grid gap-3">
                  <Setting label="Site adı" value={siteConfig.name} />
                  <Setting label="Logo" value={siteConfig.logoMark} />
                  <Setting label="Telefon" value={siteConfig.phoneDisplay} />
                  <Setting label="WhatsApp" value={siteConfig.whatsappDisplay} />
                  <Setting label="Jolly" value={siteConfig.defaultJollyUrl} />
                  <Setting label="TÜRSAB" value={siteConfig.tursabCertificate} />
                </div>
              </Panel>

              <Panel eyebrow="Yetki" title="Kullanıcı Rolleri">
                <Role name="Yönetici" permissions="Tüm modüller, ayarlar, raporlar" />
                <Role
                  name="Satış danışmanı"
                  permissions="Ön talepler, müşteri notları, durum güncelleme"
                />
                <Role
                  name="İçerik editörü"
                  permissions="Tur, kategori, blog, SEO içerikleri"
                />
              </Panel>

              <Panel eyebrow="Raporlar" title="Performans">
                <ReportRow label="Tur detay görüntüleme" value="1.248" />
                <ReportRow label="Jolly tıklaması" value="186" />
                <ReportRow label="WhatsApp tıklaması" value="94" />
                <ReportRow label="Form gönderimi" value="37" />
                <ReportRow label="UTM kaynaklı talep" value="21" />
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
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-[#dde3ea] bg-white shadow-sm" id={title.toLowerCase()}>
      <div className="flex flex-col gap-3 border-b border-[#dde3ea] px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#e85d3f]">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-black">{title}</h2>
        </div>
        {action ? (
          <button className="admin-btn-light" type="button">
            {action}
          </button>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function PipelineColumn({
  status,
  leads,
}: {
  status: LeadStatus;
  leads: Lead[];
}) {
  return (
    <div className="min-h-72 border border-[#dde3ea] bg-[#f8fafc] p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-black">{status}</h3>
        <span className="bg-white px-2 py-1 text-xs font-black text-[#64717d]">
          {leads.length}
        </span>
      </div>
      <div className="grid gap-3">
        {leads.length ? (
          leads.map((lead) => (
            <div className="border border-[#dde3ea] bg-white p-3" key={lead.name}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black">{lead.name}</p>
                  <p className="mt-1 text-xs text-[#64717d]">{lead.tour}</p>
                </div>
                <span className="bg-[#fff0eb] px-2 py-1 text-xs font-black text-[#d94d31]">
                  {lead.score}
                </span>
              </div>
              <p className="mt-3 text-sm leading-5 text-[#64717d]">{lead.note}</p>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#64717d]">
                <span>{lead.language}</span>
                <span>{lead.source}</span>
              </div>
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

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#dde3ea] bg-[#f8fafc] p-3">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#64717d]">
        {label}
      </p>
      <p className="mt-1 break-words font-bold">{value}</p>
    </div>
  );
}

function Role({ name, permissions }: { name: string; permissions: string }) {
  return (
    <div className="mb-3 border border-[#dde3ea] bg-[#f8fafc] p-4 last:mb-0">
      <p className="font-black">{name}</p>
      <p className="mt-1 text-sm leading-6 text-[#64717d]">{permissions}</p>
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
