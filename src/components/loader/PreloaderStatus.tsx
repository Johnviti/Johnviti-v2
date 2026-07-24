import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PRELOADER_LINES } from './preloaderLines';

type Props = {
  lines?: readonly string[];
  className?: string;
};

/**
 * Ticker de status abaixo da logo: frases sobem com fade, em loop.
 */
export default function PreloaderStatus({
  lines = PRELOADER_LINES,
  className = '',
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || lines.length === 0) return;

    const items = root.querySelectorAll<HTMLElement>('[data-line]');
    if (!items.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.set(items, { yPercent: 100, opacity: 0 });
    gsap.set(items[0], { yPercent: 0, opacity: 1 });

    if (reduced || lines.length === 1) return;

    const hold = 1.15;
    const move = 0.45;
    const tl = gsap.timeline({ repeat: -1 });

    for (let i = 0; i < items.length; i++) {
      const next = items[(i + 1) % items.length];
      tl.to({}, { duration: hold })
        .to(items[i], { yPercent: -100, opacity: 0, duration: move, ease: 'power2.inOut' }, '<')
        .fromTo(
          next,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: move, ease: 'power2.inOut' },
          '<',
        );
    }

    return () => {
      tl.kill();
    };
  }, [lines]);

  return (
    <div
      ref={rootRef}
      className={`relative h-5 w-[min(90vw,320px)] overflow-hidden text-center ${className}`}
      aria-live="polite"
      data-status
    >
      {lines.map((line) => (
        <p
          key={line}
          data-line
          className="absolute inset-x-0 top-0 text-[11px] font-medium uppercase tracking-[0.22em] text-ink/55"
        >
          {line}
        </p>
      ))}
    </div>
  );
}
