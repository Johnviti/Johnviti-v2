import { useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';

type Props = {
  /** Verdadeiro enquanto o ponteiro está sobre um tile. */
  visible: boolean;
};

/**
 * Etiqueta mínima "ver projeto →" que acompanha o cursor na galeria.
 *
 * Aparece no hover de um tile e persegue o mouse com amortecimento leve
 * (posição escrita direto no DOM, sem re-render a 60fps).
 */
export default function ProjectCursor({ visible }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const eased = { ...pointer };
    let started = false;
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!started) {
        started = true;
        eased.x = pointer.x;
        eased.y = pointer.y;
      }
    };

    const tick = () => {
      const k = reduced ? 1 : 0.22;
      eased.x += (pointer.x - eased.x) * k;
      eased.y += (pointer.y - eased.y) * k;
      root.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 hidden will-change-transform [@media(pointer:fine)]:block"
    >
      <div
        className="flex origin-top-left items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-white backdrop-blur-md transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          marginLeft: 18,
          marginTop: 14,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(4px) scale(0.96)',
        }}
      >
        <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] text-white">
          {t('gallery.viewProject')}
        </span>
        <span aria-hidden className="relative flex h-2.5 w-4 items-center overflow-hidden text-white">
          {[0, 0.28].map((delay) => (
            <svg
              key={delay}
              viewBox="0 0 8 12"
              className="animate-cursor-chevron absolute left-1 h-2 w-1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animationDelay: `${delay}s` }}
            >
              <path d="M1.5 1.5 6 6l-4.5 4.5" />
            </svg>
          ))}
        </span>
      </div>
    </div>
  );
}
