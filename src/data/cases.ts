import casesData from '@/data/cases.json';
import casesEn from '@/data/cases.en.json';
import caseTestFixture from '@/data/case-test.fixture.json';
import type { Lang } from '@/lib/i18n';
import type { VisualIdentity } from '@/data/ux-portfolio';

/**
 * Case studies — um por projeto (mesmo `slug` dos tiles da galeria).
 *
 * O conteúdo textual vive em `cases.json` (português, a fonte da verdade) e as
 * traduções em `cases.<idioma>.json`, indexadas por slug. Só os campos de texto
 * são traduzidos; imagens, slug e ano vêm sempre do arquivo base — assim uma
 * tradução incompleta degrada para o português em vez de quebrar a página.
 *
 * A capa e a narrativa-base são os únicos campos obrigatórios. Todo bloco de
 * vitrine é opcional e começa em `null`: quando recebe conteúdo real no JSON,
 * passa a ser renderizado automaticamente na página pública do case.
 */
export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  /** Logo da empresa/marca, opcional — exibida centralizada acima da fala. */
  logo?: string | null;
};

/** Conjunto progressivo de imagens da vitrine. Cada campo pode entrar sozinho. */
export type Showcase = {
  /** Mosaico "bento" — 7 imagens. */
  bento?: string[] | null;
  /** Grade 2×2 — 4 imagens. */
  grid?: string[] | null;
  /** Imagem full-width. */
  full?: string | null;
  /** Telas do produto em janela de navegador — título + imagem. */
  mockups?: { src: string; title: string }[] | null;
  testimonialImage?: string | null;
  avatar?: string | null;
};

export type CaseStudy = {
  slug: string;
  title: string;
  client: string | null;
  category: string | null;
  year: string | null;
  services: string[] | null;
  industries: string[];
  location: string;
  growthStage: string;
  /** Capa do projeto — hero do case e imagem do tile na galeria. */
  cover: string;
  visualIdentity: VisualIdentity | null;
  intro: string;
  challenge: string;
  approach: string;
  captionOne: string | null;
  captionTwo: string | null;
  websiteNote: string | null;
  testimonial: Testimonial | null;
  showcase: Showcase | null;
};

type OptionalCaseContentKey =
  | 'client'
  | 'category'
  | 'year'
  | 'services'
  | 'visualIdentity'
  | 'captionOne'
  | 'captionTwo'
  | 'websiteNote'
  | 'testimonial'
  | 'showcase';

type RawCaseStudy = Omit<CaseStudy, OptionalCaseContentKey> &
  Partial<Pick<CaseStudy, OptionalCaseContentKey>>;

const emptyOptionalContent: Pick<CaseStudy, OptionalCaseContentKey> = {
  client: null,
  category: null,
  year: null,
  services: null,
  visualIdentity: null,
  captionOne: null,
  captionTwo: null,
  websiteNote: null,
  testimonial: null,
  showcase: null,
};

/** Mantém o JSON progressivo: campos ainda não cadastrados viram `null`. */
const normalizeCaseStudy = (study: RawCaseStudy): CaseStudy => ({
  ...emptyOptionalContent,
  ...study,
});

const data = casesData as unknown as { cases: RawCaseStudy[] };

export const caseStudies = data.cases.map(normalizeCaseStudy);
const devCaseStudy = normalizeCaseStudy(
  caseTestFixture as unknown as RawCaseStudy,
);

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
  if (!translation) return study;

  /* Uma tradução antiga não pode ressuscitar um bloco que está `null` na fonte
     portuguesa. Quando o conteúdo real for adicionado ao base, sua tradução
     volta a ser aplicada automaticamente. */
  const applicable = Object.fromEntries(
    Object.entries(translation).filter(
      ([key, value]) => value != null && study[key as keyof CaseStudy] != null,
    ),
  ) as CaseTranslation;

  return { ...study, ...applicable };
};

/** Lista completa de cases no idioma pedido. */
export const getCaseStudies = (lang: Lang): CaseStudy[] =>
  caseStudies.map((study) => localizeCase(study, lang));

export const getCaseBySlug = (
  slug: string,
  lang: Lang = 'pt',
): CaseStudy | undefined => {
  const study =
    caseStudies.find((c) => c.slug === slug) ??
    (import.meta.env.DEV && devCaseStudy.slug === slug ? devCaseStudy : undefined);
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
