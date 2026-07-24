import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  LOGO_CELLS,
  LOGO_GREEN,
  LOGO_GRID_X,
  LOGO_GRID_Y,
  LOGO_INK,
  LOGO_VIEWBOX,
  type LogoCell,
} from '@/components/loader/logoCells';
import PreloaderStatus from '@/components/loader/PreloaderStatus';

export type PreloaderVariantId =
  | 'atual'
  | 'pixel-cursor'
  | 'onda'
  | 'onda-cursor'
  | 'scanline'
  | 'flood'
  | 'minimal'
  | 'prism'
  | 'assemble'
  | 'elevate'
  | 'sheen';

export type PreloaderVariantMeta = {
  id: PreloaderVariantId;
  title: string;
  tag: string;
  duration: string;
  why: string;
};

export const PRELOADER_VARIANTS: PreloaderVariantMeta[] = [
  {
    id: 'atual',
    title: 'Atual — montagem com cursor',
    tag: 'baseline',
    duration: '~3,5s',
    why: 'A versão em produção: a seta pixel clica cada bloco na grade e a logo voa para o canto.',
  },
  {
    id: 'pixel-cursor',
    title: 'Cursor pixel (rápido)',
    tag: 'marca',
    duration: '~3,2s',
    why: 'Mesma seta pixel, ritmo um pouco mais ágil — útil para comparar timing.',
  },
  {
    id: 'onda',
    title: 'Onda a partir do centro',
    tag: 'elegante',
    duration: '~2,0s',
    why: 'Remove o cursor (que compete com a marca) e revela as peças em ripple radial — mais rápido e limpo.',
  },
  {
    id: 'onda-cursor',
    title: 'Criação da grade → onda',
    tag: 'narrativa',
    duration: '~3,4s',
    why: 'Como no Figma: o cursor planta uma célula e arrasta o canto SE até a grade nascer; depois a onda radial monta a logo.',
  },
  {
    id: 'scanline',
    title: 'Scanline',
    tag: 'pixel',
    duration: '~2,2s',
    why: 'Uma linha varre a grade e “imprime” as células — reforça o DNA pixel sem narrativa de clique.',
  },
  {
    id: 'flood',
    title: 'Flood fill',
    tag: 'jogo',
    duration: '~2,4s',
    why: 'A marca cresce como tinta a partir de uma semente — sensação de construção viva.',
  },
  {
    id: 'minimal',
    title: 'Minimal pulse',
    tag: 'rápido',
    duration: '~1,2s',
    why: 'Logo completa, pulso verde → tinta, sem grade. Ideal para revisitas / quick load.',
  },
  {
    id: 'prism',
    title: 'Flip 3D — prisma',
    tag: 'premium',
    duration: '~2,0s',
    why: 'Cada bloco vira como um cartão, do centro para as bordas — profundidade e sofisticação, sem grade nem cursor.',
  },
  {
    id: 'assemble',
    title: 'Convergência',
    tag: 'moderno',
    duration: '~2,2s',
    why: 'As peças chegam dispersas, giram e se encaixam no lugar — precisão e movimento com cara de produto premium.',
  },
  {
    id: 'elevate',
    title: 'Camadas em elevação',
    tag: 'editorial',
    duration: '~1,9s',
    why: 'Os blocos sobem em camadas, de cima para baixo, com timing suave e limpo — leitura calma e cara.',
  },
  {
    id: 'sheen',
    title: 'Brilho — sheen',
    tag: 'luxo',
    duration: '~2,3s',
    why: 'A marca surge e uma luz diagonal varre os blocos, como reflexo em metal escovado — acabamento premium.',
  },
];

type StageProps = {
  variant: PreloaderVariantId;
  onDone: () => void;
};

const LogoCells = ({ cells = LOGO_CELLS }: { cells?: LogoCell[] }) => (
  <>
    {cells.map((c, i) =>
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
  </>
);

const GridLines = () => (
  <>
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
  </>
);

const cellCenter = (c: LogoCell) => {
  if (c.t === 'r') return { x: c.x + 40, y: c.y + 40 };
  return { x: c.cx, y: c.cy };
};

const byDistanceFromCenter = () =>
  LOGO_CELLS.map((c, i) => ({
    i,
    d: Math.hypot(cellCenter(c).x - 200, cellCenter(c).y - 160),
  })).sort((a, b) => a.d - b.d);

const neighborOrder = (): number[] => {
  const centers = LOGO_CELLS.map(cellCenter);
  const visited = new Set<number>();
  const order: number[] = [];
  let seed = 0;
  let best = Infinity;
  centers.forEach((p, i) => {
    const d = Math.hypot(p.x - 200, p.y - 160);
    if (d < best) {
      best = d;
      seed = i;
    }
  });
  const queue = [seed];
  visited.add(seed);
  while (queue.length) {
    const cur = queue.shift()!;
    order.push(cur);
    const c = centers[cur];
    centers.forEach((p, i) => {
      if (visited.has(i)) return;
      const dx = Math.abs(p.x - c.x);
      const dy = Math.abs(p.y - c.y);
      if ((dx < 20 && dy > 60 && dy < 100) || (dy < 20 && dx > 60 && dx < 100)) {
        visited.add(i);
        queue.push(i);
      }
    });
  }
  LOGO_CELLS.forEach((_, i) => {
    if (!visited.has(i)) order.push(i);
  });
  return order;
};

const q = (root: HTMLElement, sel: string) =>
  root.querySelectorAll(sel) as NodeListOf<SVGElement>;

/** Tinta da marca no tema ativo (`--color-ink` inverte no dark). */
const resolveThemeInk = () => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-ink')
    .trim();
  return value || LOGO_INK;
};

const settleAndExit = (
  root: HTMLElement,
  cells: SVGElement[],
  onDone: () => void,
  options: { flyToHeader?: boolean } = {},
) => {
  const grid = q(root, '[data-grid]');
  const cursor = root.querySelector<HTMLElement>('[data-cursor]');
  const frame = root.querySelector<HTMLElement>('[data-frame]');
  const status = root.querySelector<HTMLElement>('[data-status]');
  const logo = q(root, '[data-logo]');
  const svg = root.querySelector('svg');
  // No site (voo ao header) respeita o tema; no lab mantém tinta escura no fundo branco.
  const settleFill = options.flyToHeader ? resolveThemeInk() : LOGO_INK;

  const tl = gsap.timeline({
    onComplete: () => {
      if (options.flyToHeader && svg) {
        flyLogoToHeader(root, svg, cells, onDone);
      } else {
        exitRoot(root, onDone);
      }
    },
  });

  if (grid.length) tl.to(grid, { opacity: 0, duration: 0.3 }, 0);
  if (cursor) tl.to(cursor, { opacity: 0, duration: 0.25 }, 0);
  if (frame) tl.to(frame, { opacity: 0, duration: 0.25 }, 0);
  if (status) tl.to(status, { opacity: 0, duration: 0.25 }, 0);

  tl.to(
    cells,
    { fill: settleFill, duration: 0.5, ease: 'power2.inOut', stagger: 0.015 },
    0.1,
  ).to(
    logo,
    {
      scale: 1.04,
      duration: 0.18,
      yoyo: true,
      repeat: 1,
      transformOrigin: '50% 50%',
      ease: 'sine.inOut',
    },
    0.15,
  );
};

/** Leva a logo montada até o monograma do header (canto superior). */
const flyLogoToHeader = (
  root: HTMLElement,
  svg: SVGSVGElement,
  cells: SVGElement[],
  onDone: () => void,
) => {
  const logoGroup = root.querySelector<SVGGElement>('[data-logo]');
  if (!logoGroup) {
    exitRoot(root, onDone);
    return;
  }

  const headerLogo = document.querySelector('svg[aria-label="John Amorim"]');
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

  const svgRect = svg.getBoundingClientRect();
  const logoRect = logoGroup.getBoundingClientRect();
  const scale = th / Math.max(logoRect.height, 1);
  const dx = tcx - (svgRect.left + svgRect.width / 2);
  const dy = tcy - (svgRect.top + svgRect.height / 2);

  gsap.to(cells, {
    fill: resolveThemeInk(),
    duration: 0.35,
    ease: 'power2.inOut',
  });
  gsap.to(svg, {
    x: dx,
    y: dy,
    scale,
    transformOrigin: '50% 50%',
    duration: 0.85,
    ease: 'power3.inOut',
    onComplete: () => exitRoot(root, onDone),
  });
};

const exitRoot = (root: HTMLElement | null, onDone: () => void) => {
  if (!root) {
    onDone();
    return;
  }
  gsap.to(root, {
    opacity: 0,
    duration: 0.45,
    ease: 'power2.inOut',
    onComplete: onDone,
  });
};

/** Offset do tip no asset grande (96px) exibido a 48px (escala 0.5). */
const CURSOR_TIP = { x: 5, y: 0 };
const CURSOR_SRC = '/cursors/pixel-arrow-lg.png';

const mapSvgToCss = (root: HTMLElement, svg: SVGSVGElement, sx: number, sy: number) => {
  const pt = svg.createSVGPoint();
  pt.x = sx;
  pt.y = sy;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: sx, y: sy };
  const p = pt.matrixTransform(ctm);
  const box = root.getBoundingClientRect();
  return {
    x: p.x - box.left - CURSOR_TIP.x,
    y: p.y - box.top - CURSOR_TIP.y,
  };
};

const runAtual = (root: HTMLElement, onDone: () => void) => {
  const cells = [...q(root, '[data-cell]')];
  const grid = q(root, '[data-grid]');
  const cursor = root.querySelector<HTMLElement>('[data-cursor]');
  const ripple = q(root, '[data-ripple]');
  const svg = root.querySelector('svg');
  if (!cursor || !svg) {
    onDone();
    return;
  }

  const toCss = (sx: number, sy: number) => mapSvgToCss(root, svg, sx, sy);

  gsap.set(grid, { opacity: 0 });
  gsap.set(cells, { opacity: 0, scale: 0.35, transformOrigin: '50% 50%' });
  const start = toCss(200, 380);
  gsap.set(cursor, { opacity: 0, x: start.x, y: start.y });

  const tl = gsap.timeline({
    onComplete: () => settleAndExit(root, cells, onDone),
  });

  tl.to(grid, { opacity: 1, duration: 0.35, ease: 'power2.out' }).to(
    cursor,
    { opacity: 1, duration: 0.25 },
    '-=0.1',
  );

  LOGO_CELLS.forEach((c, i) => {
    const pos = toCss(c.cx, c.cy);
    tl.to(
      cursor,
      { x: pos.x, y: pos.y, duration: 0.16, ease: 'power3.inOut' },
      i === 0 ? '>' : '>-0.04',
    );
    tl.to(cursor, {
      scale: 0.82,
      duration: 0.05,
      transformOrigin: `${CURSOR_TIP.x}px ${CURSOR_TIP.y}px`,
    }).to(cursor, {
      scale: 1,
      duration: 0.1,
      transformOrigin: `${CURSOR_TIP.x}px ${CURSOR_TIP.y}px`,
      ease: 'back.out(3)',
    });
    tl.set(
      ripple,
      { attr: { cx: c.cx, cy: c.cy, r: 5 }, opacity: 0.4 },
      '<',
    ).to(
      ripple,
      { attr: { r: 40 }, opacity: 0, duration: 0.35, ease: 'power2.out' },
      '<',
    );
    tl.to(
      cells[i],
      { opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(2.2)' },
      '<0.02',
    );
  });
};

const runPixelCursor = (root: HTMLElement, onDone: () => void) => {
  const cells = [...q(root, '[data-cell]')];
  const grid = q(root, '[data-grid]');
  const cursor = root.querySelector<HTMLElement>('[data-cursor]');
  const svg = root.querySelector('svg');
  if (!cursor || !svg) {
    onDone();
    return;
  }

  const toCss = (sx: number, sy: number) => mapSvgToCss(root, svg, sx, sy);

  gsap.set(grid, { opacity: 0 });
  gsap.set(cells, { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' });
  const start = toCss(180, 360);
  gsap.set(cursor, { opacity: 0, x: start.x, y: start.y });

  const tl = gsap.timeline({
    onComplete: () => settleAndExit(root, cells, onDone),
  });

  tl.to(grid, { opacity: 1, duration: 0.3 }).to(
    cursor,
    { opacity: 1, duration: 0.2 },
    '-=0.05',
  );

  LOGO_CELLS.forEach((c, i) => {
    const pos = toCss(c.cx, c.cy);
    tl.to(
      cursor,
      { x: pos.x, y: pos.y, duration: 0.14, ease: 'power2.inOut' },
      i === 0 ? '>' : '>-0.03',
    );
    tl.to(cursor, {
      scale: 0.88,
      duration: 0.04,
      transformOrigin: `${CURSOR_TIP.x}px ${CURSOR_TIP.y}px`,
    }).to(cursor, {
      scale: 1,
      duration: 0.1,
      transformOrigin: `${CURSOR_TIP.x}px ${CURSOR_TIP.y}px`,
      ease: 'back.out(4)',
    });
    tl.to(
      cells[i],
      { opacity: 1, scale: 1, duration: 0.26, ease: 'back.out(2)' },
      '<',
    );
  });
};

const runOnda = (root: HTMLElement, onDone: () => void) => {
  const cells = [...q(root, '[data-cell]')];
  const grid = q(root, '[data-grid]');
  const order = byDistanceFromCenter();

  gsap.set(grid, { opacity: 0 });
  gsap.set(cells, { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' });

  const tl = gsap.timeline({
    onComplete: () => settleAndExit(root, cells, onDone),
  });

  tl.to(grid, { opacity: 1, duration: 0.35 });

  order.forEach(({ i }, step) => {
    tl.to(
      cells[i],
      { opacity: 1, scale: 1, duration: 0.38, ease: 'back.out(1.8)' },
      0.35 + step * 0.055,
    );
  });

  tl.to({}, { duration: 0.25 });
};

/**
 * Criação da grade estilo Figma: âncora no canto superior esquerdo do
 * viewBox da logo, cursor "puxa" o SE até revelar a grade cheia (mesmo
 * enquadramento das outras variantes — logo centrada).
 */
const GRID_CREATE_ORIGIN = { x: -80, y: -80 };

/** Estágios do arraste até a grade full (560×480 no viewBox). */
const GRID_CREATE_STAGES = [
  { w: 80, h: 80, duration: 0.22 },
  { w: 240, h: 220, duration: 0.5 },
  { w: 400, h: 360, duration: 0.65 },
  { w: 560, h: 480, duration: 0.55 },
] as const;

/** Variante narrativa — usada no lab e no pré-loader de produção. */
export const runOndaCursor = (
  root: HTMLElement,
  onDone: () => void,
  options: { flyToHeader?: boolean } = {},
) => {
  const cells = [...q(root, '[data-cell]')];
  const grid = q(root, '[data-grid]');
  const clip = root.querySelector<SVGRectElement>('[data-grid-clip]');
  const frame = root.querySelector<SVGRectElement>('[data-frame]');
  const cursor = root.querySelector<HTMLElement>('[data-cursor]');
  const ripple = q(root, '[data-ripple]');
  const svg = root.querySelector('svg');
  const order = byDistanceFromCenter();

  if (!cursor || !svg || !clip || !frame) {
    onDone();
    return;
  }

  const toCss = (sx: number, sy: number) => mapSvgToCss(root, svg, sx, sy);
  const tip = `${CURSOR_TIP.x}px ${CURSOR_TIP.y}px`;
  const { x: ox, y: oy } = GRID_CREATE_ORIGIN;

  const size = { w: 0, h: 0 };

  const syncCreate = () => {
    const { w, h } = size;
    gsap.set(clip, { attr: { x: ox, y: oy, width: w, height: h } });
    gsap.set(frame, { attr: { x: ox, y: oy, width: w, height: h } });
    const pos = toCss(ox + w, oy + h);
    gsap.set(cursor, { x: pos.x, y: pos.y });
  };

  gsap.set(grid, { opacity: 1 });
  gsap.set(frame, { opacity: 0 });
  gsap.set(cells, { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' });
  syncCreate();

  const approach = toCss(ox + 40, oy + 40);
  gsap.set(cursor, { opacity: 0, x: approach.x, y: approach.y + 80, scale: 1 });

  const tl = gsap.timeline({
    onComplete: () => settleAndExit(root, cells, onDone, options),
  });
  tl.to(cursor, { opacity: 1, duration: 0.2 })
    .to(cursor, {
      x: approach.x,
      y: approach.y,
      duration: 0.4,
      ease: 'power3.out',
    })
    .to(cursor, {
      scale: 0.82,
      duration: 0.06,
      transformOrigin: tip,
    })
    .to(cursor, {
      scale: 1,
      duration: 0.12,
      transformOrigin: tip,
      ease: 'back.out(3)',
    });

  tl.set(
    ripple,
    { attr: { cx: ox + 40, cy: oy + 40, r: 4 }, opacity: 0.4 },
    '<',
  )
    .to(
      ripple,
      { attr: { r: 32 }, opacity: 0, duration: 0.35, ease: 'power2.out' },
      '<',
    )
    .to(frame, { opacity: 1, duration: 0.15 }, '<');

  // Primeira célula; cursor vai ao handle SE e arrasta.
  tl.to(
    size,
    {
      w: GRID_CREATE_STAGES[0].w,
      h: GRID_CREATE_STAGES[0].h,
      duration: GRID_CREATE_STAGES[0].duration,
      ease: 'power2.out',
      onUpdate: syncCreate,
    },
    '<0.02',
  );

  GRID_CREATE_STAGES.slice(1).forEach((stage) => {
    tl.to(size, {
      w: stage.w,
      h: stage.h,
      duration: stage.duration,
      ease: 'power2.inOut',
      onUpdate: syncCreate,
    });
  });

  // Solta o frame; onda monta a marca.
  tl.to(frame, { opacity: 0, duration: 0.35, ease: 'power2.in' }, '+=0.08').to(
    cursor,
    { opacity: 0, duration: 0.28, ease: 'power2.in' },
    '<',
  );

  const waveAt = tl.duration();
  order.forEach(({ i }, step) => {
    tl.to(
      cells[i],
      { opacity: 1, scale: 1, duration: 0.36, ease: 'back.out(1.8)' },
      waveAt + step * 0.05,
    );
  });

  tl.to({}, { duration: 0.2 });
};

const runScanline = (root: HTMLElement, onDone: () => void) => {
  const cells = [...q(root, '[data-cell]')];
  const grid = q(root, '[data-grid]');
  const scan = q(root, '[data-scan]');

  gsap.set(grid, { opacity: 0 });
  gsap.set(cells, { opacity: 0 });
  gsap.set(scan, { opacity: 0, y: -80 });

  const rows = new Map<number, number[]>();
  LOGO_CELLS.forEach((c, i) => {
    const y = Math.round(cellCenter(c).y / 80) * 80;
    const list = rows.get(y) ?? [];
    list.push(i);
    rows.set(y, list);
  });
  const rowYs = [...rows.keys()].sort((a, b) => a - b);

  const tl = gsap.timeline({
    onComplete: () => settleAndExit(root, cells, onDone),
  });

  tl.to(grid, { opacity: 1, duration: 0.3 }).to(scan, {
    opacity: 1,
    duration: 0.2,
  });

  rowYs.forEach((y) => {
    tl.to(scan, { y, duration: 0.28, ease: 'none' });
    const idxs = rows.get(y) ?? [];
    tl.to(
      idxs.map((i) => cells[i]),
      { opacity: 1, duration: 0.18, stagger: 0.04, ease: 'power2.out' },
      '<0.05',
    );
  });

  tl.to(scan, { y: 400, opacity: 0, duration: 0.35 });
};

const runFlood = (root: HTMLElement, onDone: () => void) => {
  const cells = [...q(root, '[data-cell]')];
  const grid = q(root, '[data-grid]');
  const order = neighborOrder();

  gsap.set(grid, { opacity: 0 });
  gsap.set(cells, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' });

  const tl = gsap.timeline({
    onComplete: () => settleAndExit(root, cells, onDone),
  });

  tl.to(grid, { opacity: 1, duration: 0.3 });

  order.forEach((i, step) => {
    tl.to(
      cells[i],
      { opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(2)' },
      0.3 + step * 0.08,
    );
  });

  tl.to({}, { duration: 0.2 });
};

const runMinimal = (root: HTMLElement, onDone: () => void) => {
  const cells = [...q(root, '[data-cell]')];
  const grid = q(root, '[data-grid]');
  const logo = q(root, '[data-logo]');

  gsap.set(grid, { opacity: 0 });
  gsap.set(cells, { opacity: 1, scale: 1, fill: LOGO_GREEN });
  gsap.set(logo, { opacity: 0, scale: 0.88, transformOrigin: '50% 50%' });

  const tl = gsap.timeline({
    onComplete: () => settleAndExit(root, cells, onDone),
  });

  tl.to(logo, {
    opacity: 1,
    scale: 1,
    duration: 0.55,
    ease: 'power3.out',
  })
    .to(
      cells,
      {
        fill: LOGO_INK,
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: 0.02,
      },
      '+=0.15',
    )
    .to({}, { duration: 0.2 });
};

/* Verde clareado usado no reflexo diagonal da variante "sheen". */
const LOGO_SHEEN = '#DCFFE8';

/**
 * Flip 3D — prisma. Cada bloco "vira" (scaleX 0→1) do centro para as bordas,
 * com um leve exagero vertical na chegada. Sem grade, foco total na marca.
 */
const runPrism = (root: HTMLElement, onDone: () => void) => {
  const cells = [...q(root, '[data-cell]')];
  const grid = q(root, '[data-grid]');
  const order = byDistanceFromCenter();

  gsap.set(grid, { opacity: 0 });
  gsap.set(cells, {
    opacity: 0,
    scaleX: 0,
    scaleY: 0.82,
    transformOrigin: '50% 50%',
  });

  const tl = gsap.timeline({
    onComplete: () => settleAndExit(root, cells, onDone),
  });

  order.forEach(({ i }, step) => {
    tl.to(
      cells[i],
      {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 0.52,
        ease: 'back.out(1.7)',
      },
      0.2 + step * 0.05,
    );
  });

  tl.to({}, { duration: 0.2 });
};

/**
 * Convergência. As peças começam dispersas em torno da marca (ângulo áureo,
 * determinístico) e viajam para o lugar girando e crescendo — "particles
 * assemble" com timing caro.
 */
const runAssemble = (root: HTMLElement, onDone: () => void) => {
  const cells = [...q(root, '[data-cell]')];
  const grid = q(root, '[data-grid]');

  gsap.set(grid, { opacity: 0 });
  cells.forEach((cell, i) => {
    const angle = (i * 137.5 * Math.PI) / 180;
    const dist = 90 + (i % 5) * 24;
    gsap.set(cell, {
      opacity: 0,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      rotation: (i % 2 ? 1 : -1) * (22 + (i % 3) * 12),
      scale: 0.5,
      transformOrigin: '50% 50%',
    });
  });

  const tl = gsap.timeline({
    onComplete: () => settleAndExit(root, cells, onDone),
  });

  tl.to(cells, {
    opacity: 1,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    duration: 0.85,
    ease: 'power3.out',
    stagger: { each: 0.04, from: 'center' },
  });

  tl.to({}, { duration: 0.25 });
};

/**
 * Camadas em elevação. Os blocos sobem (y+ → 0) de cima para baixo, com um
 * leve crescimento a partir da base — leitura editorial, calma e limpa.
 */
const runElevate = (root: HTMLElement, onDone: () => void) => {
  const cells = [...q(root, '[data-cell]')];
  const grid = q(root, '[data-grid]');
  const order = LOGO_CELLS.map((c, i) => ({
    i,
    y: cellCenter(c).y,
    x: cellCenter(c).x,
  })).sort((a, b) => a.y - b.y || a.x - b.x);

  gsap.set(grid, { opacity: 0 });
  gsap.set(cells, {
    opacity: 0,
    y: 46,
    scale: 0.96,
    transformOrigin: '50% 100%',
  });

  const tl = gsap.timeline({
    onComplete: () => settleAndExit(root, cells, onDone),
  });

  order.forEach(({ i }, step) => {
    tl.to(
      cells[i],
      { opacity: 1, y: 0, scale: 1, duration: 0.62, ease: 'power3.out' },
      0.18 + step * 0.045,
    );
  });

  tl.to({}, { duration: 0.2 });
};

/**
 * Brilho — sheen. A marca surge suave a partir do centro e uma luz diagonal
 * (canto sup. esq. → inf. dir.) varre os blocos em duas passadas, como reflexo
 * em metal escovado, antes de assentar em tinta.
 */
const runSheen = (root: HTMLElement, onDone: () => void) => {
  const cells = [...q(root, '[data-cell]')];
  const grid = q(root, '[data-grid]');
  const order = byDistanceFromCenter();

  gsap.set(grid, { opacity: 0 });
  gsap.set(cells, {
    opacity: 0,
    scale: 0.92,
    transformOrigin: '50% 50%',
    fill: LOGO_GREEN,
  });

  const tl = gsap.timeline({
    onComplete: () => settleAndExit(root, cells, onDone),
  });

  order.forEach(({ i }, step) => {
    tl.to(
      cells[i],
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
      0.15 + step * 0.03,
    );
  });

  // Varredura diagonal de luz — posição normalizada por (cx + cy).
  const diag = LOGO_CELLS.map((c) => cellCenter(c).x + cellCenter(c).y);
  const min = Math.min(...diag);
  const span = Math.max(...diag) - min || 1;
  const sweepSpread = 0.9;

  for (let pass = 0; pass < 2; pass += 1) {
    const passAt = tl.duration() + 0.05 + pass * 0.02;
    LOGO_CELLS.forEach((c, i) => {
      const at =
        passAt + ((cellCenter(c).x + cellCenter(c).y - min) / span) * sweepSpread;
      tl.to(cells[i], { fill: LOGO_SHEEN, duration: 0.16, ease: 'sine.out' }, at);
      tl.to(
        cells[i],
        { fill: LOGO_GREEN, duration: 0.34, ease: 'sine.in' },
        at + 0.16,
      );
    });
  }

  tl.to({}, { duration: 0.2 });
};

const RUNNERS: Record<
  PreloaderVariantId,
  (root: HTMLElement, onDone: () => void) => void
> = {
  atual: runAtual,
  'pixel-cursor': runPixelCursor,
  onda: runOnda,
  'onda-cursor': runOndaCursor,
  scanline: runScanline,
  flood: runFlood,
  minimal: runMinimal,
  prism: runPrism,
  assemble: runAssemble,
  elevate: runElevate,
  sheen: runSheen,
};

/** Stage fullscreen — remonte com `key` para repetir. */
export const PreloaderVariantStage = ({ variant, onDone }: StageProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      onDone();
    };

    const ctx = gsap.context(() => {
      RUNNERS[variant](root, done);
    }, root);

    const safety = window.setTimeout(done, 12000);
    return () => {
      finished = true;
      window.clearTimeout(safety);
      ctx.revert();
    };
  }, [variant, onDone]);

  const showCursor =
    variant === 'atual' || variant === 'pixel-cursor' || variant === 'onda-cursor';
  const showScan = variant === 'scanline';
  const expandGrid = variant === 'onda-cursor';

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 flex cursor-none flex-col items-center justify-center gap-8 bg-white"
      role="status"
      aria-label={`Pré-visualizando variante ${variant}`}
    >
      <svg
        viewBox={LOGO_VIEWBOX}
        className="w-[min(70vw,480px)] overflow-visible"
        aria-hidden
      >
        <defs>
          <clipPath id="preloader-grid-clip">
            <rect
              data-grid-clip
              x={-80}
              y={-80}
              width={expandGrid ? 0 : 560}
              height={expandGrid ? 0 : 480}
            />
          </clipPath>
        </defs>

        <g data-grid clipPath={expandGrid ? 'url(#preloader-grid-clip)' : undefined}>
          <GridLines />
        </g>

        {expandGrid && (
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
        )}

        <g data-logo>
          <LogoCells />
        </g>

        {showScan && (
          <rect
            data-scan
            x={-80}
            y={0}
            width={560}
            height={3}
            fill={LOGO_INK}
            opacity={0}
          />
        )}

        <circle
          data-ripple
          r={0}
          fill="none"
          stroke={LOGO_INK}
          strokeWidth={2}
          opacity={0}
        />
      </svg>

      <PreloaderStatus />

      {showCursor && (
        <img
          data-cursor
          src={CURSOR_SRC}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-12 w-12"
          style={{
            imageRendering: 'pixelated',
            opacity: 0,
            willChange: 'transform',
          }}
        />
      )}
    </div>
  );
};
