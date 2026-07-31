import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow } from './primitives';
import Reveal from './Reveal';

/**
 * Cabeçalho padrão das seções: etiqueta técnica + título grande + texto de apoio.
 * O `level` mantém a hierarquia de headings correta em cada contexto de uso.
 */
type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  level?: 2 | 3;
  tone?: 'default' | 'inverse';
  align?: 'start' | 'between';
  action?: ReactNode;
  className?: string;
  id?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  level = 2,
  tone = 'default',
  align = 'start',
  action,
  className,
  id,
}: SectionHeaderProps) {
  const Heading = level === 2 ? 'h2' : 'h3';

  return (
    <Reveal
      className={cn(
        'flex flex-col gap-6',
        align === 'between' && 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="max-w-[46ch]">
        {eyebrow && (
          <Eyebrow tone={tone === 'inverse' ? 'inverse' : 'muted'} className="mb-4">
            {eyebrow}
          </Eyebrow>
        )}
        <Heading
          id={id}
          className={cn(
            'font-semibold tracking-[-0.03em]',
            level === 2
              ? 'text-[28px] leading-[1.12] sm:text-[36px]'
              : 'text-[22px] leading-[1.18] sm:text-[26px]',
            tone === 'inverse' ? 'text-white' : 'text-[var(--color-text)]',
          )}
        >
          {title}
        </Heading>
        {description && (
          <p
            className={cn(
              'mt-4 text-[16px] leading-[1.65] md:text-[17px]',
              tone === 'inverse' ? 'text-[var(--color-ink-muted)]' : 'text-[var(--color-muted)]',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
