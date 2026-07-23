import card01 from '@/assets/card-01.png';
import card02 from '@/assets/card-02.png';
import card03 from '@/assets/card-03.png';
import card04 from '@/assets/card-04.png';
import card05 from '@/assets/card-05.png';

export const CONTACT_EMAIL = 'observatorio@sistemafiea.com.br';

/**
 * Caixa de entrada que recebe as mensagens do formulário de contato.
 * O destino real é definido pela chave do Web3Forms (ver `.env.example`);
 * este valor é usado no fallback `mailto:` quando o envio falha.
 */
export const CONTACT_INBOX = 'johnviti21@gmail.com';

/** Currículo em PDF — o arquivo vive em `public/cv.pdf`. */
export const CV_URL = '/cv.pdf';

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/Johnviti' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/john-amorim-648480225/' },
  { label: 'Instagram', href: 'https://www.instagram.com/johnviti/' },
];

export const PROJECTS = [
  {
    title: 'Observatório da Indústria',
    client: 'FIEA',
    category: 'Plataforma institucional',
    description:
      'Plataforma institucional com visual tecnológico, voltada à apresentação de dados, serviços e projetos estratégicos.',
    image: card05,
    href: '#',
    featured: true,
  },
  {
    title: 'Sistema de Intervenções Educacionais',
    client: 'Dashboard analítico',
    category: 'Indicadores em tempo real',
    description:
      'Painel analítico para acompanhamento de indicadores educacionais, riscos e desempenho em tempo real.',
    image: card03,
    href: '#',
  },
  {
    title: 'E-commerce Karma Free',
    client: 'Loja virtual',
    category: 'Storytelling de produto',
    description:
      'Plataforma de e-commerce com forte apelo visual, focada em storytelling de produto, performance e conversão.',
    image: card01,
    href: '#',
  },
  {
    title: 'E-commerce Pai Eterno',
    client: 'Loja virtual',
    category: 'Experiência do usuário',
    description:
      'Loja virtual com navegação intuitiva, foco em experiência do usuário e fortalecimento da identidade da marca.',
    image: card04,
    href: '#',
  },
  {
    title: 'Painéis Gerenciais',
    client: 'Sistema interno',
    category: 'Gestão corporativa',
    description:
      'Interface de acesso corporativo segura e moderna para sistemas de gestão, priorizando clareza e usabilidade.',
    image: card02,
    href: '#',
  },
];

export const VERSIONS = [
  { label: 'galeria imersiva', path: '/' },
  { label: 'minimal', path: '/minimal' },
  { label: 'mundo 3d', path: '/mundo' },
  { label: 'playground 3d', path: '/playground' },
  // Rota desativada — reative junto com a de App.tsx e routeLabels.ts.
  // { label: 'cinética', path: '/cinetica' },
];

export const SERVICES = [
  {
    title: 'Design de produto',
    description:
      'Transformo ideias em interfaces que as pessoas gostam de usar. Da descoberta à microinteração, desenho produtos digitais com atenção obsessiva aos detalhes — sempre guiado por dados e pelas pessoas do outro lado da tela.',
    tags: ['Descoberta', 'Ideação', 'UX/UI', 'Design orientado a dados', 'Motion design'],
  },
  {
    title: 'Desenvolvimento de software',
    description:
      'Um produto é tão bom quanto a sua implementação. De interfaces resilientes a APIs robustas e automações eficientes, cubro o ciclo completo de desenvolvimento — do primeiro commit ao deploy.',
    tags: ['Front-end', 'React & TypeScript', 'APIs', 'Automação', 'Performance'],
  },
  {
    title: 'Dados & dashboards',
    description:
      'Equilibro complexidade e clareza para transformar dados brutos em decisões. Painéis analíticos, indicadores em tempo real e narrativas visuais que fazem os números contarem histórias.',
    tags: ['Análise de dados', 'Dashboards', 'Visualização', 'Storytelling interativo'],
  },
];
