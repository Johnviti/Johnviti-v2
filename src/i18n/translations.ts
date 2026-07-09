export type Locale = 'pt' | 'en';

export const translations = {
  pt: {
    nav: {
      work: 'Trabalhos',
      about: 'Sobre',
      contact: 'Contato',
    },
    common: {
      placeholder: 'Imagem em breve',
      showreel: 'Showreel — em breve',
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
      cta: 'Ver projetos',
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
      statement:
        'Transformo ideias em experiências digitais vivas — na fronteira entre engenharia, motion e direção de arte.',
      text: 'Sou John Amorim, desenvolvedor front-end apaixonado por interfaces vivas. Shaders, animação e tipografia a serviço de histórias digitais.',
    },
    services: {
      label: 'O que eu faço',
      items: {
        s1: { title: 'Front-end Criativo', desc: 'React, TypeScript e arquiteturas escaláveis' },
        s2: { title: 'WebGL & 3D', desc: 'Three.js, shaders e experiências imersivas' },
        s3: { title: 'Motion & Interação', desc: 'GSAP, microinterações e scrollytelling' },
        s4: { title: 'UI Engineering', desc: 'Design systems, acessibilidade e performance' },
      },
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
    common: {
      placeholder: 'Image coming soon',
      showreel: 'Showreel — coming soon',
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
      cta: 'View work',
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
      statement:
        'I turn ideas into living digital experiences — at the border between engineering, motion and art direction.',
      text: "I'm John Amorim, a front-end developer obsessed with living interfaces. Shaders, motion and typography in service of digital stories.",
    },
    services: {
      label: 'What I do',
      items: {
        s1: { title: 'Creative Front-end', desc: 'React, TypeScript and scalable architectures' },
        s2: { title: 'WebGL & 3D', desc: 'Three.js, shaders and immersive experiences' },
        s3: { title: 'Motion & Interaction', desc: 'GSAP, micro-interactions and scrollytelling' },
        s4: { title: 'UI Engineering', desc: 'Design systems, accessibility and performance' },
      },
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
