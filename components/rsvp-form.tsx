"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { avatarUrl } from "@/lib/avatar";

type AvatarChoice = {
  seed: string;
  label: string;
};

type RsvpFormProps = {
  avatarChoices: readonly AvatarChoice[];
  setupReady: boolean;
};

export function RsvpForm({ avatarChoices, setupReady }: RsvpFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [avatarSeed, setAvatarSeed] = useState(avatarChoices[0]?.seed ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const helperMessage = useMemo(() => {
    if (setupReady) {
      return "Submissions save into Supabase and refresh the attendee wall right away.";
    }

    return "The form UI is ready, but Supabase still needs to be configured before RSVP submissions can be stored.";
  }, [setupReady]);

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
        body: JSON.stringify({ name, avatarSeed }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "The RSVP signal dissolved before it landed.");
        return;
      }

      setName("");
      setSuccess("Your name is now glowing on the attendee wall.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-3">
        <label
          htmlFor="guest-name"
          className="text-xs uppercase tracking-[0.3em] text-white/48"
        >
          Name
        </label>
        <input
          id="guest-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your cosmic alias"
          maxLength={48}
          className="w-full rounded-full border border-white/18 bg-black/25 px-5 py-4 text-white outline-none transition focus:border-[color:var(--color-mint)] focus:bg-black/35"
        />
      </div>

      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/48">
          Choose an avatar
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {avatarChoices.map((choice) => {
            const isSelected = avatarSeed === choice.seed;

            return (
              <button
                key={choice.seed}
                type="button"
                onClick={() => setAvatarSeed(choice.seed)}
                className={`rounded-[1.75rem] border p-4 text-left transition ${
                  isSelected
                    ? "border-[color:var(--color-mint)] bg-white/12 shadow-[0_0_0_1px_var(--color-mint)]"
                    : "border-white/12 bg-white/6 hover:bg-white/10"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl(choice.seed)}
                  alt={`${choice.label} avatar`}
                  className="h-20 w-20 rounded-2xl border border-white/12 bg-white/10 p-2"
                />
                <p className="mt-4 text-sm uppercase tracking-[0.22em] text-white/72">
                  {choice.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm leading-7 text-white/65">{helperMessage}</p>

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
        disabled={isPending || !setupReady}
        className="w-full rounded-full bg-[linear-gradient(120deg,var(--color-mint),var(--color-sky),var(--color-orchid))] px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isPending ? "Sending..." : "I’m coming"}
      </button>
    </form>
  );
}
