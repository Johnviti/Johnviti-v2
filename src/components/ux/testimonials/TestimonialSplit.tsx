import { cn } from '@/lib/utils';
import type { UxTestimonial } from '@/data/ux-testimonials';
import Img from '../Img';
import { CompanyMark, HighlightedQuote, Byline } from './shared';

/**
 * Variação "Dividido": imagem de contexto em metade do bloco, fala na outra.
 * `reverse` inverte os lados no desktop — útil para alternar o ritmo quando
 * duas dessas aparecem seguidas.
 */
export default function TestimonialSplit({
  testimonial,
  reverse,
  className,
}: {
  testimonial: UxTestimonial;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        'grid overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] lg:grid-cols-2',
        className,
      )}
    >
      <div
        className={cn(
          'relative min-h-[240px] bg-[var(--color-background)]',
          reverse && 'lg:order-2',
        )}
      >
        {testimonial.image && (
          <Img
            src={testimonial.image}
            alt={testimonial.imageAlt ?? ''}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        )}
      </div>

      <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
        <div>
          <CompanyMark company={testimonial.company} />
          <blockquote className="mt-7">
            <p
              className="text-[21px] leading-[1.4] tracking-[-0.01em] md:text-[26px]"
              style={{ fontFamily: 'var(--font-editorial)' }}
            >
              <span aria-hidden="true">“</span>
              <HighlightedQuote
                quote={testimonial.quote}
                highlightedText={testimonial.highlightedText}
              />
              <span aria-hidden="true">”</span>
            </p>
          </blockquote>
        </div>

        <figcaption>
          <Byline
            name={testimonial.authorName}
            position={testimonial.authorPosition}
            image={testimonial.authorImage}
          />
        </figcaption>
      </div>
    </figure>
  );
}
