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
const CasePage = lazy(() => import('@/pages/CasePage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PreloaderLabPage = lazy(() => import('@/pages/PreloaderLabPage'));
const PageTransitionLabPage = lazy(() => import('@/pages/PageTransitionLabPage'));
// const OryzoPage = lazy(() => import('@/pages/OryzoPage'));
// Rota desativada — reative aqui e em VERSIONS (data/site.ts).
// const CineticaPage = lazy(() => import('@/pages/CineticaPage'));

const PageLoader = () => (
  <div className="flex min-h-svh items-center justify-center bg-cream text-ink">
    <span className="animate-pulse text-sm">carregando…</span>
  </div>
);

/** Extrai o slug de `/case/:slug` ou `/dev/case/:slug`. */
const matchCaseSlug = (path: string, prefix: '/case/' | '/dev/case/') =>
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
  ) : (
    // Rotas desativadas — descomente para voltar a servi-las:
    //   path === '/cinetica' ? <CineticaPage /> :
    //   path === '/galeria-imersiva' ? <GaleriaImersivaPage /> :
    //
    // '/', o alias antigo '/galeria-imersiva' e qualquer rota desconhecida
    // caem na galeria imersiva — a entrada principal do sistema.
    <GaleriaImersivaPage />
  );

  const showPreloader =
    !isPreloaderLab && !isTransitionLab && !ROUTE_ENTER && !routeEnter;

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
