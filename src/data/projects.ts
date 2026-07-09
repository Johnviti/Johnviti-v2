import card01 from '../assets/card-01.png';
import card02 from '../assets/card-02.png';
import card03 from '../assets/card-03.png';
import card04 from '../assets/card-04.png';

export interface Project {
  slug: string;
  title: string;
  category: { pt: string; en: string };
  role: { pt: string; en: string };
  year: string;
  image: string;
  description: { pt: string; en: string };
}

// Projetos placeholder — substitua título, textos e imagens pelo material real de cada case.
export const projects: Project[] = [
  {
    slug: 'projeto-01',
    title: 'Projeto 01',
    category: { pt: 'Web Experience', en: 'Web Experience' },
    role: { pt: 'Design & Desenvolvimento', en: 'Design & Development' },
    year: '2026',
    image: card01,
    description: {
      pt: 'Descrição do case: contexto do problema, abordagem criativa e resultado. Substitua este texto pelo conteúdo real do projeto.',
      en: 'Case description: problem context, creative approach and outcome. Replace this text with the real project content.',
    },
  },
  {
    slug: 'projeto-02',
    title: 'Projeto 02',
    category: { pt: 'Interface & Produto', en: 'Interface & Product' },
    role: { pt: 'Front-end', en: 'Front-end' },
    year: '2025',
    image: card02,
    description: {
      pt: 'Descrição do case: contexto do problema, abordagem criativa e resultado. Substitua este texto pelo conteúdo real do projeto.',
      en: 'Case description: problem context, creative approach and outcome. Replace this text with the real project content.',
    },
  },
  {
    slug: 'projeto-03',
    title: 'Projeto 03',
    category: { pt: 'WebGL & Interação', en: 'WebGL & Interaction' },
    role: { pt: 'Desenvolvimento Criativo', en: 'Creative Development' },
    year: '2025',
    image: card03,
    description: {
      pt: 'Descrição do case: contexto do problema, abordagem criativa e resultado. Substitua este texto pelo conteúdo real do projeto.',
      en: 'Case description: problem context, creative approach and outcome. Replace this text with the real project content.',
    },
  },
  {
    slug: 'projeto-04',
    title: 'Projeto 04',
    category: { pt: 'Identidade Digital', en: 'Digital Identity' },
    role: { pt: 'Design & Desenvolvimento', en: 'Design & Development' },
    year: '2024',
    image: card04,
    description: {
      pt: 'Descrição do case: contexto do problema, abordagem criativa e resultado. Substitua este texto pelo conteúdo real do projeto.',
      en: 'Case description: problem context, creative approach and outcome. Replace this text with the real project content.',
    },
  },
];

export function getProject(slug: string | undefined) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}
