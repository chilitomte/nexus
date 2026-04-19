import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string }
    | null;
  const email = body?.email?.trim() ?? "";

  if (!email) {
    return NextResponse.json(
      { error: "Enter your email address." },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const redirectUrl = new URL("/auth/callback", request.url).toString();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Could not send the magic link." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Magic link sent. Check your email to enter the realm.",
  });
}
