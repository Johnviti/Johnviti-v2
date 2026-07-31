import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import Img from '../Img';

/**
 * Peças compartilhadas pelas variações de depoimento.
 */

/* ---------------------------------------------------------------- avatar */

const sizes = {
  sm: 'size-9 text-[12px]',
  md: 'size-12 text-[14px]',
  lg: 'size-16 text-[18px]',
} as const;

/** Iniciais do nome — no máximo duas, para caber no círculo. */
const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

/**
 * Foto da pessoa quando existir; iniciais quando não. Evita o avatar genérico
 * de silhueta, que só ocupa espaço sem informar nada.
 */
export function Avatar({
  name,
  image,
  size = 'md',
  tone = 'default',
  className,
}: {
  name: string;
  image?: string;
  size?: keyof typeof sizes;
  tone?: 'default' | 'inverse';
  className?: string;
}) {
  if (image) {
    return (
      <span
        className={cn(
          'relative block shrink-0 overflow-hidden rounded-full bg-[var(--color-border)]',
          sizes[size],
          className,
        )}
      >
        <Img src={image} alt="" fill sizes="64px" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        sizes[size],
        tone === 'inverse'
          ? 'bg-white/10 text-white'
          : 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

/* ------------------------------------------------------------ marca --- */

/**
 * Marca da empresa. Aceita um caminho de imagem (`logo`) e, na falta dele,
 * desenha uma assinatura tipográfica — nenhuma variação depende de logotipo
 * de terceiro para ficar de pé.
 */
export function CompanyMark({
  company,
  logo,
  tone = 'default',
  className,
}: {
  company: string;
  logo?: string;
  tone?: 'default' | 'inverse';
  className?: string;
}) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={company}
        loading="lazy"
        decoding="async"
        className={cn('h-6 w-auto object-contain', tone === 'inverse' && 'invert', className)}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-[13px] font-semibold tracking-[-0.01em]',
        tone === 'inverse' ? 'text-white' : 'text-[var(--color-text)]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-2 rounded-[2px]',
          tone === 'inverse' ? 'bg-white/60' : 'bg-[var(--color-primary)]',
        )}
      />
      {company}
    </span>
  );
}

/* --------------------------------------------------------------- citação */

/**
 * Fala com um trecho grifado.
 *
 * A busca é literal e case-insensitive; se `highlightedText` não aparecer na
 * fala, o texto é renderizado inteiro sem grifo — nunca some conteúdo.
 */
export function HighlightedQuote({
  quote,
  highlightedText,
  className,
  tone = 'default',
}: {
  quote: string;
  highlightedText?: string;
  className?: string;
  tone?: 'default' | 'inverse';
}) {
  if (!highlightedText) return <span className={className}>{quote}</span>;

  const index = quote.toLowerCase().indexOf(highlightedText.toLowerCase());
  if (index < 0) return <span className={className}>{quote}</span>;

  const before = quote.slice(0, index);
  const match = quote.slice(index, index + highlightedText.length);
  const after = quote.slice(index + highlightedText.length);

  return (
    <Fragment>
      <span className={className}>
        {before}
        {/* Sobre fundo escuro o branco não distingue nada do resto da fala —
            daí a cor de destaque mudar junto com o tom. */}
        <mark
          className={cn(
            'bg-transparent',
            tone === 'inverse'
              ? 'text-[var(--color-secondary)]'
              : 'text-[var(--color-primary)]',
          )}
        >
          {match}
        </mark>
        {after}
      </span>
    </Fragment>
  );
}

/* -------------------------------------------------------------- autoria */

export function Byline({
  name,
  position,
  company,
  image,
  size = 'md',
  tone = 'default',
  className,
}: {
  name: string;
  position: string;
  company?: string;
  image?: string;
  size?: keyof typeof sizes;
  tone?: 'default' | 'inverse';
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3.5', className)}>
      <Avatar name={name} image={image} size={size} tone={tone} />
      <div className="min-w-0">
        <p
          className={cn(
            'text-[15px] font-semibold tracking-[-0.01em]',
            tone === 'inverse' ? 'text-white' : 'text-[var(--color-text)]',
          )}
        >
          {name}
        </p>
        <p
          className={cn(
            'mt-0.5 text-[13px] leading-[1.4]',
            tone === 'inverse' ? 'text-[var(--color-ink-muted)]' : 'text-[var(--color-muted)]',
          )}
        >
          {position}
          {company ? `, ${company}` : ''}
        </p>
      </div>
    </div>
  );
}
