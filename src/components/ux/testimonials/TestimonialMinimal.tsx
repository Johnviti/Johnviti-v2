import { cn } from '@/lib/utils';
import type { UxTestimonial } from '@/data/ux-testimonials';
import { HighlightedQuote, Avatar } from './shared';

/**
 * Variação "Mínimo": sem card e sem borda, só um filete à esquerda separando a
 * fala do texto ao redor. Pensada para viver dentro de um artigo.
 */
export default function TestimonialMinimal({
  testimonial,
  align = 'start',
  className,
}: {
  testimonial: UxTestimonial;
  align?: 'start' | 'center';
  className?: string;
}) {
  const centered = align === 'center';

  return (
    <figure
      className={cn(
        'max-w-[62ch]',
        centered ? 'mx-auto text-center' : 'border-l-2 border-[var(--color-border)] pl-6',
        className,
      )}
    >
      <blockquote>
        <p className="text-[19px] leading-[1.55] tracking-[-0.01em] md:text-[22px]">
          <span aria-hidden="true">“</span>
          <HighlightedQuote
            quote={testimonial.quote}
            highlightedText={testimonial.highlightedText}
          />
          <span aria-hidden="true">”</span>
        </p>
      </blockquote>

      <figcaption
        className={cn(
          'mt-6 flex items-center gap-3 text-[14px]',
          centered && 'justify-center',
        )}
      >
        <Avatar
          name={testimonial.authorName}
          image={testimonial.authorImage}
          size="sm"
        />
        <span className="font-medium">{testimonial.authorName}</span>
        <span aria-hidden="true" className="text-[var(--color-border)]">
          ·
        </span>
        <span className="text-[var(--color-muted)]">
          {testimonial.authorPosition}, {testimonial.company}
        </span>
      </figcaption>
    </figure>
  );
}
