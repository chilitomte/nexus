"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await fetch("/api/logout", {
            method: "POST",
          });
          router.push("/");
          router.refresh();
        })
      }
      className="rounded-full border border-white/18 bg-white/8 px-4 py-3 text-xs uppercase tracking-[0.28em] text-white/82 transition hover:bg-white/14"
      disabled={isPending}
    >
      {isPending ? "Closing..." : "bye bye!"}
    </button>
  );
}
