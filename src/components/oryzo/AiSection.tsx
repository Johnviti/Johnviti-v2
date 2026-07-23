import { useState } from 'react';

/**
 * Seção "IA": o produto se apresenta como fruto de avanços de IA e um bloco
 * interativo brinca com o clássico problema das mãos geradas por IA.
 */
export default function AiSection() {
  const [hovered, setHovered] = useState(false);

  return (
    <section id="ai" className="relative px-5 py-28 md:py-40">
      <div className="mx-auto max-w-5xl">
        <h2
          data-reveal
          className="font-archivo text-[clamp(2.2rem,7vw,5.5rem)] font-black uppercase leading-[0.95]"
        >
          Isn't just
          <br />a coaster.
        </h2>

        <p
          data-reveal
          className="mt-8 max-w-md font-literata text-lg italic leading-relaxed text-oryzo-cream/85"
        >
          Corkzo is what happens when a slice of tree bark receives a Series A.
          Trained on nothing. Deployed everywhere.
        </p>

        <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
          <span className="rounded-full bg-oryzo-orange px-5 py-2 font-archivo text-[11px] font-bold uppercase tracking-[0.22em] text-oryzo-bg">
            Powered by AI*
          </span>
          <span className="rounded-full border border-oryzo-cream/30 px-5 py-2 font-archivo text-[11px] font-semibold uppercase tracking-[0.22em] text-oryzo-cream/80">
            CORKZO-1
          </span>
          <span className="font-archivo text-[10px] uppercase tracking-[0.2em] text-oryzo-tan">
            *Actually Inert
          </span>
        </div>

        {/* Interação: a "IA" não sabe contar dedos. */}
        <div
          data-reveal
          className="mt-20 flex flex-col items-center gap-6 rounded-3xl border border-oryzo-cream/15 px-6 py-14 text-center"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <p className="font-archivo text-[10px] font-semibold uppercase tracking-[0.3em] text-oryzo-tan">
            Try to hover the hand
          </p>

          <svg
            viewBox="0 0 120 110"
            className="h-32 w-32 text-oryzo-cream transition-transform duration-500"
            style={{ transform: hovered ? 'rotate(-8deg) scale(1.08)' : 'none' }}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            aria-hidden
          >
            {/* Palma */}
            <path d="M30 70 q0 30 30 30 q30 0 30 -30 l0 -18" />
            {/* Dedos — um a mais quando a "IA" está no controle */}
            <path d="M34 70 V34" />
            <path d="M48 66 V22" />
            <path d="M62 66 V18" />
            <path d="M76 66 V24" />
            <path d="M90 70 V36" />
            {hovered && (
              <path d="M103 74 V46" className="text-oryzo-orange" stroke="currentColor" />
            )}
          </svg>

          <p className="font-archivo text-xl font-extrabold uppercase tracking-wide md:text-2xl">
            {hovered
              ? 'Six fingers. Flawless. Ship it.'
              : 'Hands remain a research problem.'}
          </p>
          <p className="font-literata text-sm italic text-oryzo-tan">
            The model fills in the gaps. Sometimes with extra gaps.
          </p>
        </div>
      </div>
    </section>
  );
}
