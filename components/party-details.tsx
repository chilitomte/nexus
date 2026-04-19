import { partyContent } from "@/lib/party-content";

export function PartyDetails() {
  return (
    <section className="w-full">
      <article
        className="glass-panel mx-auto w-full p-6 sm:p-8"
        style={{ maxWidth: 820 }}
      >
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
          Important details
        </h2>
        <div className="mt-8 flex flex-col gap-4">
          {partyContent.infoCards.map((card) => (
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
