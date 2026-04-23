"use client";

import { useState } from "react";
import type { Attendee } from "@/lib/types";
import { RsvpForm } from "./rsvp-form";

type RsvpSectionProps = {
  attendees: Attendee[];
  currentUserId: string | null;
};

function colorFromName(name: string) {
  const palette = [
    {
      shell: "from-rose-400 to-orange-300",
      glow: "rgba(251, 113, 133, 0.28)",
    },
    {
      shell: "from-cyan-400 to-blue-500",
      glow: "rgba(56, 189, 248, 0.28)",
    },
    {
      shell: "from-fuchsia-500 to-violet-500",
      glow: "rgba(217, 70, 239, 0.28)",
    },
    {
      shell: "from-lime-300 to-emerald-400",
      glow: "rgba(163, 230, 53, 0.24)",
    },
    {
      shell: "from-amber-300 to-pink-400",
      glow: "rgba(251, 191, 36, 0.26)",
    },
    {
      shell: "from-sky-300 to-indigo-500",
      glow: "rgba(96, 165, 250, 0.28)",
    },
  ];

  const index =
    name.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) %
    palette.length;

  return palette[index];
}

function AttendeeAvatar({ nickname }: { nickname: string }) {
  const palette = colorFromName(nickname);

  return (
    <div
      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/14 bg-gradient-to-br ${palette.shell}`}
      style={{ boxShadow: `0 10px 28px ${palette.glow}` }}
      aria-hidden="true"
    >
      <span className="text-2xl font-semibold text-white">
        {nickname.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export function RsvpSection({ attendees, currentUserId }: RsvpSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const currentAttendee = currentUserId
    ? attendees.find((attendee) => attendee.userId === currentUserId) ?? null
    : null;
  const orderedAttendees = currentAttendee
    ? [
        currentAttendee,
        ...attendees.filter((attendee) => attendee.id !== currentAttendee.id),
      ]
    : attendees;
  const attendeeList = orderedAttendees.map((attendee) => {
    const isCurrentUser = attendee.userId === currentUserId;
    const cardClassName = isCurrentUser
      ? "aurora-card flex items-center gap-4 border-[color:var(--color-mint)] bg-white/10 shadow-[0_0_0_1px_var(--color-mint)]"
      : "aurora-card flex items-center gap-4";
    const commentClassName = isCurrentUser
      ? "text-sm text-[color:var(--color-mint)]"
      : "text-sm text-white/60";

    return (
      <article key={attendee.id} className={cardClassName}>
        <AttendeeAvatar nickname={attendee.nickname} />
        <div>
          <p className="text-lg text-white">{attendee.nickname}</p>
          <p className={commentClassName}>{attendee.comment}</p>
        </div>
      </article>
    );
  });

  return (
    <section className="w-full">
      <article
        className="glass-panel mx-auto w-full p-6 sm:p-8"
        style={{ maxWidth: 820 }}
      >
        <div className="space-y-3">
          {currentAttendee ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Our fellow beings
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing((current) => !current)}
                className="rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/12"
              >
                {isEditing ? "Close editor" : "Edit your RSVP"}
              </button>
            </div>
          ) : (
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Join the visionary realm!
            </h2>
          )}
        </div>
        {currentAttendee ? (
          isEditing ? (
            <div className="mb-10">
              <RsvpForm
                mode="edit"
                initialValues={{
                  name: currentAttendee.name,
                  nickname: currentAttendee.nickname,
                  comment: currentAttendee.comment,
                }}
                onCancel={() => setIsEditing(false)}
                onSuccess={() => setIsEditing(false)}
              />
            </div>
          ) : null
        ) : (
          <RsvpForm />
        )}

        {currentAttendee ? (
          <div className="mt-8 pt-8 flex flex-col gap-4">{attendeeList}</div>
        ) : null}
      </article>
    </section>
  );
}
