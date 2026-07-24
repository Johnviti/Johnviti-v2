/**
 * Ponte MPA para transição entre Galeria ↔ Contato (não envolve Case).
 * O exit arma a flag; o enter consome e revela sem passar pelo Preloader.
 *
 * Padrão de produção (por enquanto): wipe + pulse —
 * ver `ContactTransition.tsx` e `DEFAULT_ROUTE_TRANSITION`.
 */

export const CONTACT_HREF = '/contato';
export const GALLERY_HREF = '/';

/** Variante ativa na navegação real Galeria ↔ Contato. */
export const DEFAULT_ROUTE_TRANSITION = 'wipe-pulse' as const;

const STORAGE_KEY = 'ja:route-transition';

const cleanPath = (path: string) => path.replace(/\/+$/, '') || '/';

export const isContactPath = (path: string) => {
  const p = cleanPath(path);
  return p === '/contato' || p === '/contact';
};

export const isGalleryPath = (path: string) => {
  const p = cleanPath(path);
  return p === '/' || p === '/galeria-imersiva';
};

export const isCasePath = (path: string) => {
  const p = cleanPath(path);
  return p.startsWith('/case/') || p.startsWith('/dev/case/');
};

/** Resolve href relativo/absoluto para pathname limpo. */
export const hrefToPath = (href: string) => {
  try {
    return cleanPath(new URL(href, window.location.origin).pathname);
  } catch {
    return cleanPath(href.split('?')[0] ?? href);
  }
};

/**
 * Galeria ↔ Contato, e Case → Contato.
 * Galeria → Case fica de fora (navegação direta).
 */
export const shouldUseRouteTransition = (fromPath: string, toHref: string) => {
  const from = cleanPath(fromPath);
  const to = hrefToPath(toHref);
  if (from === to) return false;

  const fromContact = isContactPath(from);
  const toContact = isContactPath(to);
  const fromGallery = isGalleryPath(from);
  const toGallery = isGalleryPath(to);

  if ((fromGallery && toContact) || (fromContact && toGallery)) return true;
  if (isCasePath(from) && toContact) return true;
  return false;
};

export const armRouteTransition = () => {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* private mode / blocked storage */
  }
};

/** @deprecated use armRouteTransition */
export const armContactTransition = armRouteTransition;

export const peekRouteTransition = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

/** Lê e limpa a flag no sessionStorage. */
export const consumeRouteTransition = () => {
  const pending = peekRouteTransition();
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return pending;
};

/**
 * Consome a flag 1× por carregamento de página.
 * Cache em módulo — sobrevive ao remount do React StrictMode (senão o
 * segundo mount perde a flag e o Preloader dispara por cima do wipe).
 */
let routeEnterThisLoad: boolean | undefined;

export const takeRouteTransitionEnter = () => {
  if (routeEnterThisLoad === undefined) {
    routeEnterThisLoad = consumeRouteTransition();
  }
  return routeEnterThisLoad;
};

/** @deprecated use consumeRouteTransition / takeRouteTransitionEnter */
export const consumeContactTransition = consumeRouteTransition;
