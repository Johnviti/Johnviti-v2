/**
 * Fonte única de conteúdo do portfólio UX/UI.
 *
 * O estudo de caso segue exatamente esta ordem (21 blocos):
 *
 *   1  imagem principal (heroImage)
 *   2  nome do projeto            ┐
 *   3  o que fizemos (services)   │
 *   4  indústrias                 ├ projectSummary
 *   5  localização                │
 *   6  estágio                    ┘
 *   7  introdução                 ┐
 *   8  desafio                    ├ overview
 *   9  abordagem                  ┘
 *   10 imagem secundária          ┐
 *   11 cores                      │
 *   12 logo ou imagem terciária   ├ visualIdentity
 *   13 fonte                      │
 *   14 biblioteca de ícones       ┘
 *   15 texto de apresentação      ┐
 *   16 imagem do produto 1        ├ productShowcase
 *   17 imagem do produto 2        │
 *   18 imagem do produto X        ┘
 *   19 imagem da pessoa           ┐
 *   20 texto do depoimento        ├ testimonial (opcional)
 *   21 nome/cargo/empresa/avatar  ┘
 *
 * Para publicar um projeto novo, copie um item de `projects`, troque o `slug` e
 * o conteúdo. As imagens abaixo reaproveitam capas que já existem em
 * `public/projetos/<slug>/capa.webp` — troque pelos assets definitivos depois.
 */

/* ------------------------------------------------------------------- tipos */

export type ImageRef = { src: string; alt: string; caption?: string };

export type ProjectSummary = {
  project: { title: string; client: string; category: string; year: string };
  /** "O que fizemos". */
  services: string[];
  industries: string[];
  location: string;
  stage: string;
};

export type Overview = { intro: string; challenge: string; approach: string };

export type ColorSwatch = { name: string; hex: string };

export type Gradient = {
  name: string;
  css: string;
  angle: number;
  stops: { color: string; position: string }[];
};

export type VisualIdentity = {
  secondaryImage: ImageRef;
  colors: {
    primary: ColorSwatch;
    background: ColorSwatch;
    text: ColorSwatch;
    additional: ColorSwatch[];
    gradient?: Gradient | null;
  };
  /**
   * Bloco 12: a marca do projeto. `type: 'logo'` desenha o logotipo — se `src`
   * não carregar (ou não existir), cai para o `monogram`. `type: 'image'` usa
   * uma terceira imagem do case.
   */
  brandAsset: {
    type: 'logo' | 'image';
    src?: string;
    alt: string;
    title: string;
    monogram?: string;
  };
  typography: {
    primary: { family: string; usage: string; weights: number[] };
    secondary?: { family: string; usage: string; weights: number[] } | null;
    sample: { uppercase: string; lowercase: string; title: string; text: string };
    /** Espécime editorial opcional, usado quando o case define uma prancha própria. */
    specimen?: {
      layout?: 'scale' | 'alphabet';
      eyebrow: string;
      display: string;
      weights: { label: string; value: number }[];
      roles: { label: string; text: string }[];
      alphabet?: {
        eyebrow: string;
        display: string;
        family: string;
        weights: { label: string; value: number }[];
        uppercase: string;
        lowercase: string;
        numerals: string;
      };
    };
  };
  icons: {
    library: string;
    package: string;
    website: string;
    /** Nomes em PascalCase da lucide-react (ex.: `MapPin`). */
    items: string[];
  };
};

export type ShowcaseImage = {
  src: string;
  title: string;
  alt: string;
  caption: string;
  /** `full` ocupa a largura toda; `half` divide a linha em dois. */
  display: 'full' | 'half';
};

export type ProductShowcase = { introduction: string; images: ShowcaseImage[] };

export type CaseTestimonial = {
  image: ImageRef;
  quote: string;
  author: { name: string; role: string; company: string; avatar: ImageRef };
};

export type Project = {
  slug: string;
  /** Só marca o projeto em destaque no hero do índice `/ux`. */
  featured?: boolean;
  heroImage: ImageRef;
  projectSummary: ProjectSummary;
  overview: Overview;
  visualIdentity: VisualIdentity;
  productShowcase: ProductShowcase;
  testimonial?: CaseTestimonial | null;
};

/* ------------------------------------------------------------------ perfil */

export const profile = {
  name: 'John Amorim',
  initials: 'JA',
  role: 'UX/UI Designer — Product Designer',
  headline:
    'Transformo problemas complexos em produtos digitais simples, úteis e escaláveis.',
  intro:
    'Há oito anos desenho produtos digitais para times de dados, educação e indústria. Trabalho perto de negócio e engenharia, do enquadramento do problema à entrega do design system — e fico até a métrica se mexer.',
  location: 'Maceió, Alagoas — Brasil',
  availability: 'Disponível para projetos a partir de setembro',
  focus: 'Produtos B2B, plataformas de dados e design systems',
  email: 'contato@johnamorim.design',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/johnviti/' },
    { label: 'Behance', href: 'https://www.behance.net/' },
    { label: 'Dribbble', href: 'https://dribbble.com/' },
  ],
  stats: [
    { value: '8 anos', label: 'de prática em produto' },
    { value: '20+', label: 'produtos entregues' },
    { value: '4', label: 'design systems em operação' },
  ],
} as const;

export const navigation = [
  { label: 'Projetos', href: '#projetos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Processo', href: '#processo' },
  { label: 'Contato', href: '#contato' },
];

/* ------------------------------------------------- processo (índice /ux) */

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  tools: string[];
};

/** Processo genérico exibido no índice — não faz parte do estudo de caso. */
export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Descoberta',
    description:
      'Entendimento do negócio, do sistema atual e das pessoas que o operam todos os dias.',
    deliverables: ['Kick-off e metas', 'Auditoria da solução atual', 'Mapa de stakeholders'],
    tools: ['FigJam', 'Notion', 'Hotjar'],
  },
  {
    number: '02',
    title: 'Definição',
    description:
      'Recorte do problema, priorização das oportunidades e acordo sobre o que será medido.',
    deliverables: ['Problem statement', 'Matriz de priorização', 'Critérios de sucesso'],
    tools: ['FigJam', 'Notion'],
  },
  {
    number: '03',
    title: 'Ideação',
    description:
      'Exploração de caminhos com o time de produto e engenharia, sem se apegar à primeira solução.',
    deliverables: ['Crazy 8s', 'Arquitetura da informação', 'User flows'],
    tools: ['FigJam', 'Whimsical'],
  },
  {
    number: '04',
    title: 'Prototipação',
    description:
      'Wireframes navegáveis evoluindo até a interface final, já apoiados no design system.',
    deliverables: ['Wireframes', 'Protótipo navegável', 'Componentes documentados'],
    tools: ['Figma', 'Storybook'],
  },
  {
    number: '05',
    title: 'Validação',
    description:
      'Testes moderados com usuários reais e ajustes rodada a rodada antes do código.',
    deliverables: ['Roteiro de teste', 'Relatório de achados', 'Backlog de correções'],
    tools: ['Maze', 'Google Meet'],
  },
  {
    number: '06',
    title: 'Entrega',
    description:
      'Handoff com estados especificados, acompanhamento do build e medição pós-lançamento.',
    deliverables: ['Specs de componentes', 'Checklist de acessibilidade', 'Painel de métricas'],
    tools: ['Figma', 'Linear', 'Looker Studio'],
  },
];

/* ------------------------------------------ paleta do índice /ux (teaser) */

export const designSystem = {
  intro:
    'Um sistema enxuto, documentado em Figma e publicado como biblioteca React. Cada token existe para resolver uma decisão recorrente — não para catalogar variações.',
  colors: [
    { name: 'Principal', hex: '#164194', on: 'dark' as const },
    { name: 'Secundária', hex: '#52AE32', on: 'dark' as const },
    { name: 'Azul claro', hex: '#00AEEF', on: 'dark' as const },
    { name: 'Superfície', hex: '#FFFFFF', on: 'light' as const },
    { name: 'Texto', hex: '#111111', on: 'dark' as const },
  ],
};

/* ---------------------------------------------------------------- projetos */

export const projects: Project[] = [
  {
    slug: 'acordo-mercosul-uniao-europeia',
    featured: true,
    heroImage: {
      src: '/projetos/acordo-mercosul-uniao-europeia/capa.webp',
      alt: 'Página inicial do especial Acordo Mercosul – União Europeia',
    },
    projectSummary: {
      project: {
        title: 'Acordo Mercosul – União Europeia',
        client: 'Observatório da Indústria — FIEA',
        category: 'Especial de dados',
        year: '2024',
      },
      services: ['UX/UI', 'Visualização de dados', 'Front-end'],
      industries: ['Indústria', 'Comércio exterior'],
      location: 'Maceió, BR',
      stage: 'Institucional',
    },
    overview: {
      intro:
        'Um especial de dados que traduz os impactos do acordo comercial entre o Mercosul e a União Europeia para a indústria alagoana.',
      challenge:
        'Explicar um acordo complexo e cheio de números para um público amplo, sem perder o rigor técnico.',
      approach:
        'Estruturei a narrativa em blocos visuais — setores afetados, oportunidades e riscos — com gráficos que guiam a leitura de cima para baixo.',
    },
    visualIdentity: {
      secondaryImage: {
        src: '/projetos/radar-tarifario-global/capa.webp',
        alt: 'Aplicação do projeto em notebook',
        caption: 'Visualização da página principal do especial.',
      },
      colors: {
        primary: { name: 'Principal', hex: '#164194' },
        background: { name: 'Background', hex: '#FFFFFF' },
        text: { name: 'Cor do texto', hex: '#52AE32' },
        additional: [{ name: 'Azul claro', hex: '#00AEEF' }],
        gradient: {
          name: 'Gradiente principal',
          css: 'linear-gradient(90deg, #4CAF2F 0%, #245C18 100%)',
          angle: 90,
          stops: [
            { color: '#4CAF2F', position: '0%' },
            { color: '#245C18', position: '100%' },
          ],
        },
      },
      brandAsset: {
        type: 'logo',
        src: '/projetos/acordo-mercosul-uniao-europeia/logo.svg',
        alt: 'Logo do projeto',
        title: 'Identidade do projeto',
        monogram: 'ME',
      },
      typography: {
        primary: { family: 'Inter', usage: 'Títulos, textos e interface', weights: [400, 500, 600, 700] },
        secondary: null,
        sample: {
          uppercase: 'Aa',
          lowercase: 'Aa',
          title: 'Acordo Mercosul – União Europeia',
          text: 'Informação clara para decisões mais estratégicas.',
        },
      },
      icons: {
        library: 'Lucide Icons',
        package: 'lucide-react',
        website: 'https://lucide.dev',
        items: ['MapPin', 'ArrowRight', 'Menu', 'Search', 'ExternalLink'],
      },
    },
    productShowcase: {
      introduction:
        'O conteúdo foi estruturado para transformar dados técnicos em uma experiência de leitura clara, progressiva e visual.',
      images: [
        {
          src: '/projetos/acordo-mercosul-uniao-europeia/capa.webp',
          title: 'Página inicial do especial',
          alt: 'Página inicial do especial de dados',
          caption: 'A abertura apresenta o contexto do acordo e os principais indicadores.',
          display: 'full',
        },
        {
          src: '/projetos/panorama-das-matrizes-eletrica-e-energetica/capa.webp',
          title: 'Setores impactados',
          alt: 'Seção com dados sobre os setores impactados',
          caption: 'Gráficos organizam os impactos do acordo por setor econômico.',
          display: 'half',
        },
        {
          src: '/projetos/economia-do-mar-em-alagoas/capa.webp',
          title: 'Oportunidades e riscos',
          alt: 'Página com oportunidades e riscos do acordo',
          caption: 'Cada seção começa com um dado-âncora e apresenta o contexto logo abaixo.',
          display: 'half',
        },
      ],
    },
    testimonial: {
      image: {
        src: '/projetos/conectandoofuturo-avancandocom-esgnaindustria/capa.webp',
        alt: 'Representante da FIEA',
      },
      quote:
        'O especial deu forma visual a um tema árido e virou material de referência nas nossas conversas com o setor.',
      author: {
        name: 'Ana Beatriz Lima',
        role: 'Diretora de Comunicação',
        company: 'FIEA',
        avatar: {
          src: '/projetos/conectandoofuturo-avancandocom-esgnaindustria/capa.webp',
          alt: 'Retrato da autora do depoimento',
        },
      },
    },
  },

  {
    slug: 'plataforma-integrada-gestao',
    heroImage: {
      src: '/projetos/plataforma-integradade-gestaodas-unidades/capa.webp',
      alt: 'Painel consolidado da Plataforma Integrada de Gestão',
    },
    projectSummary: {
      project: {
        title: 'Plataforma Integrada de Gestão',
        client: 'Sistema FIEA',
        category: 'Plataforma B2B',
        year: '2025',
      },
      services: ['UX Research', 'Product Design', 'Design System'],
      industries: ['Educação', 'Indústria'],
      location: 'Maceió, BR',
      stage: 'Em produção',
    },
    overview: {
      intro:
        'Um único ambiente para 32 unidades operarem indicadores, metas e planos de ação — no lugar de 14 planilhas paralelas.',
      challenge:
        'Substituir um processo consolidado em planilhas sem paralisar a operação nem forçar 300 pessoas a aprender tudo de uma vez.',
      approach:
        'Organizei o produto por tarefa — lançar, validar e ler — com validação no momento do preenchimento e uma tabela única configurável.',
    },
    visualIdentity: {
      secondaryImage: {
        src: '/projetos/paineis-gerencias/capa.webp',
        alt: 'Painel gerencial com indicadores por unidade',
        caption: 'Leitura comparativa entre unidades no fechamento do mês.',
      },
      colors: {
        primary: { name: 'Azul institucional', hex: '#164194' },
        background: { name: 'Background', hex: '#F5F5F1' },
        text: { name: 'Cor do texto', hex: '#111111' },
        additional: [{ name: 'Verde meta', hex: '#52AE32' }],
        gradient: {
          name: 'Gradiente de dados',
          css: 'linear-gradient(90deg, #164194 0%, #00AEEF 100%)',
          angle: 90,
          stops: [
            { color: '#164194', position: '0%' },
            { color: '#00AEEF', position: '100%' },
          ],
        },
      },
      brandAsset: {
        type: 'logo',
        alt: 'Marca da Plataforma Integrada',
        title: 'Identidade do projeto',
        monogram: 'PIG',
      },
      typography: {
        primary: { family: 'Inter', usage: 'Interface, tabelas e relatórios', weights: [400, 500, 600, 700] },
        secondary: null,
        sample: {
          uppercase: 'Aa',
          lowercase: 'Aa',
          title: 'Plataforma Integrada de Gestão',
          text: 'Números tabulares para tabelas densas de indicadores.',
        },
      },
      icons: {
        library: 'Lucide Icons',
        package: 'lucide-react',
        website: 'https://lucide.dev',
        items: ['LayoutDashboard', 'BarChart3', 'Check', 'RefreshCw', 'FileText', 'Users'],
      },
    },
    productShowcase: {
      introduction:
        'A interface foi desenhada para que a operação diária caiba em poucos cliques, sem esconder o controle da coordenação.',
      images: [
        {
          src: '/projetos/plataforma-integradade-gestaodas-unidades/capa.webp',
          title: 'Painel consolidado',
          alt: 'Painel consolidado da plataforma',
          caption: 'Abertura com comparativo entre unidades e desvios do período.',
          display: 'full',
        },
        {
          src: '/projetos/paineis-gerencias/capa.webp',
          title: 'Lançamento do mês',
          alt: 'Tela de lançamento de indicadores',
          caption: 'Tabela editável com validação em linha.',
          display: 'half',
        },
        {
          src: '/projetos/plataforma-do-obervatorio-interna/capa.webp',
          title: 'Fila de validação',
          alt: 'Fila de pendências por unidade',
          caption: 'Pendências agrupadas com o motivo da devolução registrado.',
          display: 'half',
        },
      ],
    },
    testimonial: {
      image: {
        src: '/projetos/paineis-gerencias/capa.webp',
        alt: 'Equipe de planejamento em reunião de acompanhamento',
      },
      quote:
        'Passamos a discutir o número em vez de discutir de onde ele veio. Na primeira reunião com a plataforma, sobrou tempo para falar de plano de ação.',
      author: {
        name: 'Cláudia Ferreira',
        role: 'Gerente de Planejamento',
        company: 'Sistema FIEA',
        avatar: {
          src: '/projetos/paineis-gerencias/capa.webp',
          alt: 'Retrato de Cláudia Ferreira',
        },
      },
    },
  },

  {
    slug: 'radar-tarifario-global',
    heroImage: {
      src: '/projetos/radar-tarifario-global/capa.webp',
      alt: 'Interface do Radar Tarifário Global',
    },
    projectSummary: {
      project: {
        title: 'Radar Tarifário Global',
        client: 'Observatório da Indústria',
        category: 'Produto de dados',
        year: '2025',
      },
      services: ['UX Research', 'Visualização de dados', 'UI Design'],
      industries: ['Comércio exterior', 'Indústria'],
      location: 'Maceió, BR',
      stage: 'Público',
    },
    overview: {
      intro:
        'Um painel público que acompanha mudanças tarifárias entre parceiros comerciais e mostra o impacto por setor.',
      challenge:
        'Dar leitura de dois minutos a um dado que só fazia sentido para especialistas, sem simplificar ao ponto de perder rigor.',
      approach:
        'A página abre pela pergunta do usuário — "isso me afeta?" — com o mapa e a série histórica um passo depois.',
    },
    visualIdentity: {
      secondaryImage: {
        src: '/projetos/panorama-das-matrizes-eletrica-e-energetica/capa.webp',
        alt: 'Comparativo entre países no radar',
        caption: 'Série histórica com anotação de eventos.',
      },
      colors: {
        primary: { name: 'Índigo dado', hex: '#1E3A8A' },
        background: { name: 'Background', hex: '#F4F2ED' },
        text: { name: 'Cor do texto', hex: '#111111' },
        additional: [
          { name: 'Âmbar alerta', hex: '#D97706' },
          { name: 'Verde revisado', hex: '#15803D' },
        ],
        gradient: null,
      },
      brandAsset: {
        type: 'logo',
        alt: 'Marca do Radar Tarifário',
        title: 'Identidade do projeto',
        monogram: 'RT',
      },
      typography: {
        primary: { family: 'Inter', usage: 'Interface e rótulos de gráfico', weights: [400, 500, 600] },
        secondary: null,
        sample: {
          uppercase: 'Aa',
          lowercase: 'Aa',
          title: 'Radar Tarifário Global',
          text: 'Alta legibilidade em séries temporais e eixos.',
        },
      },
      icons: {
        library: 'Lucide Icons',
        package: 'lucide-react',
        website: 'https://lucide.dev',
        items: ['BarChart3', 'MapPin', 'Filter', 'Download', 'Share2', 'Eye'],
      },
    },
    productShowcase: {
      introduction:
        'A leitura foi desenhada em camadas: primeiro o que mudou, depois o mapa, por fim a série histórica com contexto.',
      images: [
        {
          src: '/projetos/radar-tarifario-global/capa.webp',
          title: 'Radar semanal',
          alt: 'Tela do radar com as mudanças da semana',
          caption: 'Abertura com as mudanças do período por setor.',
          display: 'full',
        },
        {
          src: '/projetos/panorama-das-matrizes-eletrica-e-energetica/capa.webp',
          title: 'Comparativo entre países',
          alt: 'Tela de comparativo entre países',
          caption: 'Série histórica com anotação de eventos.',
          display: 'half',
        },
        {
          src: '/projetos/economia-do-mar-em-alagoas/capa.webp',
          title: 'Consulta rápida',
          alt: 'Versão da consulta rápida por setor',
          caption: 'Recorte por setor salvo entre sessões.',
          display: 'half',
        },
      ],
    },
    testimonial: {
      image: {
        src: '/projetos/radar-tarifario-global/capa.webp',
        alt: 'Analista trabalhando com o painel do radar',
      },
      quote:
        'Antes eu montava esse recorte na mão toda segunda-feira. Hoje abro, filtro e já tenho a apresentação. O tempo que sobrou virou análise.',
      author: {
        name: 'Beatriz Nunes',
        role: 'Analista de Comércio Exterior',
        company: 'Observatório da Indústria',
        avatar: {
          src: '/projetos/radar-tarifario-global/capa.webp',
          alt: 'Retrato de Beatriz Nunes',
        },
      },
    },
  },

  {
    slug: 'tempo-previsto',
    heroImage: {
      src: '/projetos/app-tempo-previsto/capa.webp',
      alt: 'Telas do aplicativo Tempo Previsto',
    },
    projectSummary: {
      project: {
        title: 'Tempo Previsto',
        client: 'Produto próprio',
        category: 'App mobile',
        year: '2024',
      },
      services: ['UX Research', 'Product Design', 'Motion'],
      industries: ['Serviços de campo', 'Agricultura'],
      location: 'Maceió, BR',
      stage: 'Piloto',
    },
    overview: {
      intro:
        'Previsão do tempo desenhada para quem trabalha ao ar livre — respondendo à pergunta que os apps genéricos ignoram: dá para trabalhar hoje?',
      challenge:
        'Traduzir dados meteorológicos brutos em uma recomendação acionável, sem esconder a incerteza da previsão.',
      approach:
        'A primeira linha da tela é uma recomendação em português, com o nível de confiança sempre visível e o dado bruto logo abaixo.',
    },
    visualIdentity: {
      secondaryImage: {
        src: '/projetos/miau-dote/capa.webp',
        alt: 'Tela de janelas de trabalho da semana',
        caption: 'Barras de viabilidade por período.',
      },
      colors: {
        primary: { name: 'Céu claro', hex: '#0EA5E9' },
        background: { name: 'Background', hex: '#F1F5F9' },
        text: { name: 'Cor do texto', hex: '#0F172A' },
        additional: [{ name: 'Laranja sol', hex: '#F97316' }],
        gradient: {
          name: 'Gradiente do céu',
          css: 'linear-gradient(180deg, #0EA5E9 0%, #0F172A 100%)',
          angle: 180,
          stops: [
            { color: '#0EA5E9', position: '0%' },
            { color: '#0F172A', position: '100%' },
          ],
        },
      },
      brandAsset: {
        type: 'logo',
        alt: 'Marca do Tempo Previsto',
        title: 'Identidade do projeto',
        monogram: 'TP',
      },
      typography: {
        primary: { family: 'Inter', usage: 'Interface, com peso alto para leitura ao sol', weights: [500, 600, 700] },
        secondary: null,
        sample: {
          uppercase: 'Aa',
          lowercase: 'Aa',
          title: 'Tempo Previsto',
          text: 'Peso alto para leitura sob sol forte, em campo.',
        },
      },
      icons: {
        library: 'Lucide Icons',
        package: 'lucide-react',
        website: 'https://lucide.dev',
        items: ['Calendar', 'RefreshCw', 'Bell', 'MapPin', 'Eye', 'Check'],
      },
    },
    productShowcase: {
      introduction:
        'Uma tela principal responde à pergunta do dia; tudo o mais é aprofundamento opcional.',
      images: [
        {
          src: '/projetos/app-tempo-previsto/capa.webp',
          title: 'Recomendação do dia',
          alt: 'Tela inicial com a recomendação do dia',
          caption: 'Abertura com decisão, janela e nível de confiança.',
          display: 'full',
        },
        {
          src: '/projetos/minha-primeira-landing-page/capa.webp',
          title: 'Janelas da semana',
          alt: 'Tela de janelas de trabalho da semana',
          caption: 'Barras de viabilidade por período.',
          display: 'half',
        },
        {
          src: '/projetos/pape-ia/capa.webp',
          title: 'Alertas de mudança',
          alt: 'Tela de alertas de mudança na janela',
          caption: 'Aviso quando a janela de trabalho muda.',
          display: 'half',
        },
      ],
    },
    testimonial: {
      image: {
        src: '/projetos/app-tempo-previsto/capa.webp',
        alt: 'Encarregado consultando o app em campo',
      },
      quote:
        'A equipe parou de me ligar às cinco da manhã perguntando se sai ou não sai. A tela responde antes de eu abrir a boca.',
      author: {
        name: 'Josué Batista',
        role: 'Encarregado de Obra',
        company: 'Construtora Norte',
        avatar: {
          src: '/projetos/app-tempo-previsto/capa.webp',
          alt: 'Retrato de Josué Batista',
        },
      },
    },
  },

  {
    slug: 'miau-dote',
    heroImage: {
      src: '/projetos/miau-dote/capa.webp',
      alt: 'Interface da plataforma Miau Dote',
    },
    projectSummary: {
      project: {
        title: 'Miau Dote',
        client: 'Projeto de impacto social',
        category: 'Marketplace social',
        year: '2024',
      },
      services: ['UX Research', 'Product Design', 'UI Design'],
      industries: ['Impacto social', 'ONGs'],
      location: 'Maceió, BR',
      stage: 'Piloto',
    },
    overview: {
      intro:
        'Plataforma que conecta protetores independentes a adotantes, com uma triagem de compatibilidade antes do primeiro contato.',
      challenge:
        'Aumentar a taxa de adoções concluídas sem transformar o cadastro numa barreira que espanta o adotante.',
      approach:
        'Cortei a triagem ao mínimo — cinco perguntas, uma por tela — e dei status explícito a cada candidatura.',
    },
    visualIdentity: {
      secondaryImage: {
        src: '/projetos/the-be-social/capa.webp',
        alt: 'Perfil de animal para adoção',
        caption: 'Rotina e temperamento acima das fotos.',
      },
      colors: {
        primary: { name: 'Coral acolhedor', hex: '#E1543F' },
        background: { name: 'Background', hex: '#FBF3EC' },
        text: { name: 'Cor do texto', hex: '#4A2C1D' },
        additional: [{ name: 'Verde cuidado', hex: '#2F8F5B' }],
        gradient: null,
      },
      brandAsset: {
        type: 'logo',
        alt: 'Marca do Miau Dote',
        title: 'Identidade do projeto',
        monogram: 'MD',
      },
      typography: {
        primary: { family: 'Inter', usage: 'Interface, com tom próximo e sem rigidez', weights: [400, 600, 700] },
        secondary: null,
        sample: {
          uppercase: 'Aa',
          lowercase: 'Aa',
          title: 'Miau Dote',
          text: 'Tom próximo, sem rigidez, para um contexto emocional.',
        },
      },
      icons: {
        library: 'Lucide Icons',
        package: 'lucide-react',
        website: 'https://lucide.dev',
        items: ['Users', 'Check', 'Bell', 'Eye', 'Share2', 'Plus'],
      },
    },
    productShowcase: {
      introduction:
        'A jornada foi desenhada para qualificar o interesse cedo, sem afastar quem realmente quer adotar.',
      images: [
        {
          src: '/projetos/miau-dote/capa.webp',
          title: 'Feed de adoção',
          alt: 'Feed de animais para adoção',
          caption: 'Descoberta com filtros por rotina.',
          display: 'full',
        },
        {
          src: '/projetos/the-be-social/capa.webp',
          title: 'Perfil do animal',
          alt: 'Perfil do animal com rotina e temperamento',
          caption: 'Rotina e temperamento acima das fotos.',
          display: 'half',
        },
        {
          src: '/projetos/meu-primeiro-portfolio/capa.webp',
          title: 'Triagem de compatibilidade',
          alt: 'Formulário de triagem, uma pergunta por tela',
          caption: 'Cinco perguntas, uma por tela, com progresso visível.',
          display: 'half',
        },
      ],
    },
    testimonial: {
      image: {
        src: '/projetos/miau-dote/capa.webp',
        alt: 'Protetora usando a plataforma',
      },
      quote:
        'Recebia cento e vinte mensagens por gato e adotava um. Agora chegam menos pessoas, mas chegam as certas.',
      author: {
        name: 'Silvana Rocha',
        role: 'Protetora independente',
        company: 'Rede Miau Dote',
        avatar: {
          src: '/projetos/miau-dote/capa.webp',
          alt: 'Retrato de Silvana Rocha',
        },
      },
    },
  },

  {
    slug: 'ecommerce-pai-eterno',
    heroImage: {
      src: '/projetos/ecommerce-pai-eterno/capa.webp',
      alt: 'Telas do e-commerce Pai Eterno',
    },
    projectSummary: {
      project: {
        title: 'E-commerce Pai Eterno',
        client: 'Loja Pai Eterno',
        category: 'E-commerce',
        year: '2023',
      },
      services: ['UX Research', 'UI Design', 'Design System'],
      industries: ['Varejo'],
      location: 'Maceió, BR',
      stage: 'Em produção',
    },
    overview: {
      intro:
        'Redesenho da navegação de catálogo e do checkout de uma loja com mais de 3.000 SKUs e público majoritariamente acima dos 50 anos.',
      challenge:
        'Reduzir o abandono de carrinho num público pouco familiarizado com compra online, sem simplificar o catálogo.',
      approach:
        'Antecipei o frete para o carrinho e mantive um resumo do pedido fixo durante todo o checkout.',
    },
    visualIdentity: {
      secondaryImage: {
        src: '/projetos/economia-do-mar-em-alagoas/capa.webp',
        alt: 'Checkout com resumo de pedido fixo',
        caption: 'Total sempre visível durante o checkout.',
      },
      colors: {
        primary: { name: 'Azul confiança', hex: '#1D4ED8' },
        background: { name: 'Background', hex: '#F5F1EA' },
        text: { name: 'Cor do texto', hex: '#111111' },
        additional: [{ name: 'Dourado destaque', hex: '#B45309' }],
        gradient: null,
      },
      brandAsset: {
        type: 'image',
        src: '/projetos/meu-primeiro-portfolio/capa.webp',
        alt: 'Página de catálogo do e-commerce',
        title: 'Imagem terciária',
      },
      typography: {
        primary: { family: 'Inter', usage: 'Interface, com corpo generoso', weights: [400, 500, 700] },
        secondary: null,
        sample: {
          uppercase: 'Aa',
          lowercase: 'Aa',
          title: 'E-commerce Pai Eterno',
          text: 'Corpo generoso para um público acima dos 50 anos.',
        },
      },
      icons: {
        library: 'Lucide Icons',
        package: 'lucide-react',
        website: 'https://lucide.dev',
        items: ['Search', 'Filter', 'Download', 'Check', 'Plus', 'Trash2'],
      },
    },
    productShowcase: {
      introduction:
        'O catálogo foi reorganizado a partir de card sorting com clientes reais, e o checkout, reduzido a três etapas.',
      images: [
        {
          src: '/projetos/ecommerce-pai-eterno/capa.webp',
          title: 'Catálogo',
          alt: 'Página de catálogo do e-commerce',
          caption: 'Navegação por categorias com nome de cliente, não de ERP.',
          display: 'full',
        },
        {
          src: '/projetos/economia-do-mar-em-alagoas/capa.webp',
          title: 'Checkout',
          alt: 'Tela de checkout com resumo fixo',
          caption: 'Três etapas com o valor total sempre à vista.',
          display: 'half',
        },
        {
          src: '/projetos/minha-primeira-landing-page/capa.webp',
          title: 'Recompra',
          alt: 'Tela de recompra para clientes recorrentes',
          caption: 'Pedido anterior como base, em um clique.',
          display: 'half',
        },
      ],
    },
    testimonial: null,
  },
];

/* ------------------------------------------------------------------ acesso */

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Próximo projeto na ordem da lista, com volta ao começo. */
export const getNextProject = (slug: string) => {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) return projects[0];
  return projects[(index + 1) % projects.length];
};
