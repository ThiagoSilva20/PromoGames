import type { Game } from "../components/GameCard";

const BASE = "https://www.cheapshark.com/api/1.0";
const CHEAPSHARK_REDIRECT = "https://www.cheapshark.com/redirect.php";
const MONITORED_STORE_IDS = new Set(["1", "7", "25"]);
const STORES_CACHE_MS = 5 * 60 * 1000;
const API_HEADERS = {
  Accept: "application/json",
  // CheapShark retorna 400 sem User-Agent (Workers / SSR)
  "User-Agent": "PromoGames/1.0 (+https://github.com/ThiagoSilva20/PromoGames)",
};

type DealSort = "Savings" | "Price" | "Title" | "DealRating" | "Recent";

type CheapSharkDeal = {
  title: string;
  dealID: string;
  storeID: string;
  salePrice: string;
  normalPrice: string;
  savings: string;
  thumb: string;
  steamAppID?: string;
  steamRatingText?: string | null;
  dealRating?: string;
};

type CheapSharkStore = {
  storeID: string;
  storeName: string;
  isActive: number;
};

export type Store = { id: string; name: string };

export type HomeStats = {
  storeCount: number;
  activeOffersLabel: string;
  maxDiscountLabel: string;
};

export type CatalogData = {
  stores: Store[];
  games: Game[];
  ratingTags: string[];
};

let storesCache: { data: Store[]; at: number } | null = null;

async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
  }
  const res = await fetch(url, { headers: API_HEADERS });
  if (!res.ok) {
    const msg =
      res.status === 429
        ? "CheapShark limitou as requisições (429). Aguarde alguns segundos e recarregue."
        : res.status === 400
          ? "CheapShark rejeitou a requisição (400). Tente novamente em instantes."
          : `CheapShark indisponível (${res.status})`;
    const err = new Error(msg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

function dealUrl(deal: CheapSharkDeal): string {
  const steamId = deal.steamAppID?.trim();
  if (deal.storeID === "1" && steamId && steamId !== "0") {
    return `https://store.steampowered.com/app/${steamId}`;
  }
  return `${CHEAPSHARK_REDIRECT}?dealID=${deal.dealID}`;
}

function toGames(deals: CheapSharkDeal[], storeNames: Map<string, string>): Game[] {
  return deals
    .filter((d) => MONITORED_STORE_IDS.has(d.storeID))
    .map((deal) => {
      const rating = deal.dealRating != null ? parseFloat(deal.dealRating) : NaN;
      return {
        id: deal.dealID,
        title: deal.title,
        cover: deal.thumb,
        price: parseFloat(deal.salePrice),
        originalPrice: parseFloat(deal.normalPrice),
        discount: Math.round(parseFloat(deal.savings)),
        store: storeNames.get(deal.storeID) ?? `Loja ${deal.storeID}`,
        tags: deal.steamRatingText ? [deal.steamRatingText] : undefined,
        lowestEver: Number.isFinite(rating) && rating >= 9,
        dealUrl: dealUrl(deal),
      };
    });
}

async function getStores(): Promise<Store[]> {
  const now = Date.now();
  if (storesCache && now - storesCache.at < STORES_CACHE_MS) return storesCache.data;

  const data = await apiGet<CheapSharkStore[]>("/stores");
  const stores = data
    .filter((s) => s.isActive === 1 && MONITORED_STORE_IDS.has(s.storeID))
    .map((s) => ({ id: s.storeID, name: s.storeName }));

  storesCache = { data: stores, at: now };
  return stores;
}

type DealQuery = {
  pageSize?: number;
  sortBy?: DealSort;
  storeId?: string;
  title?: string;
};

async function getDealsForStores(stores: Store[], query: DealQuery = {}): Promise<Game[]> {
  const storeNames = new Map(stores.map((s) => [s.id, s.name]));
  const deals = await apiGet<CheapSharkDeal[]>("/deals", {
    pageSize: query.pageSize ?? 60,
    pageNumber: 0,
    onSale: 1,
    sortBy: query.sortBy ?? "Savings",
    storeID: query.storeId,
    title: query.title?.trim() || undefined,
  });
  return toGames(deals, storeNames);
}

async function getDeals(query: DealQuery = {}): Promise<Game[]> {
  return getDealsForStores(await getStores(), query);
}

export async function getTickerGames(): Promise<Game[]> {
  return getDeals({ pageSize: 8, sortBy: "Recent" });
}

export async function fetchCatalog(title?: string): Promise<CatalogData> {
  const stores = await getStores();
  const games = await getDealsForStores(stores, { pageSize: 60, sortBy: "Savings", title });
  const ratingTags = [...new Set(games.flatMap((g) => g.tags ?? []))].sort();
  return { stores, games, ratingTags };
}

export async function getHomePage() {
  const stores = await getStores();
  const [rated, recent] = await Promise.all([
    getDealsForStores(stores, { pageSize: 6, sortBy: "DealRating" }),
    getDealsForStores(stores, { pageSize: 6, sortBy: "Recent" }),
  ]);
  const hero = rated[0] ?? recent[0];

  if (!hero) {
    throw new Error("Nenhuma promoção disponível no momento.");
  }

  const all = [...rated, ...recent];
  const maxDiscount = all.reduce((max, g) => Math.max(max, g.discount ?? 0), 0);

  return {
    hero,
    featured: rated.length ? rated.slice(0, 5) : [hero],
    topDrops: recent.length ? recent : rated.slice(0, 6),
    stats: {
      storeCount: stores.length,
      activeOffersLabel: String(all.length),
      maxDiscountLabel: maxDiscount > 0 ? `−${maxDiscount}%` : "—",
    } satisfies HomeStats,
  };
}
