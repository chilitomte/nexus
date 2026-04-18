import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthSecret, validateSessionToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const secret = getAuthSecret();

  if (!secret) {
    return NextResponse.next();
  }

  const token = request.cookies.get("party_session")?.value;
  const isAuthenticated = await validateSessionToken(token, secret);

  if (!isAuthenticated) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/party/:path*", "/api/rsvp/:path*"],
};
