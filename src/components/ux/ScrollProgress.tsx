import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Indicador de progresso da página, fixo abaixo do header.
 * É decorativo: a informação já está na barra de rolagem do navegador.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-[65] h-[2px] origin-left bg-[var(--color-primary)]"
    />
  );
}
