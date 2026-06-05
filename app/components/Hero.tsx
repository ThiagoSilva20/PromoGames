import { Link } from "react-router";
import { formatUsd } from "../lib/format";
import type { HomeStats } from "../lib/cheapshark";
import type { Game } from "./GameCard";
import { Cover } from "./Cover";

type HeroProps = {
  offer: Game;
  stats: HomeStats;
};

export function Hero({ offer, stats }: HeroProps) {
  const savings =
    offer.originalPrice != null && offer.price != null
      ? offer.originalPrice - offer.price
      : 0;

  return (
    <section className="relative">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 pt-14 pb-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8">
              <span className="label-eyebrow">Edição 042</span>
              <span className="h-px flex-1 bg-line" />
              <span className="label-eyebrow">Promoções PC</span>
            </div>

            <h1 className="font-display font-bold text-bone leading-[0.92] tracking-[-0.04em] text-[clamp(3rem,8vw,7rem)]">
              Pague menos.<br />
              <span className="inline-block relative">
                Jogue
                <span className="text-acid">.</span>{" "}
                <span className="italic font-medium text-bone-dim">mais.</span>
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-bone-dim text-[15px] leading-relaxed">
              Monitoramos Steam, Epic e GOG em tempo real via CheapShark para
              encontrar o momento exato em que um jogo entra em promoção.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                to="/promocoes"
                className="group inline-flex items-center gap-3 bg-acid text-pitch px-6 h-12 rounded-md font-semibold text-sm hover:bg-acid-dim transition-colors"
              >
                Ver todas promoções
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square">
                  <path d="M5 12h14M14 6l6 6-6 6" />
                </svg>
              </Link>
              <Link to="#destaques" className="label-eyebrow hover:text-bone transition">
                ↓ Rolar para destaques
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="hairline border bg-pitch-2">
              <div className="flex items-center justify-between px-4 py-3 hairline border-b">
                <span className="label-eyebrow text-acid">★ Oferta do dia</span>
                <span className="font-numeric text-xs text-bone-dim">
                  {offer.store}
                </span>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] gap-5 p-4 sm:p-5">
                <div className="hairline border overflow-hidden">
                  {offer.cover ? (
                    <img src={offer.cover} alt={offer.title} className="block w-full h-auto object-cover" />
                  ) : (
                    <Cover title={offer.title} className="block w-full h-auto" />
                  )}
                </div>

                <div className="flex flex-col justify-between min-w-0">
                  <div>
                    <div className="label-eyebrow mb-1">
                      {offer.store}
                      {offer.tags?.length ? ` · ${offer.tags.join(" · ")}` : ""}
                    </div>
                    <h2 className="font-display text-2xl font-bold text-bone leading-tight tracking-tight">
                      {offer.title}
                    </h2>
                    <div className="mt-3 flex items-baseline gap-3">
                      <span className="font-numeric font-semibold text-3xl text-bone">{formatUsd(offer.price)}</span>
                      <span className="font-numeric text-sm text-bone-faded line-through">{formatUsd(offer.originalPrice)}</span>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-hot/15 text-hot px-2 py-0.5 text-xs font-numeric font-semibold">
                      −{offer.discount}% · economize {formatUsd(savings)}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 hairline border-t flex items-center justify-between text-xs text-bone-dim">
                    <span className="font-numeric">
                      {offer.lowestEver ? "Menor preço histórico" : "Oferta ativa"}
                    </span>
                    {offer.dealUrl ? (
                      <a
                        href={offer.dealUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-bone font-medium hover:text-acid transition"
                      >
                        Ver loja →
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { l: "Lojas", v: String(stats.storeCount).padStart(2, "0") },
                { l: "Ofertas no feed", v: stats.activeOffersLabel },
                { l: "Maior queda", v: stats.maxDiscountLabel },
              ].map((s) => (
                <div key={s.l} className="hairline border bg-pitch-2 p-3">
                  <div className="font-display font-bold text-bone text-xl leading-none">{s.v}</div>
                  <div className="label-eyebrow mt-1.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
