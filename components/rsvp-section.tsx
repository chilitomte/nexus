import { RSVP_AVATAR_CHOICES } from "@/lib/party-content";
import type { Attendee } from "@/lib/types";
import { avatarUrl } from "@/lib/avatar";
import { RsvpForm } from "./rsvp-form";

type RsvpSectionProps = {
  attendees: Attendee[];
  setupReady: boolean;
};

export function RsvpSection({ attendees, setupReady }: RsvpSectionProps) {
  return (
    <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="glass-panel p-6 sm:p-8">
        <div className="space-y-3">
          <p className="badge-chip">RSVP constellation</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Claim your avatar and say you&apos;re coming
          </h2>
          <p className="text-sm leading-7 text-white/68">
            Guests choose a generated avatar, submit a name, and instantly join
            the attendee wall. One RSVP per name keeps the list clean.
          </p>
        </div>
        <RsvpForm avatarChoices={RSVP_AVATAR_CHOICES} setupReady={setupReady} />
      </article>

      <article className="glass-panel p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="badge-chip">Attendee wall</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Souls already crossing over
            </h2>
          </div>
          <div className="rounded-full border border-white/15 bg-white/7 px-4 py-2 text-sm uppercase tracking-[0.24em] text-white/78">
            {attendees.length} confirmed
          </div>
        </div>

        {attendees.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {attendees.map((attendee) => (
              <article
                key={attendee.id}
                className="aurora-card flex items-center gap-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl(attendee.avatarSeed)}
                  alt={`${attendee.name} avatar`}
                  className="h-16 w-16 rounded-2xl border border-white/15 bg-white/10 p-2"
                />
                <div>
                  <p className="text-lg text-white">{attendee.name}</p>
                  <p className="text-xs uppercase tracking-[0.26em] text-white/45">
                    Joined the portal
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-dashed border-white/18 bg-black/18 p-6 text-sm leading-7 text-white/68">
            No one has confirmed yet. The first brave traveler gets the whole
            dimension to themselves.
          </div>
        )}
      </article>
    </section>
  );
}
