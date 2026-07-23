import { lazy, Suspense } from 'react';
import Preloader from '@/components/loader/Preloader';

const MinimalPage = lazy(() => import('@/pages/MinimalPage'));
// Rotas desativadas — reative junto com VERSIONS (data/site.ts).
// const WorldPage = lazy(() => import('@/pages/WorldPage'));
// const PlaygroundPage = lazy(() => import('@/pages/PlaygroundPage'));
const GaleriaImersivaPage = lazy(() => import('@/pages/GaleriaImersivaPage'));
const CasePage = lazy(() => import('@/pages/CasePage'));
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

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const caseSlug = matchCaseSlug(path, '/case/');
  /* Preview com placeholders — só existe em `npm run dev` (import.meta.env.DEV). */
  const devCaseSlug = import.meta.env.DEV
    ? matchCaseSlug(path, '/dev/case/')
    : null;

  const page =
    path === '/minimal' ? (
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

  return (
    <>
      <Preloader />
      <Suspense fallback={<PageLoader />}>{page}</Suspense>
    </>
  );
}

export default App;
