# Portfólio UX/UI — página de case

Página de portfólio e template de estudo de caso, isolados do restante do site.

## Rotas

| Rota | Página | Arquivo |
| --- | --- | --- |
| `/ux` | Índice do portfólio (hero, projetos, sobre, processo) | `src/pages/UxPortfolioPage.tsx` |
| `/ux/depoimentos` | Catálogo das variações de depoimento | `src/pages/UxTestimonialsPage.tsx` |
| `/ux/<slug>` | Estudo de caso completo | `src/pages/UxCasePage.tsx` |

`/ux/depoimentos` é avaliada antes do casamento por slug, então um projeto não
pode usar `depoimentos` como `slug`.

As rotas são registradas em `src/App.tsx` (roteamento por `window.location.pathname`,
sem biblioteca de router).

## Como rodar

```bash
npm run dev
```

Depois abra `http://localhost:5173/ux`.

Outros comandos úteis:

```bash
npm run typecheck
```

```bash
npm run build
```

## Estrutura

```
src/
├── data/
│   └── ux-portfolio.ts          Todo o conteúdo: perfil, projetos e design system
├── styles/
│   └── ux-portfolio.css         Tokens (cores, raios, espaçamento, tipografia)
├── pages/
│   ├── UxPortfolioPage.tsx      Índice
│   └── UxCasePage.tsx           Template de estudo de caso
└── components/ux/
    ├── primitives.tsx           Container, Grid, Eyebrow, Tag, Button, MetaList, Rule
    ├── Img.tsx                  Imagem otimizada (equivalente ao next/image)
    ├── Reveal.tsx               Entrada ao rolar, com prefers-reduced-motion
    ├── Logo.tsx                 Monograma e assinatura
    ├── Header.tsx               Header fixo com blur ao rolar
    ├── ScrollProgress.tsx       Barra de progresso da página
    ├── HeroSection.tsx          Abertura do portfólio
    ├── ProjectCard.tsx          Card do grid
    ├── ProjectGrid.tsx          Grid editorial assimétrico
    ├── SectionHeader.tsx        Cabeçalho padrão de seção
    ├── EditorialGrid.tsx        Bloco de duas colunas com proporções variáveis
    ├── CaseStudyHero.tsx        Abertura do case + ficha técnica
    ├── CaseIdentity.tsx         Bento de identidade: imagem, cores, logo, fonte, ícones
    ├── OverviewSection.tsx      Visão geral, desafio e pergunta do projeto
    ├── ProcessTimeline.tsx      Processo em 6 etapas
    ├── ResearchSection.tsx      Métricas, métodos, personas e mapa de jornada
    ├── ArchitectureSection.tsx  Sitemap e fluxos (seção escura)
    ├── WireframeGallery.tsx     Wireframes com anotação de decisão
    ├── DesignSystemSection.tsx  Documentação do sistema
    ├── ColorPalette.tsx         Cores com HEX, RGB, função e contraste
    ├── TypographyScale.tsx      Fontes e escala tipográfica
    ├── GridShowcase.tsx         Grid de 12/8/4 colunas e espaçamento
    ├── IconGallery.tsx          Ícones Lucide e regras de uso
    ├── ComponentShowcase.tsx    Botões, campos, tabs, modal, tabela, notificações
    ├── CaseGallery.tsx          Imagens do case com títulos (usa o Lightbox)
    ├── ImageGallery.tsx         Galeria em mockups de dispositivo (alternativa, não usada por padrão)
    ├── Lightbox.tsx             Visualizador em tela cheia com zoom e navegação
    ├── mockups.tsx              Molduras de dispositivo e esquemas de wireframe
    ├── UsabilitySection.tsx     Testes, tabela de achados e antes/depois
    ├── MetricCard.tsx           Card de número grande
    ├── ResultsGrid.tsx          Resultados
    ├── TestimonialCard.tsx      Depoimento
    ├── LearningsSection.tsx     Aprendizados
    ├── NextProject.tsx          Navegação para o próximo case
    ├── CaseNav.tsx              Navegação lateral do case
    ├── Footer.tsx               Contato, links e voltar ao topo
    └── testimonials/            Variações de card de depoimento
        ├── shared.tsx           Avatar, marca da empresa, citação grifada, autoria
        ├── TestimonialFeatured.tsx  Destaque
        ├── TestimonialSplit.tsx     Dividido (imagem + fala)
        ├── TestimonialMinimal.tsx   Mínimo (sem card)
        ├── TestimonialCarousel.tsx  Carrossel
        ├── TestimonialGrid.tsx      Grade compacta
        └── TestimonialMetric.tsx    Com métrica (fundo escuro)
```

### Variações de depoimento

O conteúdo fica em `src/data/ux-testimonials.ts` (`testimonials` e `variations`).
As props seguem a nomenclatura dos componentes do 21st.dev (`companyLogo`,
`quote`, `highlightedText`, `authorName`, `authorPosition`, `authorImage`), então
substituir por um componente de lá é só trocar o import.

Nenhuma variação depende de imagem externa: sem `authorImage` o avatar cai para
as iniciais, e sem `companyLogo` a marca vira uma assinatura tipográfica.
`highlightedText` grifa o primeiro trecho literal que aparecer na fala; se não
encontrar, a fala é renderizada inteira sem grifo.

## Trocar textos

Tudo vive em `src/data/ux-portfolio.ts`:

- `profile` — nome, título, texto de apresentação, e-mail, links e localização.
- `navigation` — itens do menu.
- `designSystem` — logotipo, cores, tipografia, grid, espaçamento e ícones.
- `projects` — array de projetos; cada item alimenta um estudo de caso inteiro.

Para publicar um projeto novo, copie uma entrada de `projects`, troque o `slug`
e o conteúdo. A rota `/ux/<slug>` passa a existir automaticamente, o card entra
no grid e a navegação "Próximo projeto" se ajusta sozinha.

Blocos opcionais (`testimonial`, `liveUrl`, `identity`) simplesmente não são
renderizados quando ausentes.

### Identidade do case (bento de 5 blocos)

Cada projeto pode definir um bloco `identity` (por case, não do design system
compartilhado), que abre o estudo de caso logo após a ficha técnica:

1. `secondaryImage` — imagem secundária do projeto;
2. `colors` — paleta da marca (`{ name, hex, on }`, `on` decide a cor do texto sobre o swatch);
3. `logo` — marca (`{ label, monogram }`); com `logo: null` e um `image` definido, o 3º bloco vira uma terceira imagem;
4. `font` — fonte principal (`{ name, specimen, weights, note }`);
5. `icons` — nomes de ícone Lucide; nomes fora do mapa de `CaseIdentity.tsx` são ignorados.

Sem `identity` no projeto, a seção e o item "Identidade" da navegação lateral
somem automaticamente.

### Números ainda não medidos

Em `results`, use `placeholder: true` em vez de inventar um número. O card passa
a exibir o rótulo "Métrica em coleta".

## Trocar imagens

As capas ficam em `public/projetos/<slug>/capa.webp` e são referenciadas por
caminho absoluto (`/projetos/<slug>/capa.webp`) em `coverImage`, `screens[].image`
e `testimonial.image`.

Ao trocar uma capa, ajuste também `coverAspect` (largura ÷ altura) — é ele que
reserva o espaço e evita reflow durante o carregamento.

Wireframes e molduras de dispositivo são desenhados em CSS (`mockups.tsx`),
então não dependem de imagem nenhuma.

A seção "Imagens do case" (`CaseGallery.tsx`) mostra as telas de `screens` como
blocos editoriais grandes — a primeira em largura total, as demais em pares —
cada uma com número, título e legenda. Substituiu a galeria em mockups
(`ImageGallery.tsx`), que continua no repositório como alternativa caso queira
voltar às molduras de dispositivo.

Em ambas, cada tela abre em tela cheia ao ser clicada
(`Lightbox.tsx`): zoom de 100% a 400% pelos botões, por `Ctrl`/`⌘` + roda do
mouse, por pinça no touch, por duplo clique e pelas teclas `+`/`-`/`0`; com a
imagem ampliada, arrastar ou girar a roda move o enquadramento. As setas
navegam entre as telas e `Esc` fecha. A convenção é a mesma da galeria
imersiva da home — roda sozinha move, `Ctrl` + roda aproxima. Como as capas são exibidas em tamanho original no visualizador,
vale subir a imagem na maior resolução disponível.

## Trocar a identidade visual

Todas as cores, raios e espaçamentos são variáveis CSS em
`src/styles/ux-portfolio.css`, escopadas na classe `.ux-root`. Editar os valores
no topo do arquivo reflete em toda a página, sem tocar em componente.

## Sobre a stack

O briefing pedia Next.js; este repositório é Vite + React 19 + TypeScript +
Tailwind CSS v4, então a página foi construída na stack existente. As demais
escolhas seguem o pedido: componentes reutilizáveis, ícones Lucide, animações
com Framer Motion e imagens otimizadas.

O componente `Img.tsx` cobre a mesma superfície de API do `next/image`
(`fill`, `sizes`, `priority`) sobre a tag nativa — ao portar para Next.js, basta
trocar o `<img>` interno por `<Image>`.

## Acessibilidade

- HTML semântico com hierarquia de headings correta (`h1` único por página).
- Link "Pular para o conteúdo" antes do header.
- Foco visível em todos os elementos interativos (`:focus-visible` em `.ux-root`).
- Tabs navegáveis por seta, modal fechável por `Esc`, switch com `role="switch"`.
- Alvos de toque com no mínimo 44px.
- Tabelas viram cartões no mobile, sem rolagem horizontal do documento.
- `prefers-reduced-motion` desliga transições e deslocamentos.
