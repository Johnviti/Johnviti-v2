import { cn } from '@/lib/utils';
import type { UxTestimonial } from '@/data/ux-testimonials';
import { Byline, CompanyMark, HighlightedQuote } from './shared';

/**
 * Variação "Mosaico editorial": uma fala principal conduz a narrativa e duas
 * falas curtas funcionam como evidências de apoio. O contraste de escala cria
 * hierarquia sem depender de carrossel ou de uma grade de cards iguais.
 */
export default function TestimonialMosaic({
  testimonials,
  className,
}: {
  testimonials: UxTestimonial[];
  className?: string;
}) {
  const [featured, ...supporting] = testimonials;

  if (!featured) return null;

  return (
    <section
      aria-label="Mosaico de depoimentos"
      data-ux-surface="dark"
      className={cn(
        'overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-ink)] text-white',
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-ink-border)] px-6 py-5 md:px-8">
        <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-[var(--color-secondary)] shadow-[0_0_0_5px_rgba(82,174,50,0.12)]"
          />
          Histórias de impacto
        </p>
        <p className="font-mono text-[11px] tabular-nums text-white/45">
          {String(Math.min(testimonials.length, 3)).padStart(2, '0')} relatos selecionados
        </p>
      </header>

      <div className="grid lg:grid-cols-12">
        <FeaturedStory testimonial={featured} />

        {supporting.slice(0, 2).length > 0 && (
          <div className="grid border-t border-[var(--color-ink-border)] lg:col-span-5 lg:border-l lg:border-t-0">
            {supporting.slice(0, 2).map((testimonial, index) => (
              <SupportingStory
                key={testimonial.id}
                testimonial={testimonial}
                index={index + 2}
                className={index > 0 ? 'border-t border-[var(--color-border)]' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedStory({ testimonial }: { testimonial: UxTestimonial }) {
  return (
    <figure className="relative flex min-h-[520px] flex-col justify-between overflow-hidden bg-[var(--color-primary)] p-7 sm:p-10 lg:col-span-7 lg:min-h-[620px] lg:p-12">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -top-20 select-none font-serif text-[260px] leading-none text-white/[0.07] sm:text-[360px]"
      >
        “
      </span>

      <div className="relative flex items-start justify-between gap-5">
        <CompanyMark company={testimonial.company} tone="inverse" />
        <span className="font-mono text-[11px] tabular-nums text-white/50">01</span>
      </div>

      <div className="relative mt-16">
        {testimonial.metric && (
          <p className="mb-8 flex items-end gap-3 border-b border-white/20 pb-6">
            <strong className="text-[42px] font-semibold leading-none tracking-[-0.045em] tabular-nums sm:text-[54px]">
              {testimonial.metric.value}
            </strong>
            <span className="max-w-[20ch] pb-1 text-[12px] leading-[1.4] text-white/65">
              {testimonial.metric.label}
            </span>
          </p>
        )}

        <blockquote>
          <p
            className="max-w-[28ch] text-[25px] leading-[1.3] tracking-[-0.025em] sm:text-[32px]"
            style={{ fontFamily: 'var(--font-editorial)' }}
          >
            <span aria-hidden="true">“</span>
            <HighlightedQuote
              quote={testimonial.quote}
              highlightedText={testimonial.highlightedText}
              tone="inverse"
            />
            <span aria-hidden="true">”</span>
          </p>
        </blockquote>

        <figcaption className="mt-10">
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

function SupportingStory({
  testimonial,
  index,
  className,
}: {
  testimonial: UxTestimonial;
  index: number;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        'flex min-h-[300px] flex-col justify-between gap-10 bg-[var(--color-surface)] p-7 text-[var(--color-text)] sm:p-9 lg:min-h-0',
        className,
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <CompanyMark company={testimonial.company} />
          <span className="font-mono text-[11px] tabular-nums text-[var(--color-muted)]">
            {String(index).padStart(2, '0')}
          </span>
        </div>

        <blockquote className="mt-8">
          <p className="text-[18px] leading-[1.48] tracking-[-0.015em] sm:text-[21px]">
            <span aria-hidden="true">“</span>
            <HighlightedQuote
              quote={testimonial.quote}
              highlightedText={testimonial.highlightedText}
            />
            <span aria-hidden="true">”</span>
          </p>
        </blockquote>
      </div>

      <figcaption className="flex flex-col gap-5 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:items-end sm:justify-between">
        <Byline
          name={testimonial.authorName}
          position={testimonial.authorPosition}
          image={testimonial.authorImage}
          size="sm"
        />
        {testimonial.metric && (
          <p className="shrink-0 sm:text-right">
            <strong className="block text-[22px] font-semibold leading-none tracking-[-0.03em] text-[var(--color-primary)] tabular-nums">
              {testimonial.metric.value}
            </strong>
            <span className="mt-1 block max-w-[20ch] text-[10px] leading-[1.35] text-[var(--color-muted)] sm:max-w-[15ch]">
              {testimonial.metric.label}
            </span>
          </p>
        )}
      </figcaption>
    </figure>
  );
}
