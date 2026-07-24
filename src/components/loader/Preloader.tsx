import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { markPreloaderDone } from './loaderGate';
import {
  LOGO_CELLS,
  LOGO_GREEN,
  LOGO_GRID_X,
  LOGO_GRID_Y,
  LOGO_VIEWBOX,
} from './logoCells';
import PreloaderStatus from './PreloaderStatus';
import { runOndaCursor } from './preloaderVariants';

/**
 * Pré-loader global — fundo branco.
 *
 * Só na 1ª visita da sessão (`full`): cursor cria a grade e a onda monta a
 * logo. Nas navegações seguintes (galeria → case, etc.) não há véu — a troca
 * de página é direta.
 */

const FULL_MIN_DURATION = 3.2;

const IS_FIRST_VISIT = (() => {
  try {
    const seen = sessionStorage.getItem('ja:visited');
    sessionStorage.setItem('ja:visited', '1');
    return !seen;
  } catch {
    return true;
  }
})();

/** Revisitas: libera quem espera o gate sem montar o véu. */
if (!IS_FIRST_VISIT) {
  markPreloaderDone();
}

const whenAssetsReady = (maxWaitMs: number) =>
  new Promise<void>((resolve) => {
    const timeout = window.setTimeout(resolve, maxWaitMs);
    const done = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    const waitFonts = () => document.fonts.ready.then(done, done);
    if (document.readyState === 'complete') waitFonts();
    else window.addEventListener('load', waitFonts, { once: true });
  });

const Preloader = () => {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!IS_FIRST_VISIT) return;

    let cancelled = false;
    let finished = false;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(safety);
      document.body.style.overflow = prevOverflow;
      setDone(true);
      markPreloaderDone();
    };

    const safety = window.setTimeout(finish, 12000);

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<SVGElement>('[data-cell]');

      if (reduceMotion) {
        gsap.set('[data-grid]', { opacity: 1 });
        gsap.set('[data-grid-clip]', {
          attr: { x: -80, y: -80, width: 560, height: 480 },
        });
        gsap.set('[data-frame]', { opacity: 0 });
        gsap.set(cells, { opacity: 1, scale: 1 });
        gsap.fromTo(
          '[data-logo]',
          { opacity: 0, scale: 0.92, transformOrigin: '50% 50%' },
          { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' },
        );
        whenAssetsReady(4000).then(() => {
          if (cancelled) return;
          gsap.to(root, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: finish,
          });
        });
        return;
      }

      let buildDone = false;
      let assetsReady = false;
      const maybeFinish = () => {
        if (buildDone && assetsReady && !cancelled) finish();
      };

      runOndaCursor(
        root,
        () => {
          buildDone = true;
          maybeFinish();
        },
        { flyToHeader: true },
      );

      const startedAt = performance.now();
      whenAssetsReady(6000).then(() => {
        if (cancelled) return;
        const elapsed = (performance.now() - startedAt) / 1000;
        gsap.delayedCall(Math.max(0, FULL_MIN_DURATION - elapsed), () => {
          assetsReady = true;
          maybeFinish();
        });
      });
    }, root);

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      document.body.style.overflow = prevOverflow;
      ctx.revert();
    };
  }, []);

  if (!IS_FIRST_VISIT || done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex cursor-none flex-col items-center justify-center gap-8 bg-surface text-ink"
      role="status"
      aria-label="Carregando portfólio"
    >
      <svg
        viewBox={LOGO_VIEWBOX}
        className="w-[min(74vw,500px)] overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="pl-grid-clip">
            <rect data-grid-clip x={-80} y={-80} width={0} height={0} />
          </clipPath>
        </defs>

        <g data-grid clipPath="url(#pl-grid-clip)">
          {LOGO_GRID_X.map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1={-80}
              x2={x}
              y2={400}
              stroke="#8c8c8c"
              strokeOpacity={0.35}
              strokeWidth={1}
            />
          ))}
          {LOGO_GRID_Y.map((y) => (
            <line
              key={`h${y}`}
              x1={-80}
              y1={y}
              x2={480}
              y2={y}
              stroke="#8c8c8c"
              strokeOpacity={0.35}
              strokeWidth={1}
            />
          ))}
        </g>

        <rect
          data-frame
          x={-80}
          y={-80}
          width={0}
          height={0}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={1.5}
          opacity={0}
        />

        <g data-logo>
          {LOGO_CELLS.map((c, i) =>
            c.t === 'r' ? (
              <rect
                key={i}
                data-cell
                x={c.x}
                y={c.y}
                width={80}
                height={80}
                fill={LOGO_GREEN}
              />
            ) : (
              <polygon key={i} data-cell points={c.pts} fill={LOGO_GREEN} />
            ),
          )}
        </g>

        <circle
          data-ripple
          r={0}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          opacity={0}
        />
      </svg>

      <PreloaderStatus />

      <img
        data-cursor
        src="/cursors/pixel-arrow-lg.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-12 w-12"
        style={{ imageRendering: 'pixelated', opacity: 0, willChange: 'transform' }}
      />
    </div>
  );
};

export default Preloader;
