import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

export function getAuthSecret() {
  return process.env.PARTY_PASSWORD?.trim() ?? "";
}

async function digestValue(value: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(secret: string) {
  return digestValue(`party-session:${secret}`);
}

export async function validateSessionToken(token?: string | null, secret = getAuthSecret()) {
  if (!token || !secret) {
    return false;
  }

  return token === (await createSessionToken(secret));
}

export async function getSessionStatus() {
  const cookieStore = await cookies();
  return validateSessionToken(cookieStore.get("party_session")?.value);
}

export async function getRequestSessionStatus(
  request: Request | NextRequest,
) {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return false;
  }

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("party_session="));

  const token = match?.slice("party_session=".length) ?? null;

  return validateSessionToken(token);
}
