import type { Route } from "./+types/home";
import { useRevalidator } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { FeaturedGames } from "../components/FeaturedGames";
import { TopDrops } from "../components/TopDrops";
import { PromoBanner } from "../components/PromoBanner";
import { FetchError, fetchErrorMessage } from "../components/FetchError";
import { getHomePage } from "../lib/cheapshark";
import type { HomeStats } from "../lib/cheapshark";
import type { Game } from "../components/GameCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PromoGames — As melhores promoções de games em tempo real" },
    {
      name: "description",
      content: "Compare preços de Steam, Epic e GOG. Promoções reais agregadas pela API CheapShark.",
    },
  ];
}

const emptyStats: HomeStats = {
  storeCount: 0,
  activeOffersLabel: "—",
  maxDiscountLabel: "—",
};

export async function loader() {
  try {
    const data = await getHomePage();
    return { ...data, error: null as string | null };
  } catch (err) {
    return {
      error: fetchErrorMessage(err),
      hero: null as Game | null,
      featured: [] as Game[],
      topDrops: [] as Game[],
      stats: emptyStats,
    };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { revalidate, state } = useRevalidator();
  const { hero, featured, topDrops, stats, error } = loaderData;

  if (error || !hero) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-24">
            <FetchError
              message={error ?? undefined}
              onRetry={() => revalidate()}
              retrying={state === "loading"}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero offer={hero} stats={stats} />
        <FeaturedGames games={featured} />
        <TopDrops games={topDrops} />
        <PromoBanner />
      </main>
      <Footer />
    </div>
  );
}
