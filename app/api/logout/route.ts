import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/server";

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();
  cookieStore.delete("party_session");

  return NextResponse.json({ ok: true });
}
