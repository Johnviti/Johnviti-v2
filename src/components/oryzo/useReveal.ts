import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Anima a entrada de todos os elementos com [data-reveal] dentro do root:
 * fade + subida suave quando entram na viewport. Respeita reduced motion.
 *
 * Usa gsap.context + revert() no cleanup: kill() deixaria os estilos inline
 * de opacity 0 do `from`, e na remontagem do StrictMode a página inteira
 * ficaria invisível (animação "de 0 a 0").
 */
export function useReveal(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>(root.querySelectorAll('[data-reveal]'))
        .forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 36,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          });
        });
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
