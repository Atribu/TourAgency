export const trackingEvents = {
  tourView: "tour_view",
  leadSubmit: "lead_submit",
  leadError: "lead_error",
  whatsappClick: "whatsapp_click",
  phoneClick: "phone_click",
  emailClick: "email_click",
  jollyClick: "jolly_click",
  search: "tour_search",
  filterUse: "filter_use",
  categoryView: "category_view",
  campaignView: "campaign_view",
  blogView: "blog_view",
  languageChange: "language_change",
  cookiePreference: "cookie_preference",
} as const;

type TrackingPayload = Record<string, string | number | boolean | null>;

export function trackEvent(name: string, payload: TrackingPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("touragency:track", {
      detail: { name, payload, at: new Date().toISOString() },
    }),
  );

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;

  if (typeof gtag === "function") {
    gtag("event", name, payload);
  }

  fetch("/api/track", {
    body: JSON.stringify({ name, payload }),
    headers: { "content-type": "application/json" },
    method: "POST",
  }).catch(() => undefined);
}
