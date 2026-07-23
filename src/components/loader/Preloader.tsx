import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { markPreloaderDone } from './loaderGate';

/**
 * Pré-loader global — minimalista, fundo branco.
 *
 * Um cursor "monta" a logo bloco a bloco: para cada quadrado/triângulo, o
 * cursor se desloca até a célula, dá um clique (com micro-ondulação) e a peça
 * surge com um leve overshoot, em ordem de leitura (cima→baixo, esq→dir).
 *
 * Duas variantes (decididas 1x por page load):
 * - `full`  — primeira visita: o cursor monta a logo peça a peça.
 * - `quick` — navegações seguintes (cada rota é um full reload): a logo já
 *   aparece pronta, com um fade curto.
 */

const GREEN = '#69FF91';
const INK = '#121210';

/**
 * Células da logo em ORDEM DE MONTAGEM (cima→baixo, esq→dir).
 * `t`: 'r' quadrado 80×80 | 'p' triângulo (polígono). `cx/cy`: alvo do cursor.
 */
type Cell =
  | { t: 'r'; x: number; y: number; cx: number; cy: number }
  | { t: 'p'; pts: string; cx: number; cy: number };

const CELLS: Cell[] = [
  { t: 'r', x: 80, y: 0, cx: 120, cy: 40 },
  { t: 'r', x: 160, y: 0, cx: 200, cy: 40 },
  { t: 'r', x: 240, y: 0, cx: 280, cy: 40 },
  { t: 'p', pts: '320,80 400,80 320,0', cx: 347, cy: 53 },
  { t: 'r', x: 160, y: 80, cx: 200, cy: 120 },
  { t: 'r', x: 320, y: 80, cx: 360, cy: 120 },
  { t: 'r', x: 0, y: 160, cx: 40, cy: 200 },
  { t: 'r', x: 160, y: 160, cx: 200, cy: 200 },
  { t: 'p', pts: '240,160 320,160 240,240', cx: 267, cy: 187 },
  { t: 'r', x: 320, y: 160, cx: 360, cy: 200 },
  { t: 'p', pts: '80,240 0,240 80,320', cx: 53, cy: 267 },
  { t: 'r', x: 80, y: 240, cx: 120, cy: 280 },
  { t: 'r', x: 160, y: 240, cx: 200, cy: 280 },
  { t: 'p', pts: '320,240 400,240 320,320', cx: 347, cy: 267 },
];

/** Linhas do grid (a cada 80px), com margem de uma célula ao redor da logo. */
const GRID_X = [-80, 0, 80, 160, 240, 320, 400, 480];
const GRID_Y = [-80, 0, 80, 160, 240, 320, 400];

/** Tempo mínimo (s) em tela antes da saída, por variante. */
const FULL_MIN_DURATION = 2.6;
const QUICK_MIN_DURATION = 0.5;

/** 1x por page load — imune ao duplo efeito do StrictMode em dev. */
const IS_FIRST_VISIT = (() => {
  try {
    const seen = sessionStorage.getItem('ja:visited');
    sessionStorage.setItem('ja:visited', '1');
    return !seen;
  } catch {
    return true;
  }
})();

/** Resolve quando página + fontes carregaram, com teto de segurança. */
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
  const variant = IS_FIRST_VISIT ? 'full' : 'quick';
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    // Rede de segurança: nunca deixa o app preso atrás do véu.
    const safety = window.setTimeout(finish, 9000);

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<SVGElement>('[data-cell]');

      // Saída: dissolve o véu branco. Na variante completa a logo já está no
      // lugar do header (e preta), então some sobre a logo real — sem corte.
      const exit = () => {
        if (cancelled) return;
        gsap.to(rootRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: finish,
        });
      };

      /* Estados iniciais: grid e peças escondidos, cursor fora de cena. */
      gsap.set('#pl-grid', { opacity: 0 });
      gsap.set(cells, { opacity: 0, scale: 0.35, transformOrigin: '50% 50%' });
      gsap.set('#pl-cursor', { opacity: 0, x: 200, y: 380 });

      /* ------- Modo estático (reduced motion) ou variante rápida ------- */
      if (reduceMotion || variant === 'quick') {
        gsap.set('#pl-grid', { opacity: 1 });
        gsap.set(cells, { opacity: 1, scale: 1 });
        gsap.fromTo(
          '#pl-logo',
          { opacity: 0, scale: 0.92, transformOrigin: '50% 50%' },
          { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' },
        );
        const startedAt = performance.now();
        whenAssetsReady(reduceMotion ? 4000 : 2500).then(() => {
          if (cancelled) return;
          const elapsed = (performance.now() - startedAt) / 1000;
          gsap.delayedCall(Math.max(0, QUICK_MIN_DURATION - elapsed), exit);
        });
        return;
      }

      /* -------------------- Variante completa: montagem -------------------- */
      let buildDone = false;
      let assetsReady = false;
      const maybeExit = () => {
        if (buildDone && assetsReady && !cancelled) exit();
      };

      const tl = gsap.timeline();

      // O grid aparece primeiro — a "mesa de trabalho" onde a logo é montada.
      tl.to('#pl-grid', { opacity: 1, duration: 0.4, ease: 'power2.out' }).to(
        '#pl-cursor',
        { opacity: 1, duration: 0.3, ease: 'power2.out' },
        '-=0.1',
      );

      CELLS.forEach((c, i) => {
        // 1) cursor desliza até a célula
        tl.to(
          '#pl-cursor',
          { x: c.cx, y: c.cy, duration: 0.17, ease: 'power3.inOut' },
          i === 0 ? '>' : '>-0.05',
        );
        // 2) clique — micro-pressão do cursor + onda concêntrica
        tl.to('#pl-cursor', {
          scale: 0.82,
          duration: 0.05,
          transformOrigin: '0px 0px',
          ease: 'power2.in',
        }).to('#pl-cursor', {
          scale: 1,
          duration: 0.12,
          transformOrigin: '0px 0px',
          ease: 'back.out(3)',
        });
        tl.set(
          '#pl-ripple',
          { attr: { cx: c.cx, cy: c.cy, r: 5 }, opacity: 0.4 },
          '<',
        ).to(
          '#pl-ripple',
          { attr: { r: 42 }, opacity: 0, duration: 0.4, ease: 'power2.out' },
          '<',
        );
        // 3) a peça surge com overshoot
        tl.to(
          cells[i],
          { opacity: 1, scale: 1, duration: 0.32, ease: 'back.out(2.2)' },
          '<0.02',
        );
      });

      // Assentamento final antes do voo.
      tl.to(
        '#pl-logo',
        {
          scale: 1.04,
          duration: 0.16,
          transformOrigin: '50% 50%',
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut',
        },
        '+=0.1',
      );

      /*
       * Assim que a logo está pronta, ela voa até a posição da logo no header
       * (canto superior esquerdo) e transiciona de verde para preto — emenda
       * direta com a logo real do sistema quando o véu se dissolve.
       */
      tl.call(() => {
        gsap.to('#pl-grid', { opacity: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to('#pl-cursor', { opacity: 0, duration: 0.25 });

        const svgEl = rootRef.current?.querySelector('svg');
        const logoGroup =
          rootRef.current?.querySelector<SVGGElement>('#pl-logo');
        if (!svgEl || !logoGroup) {
          buildDone = true;
          maybeExit();
          return;
        }

        // Alvo: a logo real do header, se existir; senão, o canto padrão.
        const headerLogo = document.querySelector(
          'svg[aria-label="John Amorim"]',
        );
        let tcx: number;
        let tcy: number;
        let th: number;
        if (headerLogo) {
          const r = headerLogo.getBoundingClientRect();
          tcx = r.left + r.width / 2;
          tcy = r.top + r.height / 2;
          th = r.height;
        } else {
          const md = window.innerWidth >= 768;
          th = 32;
          tcx = (md ? 32 : 24) + (th * 400) / 320 / 2;
          tcy = (md ? 28 : 24) + th / 2;
        }

        const svgRect = svgEl.getBoundingClientRect();
        const logoRect = logoGroup.getBoundingClientRect();
        const scale = th / logoRect.height;
        const dx = tcx - (svgRect.left + svgRect.width / 2);
        const dy = tcy - (svgRect.top + svgRect.height / 2);

        gsap.to(cells, { fill: INK, duration: 0.6, ease: 'power2.inOut' });
        gsap.to(svgEl, {
          x: dx,
          y: dy,
          scale,
          transformOrigin: '50% 50%',
          duration: 0.85,
          ease: 'power3.inOut',
          onComplete: () => {
            buildDone = true;
            maybeExit();
          },
        });
      });

      const startedAt = performance.now();
      whenAssetsReady(6000).then(() => {
        if (cancelled) return;
        const elapsed = (performance.now() - startedAt) / 1000;
        gsap.delayedCall(Math.max(0, FULL_MIN_DURATION - elapsed), () => {
          assetsReady = true;
          maybeExit();
        });
      });
    }, rootRef);

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      document.body.style.overflow = prevOverflow;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      role="status"
      aria-label="Carregando portfólio"
    >
      <div id="pl-content" className="flex flex-col items-center gap-10">
        <svg
          viewBox="-80 -80 560 480"
          className="w-[min(74vw,500px)] overflow-visible"
          aria-hidden="true"
        >
          {/* Grid guia — a "mesa" onde a logo é montada */}
          <g id="pl-grid">
            {GRID_X.map((x) => (
              <line
                key={`v${x}`}
                x1={x}
                y1={-80}
                x2={x}
                y2={400}
                stroke="#ff5a5a"
                strokeOpacity={0.16}
                strokeWidth={1}
              />
            ))}
            {GRID_Y.map((y) => (
              <line
                key={`h${y}`}
                x1={-80}
                y1={y}
                x2={480}
                y2={y}
                stroke="#ff5a5a"
                strokeOpacity={0.16}
                strokeWidth={1}
              />
            ))}
          </g>

          <g id="pl-logo">
            {CELLS.map((c, i) =>
              c.t === 'r' ? (
                <rect
                  key={i}
                  data-cell
                  x={c.x}
                  y={c.y}
                  width={80}
                  height={80}
                  fill={GREEN}
                />
              ) : (
                <polygon key={i} data-cell points={c.pts} fill={GREEN} />
              ),
            )}
          </g>

          {/* Onda do clique */}
          <circle
            id="pl-ripple"
            r={0}
            fill="none"
            stroke={INK}
            strokeWidth={2}
            opacity={0}
          />

          {/* Cursor — ponteiro com a ponta em (0,0) */}
          <g id="pl-cursor">
            <path
              d="M0 0 L0 28 L7.2 21 L12 32 L16 30.3 L11.3 20 L20 20 Z"
              fill={INK}
              stroke="#fff"
              strokeWidth={1.4}
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Preloader;
