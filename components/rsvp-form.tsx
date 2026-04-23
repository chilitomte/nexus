"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";

type RsvpFormProps = {
  mode?: "create" | "edit";
  initialValues?: {
    name: string;
    nickname: string;
    comment: string;
  };
  onCancel?: () => void;
  onSuccess?: () => void;
};

const defaultValues = {
  name: "",
  nickname: "",
  comment: "",
};

export function RsvpForm({
  mode = "create",
  initialValues = defaultValues,
  onCancel,
  onSuccess,
}: RsvpFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialValues.name);
  const [nickname, setNickname] = useState(initialValues.nickname);
  const [comment, setComment] = useState(initialValues.comment);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setName(initialValues.name);
    setNickname(initialValues.nickname);
    setComment(initialValues.comment);
    setError(null);
    setSuccess(null);
  }, [initialValues.comment, initialValues.name, initialValues.nickname, mode]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const response = await fetch("/api/rsvp", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, nickname, comment }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "The RSVP signal dissolved before it landed.");
        return;
      }

      if (mode === "create") {
        setName("");
        setNickname("");
        setComment("");
      }

      setSuccess(
        mode === "edit"
          ? "Your RSVP now shines in its new form."
          : "Your spirit is now loaded into the Nexus.",
      );
      onSuccess?.();
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <>
      <div className="space-y-3">
        <label
          htmlFor="guest-real-name"
          className="block text-left text-xs uppercase tracking-[0.28em] text-white/48"
        >
          Your human name
        </label>
        <input
          id="guest-real-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Mattis, Poya, Josefin, Santi..."
          maxLength={48}
          className="w-full rounded-full border border-white/18 bg-black/25 px-5 py-4 text-white outline-none transition focus:border-[color:var(--color-mint)] focus:bg-black/35"
        />
      </div>

      <div className="space-y-3">
        <label
          htmlFor="guest-nickname"
          className="block text-left text-xs uppercase tracking-[0.28em] text-white/48"
        >
          Your entity name
        </label>
        <input
          id="guest-nickname"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="The Guide, Faceless, High priestess..."
          maxLength={48}
          className="w-full rounded-full border border-white/18 bg-black/25 px-5 py-4 text-white outline-none transition focus:border-[color:var(--color-mint)] focus:bg-black/35"
        />
      </div>

      <div className="space-y-3">
        <label
          htmlFor="guest-comment"
          className="block text-left text-xs uppercase tracking-[0.28em] text-white/48"
        >
          Tell us something about you
        </label>
        <input
          id="guest-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="I'm chaos, I like hugs, I will perform a dance..."
          maxLength={120}
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
          ? mode === "edit"
            ? "Shifting..."
            : "Embarking..."
          : mode === "edit"
            ? "Update your RSVP"
            : "Open the portal"}
      </button>
      {mode === "edit" && onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-full border border-white/18 bg-white/8 px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white/12"
        >
          Cancel
        </button>
      ) : null}
      </>
    </form>
  );
}
