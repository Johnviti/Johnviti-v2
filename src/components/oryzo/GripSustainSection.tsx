import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Grip (coeficiente de atrito com contador animado) + sustentabilidade
 * (três estatísticas reais da cortiça, tratadas com o mesmo tom de paródia).
 */

const STATS = [
  {
    value: '25',
    unit: 'YRS',
    title: 'Average age of first harvest',
    body: 'A cork oak grows for about a quarter of a century before its bark is thick enough to harvest safely.',
  },
  {
    value: '9',
    unit: 'YRS',
    title: 'Harvesting interval',
    body: 'After each harvest the bark regrows in roughly nine years, which makes cork a genuinely renewable material.',
  },
  {
    value: '0',
    unit: 'W',
    title: 'Power draw while in use',
    body: 'No compute, no tokens, no cloud bill. Say "please" and "thank you" as much as you like — it is free here.',
  },
];

export default function GripSustainSection() {
  const frictionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = frictionRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.textContent = '0.80';
      return;
    }
    const counter = { v: 0 };
    const tween = gsap.to(counter, {
      v: 0.8,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => {
        el.textContent = counter.v.toFixed(2);
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <>
      {/* Grip */}
      <section id="grip" className="px-5 py-24 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <span
              data-reveal
              className="font-archivo text-[10px] font-bold uppercase tracking-[0.28em] text-oryzo-orange"
            >
              Precision grip, zero drama
            </span>
            <h2
              data-reveal
              className="mt-4 font-archivo text-[clamp(1.8rem,5.5vw,4rem)] font-black uppercase leading-none"
            >
              Anti-slip,
              <br />
              pro-calm
            </h2>
            <p
              data-reveal
              className="mt-6 font-literata text-base italic leading-relaxed text-oryzo-tan"
            >
              Micro-textured cork so committed to staying put that your drink
              starts negotiating with gravity from a position of strength.
              Spills are hereby politely discouraged.
            </p>
          </div>

          <div data-reveal className="text-right">
            <p className="font-archivo text-[9px] font-bold uppercase tracking-[0.26em] text-oryzo-tan">
              Friction coefficient (est.)
            </p>
            <span
              ref={frictionRef}
              className="font-archivo text-[clamp(3.5rem,10vw,7rem)] font-black text-oryzo-orange"
            >
              0.00
            </span>
          </div>
        </div>
      </section>

      {/* Sustentabilidade */}
      <section id="sustainability" className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span
              data-reveal
              className="font-archivo text-[10px] font-bold uppercase tracking-[0.28em] text-oryzo-orange"
            >
              100% plant-based
            </span>
            <h2
              data-reveal
              className="mt-4 font-archivo text-[clamp(1.8rem,5.5vw,4rem)] font-black uppercase leading-none"
            >
              Vegan-friendly
            </h2>
            <p
              data-reveal
              className="mx-auto mt-6 max-w-md font-literata text-base italic leading-relaxed text-oryzo-tan"
            >
              Sustainably harvested cork. No animals were involved at any point
              — though the marketing may contain traces of nonsense.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {STATS.map((s) => (
              <article
                key={s.title}
                data-reveal
                className="rounded-3xl border border-oryzo-cream/15 p-8"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-archivo text-6xl font-black text-oryzo-cream">
                    {s.value}
                  </span>
                  <span className="font-archivo text-sm font-bold tracking-[0.2em] text-oryzo-orange">
                    {s.unit}
                  </span>
                </div>
                <h3 className="mt-4 font-archivo text-xs font-bold uppercase tracking-[0.2em]">
                  {s.title}
                </h3>
                <p className="mt-3 font-literata text-sm italic leading-relaxed text-oryzo-tan">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
