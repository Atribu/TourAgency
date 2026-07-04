import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  getAdminSession,
  getDemoAdminPassword,
  setAdminSession,
  validateAdminCredentials,
} from "@/lib/admin-auth";
import { locales, type Locale } from "@/lib/site";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

const isLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Giriş | book to tour",
  description: "book to tour yönetim paneli giriş ekranı.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function loginAction(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") ?? "tr");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const user = await validateAdminCredentials(email, password);

  if (!user) {
    redirect(`/${locale}/admin/login?error=1`);
  }

  await setAdminSession(user);
  redirect(`/${locale}/admin`);
}

export default async function AdminLoginPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    redirect("/tr/admin/login");
  }

  const session = await getAdminSession();

  if (session) {
    redirect(`/${locale}/admin`);
  }

  const { error } = await searchParams;
  const showDemoHint = process.env.NODE_ENV !== "production";

  return (
    <main className="admin-auth-shell grid min-h-screen bg-[#f4f6f8] text-[#172026] lg:grid-cols-[0.92fr_1.08fr]">
      <section className="hidden border-r border-[#dde3ea] bg-[#28374f] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center bg-[#ff9900] text-sm font-black text-[#28374f]">
              BT
            </span>
            <div>
              <p className="text-2xl font-black">book to tour</p>
              <p className="text-sm text-white/68">Acenta Yönetim Paneli</p>
            </div>
          </div>
          <div className="mt-20 max-w-xl">
            <p className="text-sm font-black uppercase text-[#ffb84d]">
              Operasyon merkezi
            </p>
            <h1 className="mt-4 text-5xl font-black leading-tight">
              Turlar, talepler ve satış akışı tek panelde.
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/72">
              Demo store ile veritabanı olmadan çalışır; gerçek database
              bağlandığında aynı yönetim ekranı korunur.
            </p>
          </div>
        </div>
        <div className="grid gap-3 text-sm text-white/72">
          <span>TR / EN / DE / RU içerik mimarisi</span>
          <span>Jolly yönlendirme ve ön talep takibi</span>
          <span>SEO, kampanya ve sayfa yönetimi</span>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md border border-[#dde3ea] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <span className="grid size-12 place-items-center bg-[#ff9900] text-sm font-black text-[#28374f] lg:hidden">
              BT
            </span>
            <p className="mt-5 text-sm font-black uppercase text-[#d17a00]">
              Güvenli giriş
            </p>
            <h2 className="mt-2 text-3xl font-black">Yönetim paneli</h2>
            <p className="mt-3 leading-7 text-[#64717d]">
              Panel işlemleri için yetkili kullanıcıyla giriş yapın.
            </p>
          </div>

          {error ? (
            <div className="mb-5 border border-[#ffd7cc] bg-[#fff2ed] p-4 text-sm font-bold text-[#b8381d]">
              E-posta veya şifre hatalı. Bilgileri kontrol edip tekrar deneyin.
            </div>
          ) : null}

          <form action={loginAction} className="grid gap-4">
            <input name="locale" type="hidden" value={locale} />
            <label className="grid gap-2 text-sm font-black">
              E-posta
              <input
                autoComplete="email"
                className="admin-input"
                name="email"
                placeholder="admin@booktotour.demo"
                required
                type="email"
              />
            </label>
            <label className="grid gap-2 text-sm font-black">
              Şifre
              <input
                autoComplete="current-password"
                className="admin-input"
                name="password"
                placeholder="Şifreniz"
                required
                type="password"
              />
            </label>
            <button className="admin-btn mt-2" type="submit">
              Panele Giriş Yap
            </button>
          </form>

          {showDemoHint ? (
            <div className="mt-6 border border-[#dde3ea] bg-[#f8fafc] p-4 text-sm leading-6 text-[#64717d]">
              <p className="font-black text-[#172026]">Yerel demo erişimi</p>
              <p className="mt-2">
                E-posta: <span className="font-black">admin@booktotour.demo</span>
              </p>
              <p>
                Şifre: <span className="font-black">{getDemoAdminPassword()}</span>
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
