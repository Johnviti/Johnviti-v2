import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useI18n } from '@/lib/i18n';

type Props = {
  /** Controla o fade de saída — o pai desmonta após a transição. */
  visible: boolean;
  /** Chamado quando o overlay decide se encerrar (gesto, clique ou timeout). */
  onDismiss: () => void;
};

/**
 * Overlay de introdução da galeria: wireframe da parede + gesto de arraste
 * e texto de instrução. Bloqueia a galeria por baixo (sem hover/clique nos
 * tiles); qualquer gesto no overlay — ou o timeout — o dispensa.
 */

const BRICKS: { x: number; y: number; w: number }[] = (() => {
  const widths = [56, 40, 64, 48];
  const out: { x: number; y: number; w: number }[] = [];
  let wi = 0;
  for (let row = 0; row < 8; row++) {
    const y = -60 + row * 40;
    let x = -84 - ((row * 36) % 72);
    while (x < 340) {
      const w = widths[wi % widths.length];
      wi += 1;
      out.push({ x, y, w: w - 5 });
      x += w;
    }
  }
  return out;
})();

export default function IntroOverlay({ visible, onDismiss }: Props) {
  const { t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGGElement>(null);
  const dotRef = useRef<SVGGElement>(null);

  // Entrada suave depois do pré-loader + loop do gesto.
  useEffect(() => {
    const root = rootRef.current;
    const grid = gridRef.current;
    const dot = dotRef.current;
    const content = contentRef.current;
    if (!root || !grid || !dot || !content) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const ctx = gsap.context(() => {
      gsap.set(root, { autoAlpha: 0 });
      gsap.set(content, { y: reducedMotion ? 0 : 14, autoAlpha: 0 });

      const enter = gsap.timeline({ delay: reducedMotion ? 0 : 0.35 });
      enter
        .to(root, {
          autoAlpha: 1,
          duration: reducedMotion ? 0.01 : 1.1,
          ease: 'power2.out',
        })
        .to(
          content,
          {
            y: 0,
            autoAlpha: 1,
            duration: reducedMotion ? 0.01 : 0.85,
            ease: 'power2.out',
          },
          '-=0.65',
        );

      if (reducedMotion) return;

      const loop = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.6,
        delay: 1.2,
        defaults: { ease: 'power2.inOut' },
      });
      const drag = (dx: number, dy: number) => {
        loop
          .to(dot, { scale: 0.72, duration: 0.22, ease: 'power2.out' }, '+=0.3')
          .to([grid, dot], { x: `+=${dx}`, y: `+=${dy}`, duration: 1 }, '<0.12')
          .to(dot, { scale: 1, duration: 0.28, ease: 'power2.out' }, '>-0.05');
      };
      gsap.set(dot, { transformOrigin: '50% 50%' });
      drag(-46, 20);
      drag(22, -42);
      drag(24, 22);
    });

    const timer = window.setTimeout(onDismiss, reducedMotion ? 6000 : 10000);

    return () => {
      ctx.revert();
      window.clearTimeout(timer);
    };
  }, [onDismiss]);

  // Saída controlada pelo pai via `visible`.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || visible) return;
    gsap.to(root, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' });
  }, [visible]);

  // Qualquer gesto no overlay dispensa — e não deixa chegar na galeria.
  useEffect(() => {
    if (!visible) return;

    const dismiss = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      onDismiss();
    };

    const onKey = (event: KeyboardEvent) => {
      // Só teclas “de exploração” / Escape — não engole Tab (a11y do header).
      if (
        event.key === 'Escape' ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === ' ' ||
        event.key === 'Enter'
      ) {
        dismiss(event);
      }
    };

    const root = rootRef.current;
    root?.addEventListener('pointerdown', dismiss);
    root?.addEventListener('wheel', dismiss, { passive: false });
    window.addEventListener('keydown', onKey, true);

    return () => {
      root?.removeEventListener('pointerdown', dismiss);
      root?.removeEventListener('wheel', dismiss);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [visible, onDismiss]);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('gallery.instruction')}
      className={`fixed inset-0 z-30 flex items-center justify-center bg-surface/90 ${
        visible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ opacity: 0, visibility: 'hidden' }}
    >
      <div ref={contentRef} className="flex flex-col items-center px-6">
        <svg
          viewBox="0 0 240 170"
          className="w-[230px] text-ink md:w-[290px]"
          fill="none"
          aria-hidden
        >
          <defs>
            <clipPath id="galeria-intro-clip">
              <rect x="21" y="21" width="198" height="128" rx="9" />
            </clipPath>
          </defs>

          <g clipPath="url(#galeria-intro-clip)">
            <g ref={gridRef}>
              {BRICKS.map((b) => (
                <rect
                  key={`${b.x}-${b.y}`}
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={35}
                  rx={3}
                  stroke="currentColor"
                  strokeOpacity={0.85}
                  strokeWidth={1.3}
                  fill="currentColor"
                  fillOpacity={0.04}
                />
              ))}
            </g>
          </g>

          <rect
            x="20"
            y="20"
            width="200"
            height="130"
            rx="10"
            stroke="currentColor"
            strokeWidth={2}
          />

          <g ref={dotRef}>
            <circle cx="120" cy="85" r="12" fill="currentColor" opacity={0.14} />
            <circle cx="120" cy="85" r="8" fill="currentColor" opacity={0.35} />
            <circle cx="120" cy="85" r="5" fill="currentColor" opacity={0.9} />
          </g>
        </svg>

        <p className="mt-9 max-w-[300px] text-center text-[12px] leading-relaxed tracking-[0.08em] text-ink/85 md:max-w-sm md:text-[13px]">
          {t('gallery.instruction')}
        </p>
        <p className="mt-2.5 hidden text-center text-[9px] tracking-[0.22em] text-ink/45 [@media(pointer:fine)]:block">
          {t('gallery.instructionHint')}
        </p>
      </div>
    </div>
  );
}
