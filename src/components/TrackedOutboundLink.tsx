"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/tracking";

type TrackingPayload = Record<string, string | number | boolean | null>;

type TrackedOutboundLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  payload?: TrackingPayload;
};

export function TrackedOutboundLink({
  children,
  eventName,
  href,
  onClick,
  payload,
  ...props
}: TrackedOutboundLinkProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        trackEvent(eventName, {
          ...(payload ?? {}),
          href: href ?? null,
        });
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
