import { projects } from '@/data/projects';
import { OG_IMAGE, SITE_URL } from '@/data/site';

/**
 * Helpers de SEO puros (sem DOM) — compartilhados entre o runtime
 * (`useDocumentMeta`) e o script de build (`scripts/prerender.mjs` replica a
 * lista de rotas a partir do mesmo `projects.json`). Ficam aqui para serem
 * testáveis sem montar o app.
 */

/** Transforma caminho relativo (`/case/foo`) ou URL absoluta no endereço final. */
export const toAbsoluteUrl = (urlOrPath: string): string => {
  if (/^https?:\/\//.test(urlOrPath)) return urlOrPath;
  const path = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
  return `${SITE_URL}${path}`;
};

export type SiteRoute = {
  path: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
};

/** Rotas estáticas indexáveis. */
export const STATIC_ROUTES: SiteRoute[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/contato', priority: 0.6, changefreq: 'monthly' },
  { path: '/minimal', priority: 0.4, changefreq: 'monthly' },
];

/** Uma rota `/case/:slug` por projeto real da galeria. */
export const caseRoutes = (): SiteRoute[] =>
  projects.map((p) => ({
    path: `/case/${p.slug}`,
    priority: 0.8,
    changefreq: 'monthly',
  }));

/** Todas as rotas indexáveis do site (estáticas + cases). */
export const allRoutes = (): SiteRoute[] => [...STATIC_ROUTES, ...caseRoutes()];

/** Imagem de compartilhamento padrão, já absoluta. */
export const OG_IMAGE_ABSOLUTE = toAbsoluteUrl(OG_IMAGE);
