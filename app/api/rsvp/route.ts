import { NextResponse } from "next/server";
import { createAttendee, updateAttendee } from "@/lib/data";
import { getRequestSessionStatus } from "@/lib/auth";

type RsvpBody = {
  name?: string;
  nickname?: string;
  comment?: string;
};

function validateRsvpBody(body: RsvpBody | null) {
  const name = body?.name?.trim() ?? "";
  const nickname = body?.nickname?.trim() ?? "";
  const comment = body?.comment?.trim() ?? "";

  if (name.length < 2 || name.length > 48) {
    return {
      ok: false as const,
      error: "Real names need to be between 2 and 48 characters.",
      status: 400,
    };
  }

  if (nickname.length < 2 || nickname.length > 48) {
    return {
      ok: false as const,
      error: "Entity names need to be between 2 and 48 characters.",
      status: 400,
    };
  }

  if (comment.length < 2 || comment.length > 120) {
    return {
      ok: false as const,
      error: "Tell us what energy you are bringing in 2 to 120 characters.",
      status: 400,
    };
  }

  return {
    ok: true as const,
    data: { name, nickname, comment },
  };
}

export async function POST(request: Request) {
  const isAuthenticated = await getRequestSessionStatus(request);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedBody = (await request.json().catch(() => null)) as RsvpBody | null;
  const validation = validateRsvpBody(parsedBody);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  const result = await createAttendee(validation.data);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, attendee: result.attendee });
}

export async function PATCH(request: Request) {
  const isAuthenticated = await getRequestSessionStatus(request);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedBody = (await request.json().catch(() => null)) as RsvpBody | null;
  const validation = validateRsvpBody(parsedBody);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  const result = await updateAttendee(validation.data);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, attendee: result.attendee });
}
