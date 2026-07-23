import { Fragment, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CONTACT_EMAIL, SOCIALS, VERSIONS } from '@/data/site';
import { caseStudies } from '@/data/cases';

gsap.registerPlugin(ScrollTrigger);

/**
 * Versão "cinética" — layout espelhado da home de zoox.com, seção a seção,
 * trocando apenas textos e imagens (as mídias da referência são material
 * proprietário; aqui entram placeholders da galeria até as fotos finais):
 *
 *  1. hero claro (#D3E4DF): headline central + mídia full-bleed abaixo;
 *  2. manifesto com scrub palavra por palavra + mídia;
 *  3. "não é só X, é um..." + experiência pinada com modos que se alternam;
 *  4. "o futuro" + CTA + mídia;
 *  5. cards de contato no padrão das cidades (Las Vegas / San Francisco);
 *  6. banda escura "fique ligado" com CTA;
 *  7. visão em dois cards grandes (visão / quem faz);
 *  8. jornal — carrossel de cases;
 *  9. rodapé sitemap com marca gigante.
 *
 * Animações da referência: Lenis smooth scroll, reveal mascarado no hero,
 * scrub de palavras, seção pinada com crossfade, parallax de mídia e nav
 * que esconde ao descer.
 */

const INK = '#0D1212';
const SLATE = '#34484A';
const MINT = '#64D5B3';
const SAGE = '#D3E4DF';

/** Modos da seção "experiência" (equivalente a Workspace/Chill Space/…). */
const EXPERIENCE_MODES = [
  { title: 'Design de produto', image: '/galeria-imersiva/img-11.jpg' },
  { title: 'Desenvolvimento', image: '/galeria-imersiva/img-14.jpg' },
  { title: 'Dados & dashboards', image: '/galeria-imersiva/img-17.jpg' },
  { title: 'Motion design', image: '/galeria-imersiva/img-20.jpg' },
  { title: 'Performance', image: '/galeria-imersiva/img-23.jpg' },
];

const HERO_MEDIA = '/galeria-imersiva/img-05.jpg';
const BETTER_MEDIA = '/galeria-imersiva/img-08.jpg';
const FUTURE_MEDIA = '/galeria-imersiva/img-27.jpg';
const CTA_IMAGES = ['/galeria-imersiva/img-21.jpg', '/galeria-imersiva/img-24.jpg'];
const VISION_IMAGES = ['/galeria-imersiva/img-30.jpg', '/galeria-imersiva/img-33.jpg'];

const Eyebrow = ({
  children,
  light,
  center,
}: {
  children: React.ReactNode;
  light?: boolean;
  center?: boolean;
}) => (
  <p
    className={`text-[11px] font-medium tracking-[0.3em] ${center ? 'text-center' : ''}`}
    style={{ color: light ? MINT : SLATE }}
  >
    {children}
  </p>
);

/**
 * Parágrafo com cada palavra em um span — alvo do scrub de opacidade.
 * O espaço fica FORA do span: espaço no fim de um inline-block é descartado
 * pelo navegador, o que colaria as palavras.
 */
const ScrubWords = ({ text, className }: { text: string; className?: string }) => (
  <p className={className} aria-label={text}>
    {text.split(' ').map((word, i) => (
      <Fragment key={`${word}-${i}`}>
        <span aria-hidden className="zx-word inline-block">
          {word}
        </span>
        {' '}
      </Fragment>
    ))}
  </p>
);

/** Texto duplicado para o hover deslizante dos cards de CTA. */
const FlipText = ({ children }: { children: string }) => (
  <span className="zx-flip">
    <span>{children}</span>
    <span aria-hidden>{children}</span>
  </span>
);

const CineticaPage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    document.title = 'john amorim — cinética';
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // --- smooth scroll (Lenis + ScrollTrigger) ----------------------------
    // Fora do gsap.context: o revert() não remove callbacks do ticker, então
    // o cleanup precisa desfazer o Lenis explicitamente.
    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    if (!reducedMotion) {
      lenis = new Lenis();
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // Sem animações: tudo visível, scroll nativo.
        gsap.set('.zx-hero-line, .zx-hero-media, .zx-reveal', {
          clearProps: 'all',
          opacity: 1,
          y: 0,
          yPercent: 0,
        });
        return;
      }

      // --- hero: reveal mascarado linha a linha ---------------------------
      // Estado inicial via GSAP: classes translate-* do Tailwind v4 usam a
      // propriedade CSS `translate`, que o yPercent do GSAP não sobrescreve.
      gsap.fromTo(
        '.zx-hero-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, stagger: 0.14, ease: 'power4.out', delay: 0.2 },
      );
      gsap.fromTo(
        '.zx-hero-media',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.7 },
      );

      // --- mídias: leve zoom-out ao entrar na viewport --------------------
      root.querySelectorAll<HTMLElement>('.zx-media').forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.08 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 25%', scrub: 0.6 },
          },
        );
      });

      // --- manifestos: scrub palavra por palavra --------------------------
      root.querySelectorAll<HTMLElement>('.zx-scrub').forEach((block) => {
        gsap.fromTo(
          block.querySelectorAll('.zx-word'),
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: block,
              start: 'top 78%',
              end: 'top 26%',
              scrub: 0.6,
            },
          },
        );
      });

      // --- experiência: seção pinada com modos que se alternam ------------
      const expPanels = gsap.utils.toArray<HTMLElement>('.zx-exp-panel');
      const expItems = gsap.utils.toArray<HTMLElement>('.zx-exp-item');
      if (expPanels.length > 1) {
        gsap.set(expPanels.slice(1), { autoAlpha: 0 });
        gsap.set(expItems[0], { color: INK });

        const expTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.zx-exp',
            start: 'top top',
            end: `+=${expPanels.length * 80}%`,
            pin: true,
            scrub: 0.5,
          },
        });
        expPanels.forEach((panel, i) => {
          if (i === 0) return;
          expTl
            .to(expPanels[i - 1], { autoAlpha: 0, duration: 0.35 }, i)
            .to(panel, { autoAlpha: 1, duration: 0.35 }, i + 0.1)
            .to(expItems[i - 1], { color: 'rgba(13,18,18,0.3)', duration: 0.3 }, i)
            .to(expItems[i], { color: INK, duration: 0.3 }, i);
        });
        expTl.to({}, { duration: 0.6 });
      }

      // --- reveals genéricos ao entrar na viewport ------------------------
      root.querySelectorAll<HTMLElement>('.zx-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        );
      });

      // --- nav: esconde ao descer, reaparece ao subir ---------------------
      const nav = root.querySelector<HTMLElement>('.zx-nav');
      if (nav) {
        ScrollTrigger.create({
          start: 'top top',
          end: 'max',
          onUpdate: (self) => {
            const y = self.scroll();
            nav.classList.toggle('zx-nav-solid', y > 90);
            gsap.to(nav, {
              yPercent: self.direction === 1 && y > 140 ? -110 : 0,
              duration: 0.4,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          },
        });
      }
    }, root);

    return () => {
      ctx.revert();
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
      lenisRef.current = null;
    };
  }, []);

  /** Scroll suave para âncoras internas via Lenis (fallback nativo). */
  const goTo = (selector: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const target = rootRef.current?.querySelector<HTMLElement>(selector);
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target);
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  const pill =
    'inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[11px] font-medium tracking-[0.18em] transition-opacity duration-300 hover:opacity-80';

  return (
    <div ref={rootRef} className="bg-white font-grotesk" style={{ color: INK }}>
      {/* CSS local: hover deslizante e nav sólida */}
      <style>{`
        .zx-flip { position: relative; display: inline-block; overflow: hidden; vertical-align: bottom; }
        .zx-flip > span { display: block; transition: transform .55s cubic-bezier(.76, 0, .24, 1); }
        .zx-flip > span:last-child { position: absolute; inset: 0; transform: translateY(105%); }
        .zx-card:hover .zx-flip > span:first-child { transform: translateY(-105%); }
        .zx-card:hover .zx-flip > span:last-child { transform: translateY(0); }
        .zx-card .zx-card-img { transition: transform .8s cubic-bezier(.22, 1, .36, 1); }
        .zx-card:hover .zx-card-img { transform: scale(1.05); }
        .zx-nav-solid { background: rgba(255, 255, 255, .82); backdrop-filter: blur(12px); }
        @media (prefers-reduced-motion: reduce) {
          .zx-flip > span, .zx-card .zx-card-img { transition: none; }
        }
      `}</style>

      {/* ------------------------------------------------------------- Nav */}
      <header className="zx-nav fixed inset-x-0 top-0 z-50 transition-colors duration-500">
        <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          <a href="/" className="text-[13px] font-bold tracking-[0.22em]">
            JOHN AMORIM®
          </a>
          <div
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[11px] tracking-[0.2em] lg:flex"
            style={{ color: SLATE }}
          >
            <a href="#experiencia" onClick={goTo('.zx-exp')} className="transition-opacity hover:opacity-60">
              COMO TRABALHO
            </a>
            <a href="#futuro" onClick={goTo('.zx-futuro')} className="transition-opacity hover:opacity-60">
              O FUTURO
            </a>
            <a href="#jornal" onClick={goTo('.zx-jornal')} className="transition-opacity hover:opacity-60">
              JORNAL
            </a>
            <a href="#contato" onClick={goTo('.zx-contato')} className="transition-opacity hover:opacity-60">
              CONTATO
            </a>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className={pill}
            style={{ backgroundColor: INK, color: '#fff' }}
          >
            FALE COMIGO
          </a>
        </nav>
      </header>

      {/* ------------------------------------------------------------ Hero */}
      {/* Como a referência: fundo sage claro, headline central no topo e a
          mídia em quase toda a largura logo abaixo. */}
      <section className="pt-28 md:pt-36" style={{ backgroundColor: SAGE }}>
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[1.04] tracking-tight">
            <span className="block overflow-hidden">
              <span className="zx-hero-line block">Não é só um site.</span>
            </span>
            <span className="block overflow-hidden">
              <span className="zx-hero-line block">É um produto desenhado</span>
            </span>
            <span className="block overflow-hidden">
              <span className="zx-hero-line block">em torno de você.</span>
            </span>
          </h1>
        </div>
        <div className="zx-hero-media mx-auto mt-10 max-w-[1600px] px-3 pb-3 md:mt-14 md:px-7 md:pb-7">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={HERO_MEDIA}
              alt="Colagem de projetos em destaque"
              className="zx-media aspect-[4/5] w-full object-cover sm:aspect-[16/10] md:aspect-[16/9]"
            />
          </div>
        </div>
      </section>

      {/* ----------------------------------- 2. Um jeito melhor (scrub) */}
      <section className="bg-white">
        <div className="zx-scrub mx-auto max-w-4xl px-6 pb-16 pt-24 text-center md:pt-36">
          <Eyebrow center>UM JEITO MELHOR DE CONSTRUIR</Eyebrow>
          <ScrubWords
            className="mt-8 text-[clamp(1.7rem,3.6vw,3rem)] font-bold leading-[1.18] tracking-tight"
            text="Cuide do que importa para o seu negócio e deixe o trajeto comigo — do primeiro rabisco ao deploy, uma jornada suave, sem solavancos."
          />
        </div>
        <div className="zx-reveal mx-auto max-w-[1600px] px-3 pb-24 md:px-7 md:pb-36">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={BETTER_MEDIA}
              alt="Detalhe de interface em construção"
              className="zx-media aspect-[4/5] w-full object-cover sm:aspect-[16/10] md:aspect-[21/9]"
            />
          </div>
        </div>
      </section>

      {/* --------------------- 3. "Não é só design, é um…" + experiência */}
      <section className="bg-white">
        <div className="zx-scrub mx-auto max-w-4xl px-6 pb-14 text-center">
          <Eyebrow center>NÃO É SÓ DESIGN, É UM…</Eyebrow>
          <ScrubWords
            className="mt-8 text-[clamp(1.7rem,3.6vw,3rem)] font-bold leading-[1.18] tracking-tight"
            text="Cada projeto destrava um novo mundo de possibilidades para o seu produto."
          />
        </div>
      </section>
      <section className="zx-exp relative h-svh overflow-hidden bg-white">
        <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6">
          <Eyebrow center>A EXPERIÊNCIA</Eyebrow>
          {/* Palco central: mídia + título gigante do modo ativo */}
          <div className="relative mt-8 aspect-[16/10] w-full max-w-4xl md:aspect-[16/9]">
            {EXPERIENCE_MODES.map((mode) => (
              <div key={mode.title} className="zx-exp-panel absolute inset-0">
                <img
                  src={mode.image}
                  alt=""
                  className="h-full w-full rounded-3xl object-cover"
                />
                <div
                  className="absolute inset-x-0 bottom-0 rounded-b-3xl p-7 md:p-9"
                  style={{ background: 'linear-gradient(transparent, rgba(13,18,18,0.75))' }}
                >
                  <p className="text-center text-[clamp(1.8rem,4.5vw,3.6rem)] font-bold tracking-tight text-white">
                    {mode.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Lista de modos — o ativo acende durante o scroll */}
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {EXPERIENCE_MODES.map((mode) => (
              <li
                key={mode.title}
                className="zx-exp-item text-[12px] font-medium tracking-[0.18em]"
                style={{ color: 'rgba(13,18,18,0.3)' }}
              >
                {mode.title.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------ 4. O futuro (scrub + CTA) */}
      <section className="zx-futuro bg-white">
        <div className="zx-scrub mx-auto max-w-4xl px-6 pb-14 pt-24 text-center md:pt-36">
          <Eyebrow center>O FUTURO DO SEU PRODUTO</Eyebrow>
          <ScrubWords
            className="mt-8 text-[clamp(1.7rem,3.6vw,3rem)] font-bold leading-[1.18] tracking-tight"
            text="Combino design preciso, engenharia sólida e dados de verdade para entregar experiências seguras e confortáveis — em todas as telas, todas as vezes."
          />
          <a
            href="/galeria-imersiva"
            className={`${pill} zx-reveal mt-10`}
            style={{ backgroundColor: INK, color: '#fff' }}
          >
            CONHEÇA O TRABALHO
          </a>
        </div>
        <div className="zx-reveal mx-auto max-w-[1600px] px-3 pb-24 md:px-7 md:pb-36">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={FUTURE_MEDIA}
              alt="Visualização de dados em produção"
              className="zx-media aspect-[4/5] w-full object-cover sm:aspect-[16/10] md:aspect-[21/9]"
            />
          </div>
        </div>
      </section>

      {/* ------------------- 5. Primeiro passeio: cards estilo "cidades" */}
      <section className="zx-contato bg-white pb-24 md:pb-36">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="zx-reveal text-center">
            <Eyebrow center>DÊ O PRIMEIRO PASSEIO</Eyebrow>
            <h2 className="mt-4 text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight">
              Pronto, set, John.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-7">
            {[
              {
                label: 'E-mail',
                action: 'CHAMAR AGORA',
                href: `mailto:${CONTACT_EMAIL}`,
                image: CTA_IMAGES[0],
                external: false,
              },
              {
                label: 'LinkedIn',
                action: 'CONECTAR',
                href: SOCIALS.find((s) => s.label === 'LinkedIn')?.href ?? '#',
                image: CTA_IMAGES[1],
                external: true,
              },
            ].map((card) => (
              <a
                key={card.label}
                href={card.href}
                target={card.external ? '_blank' : undefined}
                rel={card.external ? 'noreferrer' : undefined}
                className="zx-card zx-reveal relative block overflow-hidden rounded-3xl"
              >
                <div className="aspect-[4/5] overflow-hidden sm:aspect-[4/4] md:aspect-[4/5]">
                  <img src={card.image} alt="" className="zx-card-img h-full w-full object-cover" />
                </div>
                <div
                  className="absolute inset-0 flex flex-col justify-end p-7 md:p-9"
                  style={{ background: 'linear-gradient(165deg, rgba(13,18,18,0.05) 40%, rgba(13,18,18,0.82))' }}
                >
                  <span className="text-[clamp(2.2rem,5vw,4rem)] font-bold tracking-tight text-white">
                    <FlipText>{card.label}</FlipText>
                  </span>
                  <span
                    className="mt-4 inline-flex w-fit items-center rounded-xl px-4 py-2.5 text-[11px] font-medium tracking-[0.18em]"
                    style={{ backgroundColor: MINT, color: INK }}
                  >
                    {card.action}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------- 6. Banda escura "fique ligado" */}
      <section style={{ backgroundColor: INK }}>
        <div className="zx-reveal mx-auto max-w-4xl px-6 py-24 text-center text-white md:py-36">
          <Eyebrow center light>
            FIQUE LIGADO: NOVOS PROJETOS CHEGANDO EM BREVE
          </Eyebrow>
          <p className="mt-8 text-[clamp(1.6rem,3.4vw,2.8rem)] font-bold leading-[1.2] tracking-tight">
            Prepare-se para experimentar o futuro do seu produto enquanto o
            portfólio se expande para novas fronteiras
          </p>
          <a
            href="/galeria-imersiva"
            className={`${pill} mt-10`}
            style={{ backgroundColor: MINT, color: INK }}
          >
            VER ONDE EU CRIO
          </a>
        </div>
      </section>

      {/* --------------------------- 7. Visão: dois cards grandes lado a lado */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36">
          <div className="zx-reveal text-center">
            <Eyebrow center>MOVENDO PRODUTOS PARA FRENTE</Eyebrow>
            <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.3rem,2.4vw,1.8rem)] font-bold leading-snug tracking-tight">
              Design, tecnologia e dados: mais seguros, mais limpos, mais
              eficientes — e muito mais divertidos.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-7">
            {[
              {
                eyebrow: 'UMA REVOLUÇÃO DESDE A BASE',
                title: 'Produtos que deixam a rotina mais leve e o negócio menos congestionado.',
                action: 'MINHA VISÃO',
                href: '/',
                image: VISION_IMAGES[0],
                external: false,
              },
              {
                eyebrow: 'CONHEÇA QUEM FAZ',
                title: 'Trabalho movido por curiosidade — de UX a IA, de APIs a visualização de dados.',
                action: 'VER EXPERIMENTOS',
                href: SOCIALS.find((s) => s.label === 'GitHub')?.href ?? '#',
                image: VISION_IMAGES[1],
                external: true,
              },
            ].map((card) => (
              <a
                key={card.eyebrow}
                href={card.href}
                target={card.external ? '_blank' : undefined}
                rel={card.external ? 'noreferrer' : undefined}
                className="zx-card zx-reveal relative block overflow-hidden rounded-3xl"
              >
                <div className="aspect-[4/5] overflow-hidden md:aspect-[4/4.4]">
                  <img src={card.image} alt="" className="zx-card-img h-full w-full object-cover" />
                </div>
                <div
                  className="absolute inset-0 flex flex-col justify-end p-7 md:p-9"
                  style={{ background: 'linear-gradient(170deg, rgba(13,18,18,0.05) 35%, rgba(13,18,18,0.85))' }}
                >
                  <p className="text-[10px] tracking-[0.24em]" style={{ color: MINT }}>
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-3 max-w-md text-xl font-bold leading-snug text-white md:text-2xl">
                    {card.title}
                  </h3>
                  <span
                    className="mt-5 inline-flex w-fit items-center rounded-xl border border-white/40 px-4 py-2.5 text-[11px] font-medium tracking-[0.18em] text-white"
                  >
                    {card.action}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- 8. Jornal de cases */}
      <section className="zx-jornal bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-28 md:px-10 md:pb-40">
          <div className="zx-reveal text-center">
            <Eyebrow center>PARA SE ATUALIZAR</Eyebrow>
            <p className="mx-auto mt-4 max-w-md text-[clamp(1.3rem,2.4vw,1.8rem)] font-bold leading-snug tracking-tight">
              Saiba mais sobre o trabalho e o que vem por aí
            </p>
            <p className="mt-4 text-[11px] tracking-[0.3em]" style={{ color: SLATE }}>
              JORNAL
            </p>
          </div>
          <div className="zx-reveal mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none]">
            {caseStudies.map((study) => (
              <a
                key={study.slug}
                href={`/case/${study.slug}`}
                className="zx-card group w-[76vw] shrink-0 snap-start sm:w-[44vw] lg:w-[27vw]"
              >
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={study.cover}
                    alt={`Prévia do case ${study.title}`}
                    className="zx-card-img aspect-[4/3] w-full object-cover"
                  />
                </div>
                <p className="mt-4 text-[10px] tracking-[0.24em]" style={{ color: SLATE }}>
                  {study.category.toUpperCase()}
                </p>
                <h3 className="mt-2 text-lg font-bold leading-snug transition-opacity group-hover:opacity-60">
                  {study.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------- 9. Rodapé sitemap */}
      <footer className="overflow-hidden" style={{ backgroundColor: INK }}>
        <div className="mx-auto max-w-7xl px-6 pt-20 md:px-10">
          <div className="grid gap-12 pb-16 text-[12px] tracking-[0.14em] text-white/60 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <p className="mb-4 text-[10px] tracking-[0.28em] text-white/35">NAVEGUE</p>
              <ul className="space-y-2">
                {VERSIONS.map((version) => (
                  <li key={version.path}>
                    {version.path === '/cinetica' ? (
                      <span style={{ color: MINT }}>{version.label}</span>
                    ) : (
                      <a href={version.path} className="transition-colors hover:text-white">
                        {version.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[10px] tracking-[0.28em] text-white/35">CASES</p>
              <ul className="space-y-2">
                {caseStudies.map((study) => (
                  <li key={study.slug}>
                    <a href={`/case/${study.slug}`} className="transition-colors hover:text-white">
                      {study.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[10px] tracking-[0.28em] text-white/35">SOCIAL</p>
              <ul className="space-y-2">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[10px] tracking-[0.28em] text-white/35">CONTATO</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-white">
                {CONTACT_EMAIL}
              </a>
              <p className="mt-6 text-white/35">
                © {new Date().getFullYear()} — Maceió, Brasil
              </p>
            </div>
          </div>
        </div>
        {/* Marca gigante cortada na base, como o logo do rodapé de referência */}
        <p
          aria-hidden
          className="mx-auto -mb-[2.5vw] max-w-7xl select-none px-6 text-center text-[11.5vw] font-bold leading-[0.8] tracking-tight text-white/[0.07] md:px-10"
        >
          JOHN AMORIM
        </p>
      </footer>
    </div>
  );
};

export default CineticaPage;
