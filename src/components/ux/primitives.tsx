import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------- Container */

/** Grid editorial de 12 colunas (8 no tablet, 4 no mobile) com largura máxima. */
export function Container({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'article';
}) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[var(--container-max)] px-5 md:px-10 lg:px-20',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Grade de 12 colunas — os filhos usam `col-span-*` nos breakpoints. */
export function Grid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-4 gap-4 md:grid-cols-8 md:gap-5 lg:grid-cols-12 lg:gap-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- Eyebrow */

/** Texto técnico pequeno em caixa alta — usado como etiqueta de seção. */
export function Eyebrow({
  children,
  className,
  tone = 'muted',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'muted' | 'primary' | 'inverse';
}) {
  return (
    <span
      className={cn(
        'inline-block text-[11px] font-medium uppercase tracking-[0.16em]',
        tone === 'muted' && 'text-[var(--color-muted)]',
        tone === 'primary' && 'text-[var(--color-primary)]',
        tone === 'inverse' && 'text-[var(--color-ink-muted)]',
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- Tag */

export function Tag({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'primary' | 'inverse';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-medium leading-none',
        tone === 'default' &&
          'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]',
        tone === 'primary' &&
          'border-transparent bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
        tone === 'inverse' &&
          'border-[var(--color-ink-border)] bg-transparent text-[var(--color-ink-muted)]',
      )}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- Button */

const buttonBase =
  'group/btn inline-flex items-center justify-center gap-2 rounded-full text-[14px] font-medium leading-none transition-[background-color,color,border-color,transform] duration-200 disabled:cursor-not-allowed disabled:opacity-45';

const buttonSizes = {
  md: 'min-h-[44px] px-5',
  lg: 'min-h-[52px] px-7 text-[15px]',
  sm: 'min-h-[36px] px-4 text-[13px]',
} as const;

const buttonVariants = {
  primary:
    'bg-[var(--color-text)] text-white hover:bg-[var(--color-primary)] active:translate-y-px',
  secondary:
    'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-text)] active:translate-y-px',
  ghost: 'text-[var(--color-text)] hover:bg-black/[0.04]',
  inverse:
    'bg-white text-[var(--color-ink)] hover:bg-white/90 active:translate-y-px',
} as const;

type ButtonVisualProps = {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  /** Seta que desliza no hover — para links de "ver mais". */
  arrow?: boolean;
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  arrow,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonVisualProps & { children: ReactNode }) {
  return (
    <button
      className={cn(buttonBase, buttonSizes[size], buttonVariants[variant], className)}
      {...props}
    >
      {children}
      {arrow && <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  variant = 'primary',
  size = 'md',
  arrow,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & ButtonVisualProps & { children: ReactNode }) {
  return (
    <a
      className={cn(buttonBase, buttonSizes[size], buttonVariants[variant], className)}
      {...props}
    >
      {children}
      {arrow && (
        <ArrowUpRight
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        />
      )}
    </a>
  );
}

/* ------------------------------------------------------------- Meta list */

/** Lista de metadados (papel, duração, equipe…) em duas colunas. */
export function MetaList({
  items,
  tone = 'default',
  className,
}: {
  items: { label: string; value: ReactNode }[];
  tone?: 'default' | 'inverse';
  className?: string;
}) {
  return (
    <dl className={cn('grid grid-cols-2 gap-x-6 gap-y-6', className)}>
      {items.map((item) => (
        <div key={item.label}>
          <dt
            className={cn(
              'mb-2 text-[11px] font-medium uppercase tracking-[0.14em]',
              tone === 'inverse' ? 'text-[var(--color-ink-muted)]' : 'text-[var(--color-muted)]',
            )}
          >
            {item.label}
          </dt>
          <dd
            className={cn(
              'text-[14px] leading-[1.5]',
              tone === 'inverse' ? 'text-white/90' : 'text-[var(--color-text)]',
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ----------------------------------------------------------------- Rules */

export function Rule({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-[var(--color-border)]', className)} />;
}

/** Legenda discreta abaixo de imagens e diagramas. */
export function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('mt-3 text-[13px] leading-[1.5] text-[var(--color-muted)]', className)}>
      {children}
    </p>
  );
}
