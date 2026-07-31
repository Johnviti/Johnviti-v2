import type { ProcessStep } from '@/data/ux-portfolio';
import { Eyebrow } from './primitives';
import Reveal from './Reveal';

/**
 * Processo de design em linha horizontal no desktop (rolagem quando não cabe)
 * e cards empilhados no mobile. A linha de conexão é decorativa.
 */
export default function ProcessTimeline({
  steps,
  tone = 'default',
}: {
  steps: ProcessStep[];
  tone?: 'default' | 'inverse';
}) {
  const inverse = tone === 'inverse';

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className={`absolute left-0 right-0 top-[13px] hidden h-px lg:block ${
          inverse ? 'bg-[var(--color-ink-border)]' : 'bg-[var(--color-border)]'
        }`}
      />
      <ol className="ux-scroller -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0 lg:grid lg:grid-cols-6 lg:gap-5 lg:overflow-visible lg:pb-0">
        {steps.map((step, index) => (
          <Reveal
            as="li"
            key={step.number}
            delay={index * 0.05}
            className="relative w-[264px] shrink-0 lg:w-auto"
          >
            <span
              aria-hidden="true"
              className={`relative z-10 mb-6 flex size-[26px] items-center justify-center rounded-full text-[11px] font-medium ${
                inverse
                  ? 'bg-white text-[var(--color-ink)]'
                  : 'bg-[var(--color-text)] text-white'
              }`}
            >
              {step.number}
            </span>

            <h3
              className={`text-[18px] font-semibold tracking-[-0.02em] ${
                inverse ? 'text-white' : 'text-[var(--color-text)]'
              }`}
            >
              {step.title}
            </h3>
            <p
              className={`mt-2 text-[14px] leading-[1.55] ${
                inverse ? 'text-[var(--color-ink-muted)]' : 'text-[var(--color-muted)]'
              }`}
            >
              {step.description}
            </p>

            <div className="mt-5">
              <Eyebrow tone={inverse ? 'inverse' : 'muted'}>Entregáveis</Eyebrow>
              <ul
                className={`mt-2 space-y-1 text-[13px] leading-[1.5] ${
                  inverse ? 'text-white/80' : 'text-[var(--color-text)]'
                }`}
              >
                {step.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <Eyebrow tone={inverse ? 'inverse' : 'muted'}>Ferramentas</Eyebrow>
              <p
                className={`mt-2 text-[13px] ${
                  inverse ? 'text-[var(--color-ink-muted)]' : 'text-[var(--color-muted)]'
                }`}
              >
                {step.tools.join(' · ')}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
