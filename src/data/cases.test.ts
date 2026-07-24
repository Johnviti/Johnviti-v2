import { describe, expect, it } from 'vitest';
import { caseStudies, getCaseBySlug } from '@/data/cases';
import { projects } from '@/data/projects';

describe('cases', () => {
  it('tem cases', () => {
    expect(caseStudies.length).toBeGreaterThan(0);
  });

  it('slugs são únicos', () => {
    const slugs = caseStudies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('todo case tem os campos de texto essenciais', () => {
    for (const c of caseStudies) {
      for (const field of ['title', 'intro', 'challenge', 'approach', 'cover'] as const) {
        expect(c[field], `${c.slug}.${field}`).toBeTruthy();
      }
    }
  });

  it('todo projeto da galeria tem um case correspondente', () => {
    for (const p of projects) {
      expect(getCaseBySlug(p.slug), `case ausente para ${p.slug}`).toBeDefined();
    }
  });
});
