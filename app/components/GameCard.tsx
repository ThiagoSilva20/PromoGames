import { formatUsd } from "../lib/format";
import { Cover } from "./Cover";
import { DealLink } from "./DealLink";

export type Game = {
  id: string | number;
  title: string;
  cover?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  store?: string;
  tags?: string[];
  lowestEver?: boolean;
  dealUrl?: string;
};

export function GameCard({ game, size = "md" }: { game: Game; size?: "sm" | "md" | "lg" }) {
  const hasDiscount = !!game.discount && game.discount > 0;

  const card = (
    <>
      <div className="relative overflow-hidden hairline border bg-pitch-2">
        <div className="aspect-3/4">
          {game.cover ? (
            <img src={game.cover} alt={game.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
          ) : (
            <Cover title={game.title} className="h-full w-full transition duration-700 group-hover:scale-[1.03]" />
          )}
        </div>

        {game.lowestEver && (
          <div className="absolute top-0 left-0 bg-acid text-pitch text-[10px] font-bold tracking-wider px-2 py-1">
            ↓ MENOR PREÇO HISTÓRICO
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-0 right-0 bg-hot text-bone font-display font-bold text-2xl leading-none px-3 py-2">
            −{game.discount}<span className="text-sm">%</span>
          </div>
        )}

        {game.store && (
          <div className="absolute bottom-0 right-0 label-eyebrow bg-pitch/85 backdrop-blur px-2 py-1 text-bone">
            {game.store}
          </div>
        )}
      </div>

      <div className="pt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-bone leading-tight truncate group-hover:text-acid transition-colors">
            {game.title}
          </h3>
          {game.tags?.length ? (
            <div className="mt-1 text-[11px] text-bone-faded truncate">
              {game.tags.slice(0, 3).join(" · ")}
            </div>
          ) : null}
          {game.dealUrl ? (
            <span className="mt-2 inline-block label-eyebrow text-bone-dim group-hover:text-acid transition-colors">
              Ver na loja →
            </span>
          ) : null}
        </div>
        <div className="text-right shrink-0">
          {hasDiscount && game.originalPrice ? (
            <div className="font-numeric text-[11px] text-bone-faded line-through">{formatUsd(game.originalPrice)}</div>
          ) : null}
          <div className="font-numeric text-bone font-semibold">{formatUsd(game.price)}</div>
        </div>
      </div>
    </>
  );

  return (
    <DealLink
      href={game.dealUrl}
      className="group flex flex-col"
      ariaLabel={`Ver oferta de ${game.title} na ${game.store ?? "loja"}`}
    >
      {card}
    </DealLink>
  );
}
