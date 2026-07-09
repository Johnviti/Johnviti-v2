import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useAppReady } from '../context/app-ready';
import { useScrollTo } from '../hooks/useLenis';
import { projects } from '../data/projects';
import { Footer } from '../components/layout/Footer';
import { PageTransition } from '../components/PageTransition';
import { Marquee } from '../components/ui/Marquee';
import { ImagePlaceholder } from '../components/ui/ImagePlaceholder';
import { cn } from '../lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

const MARQUEE_ITEMS = ['Creative Developer', 'WebGL', 'Motion', 'React', 'Three.js', 'UI Engineering'];

// Padrão de grid alternado dos cards, estilo riseatseven
const CARD_LAYOUT = [
  { span: 'md:col-span-7', ratio: 'aspect-[4/3]' },
  { span: 'md:col-span-5 md:mt-32', ratio: 'aspect-[4/5]' },
  { span: 'md:col-span-5', ratio: 'aspect-[4/5]' },
  { span: 'md:col-span-7 md:mt-32', ratio: 'aspect-[4/3]' },
];

function TitleLine({
  text,
  delay,
  ready,
  outline,
}: {
  text: string;
  delay: number;
  ready: boolean;
  outline?: boolean;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={cn('block', outline && 'text-outline')}
        initial={{ y: '110%' }}
        animate={ready ? { y: 0 } : {}}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

function Hero() {
  const { t } = useI18n();
  const ready = useAppReady();
  const scrollTo = useScrollTo();

  return (
    <section className="relative flex min-h-svh flex-col justify-between pt-24">
      <div className="px-5 md:px-10">
        <h1 className="font-display text-[clamp(4rem,15vw,15rem)] leading-[0.88] font-semibold tracking-[-0.03em] uppercase">
          <TitleLine text={t('hero.line1')} delay={0.1} ready={ready} />
          <TitleLine text={t('hero.line2')} delay={0.22} ready={ready} outline />
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="inline-block size-2 animate-pulse rounded-full bg-accent" />
            <span className="tech-label text-muted">
              {t('hero.availability')} — {t('hero.location')}
            </span>
          </div>

          <div className="flex max-w-sm flex-col items-start gap-6">
            <p className="text-base leading-relaxed text-muted">{t('hero.intro')}</p>
            <button
              type="button"
              onClick={() => scrollTo('#work')}
              className="tech-label cursor-pointer rounded-full border border-ink px-6 py-3.5 transition-colors hover:bg-ink hover:text-base"
            >
              {t('hero.cta')} ↓
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
        className="mt-16"
      >
        <Marquee items={MARQUEE_ITEMS} />
      </motion.div>
    </section>
  );
}

function Showreel() {
  const { t } = useI18n();

  return (
    <section aria-label={t('common.showreel')} className="px-5 py-20 md:px-10 md:py-28">
      <ImagePlaceholder
        label={t('common.showreel')}
        className="h-[60vh] w-full rounded-3xl md:h-[75vh]"
      />
    </section>
  );
}

function WorkSection() {
  const { t, locale } = useI18n();

  return (
    <section id="work" className="relative z-10 px-5 pb-24 md:px-10 md:pb-36">
      <div className="flex items-end justify-between border-b border-line pb-6">
        <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-none font-semibold tracking-tight uppercase">
          {t('work.title')}
        </h2>
        <span className="tech-label text-muted">({String(projects.length).padStart(2, '0')})</span>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12">
        {projects.map((project, i) => {
          const layout = CARD_LAYOUT[i % CARD_LAYOUT.length];
          return (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className={cn('group block', layout.span)}
              aria-label={`${t('work.view')}: ${project.title}`}
            >
              <div className="overflow-hidden rounded-2xl">
                <ImagePlaceholder
                  className={cn(
                    'w-full rounded-2xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]',
                    layout.ratio,
                  )}
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold tracking-tight uppercase transition-colors group-hover:text-accent md:text-3xl">
                  {project.title}
                </h3>
                <span className="tech-label shrink-0 text-muted">
                  {project.category[locale]} — {project.year}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function AboutSection() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative z-10 border-t border-line px-5 py-24 md:px-10 md:py-40">
      <p className="tech-label text-muted">{t('about.label')}</p>
      <p className="mt-8 max-w-5xl font-display text-[clamp(1.75rem,4.2vw,4rem)] leading-[1.15] font-medium tracking-tight">
        {t('about.statement')}
      </p>
      <p className="mt-10 max-w-md text-base leading-relaxed text-muted">{t('about.text')}</p>
    </section>
  );
}

function ServicesSection() {
  const { t } = useI18n();
  const items = ['s1', 's2', 's3', 's4'];

  return (
    <section className="relative z-10 px-5 pb-28 md:px-10 md:pb-40">
      <p className="tech-label border-b border-line pb-6 text-muted">{t('services.label')}</p>
      <ul>
        {items.map((key, i) => (
          <li
            key={key}
            className="group flex flex-col gap-2 border-b border-line py-8 transition-colors hover:bg-block/40 md:flex-row md:items-baseline md:gap-10 md:py-10"
          >
            <span className="tech-label w-12 shrink-0 text-muted">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-[clamp(1.75rem,4.5vw,4rem)] leading-none font-semibold tracking-tight uppercase transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:translate-x-4">
              {t(`services.items.${key}.title`)}
            </h3>
            <span className="tech-label text-muted md:ml-auto md:shrink-0">
              {t(`services.items.${key}.desc`)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  const location = useLocation();
  const scrollTo = useScrollTo();

  // Navegação vinda de outra rota com um alvo de seção (ex.: header na página de projeto)
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      const id = setTimeout(() => scrollTo(target), 550);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <PageTransition>
      <main id="main">
        <Hero />
        <Showreel />
        <WorkSection />
        <AboutSection />
        <ServicesSection />
      </main>
      <Footer />
    </PageTransition>
  );
}
