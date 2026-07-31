import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Grid } from './primitives';

/**
 * Bloco editorial de duas colunas com proporções variáveis — o ritmo pedido
 * pelo case study: ora texto estreito ao lado de imagem larga, ora o inverso.
 * No tablet vira 8 colunas e no mobile empilha.
 */
const spans = {
  '4-8': ['lg:col-span-4', 'lg:col-span-8'],
  '5-7': ['lg:col-span-5', 'lg:col-span-7'],
  '6-6': ['lg:col-span-6', 'lg:col-span-6'],
  '7-5': ['lg:col-span-7', 'lg:col-span-5'],
  '8-4': ['lg:col-span-8', 'lg:col-span-4'],
  '3-9': ['lg:col-span-3', 'lg:col-span-9'],
} as const;

type EditorialGridProps = {
  ratio?: keyof typeof spans;
  left: ReactNode;
  right: ReactNode;
  /** Alinha a coluna estreita ao topo (padrão) ou centraliza verticalmente. */
  align?: 'start' | 'center';
  /** Mantém a coluna esquerda fixa durante a rolagem no desktop. */
  stickyLeft?: boolean;
  className?: string;
};

export default function EditorialGrid({
  ratio = '5-7',
  left,
  right,
  align = 'start',
  stickyLeft,
  className,
}: EditorialGridProps) {
  const [leftSpan, rightSpan] = spans[ratio];

  return (
    <Grid className={cn(align === 'center' && 'items-center', className)}>
      <div
        className={cn(
          'col-span-4 md:col-span-8',
          leftSpan,
          stickyLeft && 'lg:sticky lg:top-28 lg:self-start',
        )}
      >
        {left}
      </div>
      <div className={cn('col-span-4 md:col-span-8', rightSpan)}>{right}</div>
    </Grid>
  );
}
