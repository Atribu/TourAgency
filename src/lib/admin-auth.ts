import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { readDemoStore } from "./demo-store";
import type { DemoUserRole } from "./demo-types";

export const adminSessionCookie = "book_to_tour_admin_session";

const sessionMaxAgeSeconds = 60 * 60 * 8;
const fallbackAdminPassword = "booktotour2026";

export type AdminSession = {
  email: string;
  name: string;
  role: DemoUserRole;
  exp: number;
};

type SessionPayload = Omit<AdminSession, "exp">;

function getAuthSecret() {
  return process.env.ADMIN_AUTH_SECRET || "book-to-tour-local-dev-secret";
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function encode(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode<T>(value: string): T | null {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAdminSessionToken(payload: SessionPayload) {
  const session: AdminSession = {
    ...payload,
    exp: Date.now() + sessionMaxAgeSeconds * 1000,
  };
  const encoded = encode(session);

  return `${encoded}.${sign(encoded)}`;
}

export function parseAdminSessionToken(token?: string) {
  if (!token) {
    return null;
  }

  const [encoded, signature] = token.split(".");

  if (!encoded || !signature || !safeCompare(signature, sign(encoded))) {
    return null;
  }

  const session = decode<AdminSession>(encoded);

  if (!session || session.exp < Date.now()) {
    return null;
  }

  return session;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return parseAdminSessionToken(cookieStore.get(adminSessionCookie)?.value);
}

export async function setAdminSession(payload: SessionPayload) {
  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookie, createAdminSessionToken(payload), {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(adminSessionCookie);
}

export async function validateAdminCredentials(email: string, password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD || fallbackAdminPassword;
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!safeCompare(password, expectedPassword)) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const store = await readDemoStore();
  const user = store.users.find(
    (item) => item.active && item.email.toLowerCase() === normalizedEmail,
  );

  if (!user && normalizedEmail !== expectedEmail) {
    return null;
  }

  return {
    email: user?.email ?? email,
    name: user?.name ?? "Admin Kullanıcı",
    role: user?.role ?? "Yönetici",
  };
}

export function getDemoAdminPassword() {
  return process.env.ADMIN_PASSWORD || fallbackAdminPassword;
}
