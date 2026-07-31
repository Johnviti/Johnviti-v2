import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UxTestimonial } from '@/data/ux-testimonials';
import { CompanyMark, HighlightedQuote, Byline } from './shared';

/**
 * Variação "Carrossel": uma fala por vez, com troca manual.
 *
 * `autoAdvance` é opcional e desligado por padrão — troca automática atrapalha
 * quem lê devagar. Quando ligado, pausa no hover, no foco e sob
 * `prefers-reduced-motion`.
 */
export default function TestimonialCarousel({
  testimonials,
  autoAdvance = false,
  className,
}: {
  testimonials: UxTestimonial[];
  autoAdvance?: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const current = testimonials[index];

  const go = (next: number) =>
    setIndex((next + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (!autoAdvance || paused || reduced) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      7000,
    );
    return () => clearInterval(timer);
  }, [autoAdvance, paused, reduced, testimonials.length]);

  if (!current) return null;

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[860px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-12',
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1);
        if (e.key === 'ArrowLeft') go(index - 1);
      }}
    >
      {/* A troca é anunciada de uma vez, sem ler cada quadro da animação.

          Sem `AnimatePresence`: a `key` remonta o bloco e ele entra com fade.
          Com animação de saída, o item novo só apareceria depois que a saída
          terminasse — e o conteúdo visível não pode depender disso. */}
      <div aria-live="polite" aria-atomic="true" className="min-h-[248px] md:min-h-[224px]">
        <motion.figure
          key={current.id}
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.001 : 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <CompanyMark company={current.company} />
          <blockquote className="mt-7">
            <p className="text-[21px] leading-[1.4] tracking-[-0.015em] md:text-[26px]">
              <span aria-hidden="true">“</span>
              <HighlightedQuote
                quote={current.quote}
                highlightedText={current.highlightedText}
              />
              <span aria-hidden="true">”</span>
            </p>
          </blockquote>
          <figcaption className="mt-8">
            <Byline
              name={current.authorName}
              position={current.authorPosition}
              image={current.authorImage}
            />
          </figcaption>
        </motion.figure>
      </div>

      <div className="mt-10 flex items-center justify-between gap-6 border-t border-[var(--color-border)] pt-6">
        <ol className="flex items-center gap-2">
          {testimonials.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index ? 'true' : undefined}
                className="group/dot inline-flex h-11 items-center px-1"
              >
                <span className="sr-only">{`Depoimento ${i + 1} de ${testimonials.length}: ${item.authorName}`}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-[3px] rounded-full transition-all duration-300',
                    i === index
                      ? 'w-7 bg-[var(--color-text)]'
                      : 'w-3 bg-[var(--color-border)] group-hover/dot:bg-[var(--color-muted)]',
                  )}
                />
              </button>
            </li>
          ))}
        </ol>

        <div className="flex items-center gap-2">
          <NavButton label="Depoimento anterior" onClick={() => go(index - 1)}>
            <ArrowLeft size={17} strokeWidth={1.5} aria-hidden="true" />
          </NavButton>
          <NavButton label="Próximo depoimento" onClick={() => go(index + 1)}>
            <ArrowRight size={17} strokeWidth={1.5} aria-hidden="true" />
          </NavButton>
        </div>
      </div>
    </div>
  );
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors duration-200 hover:border-[var(--color-text)]"
    >
      <span className="sr-only">{label}</span>
      {children}
    </button>
  );
}
