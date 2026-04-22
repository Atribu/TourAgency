"use client";

import { useState } from "react";
import { type Locale } from "@/lib/site";
import { t } from "@/lib/translations";
import { trackEvent, trackingEvents } from "@/lib/tracking";

export function LeadForm({
  locale,
  tourTitle,
}: {
  locale: Locale;
  tourTitle?: string;
}) {
  const copy = t(locale);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(formData: FormData) {
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      travelers: String(formData.get("travelers") ?? ""),
      preferredDate: String(formData.get("preferredDate") ?? ""),
      note: String(formData.get("note") ?? ""),
      locale,
      tourTitle: tourTitle ?? null,
      sourcePath: window.location.pathname,
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
    }
  }

  return (
    <form action={handleSubmit} className="grid gap-3 border border-black/10 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-2xl font-black text-[var(--color-ink)]">
          {copy.sections.lead}
        </h2>
        {tourTitle ? (
          <p className="mt-2 text-sm text-[var(--color-muted)]">{tourTitle}</p>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field-input" name="name" placeholder={copy.form.name} required />
        <input className="field-input" name="phone" placeholder={copy.form.phone} required />
        <input className="field-input" name="email" placeholder={copy.form.email} type="email" />
        <input className="field-input" name="travelers" placeholder={copy.form.travelers} />
      </div>
      <input
        className="field-input"
        name="preferredDate"
        placeholder={copy.form.preferredDate}
      />
      <textarea
        className="field-input min-h-28 resize-y"
        name="note"
        placeholder={copy.form.note}
      />
      <CheckLabel name="kvkk" required text={copy.form.kvkk} />
      <CheckLabel name="marketing" text={copy.form.marketing} />
      <CheckLabel name="jollyNotice" required text={copy.form.jollyNotice} />
      <button className="button-primary" type="submit">
        {copy.actions.submit}
      </button>
      {status === "success" ? (
        <p className="border border-[var(--color-teal)] bg-[rgba(15,139,141,0.08)] p-3 text-sm font-bold text-[var(--color-teal)]">
          {copy.form.success}
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
