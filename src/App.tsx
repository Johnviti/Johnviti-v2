import { lazy, Suspense, useState } from 'react';
import Preloader from '@/components/loader/Preloader';
import {
  ContactTransitionEnter,
  ensureEnterReveal,
} from '@/components/loader/ContactTransition';
import {
  isContactPath,
  takeRouteTransitionEnter,
} from '@/lib/contactTransition';

const MinimalPage = lazy(() => import('@/pages/MinimalPage'));
// Rotas desativadas — reative junto com VERSIONS (data/site.ts).
// const WorldPage = lazy(() => import('@/pages/WorldPage'));
// const PlaygroundPage = lazy(() => import('@/pages/PlaygroundPage'));
const GaleriaImersivaPage = lazy(() => import('@/pages/GaleriaImersivaPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const CasePage = lazy(() => import('@/pages/CasePage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PreloaderLabPage = lazy(() => import('@/pages/PreloaderLabPage'));
const PageTransitionLabPage = lazy(() => import('@/pages/PageTransitionLabPage'));
/* Case de portfólio UX/UI — `/ux` e `/ux/<slug>`. */
const UxPortfolioPage = lazy(() => import('@/pages/UxPortfolioPage'));
const UxCasePage = lazy(() => import('@/pages/UxCasePage'));
const UxTestimonialsPage = lazy(() => import('@/pages/UxTestimonialsPage'));
// const OryzoPage = lazy(() => import('@/pages/OryzoPage'));
// Rota desativada — reative aqui e em VERSIONS (data/site.ts).
// const CineticaPage = lazy(() => import('@/pages/CineticaPage'));

const PageLoader = () => (
  <div className="flex min-h-svh items-center justify-center bg-cream text-ink">
    <span className="animate-pulse text-sm">carregando…</span>
  </div>
);

/** Extrai o slug de rotas como `/case/:slug`, `/dev/case/:slug` ou `/ux/:slug`. */
const matchCaseSlug = (path: string, prefix: string) =>
  path.startsWith(prefix) ? path.slice(prefix.length) || null : null;

/** Avaliado 1× no load do módulo — não no remount do StrictMode. */
const ROUTE_ENTER = takeRouteTransitionEnter();
if (ROUTE_ENTER) ensureEnterReveal();

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const caseSlug = matchCaseSlug(path, '/case/');
  const isDev = import.meta.env.DEV;
  /* Rotas de laboratório — só existem em `npm run dev`. */
  const devCaseSlug = isDev ? matchCaseSlug(path, '/dev/case/') : null;
  const isPreloaderLab = isDev && path === '/dev/preloader';
  const isTransitionLab = isDev && path === '/dev/transitions';
  const onContact = isContactPath(path);
  /* Portfólio UX/UI: `/ux` é o índice e `/ux/<slug>` abre o estudo de caso. */
  const isUxHome = path === '/ux';
  const isUxTestimonials = path === '/ux/depoimentos';
  /* Avaliado depois das rotas fixas de `/ux/*` para não capturá-las como slug. */
  const uxSlug = isUxTestimonials ? null : matchCaseSlug(path, '/ux/');

  const [routeEnter, setRouteEnter] = useState(ROUTE_ENTER);

  const page = isPreloaderLab ? (
    <PreloaderLabPage />
  ) : isTransitionLab ? (
    <PageTransitionLabPage />
  ) : /* Contato — `/contact` fica como alias em inglês. */
  onContact ? (
    <ContactPage />
  ) : path === '/minimal' ? (
    <MinimalPage />
  ) : isUxHome ? (
    <UxPortfolioPage />
  ) : isUxTestimonials ? (
    <UxTestimonialsPage />
  ) : uxSlug ? (
    <UxCasePage slug={uxSlug} />
  ) : // path === '/mundo' ? (
  //   <WorldPage />
  // ) : path === '/playground' ? (
  //   <PlaygroundPage />
  // ) :
  // path === '/oryzo' ? (
  //   <OryzoPage />
  // ) :
  devCaseSlug ? (
    <CasePage slug={devCaseSlug} previewShowcase />
  ) : caseSlug ? (
    <CasePage slug={caseSlug} />
  ) : path === '/' || path === '/galeria-imersiva' ? (
    // '/' e o alias antigo '/galeria-imersiva' abrem a galeria imersiva — a
    // entrada principal do sistema.
    // Rotas desativadas — descomente para voltar a servi-las:
    //   path === '/cinetica' ? <CineticaPage /> :
    <GaleriaImersivaPage />
  ) : (
    // Qualquer outra rota é 404 (própria + `404.html` do prerender).
    <NotFoundPage />
  );

  /* O portfólio UX tem abertura própria e não usa o preloader do site. */
  const showPreloader =
    !isPreloaderLab &&
    !isTransitionLab &&
    !isUxHome &&
    !isUxTestimonials &&
    !uxSlug &&
    !ROUTE_ENTER &&
    !routeEnter;

  return (
    <>
      {showPreloader && <Preloader />}
      {routeEnter && (
        <ContactTransitionEnter onDone={() => setRouteEnter(false)} />
      )}
      <Suspense fallback={<PageLoader />}>{page}</Suspense>
    </>
  );
}

export default App;
