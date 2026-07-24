import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  label: string;
  children: ReactNode;
  className?: string;
  /** Lado do popup em relação ao gatilho. */
  side?: 'top' | 'bottom';
};

/**
 * Tooltip de ação para ícones / botões flutuantes.
 * Renderiza no `body` (portal) para não herdar `mix-blend-difference`.
 */
export default function IconTooltip({
  label,
  children,
  className = '',
  side = 'bottom',
}: Props) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const place = () => {
    const box = anchorRef.current?.getBoundingClientRect();
    if (!box) return;
    setPos({
      x: box.left + box.width / 2,
      y: side === 'top' ? box.top - 10 : box.bottom + 10,
    });
  };

  const show = () => {
    place();
    setOpen(true);
  };

  const hide = () => setOpen(false);

  return (
    <>
      <span
        ref={anchorRef}
        className={`inline-flex ${className}`}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      {open &&
        createPortal(
          <span
            role="tooltip"
            className={`pointer-events-none fixed z-[120] -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-[11px] font-medium tracking-[0.04em] text-cream shadow-lg ${
              side === 'top' ? '-translate-y-full' : ''
            }`}
            style={{ left: pos.x, top: pos.y }}
          >
            {label}
          </span>,
          document.body,
        )}
    </>
  );
}
