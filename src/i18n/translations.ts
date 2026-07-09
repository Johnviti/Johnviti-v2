export type Locale = 'pt' | 'en';

export const translations = {
  pt: {
    nav: {
      work: 'Trabalhos',
      about: 'Sobre',
      contact: 'Contato',
    },
    preloader: {
      assembling: 'Montando interface',
      loading: 'Carregando o site',
      stages: {
        grid: 'Grid',
        type: 'Tipografia',
        layout: 'Layout',
        assets: 'Assets',
      },
    },
    hero: {
      line1: 'Creative',
      line2: 'Developer',
      intro:
        'Desenvolvedor criativo unindo código, design e WebGL para construir experiências digitais que ficam na memória.',
      location: 'Maceió — Brasil',
      availability: 'Disponível para projetos',
      scroll: 'Role para explorar',
    },
    work: {
      label: 'Trabalhos selecionados',
      title: 'Projetos',
      view: 'Ver projeto',
    },
    about: {
      label: 'Sobre',
      title: 'Código com intenção de design',
      text: 'Sou John Amorim, desenvolvedor front-end apaixonado por interfaces vivas. Trabalho na fronteira entre engenharia e direção de arte — shaders, animação e tipografia a serviço de histórias digitais.',
    },
    contact: {
      label: 'Contato',
      title: 'Vamos construir algo',
      cta: 'Enviar e-mail',
      rights: 'Todos os direitos reservados',
    },
    project: {
      back: 'Voltar',
      next: 'Próximo projeto',
      role: 'Função',
      year: 'Ano',
      category: 'Categoria',
    },
  },
  en: {
    nav: {
      work: 'Work',
      about: 'About',
      contact: 'Contact',
    },
    preloader: {
      assembling: 'Assembling interface',
      loading: 'Loading the site',
      stages: {
        grid: 'Grid',
        type: 'Typography',
        layout: 'Layout',
        assets: 'Assets',
      },
    },
    hero: {
      line1: 'Creative',
      line2: 'Developer',
      intro:
        'Creative developer blending code, design and WebGL to build digital experiences people remember.',
      location: 'Maceió — Brazil',
      availability: 'Open to new projects',
      scroll: 'Scroll to explore',
    },
    work: {
      label: 'Selected work',
      title: 'Projects',
      view: 'View project',
    },
    about: {
      label: 'About',
      title: 'Code with design intent',
      text: "I'm John Amorim, a front-end developer obsessed with living interfaces. I work at the border between engineering and art direction — shaders, motion and typography in service of digital stories.",
    },
    contact: {
      label: 'Contact',
      title: "Let's build something",
      cta: 'Send an email',
      rights: 'All rights reserved',
    },
    project: {
      back: 'Back',
      next: 'Next project',
      role: 'Role',
      year: 'Year',
      category: 'Category',
    },
  },
} as const;
