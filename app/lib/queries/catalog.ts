import { queryOptions } from "@tanstack/react-query";
import { fetchCatalog } from "../cheapshark";

/** Só o termo debounced entra na queryKey → API não roda a cada tecla */
export function catalogQueryOptions(search: string) {
  const term = search.trim();
  return queryOptions({
    queryKey: ["catalog", term],
    queryFn: () => fetchCatalog(term || undefined),
    enabled: term.length === 0 || term.length >= 2,
    placeholderData: (previous) => previous,
  });
}
