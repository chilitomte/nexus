import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/server";

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
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return Boolean(user);
}

export async function getRequestSessionStatus(
  _request: Request | NextRequest,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return Boolean(user);
}
