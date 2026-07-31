import { cn } from '@/lib/utils';
import { profile } from '@/data/ux-portfolio';

/**
 * Monograma da marca. É SVG (e não imagem) para herdar a cor do contexto e
 * funcionar igual sobre fundo claro e escuro.
 */
export default function Logo({
  size = 32,
  className,
  tone = 'default',
}: {
  size?: number;
  className?: string;
  tone?: 'default' | 'inverse';
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[10px] font-semibold tracking-[-0.02em]',
        tone === 'inverse'
          ? 'bg-white text-[var(--color-ink)]'
          : 'bg-[var(--color-primary)] text-white',
        className,
      )}
    >
      {profile.initials}
    </span>
  );
}

/** Assinatura horizontal: monograma + nome + descritor. */
export function Wordmark({
  tone = 'default',
  className,
}: {
  tone?: 'default' | 'inverse';
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Logo size={40} tone={tone} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-[16px] font-semibold tracking-[-0.02em]',
            tone === 'inverse' ? 'text-white' : 'text-[var(--color-text)]',
          )}
        >
          {profile.name}
        </span>
        <span
          className={cn(
            'mt-1.5 text-[10px] font-medium uppercase tracking-[0.16em]',
            tone === 'inverse' ? 'text-[var(--color-ink-muted)]' : 'text-[var(--color-muted)]',
          )}
        >
          Product Designer
        </span>
      </span>
    </span>
  );
}
