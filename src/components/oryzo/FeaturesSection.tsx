/**
 * "Wearable" + os três cards de feature, cada um com um diagrama-paródia
 * de paper de IA (temperatura do modelo, difusão térmica, circularidade).
 */

const TEMPS = [
  { t: 'T = 10', label: 'CREATIVE', wobble: 9 },
  { t: 'T = 1', label: 'BALANCED', wobble: 3.5 },
  { t: 'T = 0.1', label: 'DETERMINISTIC', wobble: 0 },
];

/** Círculo com perímetro "instável" — quanto maior o wobble, menos redondo. */
function WobblyCircle({ wobble }: { wobble: number }) {
  const points: string[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    // Ruído determinístico simples baseado no ângulo.
    const noise =
      Math.sin(a * 5.3) * 0.6 + Math.sin(a * 9.1 + 2) * 0.4;
    const r = 38 + noise * wobble;
    points.push(
      `${(50 + Math.cos(a) * r).toFixed(2)},${(50 + Math.sin(a) * r).toFixed(2)}`,
    );
  }
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

const FEATURES = [
  {
    title: 'Float above the ordinary',
    tag: 'AN UPGRADE OF PRECISELY 8MM',
    body: 'One coaster of vertical advantage, calibrated to the millimeter. Your mug is not resting — it is being presented.',
    diagram: 'lift',
  },
  {
    title: 'From lava to ice',
    tag: 'PASSIVE THERMAL MANAGEMENT',
    body: 'Scalding espresso or glacial cold brew — the disc does not flinch. Your table stopped being brave three sips ago.',
    diagram: 'thermal',
  },
  {
    title: 'Aggressively circular',
    tag: 'NOW 41.2% MORE CIRCULAR',
    body: 'Our engineers audited the perimeter with a level of attention no coaster has ever deserved. Because nobody asked.',
    diagram: 'round',
  },
] as const;

export default function FeaturesSection() {
  return (
    <>
      {/* Wearable */}
      <section id="wearable" className="px-5 py-24 text-center md:py-32">
        <h2
          data-reveal
          className="font-archivo text-[clamp(2rem,6.5vw,5rem)] font-black uppercase leading-none"
        >
          So portable,
          <br />
          <span className="font-literata font-medium lowercase italic text-oryzo-orange">
            it's wearable
          </span>
        </h2>
        <p
          data-reveal
          className="mx-auto mt-10 max-w-md border border-oryzo-orange/60 px-6 py-4 font-archivo text-[10px] font-bold uppercase tracking-[0.24em] text-oryzo-orange"
        >
          Warning — stunt performed by trained baristas. Do not attempt at home.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="px-5 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              data-reveal
              className="flex flex-col rounded-3xl border border-oryzo-cream/15 p-8"
            >
              <span className="font-archivo text-[9px] font-bold uppercase tracking-[0.26em] text-oryzo-orange">
                {f.tag}
              </span>
              <h3 className="mt-4 font-archivo text-2xl font-extrabold uppercase leading-tight">
                {f.title}
              </h3>
              <p className="mt-4 flex-1 font-literata text-sm italic leading-relaxed text-oryzo-tan">
                {f.body}
              </p>

              {/* Diagramas-paródia */}
              <div className="mt-8 border-t border-oryzo-cream/10 pt-6 text-oryzo-cream/80">
                {f.diagram === 'round' && (
                  <div>
                    <div className="flex items-end justify-between">
                      {TEMPS.map((c) => (
                        <div key={c.t} className="flex flex-col items-center gap-2">
                          <WobblyCircle wobble={c.wobble} />
                          <span className="font-archivo text-[9px] font-bold tracking-[0.14em]">
                            {c.t}
                          </span>
                          <span className="font-archivo text-[8px] tracking-[0.18em] text-oryzo-tan">
                            {c.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 font-archivo text-[8px] uppercase tracking-[0.18em] text-oryzo-tan/70">
                      RAG: Radius-Aligned Geometry · circle = 1.0
                    </p>
                  </div>
                )}
                {f.diagram === 'lift' && (
                  <div>
                    <svg viewBox="0 0 200 70" className="w-full" aria-hidden>
                      <line x1="10" y1="60" x2="190" y2="60" stroke="currentColor" strokeWidth="2" />
                      <rect x="70" y="46" width="60" height="12" rx="6" fill="currentColor" opacity="0.9" />
                      <path d="M100 40 V14 M92 22 L100 12 L108 22" stroke="#dc5000" strokeWidth="3" fill="none" />
                    </svg>
                    <p className="mt-4 font-archivo text-[8px] uppercase tracking-[0.18em] text-oryzo-tan/70">
                      Constant lift via geometry · a visualization, not a warranty
                    </p>
                  </div>
                )}
                {f.diagram === 'thermal' && (
                  <div>
                    <svg viewBox="0 0 200 70" className="w-full" aria-hidden>
                      <path
                        d="M10 55 C 50 55, 60 15, 100 15 S 150 55, 190 55"
                        fill="none"
                        stroke="#dc5000"
                        strokeWidth="2.5"
                      />
                      <line x1="10" y1="62" x2="190" y2="62" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                    </svg>
                    <p className="mt-4 font-archivo text-[8px] uppercase tracking-[0.18em] text-oryzo-tan/70">
                      Thermal Diffusion Model (TDM) · results on our own desk
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
