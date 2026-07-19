import { useEffect } from 'react';
import { CONTACT_EMAIL } from '@/data/site';
import {
  getCaseBySlug,
  getNextCase,
  type PaletteColor,
} from '@/data/cases';

/**
 * Página de case study — aberta ao clicar em um tile da galeria imersiva.
 * Estrutura editorial inspirada em case studies de portfólio: hero com
 * metadados, visão geral, paleta de cores, tipografia, decisões de design
 * numeradas e navegação para o próximo case.
 */

/** Luminância aproximada do hex — decide texto claro ou escuro no swatch. */
const isDarkColor = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.6;
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-medium tracking-[0.28em] text-stone-soft">
    {children}
  </p>
);

const Swatch = ({ color, featured }: { color: PaletteColor; featured?: boolean }) => {
  const dark = isDarkColor(color.hex);
  return (
    <div className={featured ? 'sm:col-span-2 sm:row-span-2' : ''}>
      <div
        className={`flex w-full flex-col justify-end rounded-2xl p-5 ${
          featured ? 'min-h-[220px] sm:h-full sm:min-h-[320px]' : 'min-h-[150px]'
        }`}
        style={{ backgroundColor: color.hex }}
      >
        <p
          className={`text-sm font-medium ${dark ? 'text-white' : 'text-ink'}`}
        >
          {color.name}
        </p>
        <p
          className={`mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] ${
            dark ? 'text-white/70' : 'text-ink/60'
          }`}
        >
          {color.hex}
        </p>
      </div>
      <p className="mt-3 pr-4 text-[13px] leading-relaxed text-stone-soft">
        {color.usage}
      </p>
    </div>
  );
};

type Props = { slug: string };

const CasePage = ({ slug }: Props) => {
  const study = getCaseBySlug(slug);

  useEffect(() => {
    document.title = study
      ? `john amorim — case ${study.title.toLowerCase()}`
      : 'john amorim — case não encontrado';
    window.scrollTo(0, 0);
  }, [study]);

  if (!study) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-white text-ink">
        <p className="text-sm tracking-[0.2em] text-stone-soft">
          CASE NÃO ENCONTRADO
        </p>
        <a
          href="/galeria-imersiva"
          className="text-lg underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
        >
          ← Voltar para a galeria
        </a>
      </div>
    );
  }

  const next = getNextCase(study.slug);

  return (
    <div className="min-h-svh bg-white text-ink">
      {/* Header fixo mínimo */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-white/85 px-6 py-5 backdrop-blur-sm md:px-8">
        <a
          href="/"
          className="text-[12px] font-medium tracking-[0.22em] transition-opacity hover:opacity-60"
        >
          JOHN AMORIM®
        </a>
        <a
          href="/galeria-imersiva"
          className="text-[10px] tracking-[0.28em] text-ink/60 transition-colors hover:text-ink"
        >
          ← GALERIA
        </a>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-32 md:px-8 md:pt-40">
        {/* ---------------------------------------------------------- Hero */}
        <SectionLabel>{study.category.toUpperCase()}</SectionLabel>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-tight">
          {study.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-charcoal md:text-xl">
          {study.summary}
        </p>

        {/* Metadados — cliente / ano / papel / stack */}
        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-ink/10 py-8 md:grid-cols-4">
          {[
            ['CLIENTE', study.client],
            ['ANO', study.year],
            ['PAPEL', study.role],
            ['STACK', study.stack.join(' · ')],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10px] tracking-[0.28em] text-stone-soft">
                {label}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Imagem principal */}
        <figure className="mt-14">
          <img
            src={study.heroImage}
            alt={`Apresentação do projeto ${study.title}`}
            className="aspect-[16/10] w-full rounded-3xl object-cover"
          />
        </figure>

        {/* --------------------------------------------------- Visão geral */}
        <section className="mt-24 grid gap-10 md:mt-32 md:grid-cols-[1fr_2fr]">
          <SectionLabel>VISÃO GERAL</SectionLabel>
          <div className="space-y-6">
            {study.overview.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base leading-relaxed text-charcoal md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ Paleta de cores */}
        <section className="mt-24 md:mt-32">
          <SectionLabel>PALETA DE CORES</SectionLabel>
          <h2 className="mt-4 max-w-xl text-2xl font-medium leading-snug md:text-3xl">
            Cada cor tem um papel — nenhuma entra por decoração.
          </h2>
          <div className="mt-12 grid gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {study.palette.map((color, i) => (
              <Swatch key={color.hex} color={color} featured={i === 0} />
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- Tipografia */}
        <section className="mt-24 md:mt-32">
          <SectionLabel>TIPOGRAFIA</SectionLabel>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              { role: 'DISPLAY', ...study.typography.display },
              { role: 'TEXTO', ...study.typography.text },
            ].map((font) => (
              <div
                key={font.role}
                className="rounded-3xl bg-cream-soft p-8 md:p-10"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] tracking-[0.28em] text-stone-soft">
                    {font.role}
                  </span>
                  <span className="text-[11px] text-stone-soft">
                    {font.weights}
                  </span>
                </div>
                <p className="mt-6 text-6xl font-medium md:text-7xl">Aa</p>
                <p className="mt-4 text-xl">{font.family}</p>
                <p className="mt-4 text-[13px] leading-relaxed text-stone-soft">
                  {font.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------- Decisões de design */}
        <section className="mt-24 md:mt-32">
          <SectionLabel>DECISÕES DE DESIGN</SectionLabel>
          <div className="mt-10">
            {study.decisions.map((decision, i) => (
              <div
                key={decision.title}
                className="grid gap-4 border-t border-ink/10 py-10 md:grid-cols-[80px_1fr_2fr] md:gap-8"
              >
                <span className="font-mono text-sm text-stone-soft">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-medium leading-snug">
                  {decision.title}
                </h3>
                <p className="text-base leading-relaxed text-charcoal">
                  {decision.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------ Imagens */}
        <section className="mt-16 grid gap-4 md:grid-cols-2">
          {study.gallery.map((image) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-3xl object-cover"
            />
          ))}
        </section>

        {/* -------------------------------------------------- Próximo case */}
        <a
          href={`/case/${next.slug}`}
          className="group mt-24 block border-t border-ink/10 py-16 md:mt-32 md:py-24"
        >
          <SectionLabel>PRÓXIMO CASE</SectionLabel>
          <span className="mt-4 flex items-baseline gap-4 text-[clamp(2rem,5vw,4rem)] font-medium leading-tight tracking-tight transition-opacity group-hover:opacity-60">
            {next.title}
            <span className="text-[0.6em] transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </span>
        </a>
      </main>

      {/* ------------------------------------------------------------ Footer */}
      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-[13px] text-stone-soft md:flex-row md:items-center md:justify-between md:px-8">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="transition-colors hover:text-ink"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href="/galeria-imersiva"
            className="tracking-[0.2em] transition-colors hover:text-ink"
          >
            ← VOLTAR PARA A GALERIA
          </a>
        </div>
      </footer>
    </div>
  );
};

export default CasePage;
