import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useAppReady } from '../context/app-ready';
import { useScrollTo } from '../hooks/useLenis';
import { projects } from '../data/projects';
import { Footer } from '../components/layout/Footer';
import { PageTransition } from '../components/PageTransition';

const EASE = [0.22, 1, 0.36, 1] as const;

function TitleLine({ text, delay, ready }: { text: string; delay: number; ready: boolean }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
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

  return (
    <section className="relative flex min-h-svh flex-col justify-between px-5 pt-16 md:px-10">
      <div className="flex flex-1 items-center">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-3 lg:items-end">
          <h1 className="col-span-2 font-display text-[clamp(3rem,9.5vw,9.5rem)] leading-[0.92] font-medium tracking-tight uppercase">
            <TitleLine text={t('hero.line1')} delay={0.1} ready={ready} />
            <TitleLine text={t('hero.line2')} delay={0.22} ready={ready} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
            className="max-w-xs text-sm leading-relaxed text-muted lg:justify-self-end"
          >
            {t('hero.intro')}
          </motion.p>
        </div>
      </div>

      {/* Três blocos de meta — espelham os "cards" do wireframe do preloader */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
        className="mb-[7vh] grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3"
      >
        <div className="flex min-h-24 flex-col justify-between bg-ink p-4">
          <span className="tech-label text-muted">01 / LOC</span>
          <span className="tech-label">{t('hero.location')}</span>
        </div>
        <div className="flex min-h-24 flex-col justify-between bg-ink p-4">
          <span className="tech-label text-muted">02 / STATUS</span>
          <span className="tech-label flex items-center gap-2">
            <span className="inline-block size-1.5 animate-pulse bg-accent" />
            {t('hero.availability')}
          </span>
        </div>
        <div className="flex min-h-24 flex-col justify-between bg-ink p-4">
          <span className="tech-label text-muted">03 / NAV</span>
          <span className="tech-label text-muted">{t('hero.scroll')} ↓</span>
        </div>
      </motion.div>
    </section>
  );
}

function WorkSection() {
  const { t, locale } = useI18n();

  return (
    <section id="work" className="relative z-10 px-5 py-24 md:px-10 md:py-36">
      <div className="flex items-end justify-between border-b border-line pb-6">
        <div>
          <p className="tech-label text-muted">{t('work.label')}</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,6vw,5rem)] leading-none font-medium tracking-tight uppercase">
            {t('work.title')}
          </h2>
        </div>
        <span className="tech-label text-muted">({String(projects.length).padStart(2, '0')})</span>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            className="group block"
            aria-label={`${t('work.view')}: ${project.title}`}
          >
            <div className="overflow-hidden border border-line">
              <img
                src={project.image}
                alt=""
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-4">
                <span className="tech-label text-muted">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-xl font-medium tracking-tight uppercase transition-colors group-hover:text-accent">
                  {project.title}
                </h3>
              </div>
              <span className="tech-label text-muted">
                {project.category[locale]} — {project.year}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative z-10 border-t border-line px-5 py-24 md:px-10 md:py-36">
      <p className="tech-label text-muted">{t('about.label')}</p>
      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <h2 className="font-display text-[clamp(1.8rem,4vw,3.5rem)] leading-tight font-medium tracking-tight">
          {t('about.title')}
        </h2>
        <p className="max-w-lg text-base leading-relaxed text-muted">{t('about.text')}</p>
      </div>
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
        <WorkSection />
        <AboutSection />
      </main>
      <Footer />
    </PageTransition>
  );
}
