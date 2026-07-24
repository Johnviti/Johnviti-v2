import { describe, expect, it } from 'vitest';
import { projects } from '@/data/projects';
import { SITE_URL } from '@/data/site';
import { allRoutes, caseRoutes, STATIC_ROUTES, toAbsoluteUrl } from '@/lib/seo';

describe('toAbsoluteUrl', () => {
  it('prefixa caminhos relativos com o SITE_URL', () => {
    expect(toAbsoluteUrl('/case/foo')).toBe(`${SITE_URL}/case/foo`);
  });

  it('normaliza caminho sem barra inicial', () => {
    expect(toAbsoluteUrl('cases/card-05.png')).toBe(`${SITE_URL}/cases/card-05.png`);
  });

  it('mantém URLs já absolutas', () => {
    const url = 'https://cdn.exemplo.com/x.png';
    expect(toAbsoluteUrl(url)).toBe(url);
  });
});

describe('rotas do site', () => {
  it('gera uma rota /case/:slug por projeto', () => {
    expect(caseRoutes()).toHaveLength(projects.length);
  });

  it('allRoutes = estáticas + cases, sem duplicatas', () => {
    const routes = allRoutes();
    expect(routes).toHaveLength(STATIC_ROUTES.length + projects.length);
    const paths = routes.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('inclui a home e o contato', () => {
    const paths = allRoutes().map((r) => r.path);
    expect(paths).toContain('/');
    expect(paths).toContain('/contato');
  });

  it('todas as prioridades ficam entre 0 e 1', () => {
    for (const r of allRoutes()) {
      expect(r.priority).toBeGreaterThan(0);
      expect(r.priority).toBeLessThanOrEqual(1);
    }
  });
});
