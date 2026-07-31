import { cn } from '@/lib/utils';
import type { UxTestimonial } from '@/data/ux-testimonials';
import { CompanyMark, HighlightedQuote, Byline } from './shared';

/**
 * Variação "Com métrica": o número puxa a atenção e a fala serve de evidência.
 * Sem `metric` no dado, o bloco cai para uma citação escura comum.
 */
export default function TestimonialMetric({
  testimonial,
  className,
}: {
  testimonial: UxTestimonial;
  className?: string;
}) {
  return (
    <figure
      data-ux-surface="dark"
      className={cn(
        'grid gap-10 rounded-[var(--radius-xl)] bg-[var(--color-ink)] p-8 md:p-12 lg:grid-cols-12 lg:items-center',
        className,
      )}
    >
      {testimonial.metric && (
        <div className="lg:col-span-4">
          <p className="text-[56px] font-semibold leading-[0.95] tracking-[-0.05em] text-white tabular-nums md:text-[72px]">
            {testimonial.metric.value}
          </p>
          <p className="mt-4 max-w-[24ch] text-[15px] leading-[1.5] text-[var(--color-ink-muted)]">
            {testimonial.metric.label}
          </p>
        </div>
      )}

      <div
        className={cn(
          'lg:border-l lg:border-[var(--color-ink-border)] lg:pl-10',
          testimonial.metric ? 'lg:col-span-8' : 'lg:col-span-12 lg:border-l-0 lg:pl-0',
        )}
      >
        <CompanyMark company={testimonial.company} tone="inverse" />
        <blockquote className="mt-6">
          <p className="text-[20px] leading-[1.45] tracking-[-0.01em] text-white md:text-[24px]">
            <span aria-hidden="true">“</span>
            <HighlightedQuote
              quote={testimonial.quote}
              highlightedText={testimonial.highlightedText}
              tone="inverse"
            />
            <span aria-hidden="true">”</span>
          </p>
        </blockquote>
        <figcaption className="mt-8">
          <Byline
            name={testimonial.authorName}
            position={testimonial.authorPosition}
            image={testimonial.authorImage}
            tone="inverse"
          />
        </figcaption>
      </div>
    </figure>
  );
}
