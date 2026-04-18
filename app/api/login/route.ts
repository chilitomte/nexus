import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionToken, getAuthSecret, sessionCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const secret = getAuthSecret();

  if (!secret) {
    return NextResponse.json(
      { error: "PARTY_PASSWORD is missing on the server." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { password?: string }
    | null;
  const submittedPassword = body?.password?.trim();

  if (!submittedPassword) {
    return NextResponse.json(
      { error: "Enter the shared party password." },
      { status: 400 },
    );
  }

  if (submittedPassword !== secret) {
    return NextResponse.json(
      { error: "That password does not open this portal." },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("party_session", await createSessionToken(secret), sessionCookieOptions);

  return NextResponse.json({ ok: true });
}
