import type { Game } from "../components/GameCard";

export type GameSortId = "discount" | "price_asc" | "price_desc" | "title";

export function filterGames(
  games: Game[],
  filters: {
    query: string;
    storeNames: string[];
    ratingTags: string[];
    minDiscount: number;
    sort: GameSortId;
  },
): Game[] {
  const q = filters.query.trim().toLowerCase();

  const filtered = games.filter((g) => {
    if (q && !g.title.toLowerCase().includes(q)) return false;
    if (filters.storeNames.length && g.store && !filters.storeNames.includes(g.store)) return false;
    if (filters.ratingTags.length && !g.tags?.some((t) => filters.ratingTags.includes(t))) return false;
    if ((g.discount ?? 0) < filters.minDiscount) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "discount":
        return (b.discount ?? 0) - (a.discount ?? 0);
      case "price_asc":
        return (a.price ?? 0) - (b.price ?? 0);
      case "price_desc":
        return (b.price ?? 0) - (a.price ?? 0);
      case "title":
        return a.title.localeCompare(b.title);
    }
  });
}
