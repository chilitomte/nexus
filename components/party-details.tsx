import { partyContent } from "@/lib/party-content";

export function PartyDetails() {
  return (
    <section className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
      <article className="glass-panel p-6 sm:p-8">
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
          Important details
        </h2>
        <div className="mt-8 grid items-start gap-4 sm:grid-cols-2">
          {partyContent.infoCards.map((card) => (
            <div key={card.title} className="aurora-card self-start">
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
