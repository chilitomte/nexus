import { partyContent } from "@/lib/party-content";

export function CoCreation() {
  return (
    <section className="w-full">
      <article
        className="glass-panel mx-auto w-full p-6 sm:p-8"
        style={{ maxWidth: 820 }}
      >
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
          Dreams and co-creations
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/78">
          Want to contribute? Reach out to us and let&apos;s make sparkling plans!
        </p>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/78">
          Perhaps you want to...
        </p>
        <div className="mt-6 flex flex-col gap-4">
          {partyContent.dreamCards.map((card) => (
            <div key={card.title} className="aurora-card w-full">
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                {card.title}
              </p>
              <p className="mt-4 text-lg whitespace-pre-line leading-8 text-white/84">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
