import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig, type Variants } from 'framer-motion';
import { MapPin, ArrowUp } from 'lucide-react';
import Logo from '@/components/Logo';
import GalleryMenu from '@/components/galeria-imersiva/GalleryMenu';
import { ContactLink } from '@/components/loader/ContactTransition';
import GrainOverlay from '@/components/ui/GrainOverlay';
import GradualBlur from '@/components/ui/gradual-blur';
import IconTooltip from '@/components/ui/IconTooltip';
import LanguageToggle from '@/components/ui/LanguageToggle';
import MenuToggle from '@/components/ui/MenuToggle';
import SkipLink from '@/components/ui/SkipLink';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ButtonWithAnimatedArrow from '@/components/ui/ButtonWithAnimatedArrow';
import CaseVisualIdentity from '@/components/case/CaseVisualIdentity';
import { getCaseBySlug, getRelatedCases } from '@/data/cases';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { useI18n } from '@/lib/i18n';

/**
 * Página de case study — reprodução da estrutura do case study de agência
 * do Figma ("Estudo/Rascunhos → Primer"): hero com título + chips de
 * metadados + imagem grande, narrativa Introdução/Desafio/Abordagem,
 * mosaico bento, legendas, grade 2×2, imagem full-width, nota "Website",
 * mockups em janela de navegador, depoimento, CTA e projetos relacionados.
 *
 * TODO O CONTEÚDO vem de `src/data/cases.json`. Os blocos opcionais começam em
 * `null` e aparecem individualmente assim que recebem conteúdo real.
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

/** Iniciais do nome — no máximo duas, para caber no círculo. */
const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

/**
 * Avatar do depoimento: foto da pessoa quando existir (e carregar); iniciais do
 * nome quando não — mesmo padrão do monograma da identidade visual.
 */
const TestimonialAvatar = ({
  name,
  image,
}: {
  name: string;
  image?: string;
}) => {
  const [failed, setFailed] = useState(false);
  if (image && !failed) {
    return (
      <img
        src={image}
        alt={`Foto de ${name}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="size-9 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink/10 text-[12px] font-semibold text-ink"
    >
      {initialsOf(name)}
    </span>
  );
};

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
};

const caseDocumentTitle = (title: string) =>
  `John Amorim - ${title.charAt(0).toUpperCase()}${title.slice(1).toLowerCase()}`;

const CasePage = ({ slug }: Props) => {
  const { t, lang } = useI18n();
  const study = getCaseBySlug(slug, lang);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const narrativeSectionRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useDocumentMeta({
    title: study
      ? caseDocumentTitle(study.title)
      : 'John Amorim - Case não encontrado',
    description: study ? study.intro : t('case.notFound'),
    path: `/case/${slug}`,
    image: study?.cover,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [study]);

  /* A seta só passa a fazer sentido depois que o visitante terminou o bloco
     Introdução / Desafio / Abordagem. O observer também a esconde novamente
     quando a pessoa retorna ao início. */
  useEffect(() => {
    const section = narrativeSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setShowBackToTop(
          !entry.isIntersecting && entry.boundingClientRect.bottom <= 0,
        );
      },
      { threshold: 0 },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, [study?.slug]);

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

  const show = study.showcase;
  const related = getRelatedCases(study.slug, 2, lang);
  const host = `${study.slug.replace(/-/g, '')}.com.br`;
  const [firstMockup, ...remainingMockups] = show?.mockups ?? [];
  const hasExtendedContent = Boolean(
    study.visualIdentity ||
      study.captionOne ||
      show?.grid?.length ||
      show?.full ||
      study.websiteNote ||
      firstMockup ||
      study.captionTwo ||
      remainingMockups.length ||
      study.testimonial,
  );
  const narrative: [string, string][] = [
    [t('case.intro'), study.intro],
    [t('case.challenge'), study.challenge],
    [t('case.approach'), study.approach],
  ];
  const enteringFromGallery =
    document.documentElement.dataset.galleryCaseTransition === study.slug;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-svh bg-surface text-ink">
        <SkipLink />
        <GrainOverlay />
        {/* Blur gradual na borda inferior — suaviza o conteúdo sob as CTAs. */}
        <GradualBlur
          target="page"
          position="bottom"
          height="6rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={1}
          style={{ zIndex: 30 }}
        />
        {/* Header fixo — mix-blend-difference adapta a marca a fundos claros/escuros */}
        <motion.header
          initial={enteringFromGallery ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="gallery-case-shared-header pointer-events-none fixed inset-0 z-[70] select-none text-white mix-blend-difference"
        >
          {/* Logo — monograma JA */}
          <a
            href="/"
            aria-label="John Amorim — voltar ao início"
            className="pointer-events-auto absolute left-6 top-6 transition-opacity duration-300 hover:opacity-70 md:left-10 md:top-7"
          >
            <Logo className="h-8 w-auto" />
          </a>

          {/* Idioma · tema · menu — idioma só no case */}
          <div className="pointer-events-auto absolute right-6 top-5 flex items-center gap-4 md:right-10 md:top-6">
            <motion.div
              initial={enteringFromGallery ? { opacity: 0, x: 10 } : false}
              animate={{ opacity: menuOpen ? 0 : 1, x: 0 }}
              transition={{ duration: 0.35, delay: enteringFromGallery ? 0.18 : 0 }}
              className={menuOpen ? 'pointer-events-none' : undefined}
            >
              <LanguageToggle />
            </motion.div>
            <div
              className={`transition-opacity duration-300 ${
                menuOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            >
              <ThemeToggle />
            </div>
            <IconTooltip label={t(menuOpen ? 'nav.closeMenu' : 'nav.openMenu')}>
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-label={t(menuOpen ? 'nav.closeMenu' : 'nav.openMenu')}
                className="group relative flex size-11 items-center justify-center rounded-full text-white"
              >
                <span
                  aria-hidden
                  className={`absolute inset-0 rounded-full transition-[background-color,opacity] duration-300 ${
                    menuOpen
                      ? 'bg-white/[0.08] opacity-100 group-hover:bg-white/[0.14]'
                      : 'bg-transparent opacity-0'
                  }`}
                />
                <MenuToggle
                  open={menuOpen}
                  className="relative size-6 transition-opacity duration-300 group-hover:opacity-60"
                />
              </button>
            </IconTooltip>
          </div>
        </motion.header>

        <GalleryMenu open={menuOpen} onClose={closeMenu} />

        {/* -------------------------------------------------------- Hero */}
        <section id="conteudo" tabIndex={-1} className="pt-20 outline-none">
          <div className={PAGE_X}>
            <div className={PAGE_SHELL}>
              <motion.div
                initial={enteringFromGallery ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <div
                  data-case-hero={study.slug}
                  className="relative overflow-hidden rounded-3xl bg-ink"
                >
                  <img
                    data-case-hero-image
                    src={study.cover}
                    alt={`Apresentação do projeto ${study.title}`}
                    decoding="async"
                    className="aspect-[16/9] w-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <div className={`${PAGE_X} mt-12`}>
            <StaggerGroup
              className={`${PAGE_SHELL} grid gap-8 sm:grid-cols-2 ${
                study.services?.length
                  ? 'lg:grid-cols-[1.5fr_2fr_2fr_1fr_1fr]'
                  : 'lg:grid-cols-[1.5fr_2fr_1fr_1fr]'
              }`}
            >
              <MetaColumn label={t('case.projectName')}>
                <h1 className={BODY}>{study.title}</h1>
              </MetaColumn>
              {study.services?.length ? (
                <MetaColumn label={t('case.whatWeDid')}>
                  {study.services.map((service) => (
                    <Chip key={service}>{service}</Chip>
                  ))}
                </MetaColumn>
              ) : null}
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
        <section ref={narrativeSectionRef} className={`${PAGE_X} py-20 md:py-28`}>
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

        {hasExtendedContent ? (
          <>
            {study.visualIdentity ? (
              <section className={PAGE_X}>
                <div className={PAGE_SHELL}>
                  <CaseVisualIdentity identity={study.visualIdentity} />
                </div>
              </section>
            ) : null}

            {study.captionOne ? <Caption>{study.captionOne}</Caption> : null}

            {show?.grid?.length ? (
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
            ) : null}

            {show?.full ? (
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
            ) : null}

            {study.websiteNote ? (
              <section className={`${PAGE_X} py-16 md:py-20`}>
                <Reveal className={PAGE_SHELL}>
                  <p className={LABEL}>{t('case.website')}</p>
                  <p className="mt-8 max-w-[1024px] text-[clamp(1.25rem,2.5vw,1.5rem)] font-medium leading-[1.3] text-ink">
                    {study.websiteNote}
                  </p>
                </Reveal>
              </section>
            ) : null}

            {firstMockup ? (
              <section className={PAGE_X}>
                <Reveal className={`${PAGE_SHELL} space-y-6`}>
                  <h3 className={SECTION_TITLE}>{firstMockup.title}</h3>
                  <BrowserMockup
                    url={host}
                    image={firstMockup.src}
                    alt={`${firstMockup.title} — ${study.title}`}
                  />
                </Reveal>
              </section>
            ) : null}

            {study.captionTwo ? <Caption>{study.captionTwo}</Caption> : null}

            {remainingMockups.map((mockup) => (
              <section key={`${mockup.src}-${mockup.title}`} className={PAGE_X}>
                <Reveal className={`${PAGE_SHELL} space-y-6`}>
                  <h3 className={SECTION_TITLE}>{mockup.title}</h3>
                  <BrowserMockup
                    url={host}
                    image={mockup.src}
                    alt={`${mockup.title} — ${study.title}`}
                  />
                </Reveal>
              </section>
            ))}

            {study.testimonial ? (
              <section className={`${PAGE_X} py-16 md:py-24`}>
                <Reveal className={PAGE_SHELL}>
                  <figure className="mx-auto flex flex-col items-center rounded-[24px] bg-cream-soft px-6 py-16 text-center sm:px-10 md:py-24">
                    {study.testimonial.logo ? (
                      <img
                        src={study.testimonial.logo}
                        alt={study.testimonial.role}
                        loading="lazy"
                        decoding="async"
                        className="mb-8 h-10 w-auto object-contain"
                      />
                    ) : null}
                    <blockquote className="max-w-[62ch]">
                      <p className="text-[clamp(1.35rem,2.6vw,2rem)] font-medium leading-[1.4] tracking-[-0.01em] text-ink">
                        <span aria-hidden="true">“</span>
                        {study.testimonial.quote}
                        <span aria-hidden="true">”</span>
                      </p>
                    </blockquote>
                    <figcaption className="mt-8 flex items-center justify-center gap-3 text-[14px]">
                      <TestimonialAvatar
                        name={study.testimonial.author}
                        image={show?.avatar ?? undefined}
                      />
                      <span className="font-medium text-ink">
                        {study.testimonial.author}
                      </span>
                      <span aria-hidden="true" className="text-stone-soft">
                        ·
                      </span>
                      <span className="text-stone-soft">
                        {study.testimonial.role}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              </section>
            ) : null}
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
            <ContactLink>
              <ButtonWithAnimatedArrow asChild variant="primary">
                {t('case.ctaAction')}
              </ButtonWithAnimatedArrow>
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

        {/* -------------------------------- Voltar ao topo · WhatsApp */}
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-center gap-3 md:bottom-6 md:right-6">
          <AnimatePresence initial={false}>
            {showBackToTop && (
              <motion.div
                key="back-to-top"
                initial={{ opacity: 0, scale: 0.65, y: 20, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.72, y: 14, rotate: 10 }}
                transition={{
                  type: 'spring',
                  stiffness: 360,
                  damping: 23,
                  mass: 0.65,
                }}
                className="flex origin-bottom items-center justify-center"
              >
                <IconTooltip label={t('nav.backToTop')} side="top" align="right">
                  <motion.button
                    type="button"
                    onClick={scrollToTop}
                    aria-label={t('nav.backToTop')}
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    className="inline-flex size-12 items-center justify-center rounded-full border border-ink/20 bg-ink text-cream shadow-lg transition-colors hover:border-ink hover:bg-charcoal"
                  >
                    <ArrowUp className="size-5" strokeWidth={1.75} aria-hidden />
                  </motion.button>
                </IconTooltip>
              </motion.div>
            )}
          </AnimatePresence>
          <WhatsAppButton
            message={`Olá John! Vi o case "${study.title}" no seu portfólio e gostaria de conversar sobre um projeto.`}
          />
        </div>
      </div>
    </MotionConfig>
  );
};

export default CasePage;
