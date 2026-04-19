import type { Attendee } from "@/lib/types";
import { RsvpForm } from "./rsvp-form";

type RsvpSectionProps = {
  attendees: Attendee[];
  currentUserId: string | null;
};

function colorFromName(name: string) {
  const palette = [
    "from-rose-400 to-orange-300",
    "from-cyan-400 to-blue-500",
    "from-fuchsia-500 to-violet-500",
    "from-lime-300 to-emerald-400",
    "from-amber-300 to-pink-400",
    "from-sky-300 to-indigo-500",
  ];

  const index =
    name.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) %
    palette.length;

  return palette[index];
}

export function RsvpSection({ attendees, currentUserId }: RsvpSectionProps) {
  const currentAttendee = currentUserId
    ? attendees.find((attendee) => attendee.userId === currentUserId) ?? null
    : null;
  const orderedAttendees = currentAttendee
    ? [
        currentAttendee,
        ...attendees.filter((attendee) => attendee.id !== currentAttendee.id),
      ]
    : attendees;

  return (
    <section className="w-full">
      <article
        className="glass-panel mx-auto w-full p-6 sm:p-8"
        style={{ maxWidth: 820 }}
      >
        <div className="space-y-3">
          {currentAttendee ? (
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              The beings of the visionary realm
            </h2>
          ) : (
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Join the visionary realm!
            </h2>
          )}
          
        </div>
        <RsvpForm hidden={Boolean(currentAttendee)} />

        {currentAttendee ? (
          <div className="mt-10 flex flex-col gap-4">
            {orderedAttendees.map((attendee) => {
              const isCurrentUser = attendee.userId === currentUserId;

              return (
              <article
                key={attendee.id}
                className={`aurora-card flex items-center gap-4 ${
                  isCurrentUser ? "border-[color:var(--color-mint)] bg-white/10 shadow-[0_0_0_1px_var(--color-mint)]" : ""
                }`}
              >
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${colorFromName(
                    attendee.name,
                  )} text-lg font-semibold text-slate-950`}
                >
                  {attendee.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg text-white">{attendee.name}</p>
                  <p className={`text-sm ${isCurrentUser ? "text-[color:var(--color-mint)]" : "text-white/60"}`}>
                    {attendee.identity}
                  </p>
                </div>
              </article>
            )})}
          </div>
        ) : (
          <div>
          </div>
        )}
      </article>
    </section>
  );
}
