export function Footer() {
  return (
    <footer className="hairline border-t bg-pitch">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="font-display font-bold text-2xl text-bone tracking-tight">
            promo<span className="text-acid">/</span>games
          </div>
          <p className="mt-4 text-bone-dim text-sm max-w-sm leading-relaxed">
            Um agregador independente de promoções de games. Sem afiliação com Steam, Epic, GOG,
            PlayStation, Xbox ou Nintendo.
          </p>
          <div className="mt-6 label-eyebrow">© {new Date().getFullYear()} — feito em São Paulo</div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
          {[
            { h: "Navegar", links: ["Promoções", "Destaques", "Buscar"] },
            { h: "Lojas", links: ["Steam", "Epic", "GOG", "PSN"] },
            { h: "Comunidade", links: ["Discord", "Twitter", "Reddit"] },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="label-eyebrow mb-4">{col.h}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-bone hover:text-acid transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="hairline border-t">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs text-bone-faded font-numeric">v0.1.0 · build 042</span>
          <a href="#" className="text-xs text-bone-faded hover:text-bone transition">Política · Termos</a>
        </div>
      </div>
    </footer>
  );
}
