import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

function createAuthCallbackClient(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const successRedirect = NextResponse.redirect(new URL("/party", request.url));

  if (code) {
    const supabase = createAuthCallbackClient(request, successRedirect);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return successRedirect;
    }
  }

  const failureRedirect = new URL("/", request.url);
  failureRedirect.searchParams.set("error", "The portal stayed shut. Request a fresh magic link.");

  return NextResponse.redirect(failureRedirect);
}
