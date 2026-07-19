import { useEffect, useRef, useState } from 'react';
import { galleryConfig } from './galleryConfig';
import type { GalleryApp } from './three/GalleryApp';

type Props = {
  appRef: React.RefObject<GalleryApp | null>;
};

/**
 * Cursor circular vermelho com atraso suave, estados de hover/arraste e
 * leve estiramento na direção da velocidade da galeria.
 * Oculto automaticamente em dispositivos touch.
 */
export default function CustomCursor({ appRef }: Props) {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  // SPA sem SSR — seguro calcular de forma preguiçosa a partir do matchMedia.
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const cfg = galleryConfig;
    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let size = cfg.cursorSize;
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

      // Posição interpolada — pequeno atraso elástico atrás do ponteiro.
      pos.x += (mouse.x - pos.x) * 0.32 * dt60;
      pos.y += (mouse.y - pos.y) * 0.32 * dt60;

      const state = appRef.current?.state;
      const dragging = state?.dragging ?? false;
      const hovering = state?.hovering ?? false;

      const targetSize = dragging
        ? cfg.cursorDragSize
        : hovering
          ? cfg.cursorHoverSize
          : cfg.cursorSize;
      size += (targetSize - size) * 0.22 * dt60;

      // Estiramento sutil na direção do movimento da galeria.
      const vx = state?.vx ?? 0;
      const vy = state?.vy ?? 0;
      const speed = Math.hypot(vx, vy);
      const stretch = Math.min(speed * 6, 0.22);
      const angle = Math.atan2(-vy, vx);

      ring.style.transform =
        `translate3d(${pos.x - size / 2}px, ${pos.y - size / 2}px, 0) ` +
        `rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.6})`;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.opacity = visible ? (dragging ? '1' : hovering ? '0.95' : '0.75') : '0';
      ring.style.borderWidth = dragging || hovering ? '1.5px' : '1px';

      dot.style.transform = `translate3d(${pos.x - 2}px, ${pos.y - 2}px, 0)`;
      dot.style.opacity = visible && dragging ? '0.9' : '0';

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

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 rounded-full border transition-none"
        style={{
          borderColor: galleryConfig.cursorColor,
          width: galleryConfig.cursorSize,
          height: galleryConfig.cursorSize,
          opacity: 0,
          willChange: 'transform',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 h-1 w-1 rounded-full"
        style={{ backgroundColor: galleryConfig.cursorColor, opacity: 0 }}
      />
    </>
  );
}
