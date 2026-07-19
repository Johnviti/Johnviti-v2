/**
 * Dados das imagens da galeria.
 *
 * PARA SUBSTITUIR AS IMAGENS: troque os arquivos em /public/galeria-imersiva
 * (ou aponte `src` para qualquer URL) e ajuste `alt`. O campo `shape`
 * controla a proporção do tile:
 *  - 'square'    → 1:1
 *  - 'portrait'  → 3:4 (mais alto)
 *  - 'landscape' → 4:3 (mais largo)
 *
 * O grid repete em blocos de GRID_COLS × GRID_ROWS itens; a ordem do array
 * define a posição (linha a linha, de cima para baixo).
 */
import { caseStudies } from '@/data/cases';

export type GalleryItemShape = 'square' | 'portrait' | 'landscape';

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  shape: GalleryItemShape;
  /** Case aberto ao clicar no tile (página /case/:slug). */
  caseSlug: string;
};

export const GRID_COLS = 8;
export const GRID_ROWS = 8;

/** Quantidade de arquivos de imagem distintos em /public/galeria-imersiva. */
const IMAGE_FILES = 48;

/** Padrão de formas em sequência — mosaico irregular mas organizado. */
const SHAPE_PATTERN: GalleryItemShape[] = [
  'square', 'portrait', 'square', 'landscape', 'square', 'square', 'portrait', 'square',
  'portrait', 'square', 'square', 'square', 'landscape', 'portrait', 'square', 'square',
  'square', 'square', 'portrait', 'square', 'square', 'landscape', 'square', 'portrait',
  'landscape', 'square', 'square', 'portrait', 'square', 'square', 'square', 'square',
  'square', 'portrait', 'landscape', 'square', 'portrait', 'square', 'square', 'landscape',
  'square', 'square', 'square', 'portrait', 'square', 'square', 'landscape', 'square',
];

const ALT_THEMES = [
  'fotografia editorial de moda',
  'arte abstrata em cores intensas',
  'detalhe arquitetônico em contraste',
  'retrato conceitual em estúdio',
  'paisagem cinematográfica',
  'textura e materiais em close',
  'fotografia urbana noturna',
  'composição gráfica experimental',
];

export const galleryItems: GalleryItem[] = Array.from(
  { length: GRID_COLS * GRID_ROWS },
  (_, i) => {
    const shape = SHAPE_PATTERN[i % SHAPE_PATTERN.length];
    // Os arquivos se repetem após IMAGE_FILES tiles com deslocamento de 3
    // colunas por bloco, para que a repetição fique diagonal e imperceptível.
    const block = Math.floor(i / IMAGE_FILES);
    const fileIndex = (((i % IMAGE_FILES) + block * 3) % IMAGE_FILES) + 1;
    const grayscale = fileIndex % 4 === 2;
    return {
      id: `item-${i + 1}`,
      src: `/galeria-imersiva/img-${String(fileIndex).padStart(2, '0')}.jpg`,
      alt: `${ALT_THEMES[i % ALT_THEMES.length]}${grayscale ? ', em preto e branco' : ''}`,
      shape,
      // Enquanto as imagens são placeholders, os cases se distribuem em ciclo.
      caseSlug: caseStudies[i % caseStudies.length].slug,
    };
  },
);
