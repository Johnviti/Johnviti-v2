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

/**
 * Variantes de transição entre páginas — DNA do pré-loader, ritmo de rota.
 * Pensadas para cobrir → (troca de conteúdo) → revelar em ~0,7–1,4s.
 */

export type PageTransitionId =
  | 'wipe-pulse'
  | 'pixel-cascade'
  | 'scan-wipe'
  | 'onda-cover'
  | 'flood-ink'
  | 'cursor-expand'
  | 'blocks-slide'
  | 'iris-logo'
  | 'blocks-fold'
  | 'blocks-swarm'
  | 'blocks-sheen'
  | 'blocks-stack';

export type PageTransitionMeta = {
  id: PageTransitionId;
  title: string;
  tag: string;
  duration: string;
  why: string;
};

export const PAGE_TRANSITIONS: PageTransitionMeta[] = [
  {
    id: 'wipe-pulse',
    title: 'Wipe + pulse',
    tag: 'produção',
    duration: '~0,9s',
    why: 'Padrão atual Galeria ↔ Contato: véu cream sobe, logo pulsa em verde→tinta e desce.',
  },
  {
    id: 'pixel-cascade',
    title: 'Cascata pixel',
    tag: 'grade',
    duration: '~1,1s',
    why: 'Células da grade cobrem a tela em stagger e abrem de novo — ecoa a montagem da marca.',
  },
  {
    id: 'scan-wipe',
    title: 'Scan wipe',
    tag: 'pixel',
    duration: '~1,0s',
    why: 'Linha de scan varre e “imprime” um véu sólido — transição com DNA de impressão.',
  },
  {
    id: 'onda-cover',
    title: 'Onda radial',
    tag: 'elegante',
    duration: '~1,0s',
    why: 'Círculo cresce do centro (cover) e encolhe de volta — limpo, sem competir com o conteúdo.',
  },
  {
    id: 'flood-ink',
    title: 'Flood ink',
    tag: 'jogo',
    duration: '~1,2s',
    why: 'Tinta preenche a tela a partir de uma semente, como o flood fill do preloader.',
  },
  {
    id: 'cursor-expand',
    title: 'Cursor expande',
    tag: 'narrativa',
    duration: '~1,3s',
    why: 'A seta pixel “clica” e abre um retângulo de grade até cobrir — narrativa curta de clique.',
  },
  {
    id: 'blocks-slide',
    title: 'Blocos JA',
    tag: 'marca',
    duration: '~1,2s',
    why: 'Peças da logo entram de lados opostos, fecham o véu e saem — marca como cortina.',
  },
  {
    id: 'iris-logo',
    title: 'Íris na marca',
    tag: 'foco',
    duration: '~1,0s',
    why: 'Iris fecha no centro com a JA dentro, troca, e abre — transição cinematográfica curta.',
  },
  {
    id: 'blocks-fold',
    title: 'Blocos JA — dobra',
    tag: 'premium',
    duration: '~1,2s',
    why: 'As peças da marca dobram para dentro (linha a linha) sobre o véu e dobram para fora na saída — arquitetural e sofisticada.',
  },
  {
    id: 'blocks-swarm',
    title: 'Blocos JA — enxame',
    tag: 'moderno',
    duration: '~1,3s',
    why: 'As peças chegam dispersas, giram e se encaixam na JA; na revelação, explodem de volta — movimento com cara de produto.',
  },
  {
    id: 'blocks-sheen',
    title: 'Blocos JA — reflexo',
    tag: 'luxo',
    duration: '~1,3s',
    why: 'A JA surge do centro e uma luz diagonal varre os blocos (verde → tinta), como reflexo em metal escovado.',
  },
  {
    id: 'blocks-stack',
    title: 'Blocos JA — elevação',
    tag: 'editorial',
    duration: '~1,2s',
    why: 'Os blocos sobem em camadas para montar a JA e continuam subindo para revelar — leitura calma e cara.',
  },
];

type StageProps = {
  variant: PageTransitionId;
  /** Chamado no meio (tela coberta) — hora de trocar o “destino”. */
  onCovered?: () => void;
  onDone: () => void;
};

const cellCenter = (c: LogoCell) => {
  if (c.t === 'r') return { x: c.x + 40, y: c.y + 40 };
  return { x: c.cx, y: c.cy };
};

const byDistanceFromCenter = () =>
  LOGO_CELLS.map((c, i) => ({
    i,
    d: Math.hypot(cellCenter(c).x - 200, cellCenter(c).y - 160),
  })).sort((a, b) => a.d - b.d);

const CURSOR_SRC = '/cursors/pixel-arrow-lg.png';
const CURSOR_TIP = { x: 5, y: 0 };

const q = (root: HTMLElement, sel: string) =>
  root.querySelectorAll(sel) as NodeListOf<HTMLElement | SVGElement>;

const callCover = (onCovered: (() => void) | undefined) => {
  onCovered?.();
};

/* ─── runners ─────────────────────────────────────────────── */

const runWipePulse = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const veil = root.querySelector<HTMLElement>('[data-veil]');
  const logo = root.querySelector<SVGElement>('[data-logo]');
  const cells = [...q(root, '[data-cell]')];
  if (!veil || !logo) {
    onDone();
    return;
  }

  gsap.set(veil, { yPercent: 100 });
  gsap.set(logo, { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' });
  gsap.set(cells, { fill: LOGO_GREEN });

  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(veil, { yPercent: 0, duration: 0.38, ease: 'power3.inOut' })
    .to(logo, { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }, '-=0.08')
    .to(
      cells,
      { fill: LOGO_INK, duration: 0.28, stagger: 0.012, ease: 'power2.inOut' },
      '-=0.05',
    )
    .call(() => callCover(onCovered))
    .to(logo, { opacity: 0, scale: 0.94, duration: 0.2, ease: 'power2.in' }, '+=0.08')
    .to(veil, { yPercent: -100, duration: 0.4, ease: 'power3.inOut' }, '-=0.05');
};

const runPixelCascade = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const tiles = [...q(root, '[data-tile]')];
  if (!tiles.length) {
    onDone();
    return;
  }

  gsap.set(tiles, { scaleY: 0, transformOrigin: '50% 0%' });

  const cols = 8;
  const rows = Math.ceil(tiles.length / cols);
  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(tiles, {
    scaleY: 1,
    duration: 0.32,
    ease: 'power2.out',
    stagger: {
      each: 0.018,
      from: 'start',
      grid: [rows, cols],
    },
  })
    .call(() => callCover(onCovered))
    .to(
      tiles,
      {
        scaleY: 0,
        duration: 0.34,
        ease: 'power2.in',
        transformOrigin: '50% 100%',
        stagger: {
          each: 0.016,
          from: 'end',
          grid: [rows, cols],
        },
      },
      '+=0.12',
    );
};

const runScanWipe = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const scan = root.querySelector<HTMLElement>('[data-scan]');
  const veil = root.querySelector<HTMLElement>('[data-veil]');
  if (!scan || !veil) {
    onDone();
    return;
  }

  gsap.set(scan, { yPercent: -100, opacity: 1 });
  gsap.set(veil, { clipPath: 'inset(0 0 100% 0)' });

  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(scan, { yPercent: 0, duration: 0.45, ease: 'none' }, 0)
    .to(veil, { clipPath: 'inset(0 0 0% 0)', duration: 0.45, ease: 'none' }, 0)
    .to(scan, { opacity: 0, duration: 0.15 }, '-=0.05')
    .call(() => callCover(onCovered))
    .set(scan, { yPercent: 0, opacity: 1 })
    .to(scan, { yPercent: 100, duration: 0.42, ease: 'none' }, '+=0.1')
    .to(
      veil,
      { clipPath: 'inset(100% 0 0 0)', duration: 0.42, ease: 'none' },
      '<',
    )
    .to(scan, { opacity: 0, duration: 0.12 }, '-=0.08');
};

const runOndaCover = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const circle = root.querySelector<HTMLElement>('[data-circle]');
  const logo = root.querySelector<SVGElement>('[data-logo]');
  const cells = [...q(root, '[data-cell]')];
  if (!circle) {
    onDone();
    return;
  }

  gsap.set(circle, { scale: 0, transformOrigin: '50% 50%' });
  if (logo) gsap.set(logo, { opacity: 0, scale: 0.85 });
  gsap.set(cells, { fill: LOGO_GREEN });

  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(circle, { scale: 1, duration: 0.48, ease: 'power3.inOut' });
  if (logo) {
    tl.to(logo, { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' }, '-=0.18');
    const order = byDistanceFromCenter();
    order.forEach(({ i }, step) => {
      tl.fromTo(
        cells[i],
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.6)' },
        0.28 + step * 0.028,
      );
    });
  }
  tl.call(() => callCover(onCovered))
    .to(logo, { opacity: 0, duration: 0.18 }, '+=0.06')
    .to(circle, { scale: 0, duration: 0.42, ease: 'power3.inOut' }, '-=0.04');
};

const runFloodInk = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const blobs = [...q(root, '[data-blob]')];
  if (!blobs.length) {
    onDone();
    return;
  }

  gsap.set(blobs, { scale: 0, opacity: 1, transformOrigin: '50% 50%' });

  const tl = gsap.timeline({ onComplete: onDone });

  const blobDist = blobs
    .map((_, i) => {
      const cols = 6;
      const r = Math.floor(i / cols);
      const c = i % cols;
      return { i, d: Math.hypot(r - 2.5, c - 2.5) };
    })
    .sort((a, b) => a.d - b.d);

  blobDist.forEach(({ i }, step) => {
    tl.to(
      blobs[i],
      { scale: 1.35, duration: 0.28, ease: 'power2.out' },
      step * 0.035,
    );
  });

  tl.call(() => callCover(onCovered), undefined, '+=0.08').addLabel('reveal');

  blobDist
    .slice()
    .reverse()
    .forEach(({ i }, step) => {
      tl.to(
        blobs[i],
        { scale: 0, duration: 0.26, ease: 'power2.in' },
        `reveal+=${step * 0.03}`,
      );
    });
};

const runCursorExpand = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const cursor = root.querySelector<HTMLElement>('[data-cursor]');
  const panel = root.querySelector<HTMLElement>('[data-panel]');
  const grid = root.querySelector<HTMLElement>('[data-grid-lines]');
  const logo = root.querySelector<SVGElement>('[data-logo]');
  if (!cursor || !panel) {
    onDone();
    return;
  }

  const tip = `${CURSOR_TIP.x}px ${CURSOR_TIP.y}px`;
  gsap.set(cursor, { opacity: 0, xPercent: -50, yPercent: -50, left: '50%', top: '58%', scale: 1 });
  gsap.set(panel, {
    clipPath: 'inset(50% 50% 50% 50%)',
  });
  if (grid) gsap.set(grid, { opacity: 0 });
  if (logo) gsap.set(logo, { opacity: 0, scale: 0.9 });

  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(cursor, { opacity: 1, duration: 0.18 })
    .to(cursor, { top: '50%', duration: 0.32, ease: 'power3.out' })
    .to(cursor, { scale: 0.82, duration: 0.05, transformOrigin: tip })
    .to(cursor, { scale: 1, duration: 0.1, transformOrigin: tip, ease: 'back.out(3)' })
    .to(
      panel,
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.48,
        ease: 'power3.inOut',
      },
      '-=0.05',
    );
  if (grid) tl.to(grid, { opacity: 1, duration: 0.25 }, '-=0.35');
  if (logo) tl.to(logo, { opacity: 1, scale: 1, duration: 0.25 }, '-=0.2');

  tl.to(cursor, { opacity: 0, duration: 0.2 }, '+=0.05')
    .call(() => callCover(onCovered))
    .to(logo, { opacity: 0, duration: 0.15 }, '+=0.06')
    .to(grid, { opacity: 0, duration: 0.15 }, '<')
    .to(
      panel,
      {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.4,
        ease: 'power3.inOut',
      },
      '-=0.05',
    );
};

const runBlocksSlide = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const cells = [...q(root, '[data-cell]')];
  const veil = root.querySelector<HTMLElement>('[data-veil]');
  if (!cells.length || !veil) {
    onDone();
    return;
  }

  gsap.set(veil, { opacity: 1 });
  gsap.set(cells, {
    opacity: 0,
    x: (i) => (i % 2 === 0 ? -120 : 120),
    scale: 0.7,
    transformOrigin: '50% 50%',
    fill: LOGO_GREEN,
  });
  // Véu começa transparente via clip nas células — usamos backdrop.
  gsap.set(veil, { opacity: 0 });

  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(veil, { opacity: 1, duration: 0.25, ease: 'power2.out' })
    .to(
      cells,
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out',
        stagger: { each: 0.03, from: 'center' },
      },
      '-=0.1',
    )
    .to(
      cells,
      { fill: LOGO_INK, duration: 0.28, stagger: 0.012, ease: 'power2.inOut' },
      '-=0.1',
    )
    .call(() => callCover(onCovered))
    .to(
      cells,
      {
        opacity: 0,
        x: (i) => (i % 2 === 0 ? 100 : -100),
        scale: 0.75,
        duration: 0.32,
        ease: 'power2.in',
        stagger: { each: 0.025, from: 'edges' },
      },
      '+=0.1',
    )
    .to(veil, { opacity: 0, duration: 0.28, ease: 'power2.inOut' }, '-=0.12');
};

const runIrisLogo = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const iris = root.querySelector<HTMLElement>('[data-iris]');
  const logo = root.querySelector<SVGElement>('[data-logo]');
  const cells = [...q(root, '[data-cell]')];
  if (!iris) {
    onDone();
    return;
  }

  gsap.set(iris, {
    clipPath: 'circle(0% at 50% 50%)',
  });
  if (logo) gsap.set(logo, { opacity: 0, scale: 1.15 });
  gsap.set(cells, { fill: LOGO_GREEN });

  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(iris, {
    clipPath: 'circle(75% at 50% 50%)',
    duration: 0.45,
    ease: 'power3.inOut',
  });
  if (logo) {
    tl.to(
      logo,
      { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' },
      '-=0.25',
    );
  }
  tl.to(
    cells,
    { fill: LOGO_INK, duration: 0.25, stagger: 0.01, ease: 'power2.inOut' },
    '-=0.05',
  )
    .call(() => callCover(onCovered))
    .to(logo, { opacity: 0, scale: 0.92, duration: 0.18 }, '+=0.08')
    .to(
      iris,
      {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.4,
        ease: 'power3.inOut',
      },
      '-=0.05',
    );
};

/* Verde clareado do reflexo diagonal (variante "blocks-sheen"). */
const LOGO_SHEEN = '#DCFFE8';

/** Ordem por linha (cima→baixo, depois esq→dir) das células da marca. */
const byRow = (topFirst = true) =>
  LOGO_CELLS.map((c, i) => ({ i, y: cellCenter(c).y, x: cellCenter(c).x })).sort(
    (a, b) => (topFirst ? a.y - b.y : b.y - a.y) || a.x - b.x,
  );

/**
 * Blocos JA — dobra. O véu cobre e as peças da marca "dobram" para dentro
 * (scaleY 0→1, linha a linha) e viram tinta; na revelação dobram para fora.
 */
const runBlocksFold = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const veil = root.querySelector<HTMLElement>('[data-veil]');
  const cells = [...q(root, '[data-cell]')];
  if (!veil || !cells.length) {
    onDone();
    return;
  }

  const order = byRow(true);
  gsap.set(veil, { opacity: 0 });
  gsap.set(cells, {
    opacity: 0,
    scaleY: 0,
    transformOrigin: '50% 0%',
    fill: LOGO_GREEN,
  });

  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(veil, { opacity: 1, duration: 0.26, ease: 'power2.out' });
  order.forEach(({ i }, step) => {
    tl.to(
      cells[i],
      { opacity: 1, scaleY: 1, duration: 0.34, ease: 'back.out(1.7)' },
      0.16 + step * 0.03,
    );
  });
  tl.to(
    cells,
    { fill: LOGO_INK, duration: 0.26, stagger: 0.01, ease: 'power2.inOut' },
    '-=0.1',
  )
    .call(() => callCover(onCovered))
    .to(
      cells,
      {
        opacity: 0,
        scaleY: 0,
        transformOrigin: '50% 100%',
        duration: 0.3,
        ease: 'power2.in',
        stagger: { each: 0.022, from: 'end' },
      },
      '+=0.08',
    )
    .to(veil, { opacity: 0, duration: 0.26, ease: 'power2.inOut' }, '-=0.1');
};

/**
 * Blocos JA — enxame. As peças chegam dispersas (ângulo áureo), giram e se
 * encaixam na marca; na revelação explodem de volta para fora.
 */
const runBlocksSwarm = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const veil = root.querySelector<HTMLElement>('[data-veil]');
  const cells = [...q(root, '[data-cell]')];
  if (!veil || !cells.length) {
    onDone();
    return;
  }

  gsap.set(veil, { opacity: 0 });
  cells.forEach((cell, i) => {
    const angle = (i * 137.5 * Math.PI) / 180;
    const dist = 140 + (i % 5) * 40;
    gsap.set(cell, {
      opacity: 0,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      rotation: (i % 2 ? 1 : -1) * (30 + (i % 3) * 14),
      scale: 0.5,
      transformOrigin: '50% 50%',
      fill: LOGO_GREEN,
    });
  });

  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(veil, { opacity: 1, duration: 0.26, ease: 'power2.out' })
    .to(
      cells,
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out',
        stagger: { each: 0.03, from: 'center' },
      },
      '-=0.08',
    )
    .to(
      cells,
      { fill: LOGO_INK, duration: 0.26, stagger: 0.01, ease: 'power2.inOut' },
      '-=0.15',
    )
    .call(() => callCover(onCovered))
    .to(
      cells,
      {
        opacity: 0,
        x: (i: number) => Math.cos((i * 137.5 * Math.PI) / 180) * 170,
        y: (i: number) => Math.sin((i * 137.5 * Math.PI) / 180) * 170,
        rotation: (i: number) => (i % 2 ? -1 : 1) * 44,
        scale: 0.5,
        duration: 0.4,
        ease: 'power2.in',
        stagger: { each: 0.02, from: 'edges' },
      },
      '+=0.08',
    )
    .to(veil, { opacity: 0, duration: 0.24 }, '-=0.15');
};

/**
 * Blocos JA — reflexo. A marca surge do centro e uma luz diagonal varre os
 * blocos (verde → tinta), como reflexo em metal escovado, antes de revelar.
 */
const runBlocksSheen = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const veil = root.querySelector<HTMLElement>('[data-veil]');
  const cells = [...q(root, '[data-cell]')];
  if (!veil || !cells.length) {
    onDone();
    return;
  }

  const order = byDistanceFromCenter();
  gsap.set(veil, { opacity: 0 });
  gsap.set(cells, {
    opacity: 0,
    scale: 0.9,
    transformOrigin: '50% 50%',
    fill: LOGO_GREEN,
  });

  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(veil, { opacity: 1, duration: 0.26, ease: 'power2.out' });
  order.forEach(({ i }, step) => {
    tl.to(
      cells[i],
      { opacity: 1, scale: 1, duration: 0.26, ease: 'power2.out' },
      0.12 + step * 0.022,
    );
  });

  // Varredura diagonal (sup. esq. → inf. dir.), normalizada por (cx + cy).
  const diag = LOGO_CELLS.map((c) => cellCenter(c).x + cellCenter(c).y);
  const min = Math.min(...diag);
  const span = Math.max(...diag) - min || 1;
  const sweepAt = tl.duration() + 0.02;
  LOGO_CELLS.forEach((c, i) => {
    const at =
      sweepAt + ((cellCenter(c).x + cellCenter(c).y - min) / span) * 0.7;
    tl.to(cells[i], { fill: LOGO_SHEEN, duration: 0.14, ease: 'sine.out' }, at);
    tl.to(cells[i], { fill: LOGO_INK, duration: 0.34, ease: 'sine.in' }, at + 0.14);
  });

  tl.call(() => callCover(onCovered), undefined, '-=0.05')
    .to(
      cells,
      {
        opacity: 0,
        scale: 0.85,
        duration: 0.3,
        ease: 'power2.in',
        stagger: { each: 0.02, from: 'edges' },
      },
      '+=0.06',
    )
    .to(veil, { opacity: 0, duration: 0.26 }, '-=0.12');
};

/**
 * Blocos JA — elevação. Os blocos sobem em camadas (baixo→cima) para montar a
 * marca e continuam subindo para revelar a próxima página.
 */
const runBlocksStack = (
  root: HTMLElement,
  onCovered: (() => void) | undefined,
  onDone: () => void,
) => {
  const veil = root.querySelector<HTMLElement>('[data-veil]');
  const cells = [...q(root, '[data-cell]')];
  if (!veil || !cells.length) {
    onDone();
    return;
  }

  const order = byRow(false); // baixo→cima
  gsap.set(veil, { opacity: 0 });
  gsap.set(cells, {
    opacity: 0,
    y: 60,
    scale: 0.96,
    transformOrigin: '50% 100%',
    fill: LOGO_GREEN,
  });

  const tl = gsap.timeline({ onComplete: onDone });

  tl.to(veil, { opacity: 1, duration: 0.26, ease: 'power2.out' });
  order.forEach(({ i }, step) => {
    tl.to(
      cells[i],
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' },
      0.16 + step * 0.03,
    );
  });
  tl.to(
    cells,
    { fill: LOGO_INK, duration: 0.26, stagger: 0.01, ease: 'power2.inOut' },
    '-=0.1',
  )
    .call(() => callCover(onCovered))
    .to(
      cells,
      {
        opacity: 0,
        y: -60,
        scale: 0.96,
        duration: 0.32,
        ease: 'power2.in',
        stagger: { each: 0.022, from: 'start' },
      },
      '+=0.08',
    )
    .to(veil, { opacity: 0, duration: 0.26 }, '-=0.12');
};

const RUNNERS: Record<
  PageTransitionId,
  (
    root: HTMLElement,
    onCovered: (() => void) | undefined,
    onDone: () => void,
  ) => void
> = {
  'wipe-pulse': runWipePulse,
  'pixel-cascade': runPixelCascade,
  'scan-wipe': runScanWipe,
  'onda-cover': runOndaCover,
  'flood-ink': runFloodInk,
  'cursor-expand': runCursorExpand,
  'blocks-slide': runBlocksSlide,
  'iris-logo': runIrisLogo,
  'blocks-fold': runBlocksFold,
  'blocks-swarm': runBlocksSwarm,
  'blocks-sheen': runBlocksSheen,
  'blocks-stack': runBlocksStack,
};

/** Transições construídas a partir dos blocos da marca JA (véu + peças). */
const JA_BLOCK_VARIANTS = new Set<PageTransitionId>([
  'blocks-fold',
  'blocks-swarm',
  'blocks-sheen',
  'blocks-stack',
]);

const LogoCells = ({ fill = LOGO_GREEN }: { fill?: string }) => (
  <>
    {LOGO_CELLS.map((c, i) =>
      c.t === 'r' ? (
        <rect
          key={i}
          data-cell
          x={c.x}
          y={c.y}
          width={80}
          height={80}
          fill={fill}
        />
      ) : (
        <polygon key={i} data-cell points={c.pts} fill={fill} />
      ),
    )}
  </>
);

const MiniLogo = ({ className }: { className?: string }) => (
  <svg
    data-logo
    viewBox={LOGO_VIEWBOX}
    className={className ?? 'w-[min(42vw,220px)] overflow-visible'}
    aria-hidden
  >
    <g>
      <LogoCells />
    </g>
  </svg>
);

/** Stage overlay — remonte com `key` para repetir. */
export const PageTransitionStage = ({
  variant,
  onCovered,
  onDone,
}: StageProps) => {
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

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      onCovered?.();
      gsap.delayedCall(0.15, done);
      return;
    }

    const ctx = gsap.context(() => {
      RUNNERS[variant](root, onCovered, done);
    }, root);

    const safety = window.setTimeout(done, 8000);
    return () => {
      finished = true;
      window.clearTimeout(safety);
      ctx.revert();
    };
  }, [variant, onCovered, onDone]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
      role="presentation"
      aria-hidden
    >
      {variant === 'wipe-pulse' && (
        <div
          data-veil
          className="absolute inset-0 flex items-center justify-center bg-cream"
        >
          <MiniLogo />
        </div>
      )}

      {variant === 'pixel-cascade' && (
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
          {Array.from({ length: 48 }, (_, i) => (
            <div
              key={i}
              data-tile
              className="bg-cream"
              style={{
                backgroundColor: i % 7 === 0 ? LOGO_GREEN : undefined,
              }}
            />
          ))}
        </div>
      )}

      {variant === 'scan-wipe' && (
        <>
          <div data-veil className="absolute inset-0 bg-cream" />
          <div
            data-scan
            className="absolute inset-x-0 top-0 h-1 bg-ink"
            style={{ boxShadow: `0 0 24px 4px ${LOGO_GREEN}` }}
          />
        </>
      )}

      {variant === 'onda-cover' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            data-circle
            className="absolute aspect-square w-[150vmax] rounded-full bg-cream"
          />
          <MiniLogo className="relative z-10 w-[min(42vw,220px)] overflow-visible" />
        </div>
      )}

      {variant === 'flood-ink' && (
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-5 place-items-center gap-0 bg-transparent p-[4%]">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              data-blob
              className="aspect-square w-full max-w-[min(18vw,120px)] rounded-[28%] bg-ink"
              style={{
                backgroundColor: i % 5 === 2 ? LOGO_GREEN : LOGO_INK,
              }}
            />
          ))}
        </div>
      )}

      {variant === 'cursor-expand' && (
        <>
          <div
            data-panel
            className="absolute inset-0 flex items-center justify-center bg-cream"
          >
            <div
              data-grid-lines
              className="pointer-events-none absolute inset-0 opacity-0"
            >
              <svg className="h-full w-full" aria-hidden>
                {LOGO_GRID_X.map((x) => (
                  <line
                    key={`v${x}`}
                    x1={`${((x + 80) / 560) * 100}%`}
                    y1="0"
                    x2={`${((x + 80) / 560) * 100}%`}
                    y2="100%"
                    stroke="#ff5a5a"
                    strokeOpacity={0.14}
                  />
                ))}
                {LOGO_GRID_Y.map((y) => (
                  <line
                    key={`h${y}`}
                    x1="0"
                    y1={`${((y + 80) / 480) * 100}%`}
                    x2="100%"
                    y2={`${((y + 80) / 480) * 100}%`}
                    stroke="#ff5a5a"
                    strokeOpacity={0.14}
                  />
                ))}
              </svg>
            </div>
            <MiniLogo />
          </div>
          <img
            data-cursor
            src={CURSOR_SRC}
            alt=""
            className="pointer-events-none absolute h-12 w-12"
            style={{ imageRendering: 'pixelated', willChange: 'transform' }}
          />
        </>
      )}

      {variant === 'blocks-slide' && (
        <div
          data-veil
          className="absolute inset-0 flex items-center justify-center bg-cream"
        >
          <MiniLogo className="w-[min(52vw,280px)] overflow-visible" />
        </div>
      )}

      {variant === 'iris-logo' && (
        <div
          data-iris
          className="absolute inset-0 flex items-center justify-center bg-cream"
        >
          <MiniLogo />
        </div>
      )}

      {JA_BLOCK_VARIANTS.has(variant) && (
        <div
          data-veil
          className="absolute inset-0 flex items-center justify-center bg-cream"
        >
          <MiniLogo className="w-[min(52vw,300px)] overflow-visible" />
        </div>
      )}
    </div>
  );
};
