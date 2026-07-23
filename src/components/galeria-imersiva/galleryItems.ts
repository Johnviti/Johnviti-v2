/**
 * Dados das imagens da galeria — alimentados pelos projetos reais
 * (capas em `public/projetos/<slug>/capa.webp`, ver `@/data/projects`).
 *
 * Cada tile respeita a PROPORÇÃO REAL da capa (`aspect` = largura / altura);
 * a maioria é 16:9. O grid repete em blocos de GRID_COLS × GRID_ROWS itens;
 * a ordem do array define a posição (linha a linha). Cada tile abre
 * `/case/<slug>` do projeto correspondente.
 */
import { projects } from '@/data/projects';

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  /** Proporção real da capa (largura / altura). */
  aspect: number;
  /** Case aberto ao clicar no tile (página /case/:slug). */
  caseSlug: string;
};

export const GRID_COLS = 8;
export const GRID_ROWS = 8;

/** Quantidade de projetos distintos disponíveis. */
const PROJECT_COUNT = projects.length;

export const galleryItems: GalleryItem[] = Array.from(
  { length: GRID_COLS * GRID_ROWS },
  (_, i) => {
    // Os projetos se repetem após PROJECT_COUNT tiles com deslocamento de 3
    // por bloco, para que a repetição fique diagonal e imperceptível.
    const block = Math.floor(i / PROJECT_COUNT);
    const projectIndex = ((i % PROJECT_COUNT) + block * 3) % PROJECT_COUNT;
    const project = projects[projectIndex];
    return {
      id: `item-${i + 1}`,
      src: project.cover,
      alt: `Capa do projeto ${project.name}`,
      aspect: project.aspect,
      caseSlug: project.slug,
    };
  },
);
