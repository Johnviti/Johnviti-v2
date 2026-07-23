import casesData from '@/data/cases.json';

/**
 * Case studies — um por projeto (mesmo `slug` dos tiles da galeria).
 *
 * O conteúdo textual vive em `cases.json`. A capa (`cover`) é a imagem real
 * de cada projeto. A vitrine (bento, grade, mockups, depoimento) ainda usa
 * `placeholderShowcase` e só aparece na rota local `/dev/case/:slug`.
 * Na rota pública `/case/:slug`, essas seções mostram "Em desenvolvimento".
 * Para publicar a vitrine de um projeto, adicione `showcase` ao case no JSON.
 */
export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

/** Conjunto de imagens de vitrine do case (layout Figma). */
export type Showcase = {
  /** Mosaico "bento" — 7 imagens. */
  bento: string[];
  /** Grade 2×2 — 4 imagens. */
  grid: string[];
  /** Imagem full-width. */
  full: string;
  /** Telas em janela de navegador — 2 imagens. */
  mockups: string[];
  testimonialImage: string;
  avatar: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  services: string[];
  industries: string[];
  location: string;
  growthStage: string;
  /** Capa do projeto — hero do case e imagem do tile na galeria. */
  cover: string;
  intro: string;
  challenge: string;
  approach: string;
  captionOne: string;
  captionTwo: string;
  websiteNote: string;
  testimonial: Testimonial;
  /** Imagens de vitrine próprias — sobrescrevem o placeholder campo a campo. */
  showcase?: Partial<Showcase>;
};

const data = casesData as unknown as {
  cases: CaseStudy[];
  placeholderShowcase: Showcase;
};

export const caseStudies = data.cases;

/** Vitrine padrão (copiada do Figma), usada enquanto um projeto não tem imagens próprias. */
export const placeholderShowcase = data.placeholderShowcase;

/** Vitrine do case: placeholder do Figma com os overrides do próprio projeto por cima. */
export const getShowcase = (study: CaseStudy): Showcase => ({
  ...placeholderShowcase,
  ...(study.showcase ?? {}),
});

export const getCaseBySlug = (slug: string): CaseStudy | undefined =>
  caseStudies.find((c) => c.slug === slug);

/** Próximo case na ordem do array, com wrap. */
export const getNextCase = (slug: string): CaseStudy => {
  const index = caseStudies.findIndex((c) => c.slug === slug);
  return caseStudies[(index + 1) % caseStudies.length];
};

/** Próximos `count` cases (com wrap), para a seção "Quer ver mais?". */
export const getRelatedCases = (slug: string, count = 2): CaseStudy[] => {
  const index = caseStudies.findIndex((c) => c.slug === slug);
  return Array.from(
    { length: Math.min(count, caseStudies.length - 1) },
    (_, i) => caseStudies[(index + 1 + i) % caseStudies.length],
  );
};
