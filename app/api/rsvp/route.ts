import { NextResponse } from "next/server";
import { createAttendee } from "@/lib/data";
import { getRequestSessionStatus } from "@/lib/auth";

type RsvpBody = {
  name?: string;
  identity?: string;
};

export async function POST(request: Request) {
  const isAuthenticated = await getRequestSessionStatus(request);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RsvpBody | null;
  const name = body?.name?.trim() ?? "";
  const identity = body?.identity?.trim() ?? "";

  if (name.length < 2 || name.length > 48) {
    return NextResponse.json(
      { error: "Names need to be between 2 and 48 characters." },
      { status: 400 },
    );
  }

  if (identity.length < 2 || identity.length > 120) {
    return NextResponse.json(
      { error: "Tell us who you really are in 2 to 120 characters." },
      { status: 400 },
    );
  }

  const result = await createAttendee({ name, identity });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, attendee: result.attendee });
}
