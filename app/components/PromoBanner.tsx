export function PromoBanner() {
  return (
    <section id="sobre" className="relative">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-numeric text-bone-faded text-sm">03</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-bone tracking-tight leading-[0.95]">
              Avisamos.<br />
              <span className="italic font-medium text-bone-dim">Você compra.</span>
            </h2>
            <p className="mt-6 text-bone-dim leading-relaxed max-w-md">
              Marque qualquer jogo, defina o preço-alvo e compare ofertas nas lojas que monitoramos
              em tempo real.
            </p>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <ol className="space-y-0 hairline border-t">
              {[
                { n: "01", t: "Adicione à lista", d: "Cole o link da Steam, Epic ou GOG, ou busque pelo nome." },
                { n: "02", t: "Defina o alvo", d: "Escolha o preço máximo que você está disposto a pagar." },
                { n: "03", t: "Aguarde a queda", d: "Monitoramos 24/7 e te avisamos no segundo em que bater o alvo." },
                { n: "04", t: "Compre na fonte", d: "Direciono você para a loja oficial. Sem intermediário, sem chave duvidosa." },
              ].map((s) => (
                <li key={s.n} className="hairline border-b py-6 grid grid-cols-[60px_1fr] gap-6 group">
                  <span className="font-numeric text-bone-faded text-sm pt-1.5 group-hover:text-acid transition-colors">{s.n}</span>
                  <div>
                    <h4 className="font-display font-semibold text-bone text-xl">{s.t}</h4>
                    <p className="mt-1 text-bone-dim text-sm leading-relaxed">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
