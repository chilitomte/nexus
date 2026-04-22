"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

type CommentsFormProps = {
  disabled?: boolean;
};

export function CommentsForm({ disabled = false }: CommentsFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Your message drifted out of orbit.");
        return;
      }

      setBody("");
      setSuccess("Your words are now echoing through the Nexus.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      {disabled ? null : (
        <>
          <div className="space-y-3">
            <div className="grid w-full gap-4 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-stretch">
              <textarea
                id="nexus-comment"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Whispers, dreams, prophecies..."
                maxLength={500}
                rows={4}
                className="min-h-[8.5rem] flex-1 rounded-[2rem] border border-white/18 bg-black/25 px-5 py-4 text-white outline-none transition focus:border-[color:var(--color-mint)] focus:bg-black/35"
              />
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full border border-white/18 bg-[linear-gradient(120deg,var(--color-sky),var(--color-mint),var(--color-sun))] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isPending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>

          {error ? (
            <p className="mt-5 rounded-3xl border border-[color:var(--color-coral)]/35 bg-[color:var(--color-coral)]/12 px-4 py-3 text-sm text-[color:var(--color-coral-soft)]">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="mt-5 rounded-3xl border border-[color:var(--color-mint)]/35 bg-[color:var(--color-mint)]/12 px-4 py-3 text-sm text-[color:var(--color-mint)]">
              {success}
            </p>
          ) : null}
        </>
      )}
    </form>
  );
}
