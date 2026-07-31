import { ArrowUp } from 'lucide-react';
import { profile } from '@/data/ux-portfolio';
import { Container, Grid, Eyebrow } from './primitives';
import { Wordmark } from './Logo';
import Reveal from './Reveal';

/**
 * Rodapé com a frase de contato, os canais e o botão de voltar ao topo.
 * O ano é calculado no render — não precisa ser atualizado à mão.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  const backToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <footer
      id="contato"
      data-ux-surface="dark"
      className="scroll-mt-24 bg-[var(--color-ink)] pt-24 md:pt-32"
    >
      <Container>
        <Grid>
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-7">
            <Eyebrow tone="inverse">Contato</Eyebrow>
            <h2 className="mt-6 text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-[52px]">
              Tem um produto complexo para simplificar?
            </h2>
            <a
              href={`mailto:${profile.email}`}
              className="ux-link mt-8 inline-block text-[18px] text-white/85 transition-colors duration-200 hover:text-white sm:text-[22px]"
            >
              {profile.email}
            </a>
          </Reveal>

          <Reveal delay={0.06} className="col-span-4 md:col-span-8 lg:col-span-5 lg:pl-10">
            <Eyebrow tone="inverse">Onde me encontrar</Eyebrow>
            <ul className="mt-6 space-y-3">
              {profile.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ux-link text-[16px] text-white/80 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Eyebrow tone="inverse">Localização</Eyebrow>
              <p className="mt-3 text-[15px] text-white/80">{profile.location}</p>
            </div>
          </Reveal>
        </Grid>

        <div className="mt-20 flex flex-col gap-6 border-t border-[var(--color-ink-border)] py-8 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark tone="inverse" />

          <div className="flex items-center gap-6">
            <p className="text-[13px] text-[var(--color-ink-muted)]">
              © {year} {profile.name}
            </p>
            <button
              type="button"
              onClick={backToTop}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-ink-border)] px-4 text-[13px] text-white/80 transition-colors duration-200 hover:border-white/40 hover:text-white"
            >
              Voltar ao topo
              <ArrowUp size={15} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
