import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/server";

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
