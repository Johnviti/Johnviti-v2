import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type Props = {
  /** Controla o fade de saída — o pai desmonta após a transição. */
  visible: boolean;
  /** Chamado quando o overlay decide se encerrar sozinho (timeout). */
  onDismiss: () => void;
};

/**
 * Overlay de introdução da galeria: um wireframe da parede de tiles com um
 * ponto luminoso que demonstra o gesto de arrastar (a grade acompanha o
 * ponto), seguido do texto de instrução. Não captura eventos — a primeira
 * interação real do usuário na galeria é o que o dispensa.
 */

// Grade de "tijolos" maior que a moldura visível, para que as translações
// da animação nunca revelem área vazia. Gerada uma única vez (determinística).
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
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGGElement>(null);
  const dotRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const dot = dotRef.current;
    const content = contentRef.current;
    if (!grid || !dot || !content) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // gsap.context + revert(): kill() deixaria estilos inline (opacity 0,
    // transforms) que quebram a remontagem do StrictMode.
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.from(content, {
        autoAlpha: 0,
        y: 10,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Um "arraste": pressiona (encolhe), desloca ponto e grade juntos, solta.
      const loop = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.6,
        delay: 0.5,
        defaults: { ease: 'power2.inOut' },
      });
      const drag = (dx: number, dy: number) => {
        loop
          .to(dot, { scale: 0.72, duration: 0.22, ease: 'power2.out' }, '+=0.3')
          .to([grid, dot], { x: `+=${dx}`, y: `+=${dy}`, duration: 1 }, '<0.12')
          .to(dot, { scale: 1, duration: 0.28, ease: 'power2.out' }, '>-0.05');
      };
      gsap.set(dot, { transformOrigin: '50% 50%' });
      // Três gestos cujos deslocamentos somam zero — o loop volta ao início.
      drag(-46, 20);
      drag(22, -42);
      drag(24, 22);
    });

    // Se o usuário não interagir, o overlay sai sozinho.
    const timer = window.setTimeout(onDismiss, reducedMotion ? 6000 : 9500);

    return () => {
      ctx.revert();
      window.clearTimeout(timer);
    };
  }, [onDismiss]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-white/90 transition-opacity duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div ref={contentRef} className="flex flex-col items-center px-6">
        <svg
          viewBox="0 0 240 170"
          className="w-[230px] md:w-[290px]"
          fill="none"
        >
          <defs>
            <clipPath id="galeria-intro-clip">
              <rect x="21" y="21" width="198" height="128" rx="9" />
            </clipPath>
          </defs>

          {/* Grade de tiles, recortada pela moldura */}
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
                  stroke="rgba(18,18,16,0.85)"
                  strokeWidth={1.3}
                  fill="rgba(18,18,16,0.04)"
                />
              ))}
            </g>
          </g>

          {/* Moldura */}
          <rect
            x="20"
            y="20"
            width="200"
            height="130"
            rx="10"
            stroke="#121210"
            strokeWidth={2}
          />

          {/* Ponto luminoso que simula o cursor/dedo */}
          <g ref={dotRef}>
            <circle cx="120" cy="85" r="12" fill="#121210" opacity={0.14} />
            <circle cx="120" cy="85" r="8" fill="#121210" opacity={0.35} />
            <circle cx="120" cy="85" r="5" fill="#121210" opacity={0.9} />
          </g>
        </svg>

        <p className="mt-9 max-w-[300px] text-center text-[12px] leading-relaxed tracking-[0.08em] text-ink/85 md:max-w-sm md:text-[13px]">
          Arraste em qualquer direção para explorar a galeria.
        </p>
        <p className="mt-2.5 hidden text-center text-[9px] tracking-[0.22em] text-ink/45 [@media(pointer:fine)]:block">
          OU USE A RODA DO MOUSE E AS SETAS DO TECLADO
        </p>
      </div>
    </div>
  );
}
