import card01 from '@/assets/card-01.png';
import card02 from '@/assets/card-02.png';
import card03 from '@/assets/card-03.png';
import card04 from '@/assets/card-04.png';
import card05 from '@/assets/card-05.png';

/**
 * Case studies dos projetos — alimentam as páginas /case/:slug.
 * Estrutura inspirada em case studies editoriais: visão geral, paleta de
 * cores com uso de cada cor, tipografia e decisões de design numeradas.
 *
 * Os tiles da galeria imersiva apontam para estes cases via `caseSlug`;
 * quando os projetos reais substituírem as imagens, basta ajustar o
 * mapeamento em galleryItems.ts.
 */
export type PaletteColor = {
  name: string;
  hex: string;
  /** Onde/como a cor é aplicada no produto. */
  usage: string;
};

export type DesignDecision = {
  title: string;
  text: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  role: string;
  stack: string[];
  /** Frase de abertura do hero. */
  summary: string;
  /** Parágrafos da visão geral. */
  overview: string[];
  heroImage: string;
  palette: PaletteColor[];
  typography: {
    display: { family: string; weights: string; note: string };
    text: { family: string; weights: string; note: string };
  };
  decisions: DesignDecision[];
  gallery: { src: string; alt: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'observatorio-da-industria',
    title: 'Observatório da Indústria',
    client: 'FIEA',
    category: 'Plataforma institucional',
    year: '2024',
    role: 'Design de produto & desenvolvimento front-end',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts'],
    summary:
      'Plataforma institucional com visual tecnológico, voltada à apresentação de dados, serviços e projetos estratégicos da indústria alagoana.',
    overview: [
      'O Observatório da Indústria precisava deixar de ser um repositório de relatórios em PDF para se tornar uma vitrine viva de dados. O desafio era equilibrar a sobriedade de uma instituição do Sistema Indústria com uma linguagem visual que comunicasse tecnologia e futuro.',
      'A resposta foi uma interface escura de base azul-profunda, na qual os dados são os protagonistas: gráficos, indicadores e mapas ganham cor e luz, enquanto a estrutura ao redor permanece silenciosa.',
    ],
    heroImage: card05,
    palette: [
      {
        name: 'Azul profundo',
        hex: '#0B1F3A',
        usage: 'Cor de base das superfícies — dá o tom institucional e tecnológico.',
      },
      {
        name: 'Azul elétrico',
        hex: '#1E6FF2',
        usage: 'Ações primárias, links e destaques de navegação.',
      },
      {
        name: 'Ciano dado',
        hex: '#2BD9C7',
        usage: 'Séries de dados, indicadores positivos e micro-destaques.',
      },
      {
        name: 'Névoa',
        hex: '#F4F6FA',
        usage: 'Texto sobre fundos escuros e superfícies claras de leitura.',
      },
      {
        name: 'Grafite',
        hex: '#0E1116',
        usage: 'Tipografia sobre fundos claros e planos de profundidade.',
      },
    ],
    typography: {
      display: {
        family: 'Space Grotesk',
        weights: '500 · 600 · 700',
        note: 'Títulos e números de indicadores — a geometria da fonte reforça o caráter técnico da plataforma.',
      },
      text: {
        family: 'Inter',
        weights: '400 · 500',
        note: 'Corpo de texto e tabelas — neutra e altamente legível em tamanhos pequenos.',
      },
    },
    decisions: [
      {
        title: 'Dados como protagonistas',
        text: 'Toda a hierarquia visual foi construída para que gráficos e indicadores fossem o primeiro ponto de atenção. A interface usa uma base escura de baixo contraste e reserva cor saturada exclusivamente para dados — nada compete com a informação.',
      },
      {
        title: 'Sistema de grid editorial',
        text: 'Em vez de cards genéricos de dashboard, as seções seguem um grid editorial de 12 colunas com respiros generosos, aproximando a leitura de uma publicação — o que aumenta a credibilidade do conteúdo institucional.',
      },
      {
        title: 'Movimento com propósito',
        text: 'As transições de números e gráficos animam apenas na primeira visualização, guiando o olhar para o dado mais relevante de cada tela sem transformar a plataforma em vitrine de efeitos.',
      },
    ],
    gallery: [
      { src: '/galeria-imersiva/img-01.jpg', alt: 'Detalhe da interface do Observatório da Indústria' },
      { src: '/galeria-imersiva/img-02.jpg', alt: 'Visualização de dados do Observatório da Indústria' },
    ],
  },
  {
    slug: 'intervencoes-educacionais',
    title: 'Sistema de Intervenções Educacionais',
    client: 'Dashboard analítico',
    category: 'Indicadores em tempo real',
    year: '2024',
    role: 'UX/UI & visualização de dados',
    stack: ['React', 'TypeScript', 'D3', 'APIs REST'],
    summary:
      'Painel analítico para acompanhamento de indicadores educacionais, riscos e desempenho em tempo real.',
    overview: [
      'Gestores educacionais precisavam responder a uma pergunta simples — "quais escolas precisam de atenção agora?" — mas os dados estavam espalhados em planilhas e sistemas isolados. O produto consolida tudo em um painel único com semáforos de risco.',
      'O design parte da semântica de cor: cada estado (adequado, alerta, risco) tem uma cor fixa e consistente em todos os gráficos, mapas e tabelas, permitindo leitura instantânea mesmo em telas densas.',
    ],
    heroImage: card03,
    palette: [
      {
        name: 'Grafite azulado',
        hex: '#101828',
        usage: 'Tipografia principal e cabeçalhos de tabelas.',
      },
      {
        name: 'Índigo',
        hex: '#465FF1',
        usage: 'Cor da marca do sistema, ações e filtros ativos.',
      },
      {
        name: 'Esmeralda',
        hex: '#12B76A',
        usage: 'Estado "adequado" — indicadores dentro da meta.',
      },
      {
        name: 'Âmbar',
        hex: '#F79009',
        usage: 'Estado "alerta" — indicadores que exigem acompanhamento.',
      },
      {
        name: 'Vermelho sinal',
        hex: '#F04438',
        usage: 'Estado "risco" — prioridade de intervenção imediata.',
      },
      {
        name: 'Gelo',
        hex: '#F8FAFC',
        usage: 'Fundo das telas — máximo contraste para os semáforos.',
      },
    ],
    typography: {
      display: {
        family: 'Space Grotesk',
        weights: '500 · 700',
        note: 'Números grandes de KPIs — largura estável evita "dança" quando valores atualizam em tempo real.',
      },
      text: {
        family: 'Inter',
        weights: '400 · 500 · 600',
        note: 'Tabelas densas e legendas — desenhada para telas, mantém legibilidade em 11px.',
      },
    },
    decisions: [
      {
        title: 'Semáforo como linguagem',
        text: 'As três cores de estado são a espinha dorsal do produto. Elas nunca são usadas para decoração — se algo é verde, âmbar ou vermelho, é um estado de indicador. Essa disciplina elimina ambiguidade em decisões de alto impacto.',
      },
      {
        title: 'Densidade progressiva',
        text: 'A tela inicial mostra apenas agregados por rede; cada clique aprofunda um nível (município → escola → turma). O gestor escolhe a densidade de informação, em vez de recebê-la toda de uma vez.',
      },
      {
        title: 'Acessibilidade além da cor',
        text: 'Todos os estados têm ícone e rótulo além da cor, garantindo leitura por pessoas com daltonismo — requisito crítico num sistema em que cor significa prioridade de intervenção.',
      },
    ],
    gallery: [
      { src: '/galeria-imersiva/img-03.jpg', alt: 'Painel de indicadores do sistema educacional' },
      { src: '/galeria-imersiva/img-04.jpg', alt: 'Detalhe de gráficos de desempenho educacional' },
    ],
  },
  {
    slug: 'karma-free',
    title: 'E-commerce Karma Free',
    client: 'Loja virtual',
    category: 'Storytelling de produto',
    year: '2023',
    role: 'Design & desenvolvimento full-stack',
    stack: ['React', 'Node.js', 'Stripe', 'GSAP'],
    summary:
      'Plataforma de e-commerce com forte apelo visual, focada em storytelling de produto, performance e conversão.',
    overview: [
      'A Karma Free vende produtos naturais com uma história forte por trás de cada item — mas a loja anterior os apresentava como commodities em um grid genérico. O redesign coloca a narrativa antes da gôndola.',
      'Cada página de produto abre como um mini-editorial: origem, processo e propósito, com a compra chegando naturalmente ao fim da história. A paleta terrosa e a tipografia quente sustentam o posicionamento da marca.',
    ],
    heroImage: card01,
    palette: [
      {
        name: 'Verde floresta',
        hex: '#1E3A2F',
        usage: 'Cor primária da marca — cabeçalhos, rodapé e botões de compra.',
      },
      {
        name: 'Salvia',
        hex: '#8FBF8F',
        usage: 'Estados de hover, selos e detalhes orgânicos.',
      },
      {
        name: 'Terracota',
        hex: '#C96F4A',
        usage: 'Acentos de storytelling e chamadas de promoção.',
      },
      {
        name: 'Areia',
        hex: '#F5EFE6',
        usage: 'Fundo geral — calor de papel, longe do branco de e-commerce.',
      },
      {
        name: 'Cacau',
        hex: '#23201D',
        usage: 'Tipografia — um preto quente que conversa com a paleta terrosa.',
      },
    ],
    typography: {
      display: {
        family: 'Space Grotesk',
        weights: '300 · 500',
        note: 'Títulos em peso leve, com tracking amplo — elegância sem esforço nos editoriais de produto.',
      },
      text: {
        family: 'Inter',
        weights: '400 · 500',
        note: 'Descrições e fluxo de checkout — clareza absoluta onde a conversão acontece.',
      },
    },
    decisions: [
      {
        title: 'História antes da gôndola',
        text: 'A página de produto inverte a convenção de e-commerce: primeiro a narrativa de origem com fotografia em tela cheia, depois preço e compra. O tempo médio na página triplicou e a conversão acompanhou.',
      },
      {
        title: 'Paleta que cheira a produto',
        text: 'As cores vêm literalmente dos produtos — verdes de folhas, terracota de especiarias, areia de papel kraft. A loja parece uma extensão da embalagem, não um marketplace neutro.',
      },
      {
        title: 'Performance como design',
        text: 'Imagens em AVIF com placeholders de cor dominante, fontes com fallback métrico e animações apenas em transform/opacity. O storytelling pesado visualmente carrega em menos de dois segundos em 4G.',
      },
    ],
    gallery: [
      { src: '/galeria-imersiva/img-05.jpg', alt: 'Editorial de produto da loja Karma Free' },
      { src: '/galeria-imersiva/img-06.jpg', alt: 'Detalhe da experiência de compra Karma Free' },
    ],
  },
  {
    slug: 'pai-eterno',
    title: 'E-commerce Pai Eterno',
    client: 'Loja virtual',
    category: 'Experiência do usuário',
    year: '2023',
    role: 'UX/UI & desenvolvimento front-end',
    stack: ['React', 'TypeScript', 'E-commerce APIs'],
    summary:
      'Loja virtual com navegação intuitiva, foco em experiência do usuário e fortalecimento da identidade da marca.',
    overview: [
      'O público da loja é amplo e, em grande parte, pouco habituado a compras online. Cada decisão de interface partiu de uma pergunta: "minha avó conseguiria completar esta compra sozinha?".',
      'A identidade devocional da marca foi traduzida em uma paleta de azul-noite e dourado, aplicada com contenção — solenidade sem excesso, e uma jornada de compra reduzida ao essencial.',
    ],
    heroImage: card04,
    palette: [
      {
        name: 'Azul-noite',
        hex: '#14213D',
        usage: 'Cor institucional — cabeçalho, rodapé e momentos de marca.',
      },
      {
        name: 'Dourado',
        hex: '#C9A227',
        usage: 'Acentos devocionais, selos e detalhes de destaque.',
      },
      {
        name: 'Vinho',
        hex: '#6E1F2E',
        usage: 'Categorias especiais e comunicação de campanhas.',
      },
      {
        name: 'Marfim',
        hex: '#F7F3EA',
        usage: 'Fundo das páginas — acolhedor e de alto contraste com o azul.',
      },
    ],
    typography: {
      display: {
        family: 'Space Grotesk',
        weights: '500 · 600',
        note: 'Títulos de seção e categorias — moderna, mas de desenho sóbrio, alinhada ao tom da marca.',
      },
      text: {
        family: 'Inter',
        weights: '400 · 600',
        note: 'Corpos generosos (mínimo 18px) e pesos fortes em botões — legibilidade para um público de todas as idades.',
      },
    },
    decisions: [
      {
        title: 'Jornada de três passos',
        text: 'O checkout foi comprimido em três telas com uma única decisão por tela, sempre com o botão principal visível sem rolagem. A taxa de abandono de carrinho caiu de forma expressiva já no primeiro mês.',
      },
      {
        title: 'Tipografia generosa',
        text: 'Corpo mínimo de 18px, alvos de toque de 48px e contraste AAA em todos os textos de fluxo de compra. Acessibilidade aqui não é conformidade — é o próprio produto.',
      },
      {
        title: 'Solenidade com contenção',
        text: 'O dourado aparece apenas em momentos de significado (selos, detalhes, confirmação de pedido). Usado em excesso viraria ruído; dosado, sustenta a identidade devocional da marca.',
      },
    ],
    gallery: [
      { src: '/galeria-imersiva/img-07.jpg', alt: 'Vitrine da loja virtual Pai Eterno' },
      { src: '/galeria-imersiva/img-08.jpg', alt: 'Detalhe da jornada de compra Pai Eterno' },
    ],
  },
  {
    slug: 'paineis-gerenciais',
    title: 'Painéis Gerenciais',
    client: 'Sistema interno',
    category: 'Gestão corporativa',
    year: '2024',
    role: 'Design de produto & front-end',
    stack: ['React', 'TypeScript', 'Auth & RBAC', 'Dashboards'],
    summary:
      'Interface de acesso corporativo segura e moderna para sistemas de gestão, priorizando clareza e usabilidade.',
    overview: [
      'Sistemas internos costumam ser o patinho feio do design corporativo — herdam telas acumuladas por anos, sem hierarquia nem consistência. Este projeto reconstruiu o acesso aos painéis de gestão a partir de um design system enxuto.',
      'A interface aposta em neutralidade deliberada: tons de aço, uma única cor de ação e espaçamento rigoroso. Em ferramentas usadas oito horas por dia, sobriedade é conforto.',
    ],
    heroImage: card02,
    palette: [
      {
        name: 'Aço escuro',
        hex: '#0F172A',
        usage: 'Navegação lateral e tipografia de títulos.',
      },
      {
        name: 'Azul ação',
        hex: '#2563EB',
        usage: 'A única cor de interação — botões, links e estados ativos.',
      },
      {
        name: 'Cinza aço',
        hex: '#64748B',
        usage: 'Textos secundários, ícones e metadados.',
      },
      {
        name: 'Verde confirmação',
        hex: '#10B981',
        usage: 'Feedbacks de sucesso e status operacionais.',
      },
      {
        name: 'Prata',
        hex: '#E2E8F0',
        usage: 'Bordas, divisores e fundos de campos de formulário.',
      },
    ],
    typography: {
      display: {
        family: 'Space Grotesk',
        weights: '500 · 600',
        note: 'Títulos de módulos e números de painéis — presença sem ornamento.',
      },
      text: {
        family: 'Inter',
        weights: '400 · 500',
        note: 'Formulários, tabelas e navegação — o cavalo de trabalho de toda a interface.',
      },
    },
    decisions: [
      {
        title: 'Uma cor para agir',
        text: 'Tudo que é clicável é azul; nada que não seja clicável é azul. Essa única regra eliminou a maior fonte de erro dos usuários no sistema anterior — descobrir onde se pode clicar.',
      },
      {
        title: 'Design system antes das telas',
        text: 'Antes de qualquer tela, foram definidos tokens de cor, espaçamento e componentes-base. As dezenas de telas seguintes se montaram como Lego — e novos módulos herdam consistência de graça.',
      },
      {
        title: 'Segurança visível, não barulhenta',
        text: 'Estados de sessão, permissões e escopos de acesso são sempre visíveis mas discretos, no canto da navegação. O usuário sabe onde está e com que poderes — sem modais de aviso a cada passo.',
      },
    ],
    gallery: [
      { src: '/galeria-imersiva/img-09.jpg', alt: 'Painel de gestão corporativa' },
      { src: '/galeria-imersiva/img-10.jpg', alt: 'Detalhe dos módulos dos painéis gerenciais' },
    ],
  },
];

export const getCaseBySlug = (slug: string): CaseStudy | undefined =>
  caseStudies.find((c) => c.slug === slug);

/** Próximo case na ordem do array, com wrap. */
export const getNextCase = (slug: string): CaseStudy => {
  const index = caseStudies.findIndex((c) => c.slug === slug);
  return caseStudies[(index + 1) % caseStudies.length];
};
