import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  label: string;
  children: ReactNode;
  className?: string;
  /** Lado do popup em relação ao gatilho. */
  side?: 'top' | 'bottom';
  /**
   * Alinhamento horizontal do popup ao gatilho.
   * `center` (padrão) estende para os dois lados; `right` ancora a borda
   * direita do popup no gatilho (evita cortar em botões colados à direita da
   * tela); `left` ancora a borda esquerda.
   */
  align?: 'center' | 'left' | 'right';
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
  align = 'center',
}: Props) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const place = () => {
    const box = anchorRef.current?.getBoundingClientRect();
    if (!box) return;
    const x =
      align === 'right'
        ? box.right
        : align === 'left'
          ? box.left
          : box.left + box.width / 2;
    setPos({
      x,
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
            className="pointer-events-none fixed z-[120] whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-[11px] font-medium tracking-[0.04em] text-cream shadow-lg"
            style={{
              left: pos.x,
              top: pos.y,
              transform: `translate(${
                align === 'right' ? '-100%' : align === 'left' ? '0' : '-50%'
              }, ${side === 'top' ? '-100%' : '0'})`,
            }}
          >
            {label}
          </span>,
          document.body,
        )}
    </>
  );
}
