"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

type RsvpFormProps = {
  hidden?: boolean;
};

export function RsvpForm({ hidden = false }: RsvpFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, identity }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "The RSVP signal dissolved before it landed.");
        return;
      }

      setName("");
      setIdentity("");
      setSuccess("Your spirit is now loaded into the Nexus.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {hidden ? null : (
        <>
      <div className="space-y-3">
        <label
          htmlFor="guest-name"
          className="block text-left text-xs uppercase tracking-[0.28em] text-white/48"
        >
          Tell us what to call you
        </label>
        <input
          id="guest-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Choose your entity name"
          maxLength={48}
          className="w-full rounded-full border border-white/18 bg-black/25 px-5 py-4 text-white outline-none transition focus:border-[color:var(--color-mint)] focus:bg-black/35"
        />
      </div>

      <div className="space-y-3">
        <label
          htmlFor="guest-identity"
          className="block text-left text-xs uppercase tracking-[0.28em] text-white/48"
        >
          Tell us who you are
        </label>
        <input
          id="guest-identity"
          value={identity}
          onChange={(event) => setIdentity(event.target.value)}
          placeholder="A glittering oracle, a cosmic trickster, a shape-shifting dream..."
          maxLength={64}
          className="w-full rounded-full border border-white/18 bg-black/25 px-5 py-4 text-white outline-none transition focus:border-[color:var(--color-mint)] focus:bg-black/35"
        />
      </div>

      {error ? (
        <p className="rounded-3xl border border-[color:var(--color-coral)]/35 bg-[color:var(--color-coral)]/12 px-4 py-3 text-sm text-[color:var(--color-coral-soft)]">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-3xl border border-[color:var(--color-mint)]/35 bg-[color:var(--color-mint)]/12 px-4 py-3 text-sm text-[color:var(--color-mint)]">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[linear-gradient(120deg,var(--color-mint),var(--color-sky),var(--color-orchid))] px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isPending
          ? "Embarking..."
          : "Open the portal"}
      </button>
        </>
      )}
    </form>
  );
}
