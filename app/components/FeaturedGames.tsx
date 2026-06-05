import { formatUsd } from "../lib/format";
import { GameCard, type Game } from "./GameCard";
import { Cover } from "./Cover";
import { DealLink } from "./DealLink";

type FeaturedGamesProps = {
  games: Game[];
};

export function FeaturedGames({ games }: FeaturedGamesProps) {
  if (!games.length) return null;

  const spotlight = games[0];
  const rest = games.slice(1, 5);

  return (
    <section id="destaques" className="relative">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-20">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 sm:gap-6 mb-10">
          <div className="flex items-baseline gap-4">
            <span className="font-numeric text-bone-faded text-sm">01</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-bone tracking-tight">
              Destaques desta semana
            </h2>
          </div>
          <a href="/promocoes" className="label-eyebrow hover:text-bone transition shrink-0">
            Ver todas →
          </a>
        </div>

        <div className="grid grid-cols-12 gap-5">
          <DealLink
            href={spotlight.dealUrl}
            className="col-span-12 lg:col-span-7 group block"
            ariaLabel={`Ver oferta de ${spotlight.title} na ${spotlight.store ?? "loja"}`}
          >
            <div className="relative hairline border bg-pitch-2 overflow-hidden aspect-16/10 lg:aspect-auto lg:h-full lg:min-h-[480px]">
              {spotlight.cover ? (
                <img
                  src={spotlight.cover}
                  alt={spotlight.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
              ) : (
                <Cover title={spotlight.title} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-[1.02]" />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-pitch via-pitch/70 to-transparent p-8">
                <div className="label-eyebrow mb-2">
                  {spotlight.store}
                  {spotlight.tags?.length ? ` · ${spotlight.tags.join(" · ")}` : ""}
                </div>
                <h3 className="font-display text-4xl sm:text-5xl font-bold text-bone tracking-tight leading-[0.95]">
                  {spotlight.title}
                </h3>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-numeric font-bold text-3xl text-bone">{formatUsd(spotlight.price)}</span>
                    <span className="font-numeric text-bone-faded line-through">{formatUsd(spotlight.originalPrice)}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-hot text-bone font-display font-bold text-3xl leading-none px-4 py-2">
                      −{spotlight.discount}%
                    </div>
                    {spotlight.dealUrl ? (
                      <span className="label-eyebrow text-bone-dim group-hover:text-acid transition-colors">
                        Ver na loja →
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </DealLink>

          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-5">
            {rest.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
