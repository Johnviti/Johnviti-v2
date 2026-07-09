import { useContext } from 'react';
import { LenisContext } from '../context/lenis';

export function useLenis() {
  return useContext(LenisContext);
}

/** Rola até um alvo respeitando reduced motion (fallback nativo). */
export function useScrollTo() {
  const lenisRef = useLenis();
  return (target: string | number) => {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    } else if (typeof target === 'string') {
      document.querySelector(target)?.scrollIntoView();
    } else {
      window.scrollTo(0, target);
    }
  };
}
