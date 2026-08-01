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

  it('normaliza como null todo bloco opcional ainda não preenchido', () => {
    const optionalFields = [
      'client',
      'category',
      'year',
      'services',
      'visualIdentity',
      'captionOne',
      'captionTwo',
      'websiteNote',
      'testimonial',
      'showcase',
    ] as const;

    for (const c of caseStudies) {
      for (const field of optionalFields) {
        expect(Object.hasOwn(c, field), `${c.slug}.${field}`).toBe(true);
        expect(c[field], `${c.slug}.${field}`).not.toBeUndefined();
      }
    }
  });

  it('preserva a identidade visual cadastrada em cada case real', () => {
    const mercosul = getCaseBySlug('acordo-mercosul-uniao-europeia');
    const tempo = getCaseBySlug('app-tempo-previsto');

    expect(mercosul?.visualIdentity?.typography.primary.family).toBe('Inter');
    expect(mercosul?.visualIdentity?.icons.items).toEqual([
      'MapPin',
      'ArrowRight',
      'Menu',
      'Search',
      'ExternalLink',
    ]);
    expect(tempo?.visualIdentity?.colors.primary.hex).toBe('#0EA5E9');
    expect(tempo?.visualIdentity?.icons.items).toHaveLength(5);
  });
});
