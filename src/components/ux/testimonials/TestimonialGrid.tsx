import { cn } from '@/lib/utils';
import type { UxTestimonial } from '@/data/ux-testimonials';
import { HighlightedQuote, Byline } from './shared';
import Reveal from '../Reveal';

/**
 * Variação "Grade": cards compactos lado a lado. A leitura aqui é do conjunto —
 * cada fala é curta de propósito.
 */
export default function TestimonialGrid({
  testimonials,
  columns = 3,
  className,
}: {
  testimonials: UxTestimonial[];
  columns?: 2 | 3;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        'grid gap-4 sm:grid-cols-2',
        columns === 3 && 'lg:grid-cols-3',
        className,
      )}
    >
      {testimonials.map((item, index) => (
        <Reveal
          as="li"
          key={item.id}
          delay={(index % 3) * 0.05}
          className="flex h-full flex-col justify-between gap-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-300 hover:border-[var(--color-text)]/25"
        >
          <blockquote>
            <p className="text-[16px] leading-[1.6]">
              <span aria-hidden="true">“</span>
              <HighlightedQuote quote={item.quote} highlightedText={item.highlightedText} />
              <span aria-hidden="true">”</span>
            </p>
          </blockquote>

          <Byline
            name={item.authorName}
            position={item.authorPosition}
            company={item.company}
            image={item.authorImage}
            size="sm"
          />
        </Reveal>
      ))}
    </ul>
  );
}
