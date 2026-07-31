import { cn } from '@/lib/utils';
import { CompanyMark, HighlightedQuote, Byline } from './shared';

/**
 * Variação "Destaque".
 *
 * As props seguem a mesma nomenclatura dos componentes de depoimento do
 * 21st.dev (`companyLogo`, `quote`, `highlightedText`, `authorName`,
 * `authorPosition`, `authorImage`), então trocar esta implementação por uma de
 * lá é só ajustar o import.
 */
export default function TestimonialFeatured({
  companyLogo,
  company,
  quote,
  highlightedText,
  authorName,
  authorPosition,
  authorImage,
  className,
}: {
  companyLogo?: string;
  company: string;
  quote: string;
  highlightedText?: string;
  authorName: string;
  authorPosition: string;
  authorImage?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        'mx-auto w-full max-w-[720px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-12',
        className,
      )}
    >
      <CompanyMark company={company} logo={companyLogo} />

      <blockquote className="mt-8">
        <p className="text-[24px] leading-[1.35] tracking-[-0.02em] md:text-[30px]">
          <span aria-hidden="true">“</span>
          <HighlightedQuote quote={quote} highlightedText={highlightedText} />
          <span aria-hidden="true">”</span>
        </p>
      </blockquote>

      <figcaption className="mt-10 border-t border-[var(--color-border)] pt-6">
        <Byline
          name={authorName}
          position={authorPosition}
          image={authorImage}
          size="md"
        />
      </figcaption>
    </figure>
  );
}
