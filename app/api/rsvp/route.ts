import { NextResponse } from "next/server";
import { createAttendee, isSupabaseConfigured } from "@/lib/data";
import { getRequestSessionStatus } from "@/lib/auth";

type RsvpBody = {
  name?: string;
  avatarSeed?: string;
};

export async function POST(request: Request) {
  const isAuthenticated = await getRequestSessionStatus(request);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase is not configured yet. Add the environment variables and table schema first.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as RsvpBody | null;
  const name = body?.name?.trim() ?? "";
  const avatarSeed = body?.avatarSeed?.trim() ?? "";

  if (name.length < 2 || name.length > 48) {
    return NextResponse.json(
      { error: "Names need to be between 2 and 48 characters." },
      { status: 400 },
    );
  }

  if (!/^[a-z0-9-]{3,40}$/i.test(avatarSeed)) {
    return NextResponse.json(
      { error: "Choose one of the portal avatars before submitting." },
      { status: 400 },
    );
  }

  const result = await createAttendee({ name, avatarSeed });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, attendee: result.attendee });
}
