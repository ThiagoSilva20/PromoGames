import { formatUsd } from "../lib/format";
import type { Game } from "./GameCard";
import { DealLink } from "./DealLink";

type TickerProps = {
  games: Game[];
};

export function Ticker({ games }: TickerProps) {
  if (!games.length) return null;

  const row = [...games, ...games];

  return (
    <div className="hairline border-y bg-pitch-2/80 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2.5">
        {row.map((game, i) => (
          <span key={`${game.id}-${i}`} className="px-6 inline-flex items-center gap-3 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-acid animate-blink" />
            <span className="text-bone-dim">AO VIVO</span>
            <DealLink
              href={game.dealUrl}
              className="text-bone font-medium hover:text-acid transition-colors"
              ariaLabel={`Ver oferta de ${game.title}`}
            >
              {game.title}
            </DealLink>
            <span className="font-numeric text-bone-dim">{formatUsd(game.price)}</span>
            <span className="font-numeric text-hot">−{game.discount}%</span>
            <span className="text-bone-faded">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
