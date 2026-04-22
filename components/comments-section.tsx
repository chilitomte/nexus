import type { Attendee, Comment } from "@/lib/types";
import { CommentsForm } from "./comments-form";

type CommentsSectionProps = {
  comments: Comment[];
  attendees: Attendee[];
  currentUserId: string | null;
};

export function CommentsSection({
  comments,
  attendees,
  currentUserId,
}: CommentsSectionProps) {
  const currentAttendee = currentUserId
    ? attendees.find((attendee) => attendee.userId === currentUserId) ?? null
    : null;

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full flex-col gap-8" style={{ maxWidth: 820 }}>
        <article className="glass-panel w-full p-6 sm:p-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Leave a message
            </h2>
            {!currentAttendee ? (
              <p className="text-base leading-7 text-white/68">
                RSVP first if you want to add your own message to the Nexus.
              </p>
            ) : null}
          </div>

          {currentAttendee ? <CommentsForm /> : null}
        </article>

        <article className="glass-panel w-full p-6 sm:p-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Messages from the realm
            </h2>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {comments.length ? (
              comments.map((comment) => {
                const isCurrentUser = comment.userId === currentUserId;

                return (
                  <article
                    key={comment.id}
                    className={`aurora-card flex flex-col gap-3 ${
                      isCurrentUser
                        ? "border-[color:var(--color-mint)] bg-white/10 shadow-[0_0_0_1px_var(--color-mint)]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-lg text-white">{comment.authorName}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                        {new Date(comment.createdAt).toLocaleDateString("sv-SE", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="whitespace-pre-line text-base leading-7 text-white/72">
                      {comment.body}
                    </p>
                  </article>
                );
              })
            ) : (
              <article className="aurora-card">
                <p className="text-base leading-7 text-white/68">
                  No messages in the Nexus yet. Be the first to leave a trace.
                </p>
              </article>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
