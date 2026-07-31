/**
 * Conteúdo das variações de depoimento.
 *
 * Fonte única para a página `/ux/depoimentos`. As pessoas e empresas são
 * fictícias; as falas foram escritas para exercitar tamanhos diferentes de
 * texto — é o que revela se um card aguenta conteúdo real.
 */

export type UxTestimonial = {
  id: string;
  /** Fala completa. Quebras de linha não são interpretadas. */
  quote: string;
  /** Trecho destacado dentro da fala (ex.: o nome do produto). */
  highlightedText?: string;
  authorName: string;
  authorPosition: string;
  /** Foto opcional — sem ela, o avatar cai para as iniciais. */
  authorImage?: string;
  company: string;
  /** Imagem de contexto usada pelas variações com foto grande. */
  image?: string;
  imageAlt?: string;
  /** Número associado ao depoimento, usado na variação com métrica. */
  metric?: { value: string; label: string };
};

export const testimonials: UxTestimonial[] = [
  {
    id: 'claudia',
    quote:
      'O que mudou não foi só a ferramenta. Passamos a discutir o número em vez de discutir de onde ele veio. Na primeira reunião com a plataforma, sobrou tempo para falar de plano de ação.',
    highlightedText: 'discutir o número',
    authorName: 'Cláudia Ferreira',
    authorPosition: 'Gerente de Planejamento',
    company: 'Sistema FIEA',
    image: '/projetos/paineis-gerencias/capa.webp',
    imageAlt: 'Painel de acompanhamento aberto durante reunião de planejamento',
    metric: { value: '−32%', label: 'no tempo de fechamento mensal' },
  },
  {
    id: 'beatriz',
    quote:
      'Antes eu montava esse recorte na mão toda segunda-feira. Hoje abro, filtro e já tenho a apresentação. O tempo que sobrou virou análise.',
    highlightedText: 'O tempo que sobrou virou análise',
    authorName: 'Beatriz Nunes',
    authorPosition: 'Analista de Comércio Exterior',
    company: 'Observatório da Indústria',
    image: '/projetos/radar-tarifario-global/capa.webp',
    imageAlt: 'Painel do radar tarifário com o recorte por setor',
    metric: { value: '38s', label: 'até a primeira resposta útil' },
  },
  {
    id: 'josue',
    quote:
      'A equipe parou de me ligar às cinco da manhã perguntando se sai ou não sai. A tela responde antes de eu abrir a boca.',
    highlightedText: 'responde antes',
    authorName: 'Josué Batista',
    authorPosition: 'Encarregado de Obra',
    company: 'Construtora Norte',
    image: '/projetos/app-tempo-previsto/capa.webp',
    imageAlt: 'Aplicativo de previsão aberto no celular em campo',
    metric: { value: '6s', label: 'até a decisão do dia' },
  },
  {
    id: 'silvana',
    quote:
      'Recebia cento e vinte mensagens por gato e adotava um. Agora chegam menos pessoas, mas chegam as certas.',
    highlightedText: 'chegam as certas',
    authorName: 'Silvana Rocha',
    authorPosition: 'Protetora independente',
    company: 'Rede Miau Dote',
    image: '/projetos/miau-dote/capa.webp',
    imageAlt: 'Perfil de animal para adoção na plataforma',
    metric: { value: '−70%', label: 'de contato inviável' },
  },
  {
    id: 'marcos',
    quote:
      'Pela primeira vez a base bateu com o relatório oficial sem ninguém reprocessar nada por fora.',
    authorName: 'Marcos Vieira',
    authorPosition: 'Analista de Dados',
    company: 'Sistema FIEA',
    metric: { value: '61', label: 'indicadores com regra documentada' },
  },
  {
    id: 'celia',
    quote:
      'Eu desisti de comprar nesse site umas três vezes por causa do frete que só aparecia no fim. Agora eu vejo o total antes de me cadastrar.',
    highlightedText: 'vejo o total antes',
    authorName: 'Célia Amaral',
    authorPosition: 'Cliente recorrente',
    company: 'E-commerce Pai Eterno',
    metric: { value: '−41%', label: 'de abandono na entrega' },
  },
];

/** Documentação de cada variação — alimenta os cabeçalhos da página. */
export const variations = [
  {
    id: 'destaque',
    name: 'Destaque',
    description:
      'Card único com marca da empresa, trecho grifado e autoria. Serve para a prova social principal da landing page, logo abaixo da dobra.',
    props: 'companyLogo · quote · highlightedText · authorName · authorPosition · authorImage',
  },
  {
    id: 'dividido',
    name: 'Dividido',
    description:
      'Imagem de contexto ocupando metade do bloco e a fala na outra. Bom quando existe foto real do produto em uso — dá lastro ao depoimento.',
    props: 'testimonial · reverse',
  },
  {
    id: 'minimo',
    name: 'Mínimo',
    description:
      'Sem card, sem borda: só a fala e a assinatura. Encaixa dentro de um texto corrido sem interromper a leitura.',
    props: 'testimonial · align',
  },
  {
    id: 'carrossel',
    name: 'Carrossel',
    description:
      'Uma fala por vez com troca manual. Use quando houver muitos depoimentos e nenhum for claramente o mais forte.',
    props: 'testimonials · autoAdvance',
  },
  {
    id: 'grade',
    name: 'Grade',
    description:
      'Cards compactos lado a lado. Comunica volume — a leitura é do conjunto, não de cada fala.',
    props: 'testimonials · columns',
  },
  {
    id: 'metrica',
    name: 'Com métrica',
    description:
      'Fundo escuro, número grande e a fala como evidência do número. Para a seção de resultados, onde o dado precisa vir acompanhado.',
    props: 'testimonial',
  },
];
