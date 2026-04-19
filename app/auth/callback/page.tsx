"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Opening the portal...");
  const code = searchParams.get("code");

  useEffect(() => {
    async function finalizeLogin() {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setStatus("Your soul is not pure");
          return;
        }

        setStatus("Welcome!");
        router.replace("/party");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setStatus("Welcome!");
        router.replace("/party");
      } else {
        setStatus("Your soul is not pure");
      }
    }

    finalizeLogin().catch(() => {
      setStatus("Your soul is not pure");
    });
  }, [code, router]);

  return <div
      className="glass-panel space-y-8 p-6 text-center sm:p-8"
    >
      <label className="space-y-3">
        <span className="sr-only">
          {status}
        </span>
      </label>
    </div>;
}
