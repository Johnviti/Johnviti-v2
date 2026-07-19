import { lazy, Suspense } from 'react';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { CaseStudies } from '@/components/site/CaseStudies';
import { Statement } from '@/components/site/Statement';
import { Services } from '@/components/site/Services';
import { Marquee } from '@/components/site/Marquee';
import { Footer } from '@/components/site/Footer';
import { SOCIALS } from '@/data/site';

const ThreeDTestPage = lazy(() => import('@/ThreeDTestPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const MinimalPage = lazy(() => import('@/pages/MinimalPage'));
const WorldPage = lazy(() => import('@/pages/WorldPage'));
const PlaygroundPage = lazy(() => import('@/pages/PlaygroundPage'));
const OrbitPage = lazy(() => import('@/pages/OrbitPage'));
const MosaicPage = lazy(() => import('@/pages/MosaicPage'));
const GaleriaImersivaPage = lazy(() => import('@/pages/GaleriaImersivaPage'));
const CasePage = lazy(() => import('@/pages/CasePage'));

const PageLoader = () => (
  <div className="flex min-h-svh items-center justify-center bg-cream text-ink">
    <span className="animate-pulse text-sm">carregando…</span>
  </div>
);

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const caseSlug = path.startsWith('/case/') ? path.slice('/case/'.length) : null;

  const page =
    path === '/3d-test' ? (
      <ThreeDTestPage />
    ) : path === '/galeria' ? (
      <GalleryPage />
    ) : path === '/minimal' ? (
      <MinimalPage />
    ) : path === '/mundo' ? (
      <WorldPage />
    ) : path === '/playground' ? (
      <PlaygroundPage />
    ) : path === '/orbita' ? (
      <OrbitPage />
    ) : path === '/mosaico' ? (
      <MosaicPage />
    ) : path === '/galeria-imersiva' ? (
      <GaleriaImersivaPage />
    ) : caseSlug ? (
      <CasePage slug={caseSlug} />
    ) : null;

  if (page) {
    return <Suspense fallback={<PageLoader />}>{page}</Suspense>;
  }

  const github = SOCIALS.find((s) => s.label === 'GitHub')?.href ?? '#';

  return (
    <div className="bg-cream text-ink">
      <Header />
      <main>
        <Hero />
        <CaseStudies />
        <Statement
          id="sobre"
          text="Trabalho de ponta a ponta e uno design, tecnologia e dados para criar produtos digitais que geram resultado de verdade."
        />
        <Services />
        <Statement text="Projetos para clientes são só uma parte do que eu faço. Também adoro experimentar por conta própria.">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="group mt-10 inline-flex items-center gap-2 text-lg"
          >
            <span className="underline decoration-1 underline-offset-4 transition-opacity group-hover:opacity-60">
              Ver experimentos no GitHub
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
          </a>
        </Statement>
        <Marquee />
      </main>
      <Footer />
    </div>
  );
}

export default App;
