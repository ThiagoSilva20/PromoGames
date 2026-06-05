import { formatUsd } from "../lib/format";
import type { Game } from "./GameCard";
import { Cover } from "./Cover";
import { DealLink } from "./DealLink";

type TopDropsProps = {
  games: Game[];
};

export function TopDrops({ games }: TopDropsProps) {
  return (
    <section className="hairline border-y bg-pitch-2/40">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-10">
          <header className="lg:col-span-4">
            <div className="flex items-baseline gap-4 mb-3">
              <span className="font-numeric text-bone-faded text-sm">02</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-bone tracking-tight leading-[0.95]">
                Maiores quedas<br />recentes
              </h2>
            </div>
            <p className="text-bone-dim text-sm leading-relaxed max-w-xs">
              Ranking com ofertas que mudaram de preço recentemente nas lojas
              Steam, Epic e GOG (dados CheapShark).
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-acid animate-blink" />
              <span className="label-eyebrow">Atualizado ao carregar a página</span>
            </div>
          </header>

          <div className="lg:col-span-8">
            <ul className="hairline border divide-y divide-line">
              {games.map((g, i) => (
                <li key={g.id}>
                  <DealLink
                    href={g.dealUrl}
                    className="flex items-center gap-3 sm:grid sm:grid-cols-[40px_56px_1fr_auto_auto] sm:gap-4 px-4 py-4 hover:bg-pitch transition-colors group"
                    ariaLabel={`Ver oferta de ${g.title}`}
                  >
                    <span className="hidden sm:block font-numeric text-bone-faded text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="hairline border aspect-3/4 w-12 sm:w-auto overflow-hidden shrink-0">
                      {g.cover ? (
                        <img src={g.cover} alt={g.title} className="h-full w-full object-cover" />
                      ) : (
                        <Cover title={g.title} className="h-full w-full" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-semibold text-bone truncate group-hover:text-acid transition-colors">
                        {g.title}
                      </div>
                      <div className="text-xs text-bone-faded truncate">
                        {g.store}
                        {g.tags?.length ? ` · ${g.tags.join(" · ")}` : ""}
                      </div>
                      <div className="mt-1 sm:hidden font-numeric text-xs text-bone">
                        {formatUsd(g.price)}
                        <span className="text-hot font-bold ml-2">−{g.discount}%</span>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="font-numeric text-xs text-bone-faded line-through">{formatUsd(g.originalPrice)}</div>
                      <div className="font-numeric text-bone font-semibold">{formatUsd(g.price)}</div>
                    </div>
                    <div className="hidden sm:block font-numeric font-bold text-hot text-lg w-14 text-right">
                      −{g.discount}%
                    </div>
                  </DealLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
