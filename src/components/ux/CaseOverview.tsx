import type { Overview } from '@/data/ux-portfolio';
import { Container, Eyebrow } from './primitives';
import Reveal from './Reveal';

/**
 * Blocos 7 a 9 — introdução, desafio e abordagem.
 *
 * A introdução vem grande, em destaque; desafio e abordagem descem em duas
 * colunas de leitura confortável.
 */
export default function CaseOverview({ overview }: { overview: Overview }) {
  return (
    <section id="overview" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <Reveal>
          <Eyebrow tone="primary">Visão geral</Eyebrow>
          <p className="mt-6 max-w-[24ch]">
            <span className="text-[26px] font-semibold leading-[1.2] tracking-[-0.03em] sm:text-[34px]">
              {overview.intro}
            </span>
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 border-t border-[var(--color-border)] pt-12 md:grid-cols-2">
          <Reveal>
            <Eyebrow>Desafio</Eyebrow>
            <p className="mt-4 text-[17px] leading-[1.6] text-[var(--color-muted)] md:text-[18px]">
              {overview.challenge}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <Eyebrow>Abordagem</Eyebrow>
            <p className="mt-4 text-[17px] leading-[1.6] md:text-[18px]">{overview.approach}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
