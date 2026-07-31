import { cn } from '@/lib/utils';

/**
 * Card de métrica com número grande — usado na pesquisa e nos resultados.
 * `placeholder` marca visivelmente números ainda não medidos.
 */
export default function MetricCard({
  value,
  label,
  note,
  size = 'md',
  tone = 'default',
  placeholder,
  className,
}: {
  value: string;
  label: string;
  note?: string;
  size?: 'md' | 'lg';
  tone?: 'default' | 'inverse';
  placeholder?: boolean;
  className?: string;
}) {
  const inverse = tone === 'inverse';

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-[var(--radius-lg)] border p-6 md:p-7',
        inverse
          ? 'border-[var(--color-ink-border)] bg-white/[0.03]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)]',
        className,
      )}
    >
      <p
        className={cn(
          'font-semibold tracking-[-0.04em] tabular-nums',
          size === 'lg' ? 'text-[44px] leading-[1] md:text-[56px]' : 'text-[36px] leading-[1]',
          placeholder
            ? 'text-[var(--color-muted)]'
            : inverse
              ? 'text-white'
              : 'text-[var(--color-text)]',
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          'mt-3 text-[15px] leading-[1.45] font-medium',
          inverse ? 'text-white/90' : 'text-[var(--color-text)]',
        )}
      >
        {label}
      </p>
      {note && (
        <p
          className={cn(
            'mt-2 text-[13px] leading-[1.5]',
            inverse ? 'text-[var(--color-ink-muted)]' : 'text-[var(--color-muted)]',
          )}
        >
          {note}
        </p>
      )}
      {placeholder && (
        <p className="mt-auto pt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-warning)]">
          Métrica em coleta
        </p>
      )}
    </div>
  );
}
