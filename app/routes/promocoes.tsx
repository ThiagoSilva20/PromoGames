import type { Route } from "./+types/promocoes";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { GameCard } from "../components/GameCard";
import { Cover } from "../components/Cover";
import { DealLink } from "../components/DealLink";
import { useDebounce } from "../hooks/use-debounce";
import { formatUsd } from "../lib/format";
import { filterGames, type GameSortId } from "../lib/filters";
import { catalogQueryOptions } from "../lib/queries/catalog";
import { FetchError, fetchErrorMessage } from "../components/FetchError";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Promoções — PromoGames" },
    {
      name: "description",
      content: "Catálogo de ofertas reais de Steam, Epic e GOG com filtros por loja e desconto.",
    },
  ];
}

const SORTS: { id: GameSortId; label: string }[] = [
  { id: "discount", label: "Maior desconto" },
  { id: "price_asc", label: "Menor preço" },
  { id: "price_desc", label: "Maior preço" },
  { id: "title", label: "A-Z" },
];

const MIN_SEARCH_LEN = 2;
const DEBOUNCE_MS = 400;

export default function Promocoes() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_MS);

  const [storeNames, setStoreNames] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string[]>([]);
  const [minDisc, setMinDisc] = useState(0);
  const [sort, setSort] = useState<GameSortId>("discount");
  const [view, setView] = useState<"grid" | "list">("grid");

  const {
    data,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery(catalogQueryOptions(debouncedSearch));

  const games = data?.games ?? [];
  const stores = data?.stores ?? [];
  const ratingTags = data?.ratingTags ?? [];

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const results = useMemo(
    () =>
      filterGames(games, {
        query: "",
        storeNames,
        ratingTags: ratings,
        minDiscount: minDisc,
        sort,
      }),
    [games, storeNames, ratings, minDisc, sort],
  );

  const activeFilters = storeNames.length + ratings.length + (minDisc > 0 ? 1 : 0);
  const searchTooShort =
    searchInput.trim().length > 0 && searchInput.trim().length < MIN_SEARCH_LEN;
  const isSearching = isFetching && debouncedSearch.trim().length >= MIN_SEARCH_LEN;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <header className="hairline border-b">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-12">
            <div className="flex items-baseline gap-4 mb-3">
              <span className="font-numeric text-bone-faded text-sm">/promoções</span>
              <span className="h-px flex-1 bg-line" />
              <span className="label-eyebrow font-numeric">
                {isPending ? "…" : `${games.length} jogos no catálogo`}
              </span>
            </div>
            <h1 className="font-display font-bold text-bone tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,6vw,5rem)]">
              Catálogo<br />
              <span className="italic font-medium text-bone-dim">em promoção.</span>
            </h1>
          </div>
        </header>

        <div className="hairline border-b sticky top-0 bg-pitch/95 backdrop-blur-xl z-20">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-4">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
              <div className="relative flex-1">
                <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bone-faded" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar por título…"
                  className="w-full h-11 pl-10 pr-3 bg-pitch-2 hairline border focus:border-acid focus:outline-none text-bone placeholder:text-bone-faded text-sm"
                />
                {isSearching ? (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 label-eyebrow text-acid">
                    Buscando…
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as GameSortId)}
                  className="h-11 flex-1 sm:flex-none px-3 bg-pitch-2 hairline border text-bone text-sm focus:outline-none focus:border-acid font-numeric"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>

                <div className="hairline border flex">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grade"
                    className={`h-11 w-11 inline-flex items-center justify-center ${view === "grid" ? "bg-bone text-pitch" : "text-bone-dim hover:text-bone"}`}
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor"><rect x="1" y="1" width="6" height="6" /><rect x="9" y="1" width="6" height="6" /><rect x="1" y="9" width="6" height="6" /><rect x="9" y="9" width="6" height="6" /></svg>
                  </button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="Lista"
                    className={`h-11 w-11 inline-flex items-center justify-center hairline border-l ${view === "list" ? "bg-bone text-pitch" : "text-bone-dim hover:text-bone"}`}
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor"><rect x="1" y="2" width="14" height="2" /><rect x="1" y="7" width="14" height="2" /><rect x="1" y="12" width="14" height="2" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {searchTooShort ? (
              <p className="mt-2 text-xs text-bone-dim">
                Digite pelo menos {MIN_SEARCH_LEN} caracteres para buscar na API.
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="label-eyebrow mr-2">Lojas</span>
              {stores.map((s) => {
                const active = storeNames.includes(s.name);
                return (
                  <button
                    key={s.id}
                    onClick={() => setStoreNames((p) => toggle(p, s.name))}
                    className={`px-3 h-8 inline-flex items-center text-xs hairline border transition-colors ${
                      active ? "bg-bone text-pitch border-bone" : "text-bone-dim hover:text-bone hover:border-bone/30"
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}

              {ratingTags.length > 0 ? (
                <>
                  <span className="hidden md:inline-block w-px h-5 bg-line mx-2" />
                  <span className="label-eyebrow mr-2">Steam</span>
                  {ratingTags.map((tag) => {
                    const active = ratings.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => setRatings((p) => toggle(p, tag))}
                        className={`px-3 h-8 inline-flex items-center text-xs hairline border transition-colors ${
                          active ? "bg-bone text-pitch border-bone" : "text-bone-dim hover:text-bone hover:border-bone/30"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </>
              ) : null}

              <span className="hidden md:inline-block w-px h-5 bg-line mx-2" />

              <label className="inline-flex items-center gap-3 text-xs text-bone-dim ml-1">
                <span className="label-eyebrow">Desconto ≥</span>
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={5}
                  value={minDisc}
                  onChange={(e) => setMinDisc(+e.target.value)}
                  className="w-32 accent-acid"
                />
                <span className="font-numeric text-bone w-10">{minDisc}%</span>
              </label>

              {activeFilters > 0 && (
                <button
                  onClick={() => { setStoreNames([]); setRatings([]); setMinDisc(0); }}
                  className="ml-auto text-xs text-hot hover:underline label-eyebrow"
                >
                  ✕ Limpar ({activeFilters})
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-10">
          <div className="flex items-baseline justify-between mb-6">
            <span className="font-numeric text-bone-faded text-sm">
              {isPending ? "Carregando…" : `${String(results.length).padStart(3, "0")} resultados`}
            </span>
          </div>

          {isError ? (
            <FetchError
              message={fetchErrorMessage(error)}
              onRetry={() => refetch()}
              retrying={isRefetching}
            />
          ) : isPending ? (
            <div className="hairline border py-24 text-center text-bone-dim text-sm">
              Carregando promoções…
            </div>
          ) : searchTooShort ? (
            <div className="hairline border py-24 text-center">
              <div className="font-display text-2xl text-bone">Continue digitando</div>
              <p className="mt-2 text-bone-dim text-sm">
                A busca na API só dispara com {MIN_SEARCH_LEN}+ caracteres (debounce de {DEBOUNCE_MS}ms).
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="hairline border py-24 text-center">
              <div className="font-display text-2xl text-bone">Nada encontrado.</div>
              <p className="mt-2 text-bone-dim text-sm">Tente afrouxar os filtros ou limpar a busca.</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {results.map((g) => <GameCard key={g.id} game={g} />)}
            </div>
          ) : (
            <ul className="hairline border divide-y divide-line">
              {results.map((g, i) => (
                <li key={g.id}>
                  <DealLink
                    href={g.dealUrl}
                    className="flex items-center gap-3 sm:grid sm:grid-cols-[40px_64px_1fr_auto_auto_auto] sm:gap-4 px-4 py-3 hover:bg-pitch-2 transition-colors group"
                    ariaLabel={`Ver oferta de ${g.title}`}
                  >
                    <span className="hidden sm:block font-numeric text-bone-faded text-sm">
                      {String(i + 1).padStart(3, "0")}
                    </span>
                    <div className="hairline border aspect-3/4 w-14 sm:w-auto overflow-hidden shrink-0">
                      {g.cover ? (
                        <img src={g.cover} alt={g.title} className="h-full w-full object-cover" />
                      ) : (
                        <Cover title={g.title} className="h-full w-full" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="font-display font-semibold text-bone truncate group-hover:text-acid transition-colors">
                          {g.title}
                        </h3>
                        {g.lowestEver && (
                          <span className="label-eyebrow text-acid shrink-0">↓ histórico</span>
                        )}
                      </div>
                      <div className="text-xs text-bone-faded truncate">
                        <span className="sm:hidden">{g.store} · </span>
                        {g.tags?.join(" · ")}
                      </div>
                      <div className="mt-1 sm:hidden font-numeric text-xs">
                        <span className="text-bone-faded line-through mr-2">{formatUsd(g.originalPrice)}</span>
                        <span className="text-bone font-semibold">{formatUsd(g.price)}</span>
                        <span className="text-hot font-bold ml-2">−{g.discount}%</span>
                      </div>
                    </div>
                    <div className="label-eyebrow hidden md:block">{g.store}</div>
                    <div className="text-right hidden sm:block">
                      <div className="font-numeric text-[11px] text-bone-faded line-through">
                        {formatUsd(g.originalPrice)}
                      </div>
                      <div className="font-numeric text-bone font-semibold">{formatUsd(g.price)}</div>
                    </div>
                    <div className="hidden sm:block font-numeric font-bold text-hot text-base w-14 text-right">
                      −{g.discount}%
                    </div>
                  </DealLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
