import projectsData from '@/data/projects.json';

/**
 * Projetos reais do portfólio — gerados a partir das capas em
 * `public/projetos/<slug>/capa.png` (ver script de importação).
 *
 * A galeria imersiva consome esta lista; cada tile aponta para
 * `/case/<slug>`. Para publicar um case completo de um projeto, crie a
 * entrada correspondente em `cases.json` usando o mesmo `slug`.
 */
export type Project = {
  slug: string;
  name: string;
  /** Caminho público da capa. */
  cover: string;
  /** Proporção real da capa (largura / altura) — usada pelos tiles da galeria. */
  aspect: number;
};

export const projects = projectsData as Project[];
