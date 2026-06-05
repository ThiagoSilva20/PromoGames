# PromoGames

Agregador de promoções de jogos para PC com dados reais da [CheapShark API](https://www.cheapshark.com/). Monitora ofertas da **Steam**, **Epic Games** e **GOG**, com destaques na home, catálogo filtrável e busca com debounce.

## Funcionalidades

- **Home** — oferta em destaque, jogos em promoção, maiores quedas recentes e ticker ao vivo
- **Catálogo** (`/promocoes`) — grade ou lista, filtros por loja, rating Steam e desconto mínimo
- **Busca** — debounce de 400ms e TanStack Query; a API só é chamada com 2+ caracteres
- **Links diretos** — Steam via `steamAppID`; demais lojas via redirect da CheapShark
- **Tratamento de erros** — estados de falha com retry (429, indisponibilidade da API)
- **Responsivo** — menu mobile, layouts adaptados para celular

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | [React Router 7](https://reactrouter.com/) (SSR) |
| UI | React 19, [Tailwind CSS 4](https://tailwindcss.com/) |
| Dados (cliente) | [TanStack Query](https://tanstack.com/query) |
| Build | Vite 8, TypeScript |
| API externa | CheapShark (`/stores`, `/deals`) |

## Estrutura do projeto

```
app/
├── components/     # UI (Navbar, Hero, GameCard, FetchError…)
├── hooks/          # useDebounce
├── lib/
│   ├── cheapshark.ts   # fetch e mapeamento Deal → Game
│   ├── filters.ts      # filtros client-side do catálogo
│   ├── queries/        # catalogQueryOptions (TanStack Query)
│   └── query-client.ts
├── routes/
│   ├── home.tsx        # loader SSR + página inicial
│   └── promocoes.tsx   # catálogo + busca (client)
└── root.tsx            # ticker global + QueryClientProvider
```

## Como os dados fluem

**Servidor (loaders)** — IP do hosting na requisição à CheapShark:

- `root.tsx` → ticker (8 ofertas recentes)
- `home.tsx` → hero, destaques e top drops

**Cliente (browser)** — IP do visitante:

- `/promocoes` → `useQuery` + `fetchCatalog` com termo debounced

Cache em memória de lojas (`/stores`) por 5 minutos. TanStack Query usa `staleTime` de 2 min no catálogo.

## Pré-requisitos

- Node.js 20+
- npm ou yarn

## Desenvolvimento

```bash
npm install
npm run dev
```

App em `http://localhost:5173`.

```bash
npm run typecheck   # tipos + react-router typegen
npm run build       # build de produção
npm start           # serve build/server (após build)
```

## Deploy

Build padrão React Router 7 com SSR. Opções comuns:

- **Vercel** — instalar `@vercel/react-router` e usar `vercelPreset()` em `react-router.config.ts`
- **Cloudflare Workers** — preset `@react-router/cloudflare`
- **Render / Docker** — `npm run build` + `npm start`

Não há variáveis de ambiente obrigatórias; a CheapShark é pública. Evite muitas requisições seguidas para não receber **429** (rate limit por IP).

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Home com destaques e estatísticas |
| `/promocoes` | Catálogo completo com filtros e busca |

