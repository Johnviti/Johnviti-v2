import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * `whileInView` depende de IntersectionObserver. Onde a API não existe, o
 * conteúdo é renderizado já visível — animação é enfeite, texto é obrigação.
 */
const canObserve = typeof IntersectionObserver !== 'undefined';

/**
 * Entrada suave dos blocos ao rolar: fade + poucos pixels de deslocamento.
 *
 * Com `prefers-reduced-motion` ativo o conteúdo aparece direto, sem transform —
 * o elemento nunca fica invisível por causa da animação.
 */
type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Atraso em segundos — use para escalonar itens de uma lista. */
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'figure';
  y?: number;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
  y = 16,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.001 : 0.4, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      initial={canObserve ? 'hidden' : 'visible'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
