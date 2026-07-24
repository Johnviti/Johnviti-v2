/**
 * Geometria compartilhada da logo JA (grade 80px) — usada pelo Preloader
 * de produção e pelas variantes do laboratório em `/dev/preloader`.
 */

export const LOGO_GREEN = '#69FF91';
export const LOGO_INK = '#121210';

export type LogoCell =
  | { t: 'r'; x: number; y: number; cx: number; cy: number }
  | { t: 'p'; pts: string; cx: number; cy: number };

/** Células em ordem de montagem (cima→baixo, esq→dir). */
export const LOGO_CELLS: LogoCell[] = [
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

export const LOGO_GRID_X = [-80, 0, 80, 160, 240, 320, 400, 480];
export const LOGO_GRID_Y = [-80, 0, 80, 160, 240, 320, 400];

/** viewBox do SVG de montagem (com margem para o grid). */
export const LOGO_VIEWBOX = '-80 -80 560 480';
