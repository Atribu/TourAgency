"use client";

import { useEffect, useState } from "react";
import { type Locale } from "@/lib/site";
import { t } from "@/lib/translations";
import { trackEvent, trackingEvents } from "@/lib/tracking";

type CookieChoice = "accepted" | "required";

export function CookieConsent({ locale }: { locale: Locale }) {
  const [choice, setChoice] = useState<CookieChoice | null>(null);
  const copy = t(locale);

  useEffect(() => {
    const saved = window.localStorage.getItem("touragency-cookie-choice");
    if (saved === "accepted" || saved === "required") {
      const timer = window.setTimeout(() => setChoice(saved), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function saveChoice(nextChoice: CookieChoice) {
    window.localStorage.setItem("touragency-cookie-choice", nextChoice);
    setChoice(nextChoice);
    trackEvent(trackingEvents.cookiePreference, {
      choice: nextChoice,
      locale,
    });
  }

  if (choice) {
    return null;
  }

  return (
    <div className="cookie-consent fixed bottom-4 left-4 right-4 z-50 border border-black/10 bg-white p-4 shadow-2xl sm:left-auto sm:max-w-xl">
      <h2 className="text-lg font-black">{copy.footer.legal}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
        {cookieText[locale]}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button className="button-primary" onClick={() => saveChoice("accepted")} type="button">
          {acceptText[locale]}
        </button>
        <button
          className="button-secondary !border-black/15 !text-[var(--color-ink)]"
          onClick={() => saveChoice("required")}
          type="button"
        >
          {requiredText[locale]}
        </button>
      </div>
    </div>
  );
}

const cookieText: Record<Locale, string> = {
  tr: "Zorunlu çerezler siteyi çalıştırır. Analitik ve pazarlama çerezleri, izin verirseniz tur, form ve yönlendirme performansını ölçmek için kullanılır.",
  en: "Required cookies keep the site running. Analytics and marketing cookies are used to measure tour, form and redirect performance if you allow them.",
  de: "Notwendige Cookies halten die Seite funktionsfähig. Analyse- und Marketing-Cookies messen Reise-, Formular- und Weiterleitungsleistung, wenn Sie zustimmen.",
  ru: "Обязательные cookie обеспечивают работу сайта. Аналитические и маркетинговые cookie используются для измерения туров, форм и переходов при вашем согласии.",
};

const acceptText: Record<Locale, string> = {
  tr: "Tümünü Kabul Et",
  en: "Accept All",
  de: "Alle akzeptieren",
  ru: "Принять все",
};

const requiredText: Record<Locale, string> = {
  tr: "Sadece Zorunlu",
  en: "Required Only",
  de: "Nur notwendige",
  ru: "Только обязательные",
};
