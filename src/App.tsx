import { lazy, Suspense, useEffect, useState } from 'react';
import Preloader from '@/components/loader/Preloader';
import SharedFloatingContactButton from '@/components/ui/SharedFloatingContactButton';
import {
  ContactTransitionEnter,
  ensureEnterReveal,
} from '@/components/loader/ContactTransition';
import {
  isContactPath,
  takeRouteTransitionEnter,
} from '@/lib/contactTransition';

const MinimalPage = lazy(() => import('@/pages/MinimalPage'));
const GaleriaImersivaPage = lazy(() => import('@/pages/GaleriaImersivaPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const CasePage = lazy(() => import('@/pages/CasePage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
/* Case de portfólio UX/UI — `/ux` e `/ux/<slug>`. */
const UxPortfolioPage = lazy(() => import('@/pages/UxPortfolioPage'));
const UxCasePage = lazy(() => import('@/pages/UxCasePage'));

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
  const [path, setPath] = useState(
    () => window.location.pathname.replace(/\/+$/, '') || '/',
  );

  // A transição Galeria → Case troca somente a rota no mesmo documento para
  // que a capa animada continue viva. Voltar/avançar também sincronizam a tela.
  useEffect(() => {
    const syncPath = () => {
      setPath(window.location.pathname.replace(/\/+$/, '') || '/');
    };
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);
  const caseSlug = matchCaseSlug(path, '/case/');
  const isDev = import.meta.env.DEV;
  /* Fixture de case — só existe em `npm run dev`. */
  const devCaseSlug = isDev ? matchCaseSlug(path, '/dev/case/') : null;
  const onContact = isContactPath(path);
  /* Portfólio UX/UI: `/ux` é o índice e `/ux/<slug>` abre o estudo de caso. */
  const isUxHome = path === '/ux';
  const uxSlug = matchCaseSlug(path, '/ux/');

  const [routeEnter, setRouteEnter] = useState(ROUTE_ENTER);

  const page = onContact ? (
    <ContactPage />
  ) : path === '/minimal' ? (
    <MinimalPage />
  ) : isUxHome ? (
    <UxPortfolioPage />
  ) : uxSlug ? (
    <UxCasePage slug={uxSlug} />
  ) :
  devCaseSlug ? (
    <CasePage slug={devCaseSlug} />
  ) : caseSlug ? (
    <CasePage slug={caseSlug} />
  ) : path === '/' || path === '/galeria-imersiva' ? (
    // '/' e o alias antigo '/galeria-imersiva' abrem a galeria imersiva — a
    // entrada principal do sistema.
    <GaleriaImersivaPage />
  ) : (
    // Qualquer outra rota é 404 (própria + `404.html` do prerender).
    <NotFoundPage />
  );

  /* O portfólio UX tem abertura própria e não usa o preloader do site. */
  const showPreloader =
    !isUxHome &&
    !uxSlug &&
    !ROUTE_ENTER &&
    !routeEnter;
  const showSharedFloatingContact =
    path === '/' ||
    path === '/galeria-imersiva' ||
    Boolean(caseSlug) ||
    Boolean(devCaseSlug);

  return (
    <>
      {showPreloader && <Preloader />}
      {routeEnter && (
        <ContactTransitionEnter onDone={() => setRouteEnter(false)} />
      )}
      {showSharedFloatingContact && <SharedFloatingContactButton />}
      <Suspense fallback={<PageLoader />}>{page}</Suspense>
    </>
  );
}

export default App;
