import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, MotionConfig, type Variants } from 'framer-motion';
import { MapPin, Menu, ArrowUp } from 'lucide-react';
import Logo from '@/components/Logo';
import GalleryMenu from '@/components/galeria-imersiva/GalleryMenu';
import { ContactLink } from '@/components/loader/ContactTransition';
import IconTooltip from '@/components/ui/IconTooltip';
import LanguageToggle from '@/components/ui/LanguageToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { getCaseBySlug, getRelatedCases, getShowcase } from '@/data/cases';
import { useI18n } from '@/lib/i18n';

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

/** Gutter lateral do site (`px-6` / `md:px-10`) — header e conteúdo. */
const PAGE_X = 'px-6 md:px-10';
const PAGE_SHELL = 'mx-auto max-w-[1760px]';

/** Eyebrow pequeno (Website, case study, etc.). */
const LABEL =
  'text-[11px] font-medium uppercase tracking-[0.16em] text-stone-soft';

/**
 * Títulos de seção — mesma escala para "Nome do projeto", "Introdução",
 * "Desafio", "Abordagem", etc.
 */
const SECTION_TITLE =
  'text-[clamp(1.35rem,2.4vw,1.75rem)] font-medium tracking-tight text-ink';

/** Corpo — também usado no nome do projeto e na localização. */
const BODY = 'text-[15px] leading-relaxed text-charcoal md:text-[16px]';

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
    <p className={SECTION_TITLE}>{label}</p>
    <div className="mt-3 flex flex-wrap items-center gap-2">{children}</div>
  </motion.div>
);

/** Legenda curta (parágrafo estreito, estilo Figma). */
const Caption = ({ children }: { children: React.ReactNode }) => (
  <section className={`${PAGE_X} py-12 md:py-16`}>
    <Reveal className={PAGE_SHELL}>
      <p className={`max-w-[512px] ${BODY}`}>{children}</p>
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
    <div className="mx-auto max-w-[1152px] overflow-hidden rounded-xl bg-surface shadow-sm ring-1 ring-ink/10">
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

type Props = {
  slug: string;
  /** Mostra a vitrine completa com placeholders (só para preview local). */
  previewShowcase?: boolean;
};

const caseDocumentTitle = (title: string) =>
  `John Amorim - ${title.charAt(0).toUpperCase()}${title.slice(1).toLowerCase()}`;

const CasePage = ({ slug, previewShowcase = false }: Props) => {
  const { t, lang } = useI18n();
  const study = getCaseBySlug(slug, lang);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    document.title = study
      ? caseDocumentTitle(study.title)
      : 'John Amorim - Case não encontrado';
    window.scrollTo(0, 0);
  }, [study]);

  if (!study) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-surface text-ink">
        <p className="text-sm tracking-[0.2em] text-stone-soft">{t('case.notFound')}</p>
        <a
          href="/"
          className="text-lg underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
        >
          ← {t('nav.backToGallery')}
        </a>
      </div>
    );
  }

  const show = previewShowcase ? getShowcase(study) : null;
  const related = getRelatedCases(study.slug, 2, lang);
  const host = `${study.slug.replace(/-/g, '')}.com.br`;
  const narrative: [string, string][] = [
    [t('case.intro'), study.intro],
    [t('case.challenge'), study.challenge],
    [t('case.approach'), study.approach],
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-surface text-ink">
        {/* Header fixo — mix-blend-difference adapta a marca a fundos claros/escuros */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 text-white mix-blend-difference md:px-10"
        >
          {/* Logo — monograma JA */}
          <a
            href="/"
            aria-label="John Amorim — voltar ao início"
            className="transition-opacity duration-300 hover:opacity-70"
          >
            <Logo className="h-6 w-auto md:h-7" />
          </a>

          {/* Idioma · tema · menu — idioma só no case */}
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <IconTooltip label={t('nav.openMenu')}>
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-label={t('nav.openMenu')}
                className="transition-opacity duration-300 hover:opacity-60"
              >
                <Menu className="size-6" strokeWidth={1.5} aria-hidden />
              </button>
            </IconTooltip>
          </div>
        </motion.header>

        <GalleryMenu open={menuOpen} onClose={closeMenu} />

        {/* -------------------------------------------------------- Hero */}
        <section className="pt-12 md:pt-20">
          <div className={PAGE_X}>
            <div className={PAGE_SHELL}>
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
                    className="aspect-[16/9] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>

          <div className={`${PAGE_X} mt-12`}>
            <StaggerGroup
              className={`${PAGE_SHELL} grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_2fr_2fr_1fr_1fr]`}
            >
              <MetaColumn label={t('case.projectName')}>
                <h1 className={BODY}>{study.title}</h1>
              </MetaColumn>
              <MetaColumn label={t('case.whatWeDid')}>
                {study.services.map((service) => (
                  <Chip key={service}>{service}</Chip>
                ))}
              </MetaColumn>
              <MetaColumn label={t('case.industries')}>
                {study.industries.map((industry) => (
                  <Chip key={industry}>{industry}</Chip>
                ))}
              </MetaColumn>
              <MetaColumn label={t('case.location')}>
                <span className={`flex items-center gap-1.5 ${BODY}`}>
                  <MapPin className="size-4 shrink-0 opacity-60" aria-hidden />
                  {study.location}
                </span>
              </MetaColumn>
              <MetaColumn label={t('case.stage')}>
                <Chip>{study.growthStage}</Chip>
              </MetaColumn>
            </StaggerGroup>
          </div>
        </section>

        {/* ------------------------------- Introdução / Desafio / Abordagem */}
        <section className={`${PAGE_X} py-20 md:py-28`}>
          <StaggerGroup
            className={`${PAGE_SHELL} grid gap-x-8 gap-y-12 md:grid-cols-3`}
          >
            {narrative.map(([heading, body]) => (
              <motion.div key={heading} variants={item}>
                <h2 className={SECTION_TITLE}>{heading}</h2>
                <p className={`mt-4 max-w-[40ch] ${BODY}`}>{body}</p>
              </motion.div>
            ))}
          </StaggerGroup>
        </section>

        {previewShowcase && show ? (
          <>
            {/* ------------------------------------------------- Mosaico bento */}
            <section className={PAGE_X}>
              <div className={`${PAGE_SHELL} space-y-4`}>
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
            <section className={PAGE_X}>
              <StaggerGroup className={`${PAGE_SHELL} grid grid-cols-1 gap-4 sm:grid-cols-2`}>
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
            <section className={`${PAGE_X} pt-4`}>
              <Reveal className={PAGE_SHELL}>
                <img
                  src={show.full}
                  alt={`Visão ampla do projeto ${study.title}`}
                  loading="lazy"
                  className="aspect-[16/9] w-full rounded-2xl object-cover"
                />
              </Reveal>
            </section>

            {/* ------------------------------------------- Nota "Website" */}
            <section className={`${PAGE_X} py-16 md:py-20`}>
              <Reveal className={PAGE_SHELL}>
                <p className={LABEL}>{t('case.website')}</p>
                <p className="mt-8 max-w-[1024px] text-[clamp(1.25rem,2.5vw,1.5rem)] font-medium leading-[1.3] text-ink">
                  {study.websiteNote}
                </p>
              </Reveal>
            </section>

            {/* -------------------------------------------- Mockup navegador 1 */}
            <section className={PAGE_X}>
              <Reveal className={PAGE_SHELL}>
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
            <section className={PAGE_X}>
              <Reveal className={PAGE_SHELL}>
                <BrowserMockup
                  url={host}
                  image={show.mockups[1]}
                  alt={`Interface do projeto ${study.title}`}
                />
              </Reveal>
            </section>

            {/* -------------------------------------------------- Depoimento */}
            <section className={`${PAGE_X} py-16 md:py-24`}>
              <Reveal className={PAGE_SHELL}>
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
                          <p className="text-[15px] font-medium text-ink">
                            {study.testimonial.author}
                          </p>
                          <p className={LABEL}>{study.testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </section>
          </>
        ) : (
          <section className={`${PAGE_X} pb-8`}>
            <Reveal
              className={`${PAGE_SHELL} flex flex-col items-center justify-center gap-3 rounded-3xl bg-cream-soft px-6 py-24 text-center md:py-32`}
            >
              <p className={LABEL}>{t('case.label')}</p>
              <h2 className={SECTION_TITLE}>{t('case.wip')}</h2>
              <p className={`max-w-md ${BODY}`}>{t('case.wipBody')}</p>
            </Reveal>
          </section>
        )}

        {/* -------------------------------------------------------- CTA final */}
        <section className={PAGE_X}>
          <Reveal
            className={`${PAGE_SHELL} flex flex-col items-center gap-8 rounded-[32px] bg-cream-soft px-6 py-24 text-center md:py-32`}
          >
            <h2 className="text-[clamp(2.2rem,6vw,3rem)] font-medium tracking-tight">
              {t('case.ctaTitle')}
            </h2>
            <ContactLink
              className="rounded-full bg-ink px-8 py-4 text-base font-medium text-cream transition-opacity hover:opacity-80"
            >
              {t('case.ctaAction')}
            </ContactLink>
          </Reveal>
        </section>

        {/* ------------------------------------------------- Quer ver mais? */}
        <section className={`${PAGE_X} pt-20 pb-28 md:pt-28 md:pb-36`}>
          <div className={PAGE_SHELL}>
            <Reveal>
              <h2 className={SECTION_TITLE}>{t('case.more')}</h2>
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
                  <p className="mt-3 text-[15px] font-medium text-ink">{rc.title}</p>
                </motion.a>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* -------------------------------- Pílula flutuante (contato) */}
        <IconTooltip
          label={t('case.ctaAction')}
          side="top"
          className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-5.5rem)] md:bottom-6 md:left-6 md:max-w-none"
        >
          <ContactLink className="inline-flex max-w-full items-center gap-2 truncate rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-cream shadow-lg transition-opacity hover:opacity-90">
            <span className="size-2 shrink-0 rounded-full bg-[#28ca41]" />
            <span className="truncate">{t('case.floating')}</span>
          </ContactLink>
        </IconTooltip>

        {/* -------------------------------- Voltar ao topo */}
        <IconTooltip
          label={t('nav.backToTop')}
          side="top"
          className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6"
        >
          <button
            type="button"
            onClick={scrollToTop}
            aria-label={t('nav.backToTop')}
            className="inline-flex size-12 items-center justify-center rounded-full border border-ink/20 bg-surface text-ink shadow-lg transition-colors hover:border-ink hover:bg-ink hover:text-cream"
          >
            <ArrowUp className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
        </IconTooltip>
      </div>
    </MotionConfig>
  );
};

export default CasePage;
