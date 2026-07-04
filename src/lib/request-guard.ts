type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

export function getClientKey(request: Request, scope: string) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return `${scope}:${forwardedIp || realIp || "local"}`;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
) {
  const timestamp = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= timestamp) {
    buckets.set(key, { count: 1, resetAt: timestamp + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((bucket.resetAt - timestamp) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export async function readJsonBody(request: Request, maxLength = 12_000) {
  const raw = await request.text().catch(() => "");

  if (raw.length > maxLength) {
    return {
      data: null,
      ok: false,
      status: 413,
      message: "payload_too_large",
    } as const;
  }

  try {
    return {
      data: raw ? (JSON.parse(raw) as unknown) : {},
      ok: true,
      status: 200,
      message: "ok",
    } as const;
  } catch {
    return {
      data: null,
      ok: false,
      status: 400,
      message: "invalid_json",
    } as const;
  }
}

export function cleanString(value: unknown, maxLength = 500) {
  return String(value ?? "").trim().slice(0, maxLength);
}

export function isLikelyPhone(value: string) {
  return value.replace(/\D/g, "").length >= 10;
}

export function cleanPayload(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .slice(0, 16)
      .map(([key, entry]) => {
        if (typeof entry === "string") {
          return [cleanString(key, 60), cleanString(entry, 320)];
        }

        if (typeof entry === "number") {
          return [cleanString(key, 60), Number.isFinite(entry) ? entry : null];
        }

        if (typeof entry === "boolean" || entry === null) {
          return [cleanString(key, 60), entry];
        }

        return [cleanString(key, 60), cleanString(entry, 320)];
      }),
  );
}
