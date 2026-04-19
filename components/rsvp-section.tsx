import type { Attendee } from "@/lib/types";
import { RsvpForm } from "./rsvp-form";

type RsvpSectionProps = {
  attendees: Attendee[];
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

export function RsvpSection({ attendees }: RsvpSectionProps) {
  return (
    <section className="w-full">
      <article
        className="glass-panel mx-auto w-full p-6 sm:p-8"
        style={{ maxWidth: 820 }}
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Are you ready to embark on your journey?
          </h2>
        </div>
        <RsvpForm />

        {attendees.length ? (
          <div className="mt-10 flex flex-col gap-4">
            {attendees.map((attendee) => (
              <article
                key={attendee.id}
                className="aurora-card flex items-center gap-4"
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
                  <p className="text-xs uppercase tracking-[0.26em] text-white/45">
                    Joined the nexus
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-dashed border-white/18 bg-black/18 p-6 text-sm leading-7 text-white/68">
            No spirit names loaded yet.
          </div>
        )}
      </article>
    </section>
  );
}
