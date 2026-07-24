import casesData from '@/data/cases.json';
import casesEn from '@/data/cases.en.json';
import type { Lang } from '@/lib/i18n';

/**
 * Case studies — um por projeto (mesmo `slug` dos tiles da galeria).
 *
 * O conteúdo textual vive em `cases.json` (português, a fonte da verdade) e as
 * traduções em `cases.<idioma>.json`, indexadas por slug. Só os campos de texto
 * são traduzidos; imagens, slug e ano vêm sempre do arquivo base — assim uma
 * tradução incompleta degrada para o português em vez de quebrar a página.
 *
 * A capa (`cover`) é a imagem real de cada projeto. A vitrine (bento, grade,
 * mockups, depoimento) ainda usa `placeholderShowcase` e só aparece na rota
 * local `/dev/case/:slug`. Na rota pública `/case/:slug`, essas seções mostram
 * "Em desenvolvimento". Para publicar a vitrine de um projeto, adicione
 * `showcase` ao case no JSON.
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

/* ------------------------------------------------------------------ idiomas */

/** Campos traduzíveis de um case (o resto — slug, ano, imagens — é comum). */
export type CaseTranslation = Partial<
  Pick<
    CaseStudy,
    | 'title'
    | 'client'
    | 'category'
    | 'services'
    | 'industries'
    | 'location'
    | 'growthStage'
    | 'intro'
    | 'challenge'
    | 'approach'
    | 'captionOne'
    | 'captionTwo'
    | 'websiteNote'
    | 'testimonial'
  >
>;

/** Traduções por idioma → slug. `pt` é o próprio `cases.json`, então fica vazio. */
const translations: Partial<Record<Lang, Record<string, CaseTranslation>>> = {
  en: casesEn as Record<string, CaseTranslation>,
};

/** Case com os campos traduzidos por cima do português. */
export const localizeCase = (study: CaseStudy, lang: Lang): CaseStudy => {
  const translation = translations[lang]?.[study.slug];
  return translation ? { ...study, ...translation } : study;
};

/** Lista completa de cases no idioma pedido. */
export const getCaseStudies = (lang: Lang): CaseStudy[] =>
  caseStudies.map((study) => localizeCase(study, lang));

/** Vitrine padrão (copiada do Figma), usada enquanto um projeto não tem imagens próprias. */
export const placeholderShowcase = data.placeholderShowcase;

/** Vitrine do case: placeholder do Figma com os overrides do próprio projeto por cima. */
export const getShowcase = (study: CaseStudy): Showcase => ({
  ...placeholderShowcase,
  ...(study.showcase ?? {}),
});

export const getCaseBySlug = (
  slug: string,
  lang: Lang = 'pt',
): CaseStudy | undefined => {
  const study = caseStudies.find((c) => c.slug === slug);
  return study && localizeCase(study, lang);
};

/** Próximo case na ordem do array, com wrap. */
export const getNextCase = (slug: string): CaseStudy => {
  const index = caseStudies.findIndex((c) => c.slug === slug);
  return caseStudies[(index + 1) % caseStudies.length];
};

/** Próximos `count` cases (com wrap), para a seção "Quer ver mais?". */
export const getRelatedCases = (
  slug: string,
  count = 2,
  lang: Lang = 'pt',
): CaseStudy[] => {
  const index = caseStudies.findIndex((c) => c.slug === slug);
  return Array.from({ length: Math.min(count, caseStudies.length - 1) }, (_, i) =>
    localizeCase(caseStudies[(index + 1 + i) % caseStudies.length], lang),
  );
};
