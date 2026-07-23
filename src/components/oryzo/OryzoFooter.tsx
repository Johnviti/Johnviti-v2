import { useState } from 'react';

/**
 * Fechamento: a grande revelação (é um estudo de design), links de contato
 * do portfólio, botão de copiar URL e o disclaimer obrigatório.
 */
export default function OryzoFooter() {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard indisponível — sem drama.
    }
  };

  return (
    <footer id="contact" className="px-5 pb-10 pt-24 md:pt-32">
      <div className="mx-auto max-w-5xl">
        <h2
          data-reveal
          className="text-center font-archivo text-[clamp(1.6rem,5vw,3.8rem)] font-black uppercase leading-tight"
        >
          You just scrolled a full landing page
          <br />
          for a disc of bark.
          <br />
          <span className="text-oryzo-orange">
            Imagine this energy on your project.
          </span>
        </h2>

        <div
          data-reveal
          className="mt-16 grid gap-10 border-t border-oryzo-cream/15 pt-10 font-archivo md:grid-cols-3"
        >
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-oryzo-tan">
              Built by
            </p>
            <a
              href="/"
              className="mt-2 block text-sm font-extrabold uppercase tracking-[0.18em] transition-colors hover:text-oryzo-orange"
            >
              John Amorim — portfolio
            </a>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-oryzo-tan">
              Share with friends, if you like it
            </p>
            <button
              type="button"
              onClick={copyUrl}
              className="mt-2 rounded-full border border-oryzo-cream/30 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] transition-colors hover:border-oryzo-orange hover:text-oryzo-orange"
            >
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-oryzo-tan">
              More experiments
            </p>
            <div className="mt-2 flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
              <a href="/galeria-imersiva" className="transition-colors hover:text-oryzo-orange">
                Galeria imersiva
              </a>
              <a href="/playground" className="transition-colors hover:text-oryzo-orange">
                Playground 3D
              </a>
              <a href="/cinetica" className="transition-colors hover:text-oryzo-orange">
                Cinética
              </a>
            </div>
          </div>
        </div>

        <p className="mt-16 border-t border-oryzo-cream/15 pt-8 text-center font-archivo text-[9px] font-medium uppercase leading-relaxed tracking-[0.2em] text-oryzo-tan/80">
          This page is a fictional design study by John Amorim, inspired by the
          structure of oryzo.ai (a creative project by Lusion). Corkzo does not
          exist. Nothing is for sale. Every claim is satirical.
        </p>
      </div>
    </footer>
  );
}
