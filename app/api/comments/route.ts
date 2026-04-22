import { NextResponse } from "next/server";
import { createComment } from "@/lib/data";
import { getRequestSessionStatus } from "@/lib/auth";

type CommentBody = {
  body?: string;
};

export async function POST(request: Request) {
  const isAuthenticated = await getRequestSessionStatus(request);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as CommentBody | null;
  const body = payload?.body?.trim() ?? "";

  if (body.length < 2 || body.length > 500) {
    return NextResponse.json(
      { error: "Messages need to be between 2 and 500 characters." },
      { status: 400 },
    );
  }

  const result = await createComment({ body });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, comment: result.comment });
}
