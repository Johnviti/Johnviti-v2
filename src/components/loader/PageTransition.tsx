import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { labelForPath } from './routeLabels';

/**
 * Loader de transição entre páginas.
 *
 * O site navega com `<a href>` (full reload), então a transição acontece em
 * duas metades: este componente intercepta o clique em links internos, cobre
 * a tela com uma cortina dupla (acento + ink) e só então navega; na chegada,
 * o Preloader (variante rápida) faz o reveal — o label do destino viaja via
 * sessionStorage para manter a continuidade visual.
 *
 * Links com `data-no-transition`, target, download, âncoras e cliques com
 * modificadores são ignorados.
 */

const PageTransition = () => {
  const [label, setLabel] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const targetRef = useRef<string | null>(null);
  const navigatingRef = useRef(false);

  /* Intercepta cliques em links internos. */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!anchor) return;
      if (anchor.hasAttribute('data-no-transition')) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (!/^https?:$/.test(url.protocol)) return;
      /* Mesma página (com ou sem âncora) — deixa o comportamento nativo. */
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();
      if (navigatingRef.current) return;
      navigatingRef.current = true;

      const destination = labelForPath(url.pathname);
      try {
        sessionStorage.setItem('ja:transition-label', destination);
      } catch {
        /* sessionStorage indisponível — segue sem continuidade de label */
      }
      targetRef.current = url.href;
      setLabel(destination);
    };

    /* bfcache: se o usuário voltar, a página restaurada não pode ficar coberta. */
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      navigatingRef.current = false;
      targetRef.current = null;
      setLabel(null);
      if (rootRef.current)
        gsap.set(rootRef.current, { autoAlpha: 0, pointerEvents: 'none' });
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  /* Anima a cobertura e navega ao terminar. */
  useEffect(() => {
    if (!label) return;
    const go = () => {
      if (targetRef.current) window.location.href = targetRef.current;
    };

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const ctx = gsap.context(() => {
      gsap.set(rootRef.current, { autoAlpha: 1, pointerEvents: 'auto' });

      if (reduceMotion) {
        gsap.set([inkRef.current, accentRef.current], { yPercent: 0 });
        gsap.fromTo(
          rootRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, onComplete: go },
        );
        return;
      }

      gsap.set([inkRef.current, accentRef.current], { yPercent: 100 });
      gsap
        .timeline({ onComplete: go })
        .to(accentRef.current, {
          yPercent: 0,
          duration: 0.6,
          ease: 'power4.inOut',
        })
        .to(
          inkRef.current,
          { yPercent: 0, duration: 0.6, ease: 'power4.inOut' },
          '<0.1',
        )
        .fromTo(
          labelRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
          '-=0.25',
        )
        .to({}, { duration: 0.15 });
    });

    return () => ctx.revert();
  }, [label]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-0 z-[90] opacity-0"
    >
      {/* Acento lidera a cortina; ink cobre por cima com o label */}
      <div ref={accentRef} className="absolute inset-0 bg-cream-soft" />
      <div
        ref={inkRef}
        className="absolute inset-0 flex items-center justify-center bg-ink"
      >
        <p
          ref={labelRef}
          className="text-[11px] tracking-[0.35em] text-cream/80"
        >
          → {label}
        </p>
      </div>
    </div>
  );
};

export default PageTransition;
