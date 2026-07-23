import { useEffect } from 'react';
import { motion, MotionConfig, type Variants } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import logoMark from '@/assets/logo-john-amorim.svg';
import { CONTACT_EMAIL } from '@/data/site';
import { getCaseBySlug, getRelatedCases, getShowcase } from '@/data/cases';

/**
 * Página de case study — reprodução da estrutura do case study de agência
 * do Figma ("Estudo/Rascunhos → Primer"): hero com título + chips de
 * metadados + imagem grande, narrativa Introdução/Desafio/Abordagem,
 * mosaico bento, legendas, grade 2×2, imagem full-width, nota "Website",
 * mockups em janela de navegador, depoimento, CTA e projetos relacionados.
 *
 * TODO O CONTEÚDO vem de `src/data/cases.json`. As imagens usam o
 * `placeholderShowcase` (copiado do Figma) enquanto cada projeto não recebe
 * as suas — para trocar por projeto, adicione um `showcase` ao case no JSON.
 *
 * Fonte: Inter em todo o projeto (as fontes do Figma — StanVision Pro /
 * Neue Montreal — são pagas e foram substituídas por Inter, a fonte padrão).
 */

/* ------------------------------------------------- Variantes de animação */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const VIEWPORT = { once: true, margin: '-80px' } as const;

/* --------------------------------------------------- Blocos reutilizáveis */

const Reveal = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={VIEWPORT}
    className={className}
  >
    {children}
  </motion.div>
);

const StaggerGroup = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={stagger}
    initial="hidden"
    whileInView="show"
    viewport={VIEWPORT}
    className={className}
  >
    {children}
  </motion.div>
);

/** Chip cinza de metadado. */
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex rounded-md bg-cream-soft px-3 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-ink">
    {children}
  </span>
);

/** Coluna de metadado do hero: rótulo + conteúdo (anima em um stagger). */
const MetaColumn = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <motion.div variants={item}>
    <p className="text-[13px] text-stone-soft">{label}</p>
    <div className="mt-3 flex flex-wrap items-center gap-2">{children}</div>
  </motion.div>
);

/** Legenda curta (parágrafo estreito, estilo Figma). */
const Caption = ({ children }: { children: React.ReactNode }) => (
  <section className="px-6 py-12 md:px-20 md:py-16">
    <Reveal>
      <p className="max-w-[512px] text-sm leading-[1.6] text-ink">{children}</p>
    </Reveal>
  </section>
);

/** Mockup do produto dentro de uma janela de navegador (elemento do Figma). */
const BrowserMockup = ({
  url,
  image,
  alt,
}: {
  url: string;
  image: string;
  alt: string;
}) => (
  <div className="rounded-2xl bg-ink/[0.06] p-5 sm:p-10 md:p-16">
    <div className="mx-auto max-w-[1152px] overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink/10">
      <div className="flex items-center gap-2 border-b border-ink/10 px-3 py-2.5">
        <span className="flex flex-none gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="size-2.5 rounded-full bg-[#28ca41]" />
        </span>
        <span className="mx-auto max-w-[420px] flex-1 truncate rounded bg-ink/[0.05] px-4 py-1 text-center text-[11px] tracking-[0.02em] text-stone-soft">
          {url}
        </span>
        <span className="w-10 flex-none" aria-hidden />
      </div>
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="w-full object-cover"
      />
    </div>
  </div>
);

type Props = { slug: string };

const CasePage = ({ slug }: Props) => {
  const study = getCaseBySlug(slug);

  useEffect(() => {
    document.title = study
      ? `john amorim — case ${study.title.toLowerCase()}`
      : 'john amorim — case não encontrado';
    window.scrollTo(0, 0);
  }, [study]);

  if (!study) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-white text-ink">
        <p className="text-sm tracking-[0.2em] text-stone-soft">
          CASE NÃO ENCONTRADO
        </p>
        <a
          href="/"
          className="text-lg underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
        >
          ← Voltar para a galeria
        </a>
      </div>
    );
  }

  const show = getShowcase(study);
  const related = getRelatedCases(study.slug, 2);
  const host = `${study.slug.replace(/-/g, '')}.com.br`;
  const narrative: [string, string][] = [
    ['Introdução', study.intro],
    ['Desafio', study.challenge],
    ['Abordagem', study.approach],
  ];
  const mailto = `mailto:${CONTACT_EMAIL}`;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-white text-ink">
        {/* Header fixo — mix-blend-difference adapta a marca a fundos claros/escuros */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 text-white mix-blend-difference md:px-10"
        >
          {/* Logo — wordmark vetorial */}
          <a
            href="/"
            aria-label="John Amorim — voltar ao início"
            className="transition-opacity duration-300 hover:opacity-70"
          >
            <img
              src={logoMark}
              alt="John Amorim"
              className="h-6 w-auto md:h-7"
            />
          </a>

          {/* Voltar à galeria — seta em badge que desliza no hover */}
          <a
            href="/"
            className="group flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] transition-opacity duration-300 hover:opacity-100 md:gap-3"
          >
            <span className="flex size-7 items-center justify-center rounded-full border border-current transition-transform duration-300 ease-out group-hover:-translate-x-1 md:size-8">
              <ArrowLeft className="size-3.5" aria-hidden />
            </span>
            <span>Galeria</span>
          </a>
        </motion.header>

        {/* -------------------------------------------------------- Hero */}
        <section className="pt-12 md:pt-20">
          <div className="px-4 md:px-8">
            <div className="mx-auto max-w-[1760px]">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-ink">
                  <img
                    src={study.cover}
                    alt={`Apresentação do projeto ${study.title}`}
                    className="aspect-[16/10] w-full object-cover md:aspect-[21/9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>

          <StaggerGroup className="mx-auto mt-12 grid max-w-[1760px] gap-8 px-6 sm:grid-cols-2 md:px-20 lg:grid-cols-[1.5fr_2fr_2fr_1fr_1fr]">
            <MetaColumn label="Nome do projeto">
              <h1 className="text-sm font-medium text-ink">{study.title}</h1>
            </MetaColumn>
            <MetaColumn label="O que fizemos">
              {study.services.map((service) => (
                <Chip key={service}>{service}</Chip>
              ))}
            </MetaColumn>
            <MetaColumn label="Indústrias">
              {study.industries.map((industry) => (
                <Chip key={industry}>{industry}</Chip>
              ))}
            </MetaColumn>
            <MetaColumn label="Localização">
              <span className="flex items-center gap-1.5 text-sm text-ink">
                <MapPin className="size-4 text-stone-soft" aria-hidden />
                {study.location}
              </span>
            </MetaColumn>
            <MetaColumn label="Estágio">
              <Chip>{study.growthStage}</Chip>
            </MetaColumn>
          </StaggerGroup>
        </section>

        {/* ------------------------------- Introdução / Desafio / Abordagem */}
        <section className="px-6 py-20 md:px-20 md:py-28">
          <StaggerGroup className="mx-auto grid max-w-[1760px] gap-x-8 gap-y-12 md:grid-cols-3">
            {narrative.map(([heading, body]) => (
              <motion.div key={heading} variants={item}>
                <h2 className="text-xl font-medium leading-snug">{heading}</h2>
                <p className="mt-4 max-w-[523px] text-[15px] leading-relaxed text-charcoal">
                  {body}
                </p>
              </motion.div>
            ))}
          </StaggerGroup>
        </section>

        {/* ------------------------------------------------- Mosaico bento */}
        <section className="px-4 md:px-8">
          <div className="mx-auto max-w-[1760px] space-y-4">
            <StaggerGroup className="grid grid-cols-2 gap-4 md:grid-cols-8">
              <motion.img
                variants={item}
                src={show.bento[0]}
                alt="Detalhe do projeto"
                loading="lazy"
                className="col-span-2 h-[220px] w-full rounded-2xl object-cover sm:h-[340px] md:col-span-4 lg:h-[520px]"
              />
              <motion.img
                variants={item}
                src={show.bento[1]}
                alt="Detalhe do projeto"
                loading="lazy"
                className="col-span-1 h-[220px] w-full rounded-2xl object-cover sm:h-[340px] md:col-span-2 lg:h-[520px]"
              />
              <motion.img
                variants={item}
                src={show.bento[2]}
                alt="Detalhe do projeto"
                loading="lazy"
                className="col-span-1 h-[220px] w-full rounded-2xl object-cover sm:h-[340px] md:col-span-2 lg:h-[520px]"
              />
            </StaggerGroup>
            <StaggerGroup className="grid grid-cols-2 gap-4 md:grid-cols-8">
              <motion.img
                variants={item}
                src={show.bento[3]}
                alt="Detalhe do projeto"
                loading="lazy"
                className="col-span-1 h-[180px] w-full rounded-2xl object-cover sm:h-[280px] md:col-span-1 lg:h-[440px]"
              />
              <motion.img
                variants={item}
                src={show.bento[4]}
                alt="Detalhe do projeto"
                loading="lazy"
                className="col-span-1 h-[180px] w-full rounded-2xl object-cover sm:h-[280px] md:col-span-2 lg:h-[440px]"
              />
              <motion.img
                variants={item}
                src={show.bento[5]}
                alt="Detalhe do projeto"
                loading="lazy"
                className="col-span-2 h-[180px] w-full rounded-2xl object-cover sm:h-[280px] md:col-span-3 lg:h-[440px]"
              />
              <motion.img
                variants={item}
                src={show.bento[6]}
                alt="Detalhe do projeto"
                loading="lazy"
                className="col-span-2 h-[180px] w-full rounded-2xl object-cover sm:h-[280px] md:col-span-2 lg:h-[440px]"
              />
            </StaggerGroup>
          </div>
        </section>

        {/* ---------------------------------------------------- Legenda 1 */}
        <Caption>{study.captionOne}</Caption>

        {/* -------------------------------------------------- Grade 2×2 */}
        <section className="px-4 md:px-8">
          <StaggerGroup className="mx-auto grid max-w-[1760px] grid-cols-1 gap-4 sm:grid-cols-2">
            {show.grid.map((src, i) => (
              <motion.img
                key={src}
                variants={item}
                src={src}
                alt={`Tela ${i + 1} do projeto`}
                loading="lazy"
                className="aspect-[16/10] w-full rounded-2xl object-cover"
              />
            ))}
          </StaggerGroup>
        </section>

        {/* ------------------------------------------------ Imagem full-width */}
        <section className="px-4 pt-4 md:px-8">
          <Reveal className="mx-auto max-w-[1760px]">
            <img
              src={show.full}
              alt={`Visão ampla do projeto ${study.title}`}
              loading="lazy"
              className="aspect-[16/9] w-full rounded-2xl object-cover"
            />
          </Reveal>
        </section>

        {/* ------------------------------------------- Nota "Website" */}
        <section className="px-6 py-16 md:px-20 md:py-20">
          <Reveal className="mx-auto max-w-[1760px]">
            <p className="text-sm font-medium text-ink/40">Website</p>
            <p className="mt-8 max-w-[1024px] text-[clamp(1.25rem,2.5vw,1.5rem)] font-medium leading-[1.3] text-ink">
              {study.websiteNote}
            </p>
          </Reveal>
        </section>

        {/* -------------------------------------------- Mockup navegador 1 */}
        <section className="px-4 md:px-8">
          <Reveal className="mx-auto max-w-[1760px]">
            <BrowserMockup
              url={host}
              image={show.mockups[0]}
              alt={`Site do projeto ${study.title}`}
            />
          </Reveal>
        </section>

        {/* ---------------------------------------------------- Legenda 2 */}
        <Caption>{study.captionTwo}</Caption>

        {/* -------------------------------------------- Mockup navegador 2 */}
        <section className="px-4 md:px-8">
          <Reveal className="mx-auto max-w-[1760px]">
            <BrowserMockup
              url={host}
              image={show.mockups[1]}
              alt={`Interface do projeto ${study.title}`}
            />
          </Reveal>
        </section>

        {/* -------------------------------------------------- Depoimento */}
        <section className="px-4 py-16 md:px-8 md:py-24">
          <Reveal className="mx-auto max-w-[1760px]">
            <div className="rounded-2xl bg-ink/[0.03] p-5 sm:p-10 md:p-16">
              <div className="mx-auto max-w-[1080px]">
                <img
                  src={show.testimonialImage}
                  alt="Contexto do depoimento"
                  loading="lazy"
                  className="aspect-[16/9] w-full rounded-xl object-cover"
                />
                <div className="mt-4 rounded-xl border border-ink/15 p-8 md:p-10">
                  <p className="text-[clamp(1.4rem,3vw,2rem)] font-medium italic leading-snug tracking-tight text-ink">
                    “{study.testimonial.quote}”
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <img
                      src={show.avatar}
                      alt={`Foto de ${study.testimonial.author}`}
                      loading="lazy"
                      className="size-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {study.testimonial.author}
                      </p>
                      <p className="text-[13px] text-stone-soft">
                        {study.testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* -------------------------------------------------------- CTA final */}
        <section className="px-4 md:px-8">
          <Reveal className="mx-auto flex max-w-[1760px] flex-col items-center gap-8 rounded-[32px] bg-cream-soft px-6 py-24 text-center md:py-32">
            <h2 className="text-[clamp(2.2rem,6vw,3rem)] font-medium tracking-tight">
              Vamos construir algo.
            </h2>
            <a
              href={mailto}
              className="rounded-full bg-ink px-8 py-4 text-base font-medium text-cream transition-opacity hover:opacity-80"
            >
              Entrar em contato
            </a>
          </Reveal>
        </section>

        {/* ------------------------------------------------- Quer ver mais? */}
        <section className="px-4 pt-20 pb-12 md:px-8 md:pt-28">
          <div className="mx-auto max-w-[1760px]">
            <Reveal>
              <h2 className="text-[clamp(1.6rem,4vw,2.25rem)] font-medium tracking-tight">
                Quer ver mais?
              </h2>
            </Reveal>
            <StaggerGroup className="mt-8 grid gap-4 md:grid-cols-2">
              {related.map((rc) => (
                <motion.a
                  key={rc.slug}
                  variants={item}
                  href={`/case/${rc.slug}`}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-2xl bg-ink">
                    <img
                      src={rc.cover}
                      alt={`Capa do case ${rc.title}`}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium">{rc.title}</p>
                </motion.a>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* ------------------------------------------------------------ Footer */}
        <footer className="border-t border-ink/10">
          <div className="flex flex-col gap-4 px-6 py-10 text-[13px] text-stone-soft md:flex-row md:items-center md:justify-between md:px-10">
            <a href={mailto} className="transition-colors hover:text-ink">
              {CONTACT_EMAIL}
            </a>
            <a
              href="/"
              className="tracking-[0.2em] transition-colors hover:text-ink"
            >
              ← VOLTAR PARA A GALERIA
            </a>
          </div>
        </footer>

        {/* -------------------------------- Pílula flutuante (chat/contato) */}
        <a
          href={mailto}
          className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-cream shadow-lg transition-opacity hover:opacity-90"
        >
          <span className="size-2 rounded-full bg-[#28ca41]" />
          Vamos trabalhar juntos
        </a>
      </div>
    </MotionConfig>
  );
};

export default CasePage;
