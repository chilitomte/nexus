import { NextResponse } from "next/server";
import { createAttendee, isSupabaseConfigured } from "@/lib/data";
import { getRequestSessionStatus } from "@/lib/auth";

type RsvpBody = {
  name?: string;
};

export async function POST(request: Request) {
  const isAuthenticated = await getRequestSessionStatus(request);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RsvpBody | null;
  const name = body?.name?.trim() ?? "";

  if (name.length < 2 || name.length > 48) {
    return NextResponse.json(
      { error: "Names need to be between 2 and 48 characters." },
      { status: 400 },
    );
  }

  const result = await createAttendee({ name });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, attendee: result.attendee });
}
