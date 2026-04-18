"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

          setPassword("");
        setError(data?.error ?? "The portal stayed shut. Try again.");
        return;
      }

      router.push("/party");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel space-y-8 p-6 text-center sm:p-8"
    >
      <label className="space-y-3">
        <span className="sr-only">
          Say your vow
        </span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Say your vow"
          autoComplete="current-password"
          className="w-full rounded-full border border-white/18 bg-black/25 px-5 py-4 text-white outline-none transition focus:border-[color:var(--color-mint)] focus:bg-black/35"
        />
      </label>

      {error ? (
        <p className="mt-2 rounded-3xl border border-[color:var(--color-coral)]/35 bg-[color:var(--color-coral)]/12 px-4 py-3 text-sm text-[color:var(--color-coral-soft)]">
          We do not believe you!
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-full bg-[linear-gradient(120deg,var(--color-coral),var(--color-sun),var(--color-lime))] px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
      >
        {"Enter the realm"}
      </button>
    </form>
  );
}
