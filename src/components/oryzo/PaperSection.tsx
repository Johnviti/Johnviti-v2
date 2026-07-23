/**
 * Seção "open-weight": o porta-copos apresentado como paper acadêmico,
 * com abstract, botões de release e BibTeX — tudo satírico e original.
 */

const BIBTEX = `@misc{corkzo2026,
  title        = {Corkzo-1: An Open-Weight Coaster},
  author       = {Amorim, John},
  year         = {2026},
  howpublished = {OBJ release},
  note         = {A 3D cork disc. Weights: about 12 grams.}
}`;

export default function PaperSection() {
  return (
    <section id="open-weight" className="bg-oryzo-cream px-5 py-24 text-oryzo-bg md:py-32">
      <div className="mx-auto max-w-3xl">
        <span
          data-reveal
          className="font-archivo text-[10px] font-bold uppercase tracking-[0.28em] text-oryzo-orange"
        >
          Our SOTA open-weight model
        </span>
        <h2
          data-reveal
          className="mt-4 font-archivo text-[clamp(1.8rem,5.5vw,4rem)] font-black uppercase leading-none"
        >
          Corkzo-1
        </h2>

        <div data-reveal className="mt-8 flex flex-wrap gap-3">
          {['PAPER', 'MODEL (.OBJ)', 'CODE — COMING SOON'].map((b) => (
            <span
              key={b}
              className="cursor-not-allowed rounded-full border border-oryzo-bg/30 px-5 py-2 font-archivo text-[10px] font-bold uppercase tracking-[0.22em] opacity-80"
              title="Este release é tão aberto que nem existe"
            >
              {b}
            </span>
          ))}
        </div>

        <div data-reveal className="mt-12 space-y-8 font-literata leading-relaxed">
          <div>
            <h3 className="font-archivo text-xs font-bold uppercase tracking-[0.24em]">
              Abstract
            </h3>
            <p className="mt-3 italic text-oryzo-bg/80">
              We introduce Corkzo-1, an open-weight 3D model of a cork coaster
              intended for rendering, simulation, and research nobody
              commissioned. The model reproduces the core behaviors of the
              physical artifact — table protection, stubborn circularity, and
              passive thermal moderation under everyday beverage workloads. We
              report strong results on DeskBench, an evaluation suite we
              invented this morning and administered on a single desk while
              mildly caffeinated. Known limitations include a hard dependency
              on gravity, mugs, and a human willing to put things on top of it.
            </p>
          </div>

          <div>
            <h3 className="font-archivo text-xs font-bold uppercase tracking-[0.24em]">
              Peer review
            </h3>
            <p className="mt-3 italic text-oryzo-bg/80">
              "Strong baseline. Would stack again." — anonymous reviewer #2
            </p>
          </div>

          <div>
            <h3 className="font-archivo text-xs font-bold uppercase tracking-[0.24em]">
              BibTeX
            </h3>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-oryzo-bg p-6 font-mono text-xs leading-relaxed text-oryzo-cream">
              {BIBTEX}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
