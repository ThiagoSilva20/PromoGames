import { useState } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import type { Route } from "./+types/root";
import { FetchError, fetchErrorMessage } from "./components/FetchError";
import { getTickerGames } from "./lib/cheapshark";
import { makeQueryClient } from "./lib/query-client";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
];

export async function loader() {
  try {
    const tickerGames = await getTickerGames();
    return { tickerGames };
  } catch {
    return { tickerGames: [] };
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Erro";
  let message = "Ocorreu um erro inesperado.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "Página não encontrada" : "Erro";
    if (error.status === 404) {
      message = "A página solicitada não foi encontrada.";
    } else if (error.status === 429) {
      message =
        "Muitas consultas à API de preços. Espere alguns segundos e tente novamente.";
    } else {
      message = error.statusText || message;
    }
  } else {
    message = fetchErrorMessage(error);
    if (import.meta.env.DEV && error instanceof Error) stack = error.stack;
  }

  return (
    <main className="min-h-screen bg-pitch flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <FetchError
          title={title}
          message={message}
          onRetry={() => window.location.reload()}
        />
        {stack ? (
          <pre className="mt-6 w-full p-4 overflow-x-auto text-xs text-bone-faded hairline border">
            <code>{stack}</code>
          </pre>
        ) : null}
      </div>
    </main>
  );
}
