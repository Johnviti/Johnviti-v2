import { useEffect, useRef, useState } from 'react';
import { galleryConfig } from './galleryConfig';
import type { GalleryApp } from './three/GalleryApp';

type Props = {
  appRef: React.RefObject<GalleryApp | null>;
};

/**
 * Cursor personalizado moderno da galeria.
 *
 * - Ponto sólido preciso que acompanha o ponteiro + anel que arrasta com um
 *   leve atraso elástico (efeito "trailing ring").
 * - `mix-blend-difference`: branco que se inverte contra o fundo, ficando
 *   sempre legível sobre as capas (pretos sobre claro, claros sobre escuro).
 * - Hover em um tile: o anel cresce e mostra uma seta ("abrir"); o ponto some.
 * - Arraste: o anel encolhe e ganha um preenchimento sutil (estado "pegar").
 * - Estiramento sutil do anel na direção da velocidade da parede.
 *
 * Oculto automaticamente em dispositivos touch.
 */
export default function CustomCursor({ appRef }: Props) {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  // SPA sem SSR — seguro calcular de forma preguiçosa a partir do matchMedia.
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    const cfg = galleryConfig;
    const mouse = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    const dotPos = { x: -100, y: -100 };
    let size = cfg.cursorSize;
    let hover = 0; // 0 → 1, transição suave do estado de hover
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      visible = true;
    };
    const onLeave = () => {
      visible = false;
    };

    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);

    let last = performance.now();
    const tick = (now: number) => {
      const dt60 = Math.min((now - last) / (1000 / 60), 3);
      last = now;

      // Ponto quase preciso; anel arrasta mais devagar (trailing).
      dotPos.x += (mouse.x - dotPos.x) * 0.6 * dt60;
      dotPos.y += (mouse.y - dotPos.y) * 0.6 * dt60;
      ringPos.x += (mouse.x - ringPos.x) * 0.18 * dt60;
      ringPos.y += (mouse.y - ringPos.y) * 0.18 * dt60;

      const state = appRef.current?.state;
      const dragging = state?.dragging ?? false;
      const hovering = state?.hovering ?? false;

      const targetSize = dragging
        ? cfg.cursorDragSize
        : hovering
          ? cfg.cursorHoverSize
          : cfg.cursorSize;
      size += (targetSize - size) * 0.2 * dt60;
      hover += ((hovering ? 1 : 0) - hover) * 0.2 * dt60;

      // Estiramento sutil do anel na direção do movimento da parede.
      const vx = state?.vx ?? 0;
      const vy = state?.vy ?? 0;
      const speed = Math.hypot(vx, vy);
      const stretch = Math.min(speed * 6, 0.18);
      const angle = Math.atan2(-vy, vx);

      // Anel
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.transform =
        `translate3d(${ringPos.x - size / 2}px, ${ringPos.y - size / 2}px, 0) ` +
        `rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.6})`;
      ring.style.opacity = visible
        ? dragging
          ? '1'
          : hovering
            ? '1'
            : '0.72'
        : '0';
      ring.style.borderWidth = dragging ? '1.5px' : '1.25px';
      ring.style.backgroundColor = dragging
        ? 'rgba(255,255,255,0.16)'
        : `rgba(255,255,255,${0.12 * hover})`;

      // Seta ("abrir") — surge no hover, sempre na vertical, centrada no anel.
      label.style.transform =
        `translate3d(${ringPos.x - 12}px, ${ringPos.y - 12}px, 0) ` +
        `scale(${0.6 + 0.4 * hover})`;
      label.style.opacity = visible ? `${hover}` : '0';

      // Ponto preciso — some no hover (a seta assume) e no arraste.
      dot.style.transform = `translate3d(${dotPos.x - 3}px, ${dotPos.y - 3}px, 0)`;
      dot.style.opacity =
        visible && !hovering && !dragging ? '1' : `${Math.max(0, 0.9 - hover)}`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, appRef]);

  if (!enabled) return null;

  const color = galleryConfig.cursorColor;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 mix-blend-difference">
      {/* Anel que arrasta */}
      <div
        ref={ringRef}
        aria-hidden
        className="absolute left-0 top-0 rounded-full border"
        style={{
          borderColor: color,
          width: galleryConfig.cursorSize,
          height: galleryConfig.cursorSize,
          opacity: 0,
          willChange: 'transform, width, height',
        }}
      />

      {/* Seta "abrir" (hover) */}
      <div
        ref={labelRef}
        aria-hidden
        className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center text-[15px] font-medium leading-none"
        style={{ color, opacity: 0, willChange: 'transform, opacity' }}
      >
        ↗
      </div>

      {/* Ponto preciso */}
      <div
        ref={dotRef}
        aria-hidden
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color, opacity: 0, willChange: 'transform' }}
      />
    </div>
  );
}
