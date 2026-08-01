import {
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import {
  LOGO_CELLS,
  LOGO_GREEN,
  LOGO_VIEWBOX,
  resolveThemeInk,
} from '@/components/loader/logoCells';
import { markPreloaderDone } from '@/components/loader/loaderGate';
import {
  armRouteTransition,
  CONTACT_HREF,
  shouldUseRouteTransition,
} from '@/lib/contactTransition';

/**
 * Wipe + progresso entre Galeria ↔ Contato (e Case → Contato).
 * Padrão de produção (`DEFAULT_ROUTE_TRANSITION`) — exit cobre e navega;
 * Enter assume o véu e revela o destino.
 */

const MiniLogo = () => (
  <svg
    data-logo
    viewBox={LOGO_VIEWBOX}
    className="w-[min(42vw,220px)] overflow-visible"
    aria-hidden
  >
    {LOGO_CELLS.map((c, i) =>
      c.t === 'r' ? (
        <rect
          key={i}
          data-cell
          x={c.x}
          y={c.y}
          width={80}
          height={80}
          fill={LOGO_GREEN}
        />
      ) : (
        <polygon key={i} data-cell points={c.pts} fill={LOGO_GREEN} />
      ),
    )}
  </svg>
);

const Veil = ({ children }: { children?: ReactNode }) => (
  <div
    data-veil
    className="absolute inset-0 flex items-center justify-center bg-cream text-ink"
  >
    {children ?? <MiniLogo />}
  </div>
);

type PhaseProps = {
  onDone: () => void;
};

/** Metade de saída — o verde drena conforme a rota fica pronta para navegar. */
export const ContactTransitionExit = ({
  onCovered,
}: {
  onCovered: () => void;
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      onCovered();
      return;
    }

    const veil = root.querySelector<HTMLElement>('[data-veil]');
    const logo = root.querySelector<SVGElement>('[data-logo]');
    const cells = gsap.utils.toArray<SVGElement>('[data-cell]', root);
    if (!veil || !logo) {
      onCovered();
      return;
    }

    const ink = resolveThemeInk();

    gsap.set(veil, { yPercent: 100 });
    gsap.set(logo, { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' });
    gsap.set(cells, { fill: LOGO_GREEN });

    const ctx = gsap.context(() => {
      // O verde funciona como progresso em uma única passada. A navegação só
      // acontece depois que todas as células assentam na tinta do tema.
      gsap
        .timeline({ onComplete: onCovered })
        .to(veil, { yPercent: 0, duration: 0.38, ease: 'power3.inOut' })
        .to(logo, { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }, '-=0.08')
        .to(
          cells,
          { fill: ink, duration: 0.28, stagger: 0.012, ease: 'power2.inOut' },
          '-=0.05',
        );
    }, root);

    return () => ctx.revert();
  }, [onCovered]);

  return createPortal(
    <div
      ref={rootRef}
      className="pointer-events-auto fixed inset-0 z-[200] overflow-hidden"
      role="presentation"
      aria-hidden
    >
      <Veil />
    </div>,
    document.body,
  );
};

/**
 * Reveal de entrada — 1× por page load, host no `document.body` fora do
 * ciclo de remount do StrictMode (evita wipe + Preloader / reveal duplicado).
 */
let enterPromise: Promise<void> | null = null;

const logoCellsMarkup = (fill: string) =>
  LOGO_CELLS.map((c) =>
    c.t === 'r'
      ? `<rect data-cell x="${c.x}" y="${c.y}" width="80" height="80" fill="${fill}"/>`
      : `<polygon data-cell points="${c.pts}" fill="${fill}"/>`,
  ).join('');

const runEnterRevealOnce = (): Promise<void> => {
  if (enterPromise) return enterPromise;

  enterPromise = new Promise((resolve) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      document.documentElement.classList.remove('ja-route-enter');
      resolve();
      return;
    }

    const ink = resolveThemeInk();
    const root = document.createElement('div');
    root.setAttribute('role', 'status');
    root.setAttribute('aria-label', 'Carregando página');
    root.style.cssText =
      'pointer-events:none;position:fixed;inset:0;z-index:200;overflow:hidden';
    root.innerHTML = `
      <div data-veil style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--color-cream,#f4f3ec);color:var(--color-ink,#121210)">
        <svg data-logo viewBox="${LOGO_VIEWBOX}" style="width:min(42vw,220px);overflow:visible" aria-hidden="true">
          ${logoCellsMarkup(ink)}
        </svg>
      </div>
    `;
    document.body.appendChild(root);

    const veil = root.querySelector<HTMLElement>('[data-veil]');
    const logo = root.querySelector<SVGElement>('[data-logo]');
    const cells = gsap.utils.toArray<SVGElement>('[data-cell]', root);

    const cleanup = () => {
      document.documentElement.classList.remove('ja-route-enter');
      root.remove();
      resolve();
    };

    if (!veil || !logo) {
      cleanup();
      return;
    }

    gsap.set(veil, { yPercent: 0 });
    gsap.set(logo, { opacity: 1, scale: 1, transformOrigin: '50% 50%' });
    gsap.set(cells, { fill: ink });

    // O véu JS (z-200) já cobre a tela: retiramos o véu estático
    // (`body::before`, z-199). Os dois mostram a MESMA logo em tinta, então a
    // troca é invisível — a marca não some e reaparece (evita o piscar).
    document.documentElement.classList.remove('ja-route-enter');

    // O véu sobe inteiro e sai pelo topo, revelando a página — sem pulso.
    gsap
      .timeline({ onComplete: cleanup })
      .to(veil, { yPercent: -100, duration: 0.72, ease: 'power4.inOut' }, 0.16);
  });

  return enterPromise;
};

/** Inicia o reveal o mais cedo possível (logo no load do App). */
export const ensureEnterReveal = () => {
  void runEnterRevealOnce();
};

/** Metade de entrada — parte coberto e revela a página de destino. */
export const ContactTransitionEnter = ({ onDone }: PhaseProps) => {
  useEffect(() => {
    let alive = true;
    runEnterRevealOnce().then(() => {
      if (!alive) return;
      markPreloaderDone();
      onDone();
    });
    return () => {
      alive = false;
    };
  }, [onDone]);

  return null;
};

type RouteTransitionLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  href: string;
  children: ReactNode;
};

/**
 * Link com wipe quando o destino é Galeria ↔ Contato (ou Case → Contato).
 * Cmd/Ctrl-click e destinos fora dessa regra usam navegação nativa.
 */
export const RouteTransitionLink = ({
  href,
  children,
  onClick,
  ...rest
}: RouteTransitionLinkProps) => {
  const [exiting, setExiting] = useState(false);
  const covered = useRef(false);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!shouldUseRouteTransition(window.location.pathname, href)) return;

    event.preventDefault();
    if (exiting) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      window.location.assign(href);
      return;
    }

    setExiting(true);
  };

  const onCovered = () => {
    if (covered.current) return;
    covered.current = true;
    armRouteTransition();
    window.location.assign(href);
  };

  return (
    <>
      <a href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
      {exiting && <ContactTransitionExit onCovered={onCovered} />}
    </>
  );
};

/** Atalho para `/contato`. */
export const ContactLink = ({
  href = CONTACT_HREF,
  ...rest
}: Omit<RouteTransitionLinkProps, 'href'> & { href?: string }) => (
  <RouteTransitionLink href={href} {...rest} />
);
