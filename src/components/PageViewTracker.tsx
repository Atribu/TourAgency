"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/tracking";

type TrackingPayload = Record<string, string | number | boolean | null>;

export function PageViewTracker({
  eventName,
  payload,
}: {
  eventName: string;
  payload?: TrackingPayload;
}) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) {
      return;
    }

    trackedRef.current = true;
    trackEvent(eventName, {
      path: window.location.pathname,
      ...(payload ?? {}),
    });
  }, [eventName, payload]);

  return null;
}
