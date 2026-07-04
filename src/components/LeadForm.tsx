"use client";

import { useState } from "react";
import { type Locale } from "@/lib/site";
import { t } from "@/lib/translations";
import { trackEvent, trackingEvents } from "@/lib/tracking";

type BookingDate = {
  start: string;
  end: string;
  price: number;
  currency: "TRY" | "EUR" | "USD";
  availability: string;
};

const bookingCopy = {
  tr: {
    steps: ["Tarih", "Katılımcı", "İletişim"],
    date: "Tur tarihi",
    adult: "Yetişkin",
    child: "Çocuk",
    estimate: "Tahmini toplam",
    perPerson: "kişi başı",
    requestNo: "Talep no",
    sending: "Gönderiliyor...",
    notice: "Bu tutar ön bilgilendirme içindir. Kesin fiyat ve ödeme Jolly / satış danışmanı sürecinde netleşir.",
  },
  en: {
    steps: ["Date", "Guests", "Contact"],
    date: "Tour date",
    adult: "Adult",
    child: "Child",
    estimate: "Estimated total",
    perPerson: "per person",
    requestNo: "Request no",
    sending: "Sending...",
    notice: "This is an indicative total. Final price and payment are confirmed through Jolly / consultant flow.",
  },
  de: {
    steps: ["Termin", "Personen", "Kontakt"],
    date: "Reisetermin",
    adult: "Erwachsene",
    child: "Kinder",
    estimate: "Geschätzte Summe",
    perPerson: "pro Person",
    requestNo: "Anfrage-Nr.",
    sending: "Wird gesendet...",
    notice: "Dies ist ein Richtwert. Endpreis und Zahlung werden über Jolly / Beratung bestätigt.",
  },
  ru: {
    steps: ["Дата", "Участники", "Контакт"],
    date: "Дата тура",
    adult: "Взрослые",
    child: "Дети",
    estimate: "Ориентировочно",
    perPerson: "за человека",
    requestNo: "Номер заявки",
    sending: "Отправляется...",
    notice: "Это ориентировочная сумма. Итоговая цена и оплата подтверждаются через Jolly / консультанта.",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

export function LeadForm({
  currency,
  locale,
  priceFrom,
  tourDates = [],
  tourTitle,
}: {
  currency?: "TRY" | "EUR" | "USD";
  locale: Locale;
  priceFrom?: number;
  tourDates?: BookingDate[];
  tourTitle?: string;
}) {
  const copy = t(locale);
  const flowCopy = bookingCopy[locale];
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [selectedDateKey, setSelectedDateKey] = useState(tourDates[0]?.start ?? "");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const selectedDate =
    tourDates.find((date) => date.start === selectedDateKey) ?? tourDates[0];
  const basePrice = selectedDate?.price ?? priceFrom ?? 0;
  const displayCurrency = selectedDate?.currency ?? currency ?? "TRY";
  const childPrice = Math.round(basePrice * 0.65);
  const totalEstimate = basePrice * adults + childPrice * children;

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setRequestId("");
    setStatus("idle");

    const adultCount = Number(formData.get("adults") ?? adults);
    const childCount = Number(formData.get("children") ?? children);
    const travelerText = `${adultCount} ${flowCopy.adult}${
      childCount ? `, ${childCount} ${flowCopy.child}` : ""
    }`;
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      travelers: travelerText,
      preferredDate: String(formData.get("preferredDate") ?? ""),
      note: String(formData.get("note") ?? ""),
      locale,
      tourTitle: tourTitle ?? null,
      sourcePath: window.location.pathname,
      channel: "Form",
      internalNote: totalEstimate
        ? `${flowCopy.estimate}: ${formatBookingPrice(totalEstimate, displayCurrency)}`
        : "",
      kvkk: formData.get("kvkk") === "on",
      marketing: formData.get("marketing") === "on",
      jollyNotice: formData.get("jollyNotice") === "on",
    };

    try {
      const response = await fetch("/api/leads", {
        body: JSON.stringify(payload),
        headers: { "content-type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("lead_failed");
      }

      const result = (await response.json()) as { id?: string };
      setRequestId(result.id ?? "");
      setStatus("success");
      trackEvent(trackingEvents.leadSubmit, {
        locale,
        tourTitle: tourTitle ?? "",
        sourcePath: window.location.pathname,
      });
    } catch {
      setStatus("error");
      trackEvent(trackingEvents.leadError, {
        locale,
        sourcePath: window.location.pathname,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      aria-busy={isSubmitting}
      className="grid gap-3 border border-black/10 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-2xl font-black text-[var(--color-ink)]">
          {copy.sections.lead}
        </h2>
        {tourTitle ? (
          <p className="mt-2 text-sm text-[var(--color-muted)]">{tourTitle}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(flowCopy.steps as string[]).map((step, index) => (
          <span
            className="border border-black/10 bg-[var(--color-sand)] px-2 py-2 text-center text-xs font-black uppercase tracking-[0.08em] text-[var(--color-ink)]"
            key={step}
          >
            {index + 1}. {step}
          </span>
        ))}
      </div>
      {tourDates.length ? (
        <label className="grid gap-2 text-sm font-black text-[var(--color-ink)]">
          {flowCopy.date as string}
          <select
            className="field-input"
            name="preferredDate"
            onChange={(event) => setSelectedDateKey(event.target.value)}
            value={selectedDateKey}
          >
            {tourDates.map((date) => (
              <option key={`${date.start}-${date.end}`} value={date.start}>
                {date.start} / {date.end} - {formatBookingPrice(date.price, date.currency)} - {date.availability}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <input
          className="field-input"
          name="preferredDate"
          placeholder={copy.form.preferredDate}
        />
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField
          label={flowCopy.adult as string}
          min={1}
          name="adults"
          onChange={setAdults}
          value={adults}
        />
        <NumberField
          label={flowCopy.child as string}
          min={0}
          name="children"
          onChange={setChildren}
          value={children}
        />
      </div>
      {basePrice > 0 ? (
        <div className="border border-black/10 bg-[var(--color-sand)] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-muted)]">
                {flowCopy.estimate as string}
              </p>
              <p className="mt-1 text-2xl font-black text-[var(--color-ink)]">
                {formatBookingPrice(totalEstimate, displayCurrency)}
              </p>
            </div>
            <p className="text-right text-sm font-bold text-[var(--color-muted)]">
              {formatBookingPrice(basePrice, displayCurrency)} {flowCopy.perPerson as string}
            </p>
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--color-muted)]">
            {flowCopy.notice as string}
          </p>
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field-input" name="name" placeholder={copy.form.name} required />
        <input className="field-input" name="phone" placeholder={copy.form.phone} required />
        <input className="field-input" name="email" placeholder={copy.form.email} type="email" />
      </div>
      <textarea
        className="field-input min-h-28 resize-y"
        name="note"
        placeholder={copy.form.note}
      />
      <CheckLabel name="kvkk" required text={copy.form.kvkk} />
      <CheckLabel name="marketing" text={copy.form.marketing} />
      <CheckLabel name="jollyNotice" required text={copy.form.jollyNotice} />
      <button className="button-primary disabled:cursor-not-allowed disabled:opacity-70" disabled={isSubmitting} type="submit">
        {isSubmitting ? (flowCopy.sending as string) : copy.actions.submit}
      </button>
      {status === "success" ? (
        <p className="border border-[var(--color-teal)] bg-[rgba(15,139,141,0.08)] p-3 text-sm font-bold text-[var(--color-teal)]">
          {copy.form.success}
          {requestId ? (
            <span className="mt-1 block">
              {flowCopy.requestNo as string}: {requestId}
            </span>
          ) : null}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="border border-[var(--color-coral)] bg-[rgba(232,93,63,0.08)] p-3 text-sm font-bold text-[var(--color-coral)]">
          Form gönderimi şu an tamamlanamadı.
        </p>
      ) : null}
    </form>
  );
}

function NumberField({
  label,
  min,
  name,
  onChange,
  value,
}: {
  label: string;
  min: number;
  name: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-black text-[var(--color-ink)]">
      {label}
      <input
        className="field-input"
        min={min}
        name={name}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          onChange(Number.isFinite(nextValue) ? Math.max(min, nextValue) : min);
        }}
        type="number"
        value={value}
      />
    </label>
  );
}

function CheckLabel({
  text,
  name,
  required,
}: {
  text: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 text-sm leading-6 text-[var(--color-muted)]">
      <input
        className="mt-1 size-4 accent-[var(--color-coral)]"
        name={name}
        required={required}
        type="checkbox"
      />
      <span>{text}</span>
    </label>
  );
}

function formatBookingPrice(price: number, currency: BookingDate["currency"]) {
  return new Intl.NumberFormat("tr-TR", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(price);
}
