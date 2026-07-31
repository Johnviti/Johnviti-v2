import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LightboxItem = {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const STEP = 0.5;

type Offset = { x: number; y: number };
const ORIGIN: Offset = { x: 0, y: 0 };

/**
 * Visualizador em tela cheia para ampliar as telas dos cases.
 *
 * Zoom pelos botões, pela roda do mouse, por `+`/`-` e por duplo clique; com a
 * imagem ampliada, arrastar move o enquadramento. As setas navegam entre as
 * telas da mesma galeria e `Esc` fecha. Renderiza em portal no `body` — o
 * wrapper carrega a classe `ux-root` para herdar os tokens do portfólio.
 */
export default function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: LightboxItem[];
  /** Índice aberto; `null` mantém o visualizador fechado. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const open = index !== null;
  const item = open ? items[index] : undefined;

  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState<Offset>(ORIGIN);

  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; from: Offset } | null>(null);
  const pointersRef = useRef(new Map<number, Offset>());
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);

  /* Mantém a imagem dentro do palco: sem zoom ela fica centrada, com zoom o
     deslocamento é limitado pela sobra de cada eixo. */
  const clamp = useCallback((next: Offset, atScale: number): Offset => {
    const stage = stageRef.current;
    const image = imageRef.current;
    if (!stage || !image) return next;

    const maxX = Math.max(0, (image.offsetWidth * atScale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (image.offsetHeight * atScale - stage.clientHeight) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  }, []);

  const zoomTo = useCallback(
    (value: number) => {
      const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(value * 100) / 100));
      setScale(nextScale);
      setOffset((current) =>
        nextScale === MIN_SCALE ? ORIGIN : clamp(current, nextScale),
      );
    },
    [clamp],
  );

  const reset = useCallback(() => {
    dragRef.current = null;
    pinchRef.current = null;
    pointersRef.current.clear();
    setScale(MIN_SCALE);
    setOffset(ORIGIN);
  }, []);

  const go = useCallback(
    (direction: 1 | -1) => {
      if (index === null || items.length < 2) return;
      reset();
      onIndexChange((index + direction + items.length) % items.length);
    },
    [index, items.length, onIndexChange, reset],
  );

  /* Estado zerado a cada abertura e a cada troca de tela. */
  useLayoutEffect(() => {
    if (open) reset();
  }, [open, index, reset]);

  /* Trava a rolagem do documento enquanto o visualizador está aberto. */
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  /* Devolve o foco ao elemento que abriu o visualizador. */
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus?.();
  }, [open]);

  /* Atalhos de teclado + foco preso no diálogo. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          go(1);
          break;
        case 'ArrowLeft':
          go(-1);
          break;
        case '+':
        case '=':
          zoomTo(scale + STEP);
          break;
        case '-':
        case '_':
          zoomTo(scale - STEP);
          break;
        case '0':
          reset();
          break;
        case 'Tab': {
          const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled])',
          );
          if (!focusable?.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          return;
        }
        default:
          return;
      }
      event.preventDefault();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, go, onClose, reset, scale, zoomTo]);

  /* Mesma convenção da galeria imersiva: Ctrl/⌘ + roda dá zoom, a roda sozinha
     move o enquadramento. Precisa de listener não passivo para poder bloquear
     tanto a rolagem quanto o zoom do navegador. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!open || !stage) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        zoomTo(scale * Math.exp(-event.deltaY * 0.0026));
        return;
      }
      if (scale > MIN_SCALE) {
        setOffset((current) =>
          clamp({ x: current.x - event.deltaX, y: current.y - event.deltaY }, scale),
        );
      }
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [open, clamp, scale, zoomTo]);

  /* Reenquadra quando a janela muda de tamanho. */
  useEffect(() => {
    if (!open) return;
    const onResize = () => setOffset((current) => clamp(current, scale));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, clamp, scale]);

  if (typeof document === 'undefined') return null;

  const zoomed = scale > MIN_SCALE;

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    /* Dois dedos: pinça. Um dedo (ou mouse) com zoom ativo: arrasto. */
    if (pointersRef.current.size === 2) {
      dragRef.current = null;
      pinchRef.current = { distance: pointerDistance(pointersRef.current), scale };
      return;
    }

    if (!zoomed) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, from: offset };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointers = pointersRef.current;
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const pinch = pinchRef.current;
    if (pinch && pointers.size === 2) {
      event.preventDefault();
      const distance = pointerDistance(pointers);
      if (pinch.distance > 0) zoomTo(pinch.scale * (distance / pinch.distance));
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    setOffset(
      clamp(
        {
          x: drag.from.x + (event.clientX - drag.x),
          y: drag.from.y + (event.clientY - drag.y),
        },
        scale,
      ),
    );
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };

  return createPortal(
    <div className="ux-root">
      <AnimatePresence>
        {open && item && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.001 : 0.2 }}
            className="fixed inset-0 z-[100] bg-[rgba(10,10,12,0.94)] backdrop-blur-sm"
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={item.title ? `Tela ampliada: ${item.title}` : 'Tela ampliada'}
              className="flex h-full flex-col"
            >
              {/* --------------------------------------------------- topo */}
              <div className="flex items-start justify-between gap-4 px-5 py-4 md:px-8">
                <div className="min-w-0">
                  {item.title && (
                    <p className="truncate text-[15px] font-medium text-white">{item.title}</p>
                  )}
                  {items.length > 1 && (
                    <p className="mt-1 font-mono text-[12px] text-[var(--color-ink-muted)]">
                      {String((index ?? 0) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                    </p>
                  )}
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="-m-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <span className="sr-only">Fechar (Esc)</span>
                  <X size={20} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>

              {/* --------------------------------------------------- palco */}
              <div
                ref={stageRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onDoubleClick={() => (zoomed ? reset() : zoomTo(2))}
                className={cn(
                  'relative flex flex-1 touch-none select-none items-center justify-center overflow-hidden px-5 md:px-16',
                  zoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in',
                )}
              >
                <img
                  ref={imageRef}
                  src={item.src}
                  alt={item.alt}
                  draggable={false}
                  className="max-h-full max-w-full object-contain will-change-transform"
                  style={{
                    transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
                    transition: dragRef.current || reduced ? 'none' : 'transform 180ms ease-out',
                  }}
                />

                {items.length > 1 && (
                  <>
                    <NavButton side="left" onClick={() => go(-1)} />
                    <NavButton side="right" onClick={() => go(1)} />
                  </>
                )}
              </div>

              {/* ----------------------------------------------- controles */}
              <div className="flex flex-col items-center gap-3 px-5 py-5 md:flex-row md:justify-between md:px-8">
                <p className="order-2 max-w-[52ch] text-center text-[13px] leading-[1.5] text-[var(--color-ink-muted)] md:order-1 md:text-left">
                  {item.caption}
                </p>

                <div className="order-1 flex items-center gap-1 rounded-full border border-[var(--color-ink-border)] bg-white/[0.06] p-1 md:order-2">
                  <ControlButton
                    label="Diminuir zoom"
                    onClick={() => zoomTo(scale - STEP)}
                    disabled={scale <= MIN_SCALE}
                  >
                    <Minus size={16} strokeWidth={1.5} aria-hidden="true" />
                  </ControlButton>
                  <span
                    aria-live="polite"
                    className="w-[4.5ch] text-center font-mono text-[12px] text-white"
                  >
                    {Math.round(scale * 100)}%
                  </span>
                  <ControlButton
                    label="Aumentar zoom"
                    onClick={() => zoomTo(scale + STEP)}
                    disabled={scale >= MAX_SCALE}
                  >
                    <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
                  </ControlButton>
                  <ControlButton label="Restaurar zoom" onClick={reset} disabled={!zoomed}>
                    <RotateCcw size={15} strokeWidth={1.5} aria-hidden="true" />
                  </ControlButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

/** Distância entre os dois primeiros ponteiros ativos — base da pinça. */
function pointerDistance(pointers: Map<number, Offset>) {
  const [a, b] = [...pointers.values()];
  if (!a || !b) return 0;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex size-10 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
    >
      <span className="sr-only">{label}</span>
      {children}
    </button>
  );
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-ink-border)] bg-black/40 text-white/85 transition-colors hover:bg-black/70 hover:text-white md:inline-flex',
        side === 'left' ? 'left-4' : 'right-4',
      )}
    >
      <span className="sr-only">{side === 'left' ? 'Tela anterior' : 'Próxima tela'}</span>
      <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}
