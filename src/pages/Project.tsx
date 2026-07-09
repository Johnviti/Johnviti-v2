import { Link, Navigate, useParams } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { getNextProject, getProject } from '../data/projects';
import { Footer } from '../components/layout/Footer';
import { PageTransition } from '../components/PageTransition';
import { ImagePlaceholder } from '../components/ui/ImagePlaceholder';

export default function Project() {
  const { slug } = useParams();
  const { t, locale } = useI18n();
  const project = getProject(slug);

  if (!project) return <Navigate to="/" replace />;

  const next = getNextProject(project.slug);

  return (
    <PageTransition>
      <main id="main" className="relative z-10 px-5 pt-32 md:px-10">
        <Link to="/" className="tech-label text-muted transition-colors hover:text-ink">
          ← {t('project.back')}
        </Link>

        <h1 className="mt-8 font-display text-[clamp(2.5rem,10vw,10rem)] leading-[0.92] font-semibold tracking-tight uppercase">
          {project.title}
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          <div className="flex flex-col gap-2 bg-base p-5">
            <span className="tech-label text-muted">{t('project.category')}</span>
            <span className="tech-label">{project.category[locale]}</span>
          </div>
          <div className="flex flex-col gap-2 bg-base p-5">
            <span className="tech-label text-muted">{t('project.role')}</span>
            <span className="tech-label">{project.role[locale]}</span>
          </div>
          <div className="flex flex-col gap-2 bg-base p-5">
            <span className="tech-label text-muted">{t('project.year')}</span>
            <span className="tech-label">{project.year}</span>
          </div>
        </div>

        <ImagePlaceholder className="mt-12 aspect-video w-full rounded-3xl" />

        <p className="mt-16 max-w-2xl text-lg leading-relaxed text-muted">
          {project.description[locale]}
        </p>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <ImagePlaceholder className="aspect-[4/3] w-full rounded-2xl" />
          <ImagePlaceholder className="aspect-[4/3] w-full rounded-2xl" />
        </div>

        <Link
          to={`/projects/${next.slug}`}
          className="group mt-28 mb-4 block border-t border-line pt-10 pb-16"
        >
          <span className="tech-label text-muted">{t('project.next')}</span>
          <span className="mt-4 block font-display text-[clamp(2rem,7vw,6rem)] leading-none font-semibold tracking-tight uppercase transition-colors group-hover:text-accent">
            {next.title} →
          </span>
        </Link>
      </main>
      <Footer />
    </PageTransition>
  );
}
