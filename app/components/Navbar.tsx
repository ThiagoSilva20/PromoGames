import { useState } from "react";
import { Link, NavLink, useRouteLoaderData } from "react-router";
import type { Game } from "./GameCard";
import { Ticker } from "./Ticker";

const navItems = [
  { to: "/promocoes", label: "Promoções" },
  { to: "/#destaques", label: "Destaques" },
  { to: "/#sobre", label: "Como funciona" },
];

type RootLoaderData = {
  tickerGames: Game[];
};

export function Navbar() {
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-30">
      <Ticker games={rootData?.tickerGames ?? []} />
      <nav className="hairline border-b bg-pitch/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
            <span className="font-display font-bold text-[22px] tracking-tight text-bone leading-none">
              promo<span className="text-acid">/</span>games
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `label-eyebrow transition-colors ${
                      isActive ? "text-bone" : "hover:text-bone"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden hairline border h-10 w-10 inline-flex items-center justify-center text-bone-dim hover:text-bone transition-colors"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen ? (
          <div className="md:hidden hairline border-t bg-pitch/95 px-6 py-4">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block label-eyebrow py-2 transition-colors ${
                        isActive ? "text-bone" : "text-bone-dim hover:text-bone"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
