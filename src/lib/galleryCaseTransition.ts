import gsap from 'gsap';
import type { GalleryTileBounds } from '@/components/galeria-imersiva/three/GalleryApp';

type GalleryCaseTransitionOptions = {
  bounds: GalleryTileBounds;
  cover: string;
  slug: string;
};

let running = false;

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const navigateInApp = (href: string) => {
  window.history.pushState(null, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const measureScrollbarWidth = () => {
  const probe = document.createElement('div');
  Object.assign(probe.style, {
    position: 'absolute',
    left: '-9999px',
    width: '100px',
    height: '100px',
    overflow: 'scroll',
  });
  document.body.appendChild(probe);
  const width = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return width;
};

const heroTarget = () => {
  // A galeria nao tem scrollbar, mas o case tem. Antecipar essa largura evita
  // que o hero precise encolher alguns pixels logo depois da troca de rota.
  const viewportWidth =
    document.documentElement.clientWidth - measureScrollbarWidth();
  const desktop = viewportWidth >= 768;
  const gutter = desktop ? 40 : 24;
  const width = Math.min(1760, viewportWidth - gutter * 2);
  return {
    left: (viewportWidth - width) / 2,
    // O hero usa `pt-20` em todos os breakpoints. Manter o mesmo destino evita
    // que a capa termine 32px acima e salte para baixo ao montar o case mobile.
    top: 80,
    width,
    height: width * (9 / 16),
  };
};

const waitForHero = async () => {
  for (let frame = 0; frame < 24; frame++) {
    await nextFrame();
    const hero = document.querySelector<HTMLElement>('[data-case-hero]');
    if (hero) return hero;
  }
  return null;
};

const waitForHeroImage = async (hero: HTMLElement) => {
  const heroImage = hero.querySelector<HTMLImageElement>(
    '[data-case-hero-image]',
  );
  if (!heroImage) return;

  await Promise.race([
    heroImage.decode().catch(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, 900)),
  ]);
  // `decode()` garante os pixels; estes frames garantem que eles ja chegaram
  // ao compositor antes do crossfade retirar a imagem compartilhada.
  await nextFrame();
  await nextFrame();
};

const tween = (target: gsap.TweenTarget, vars: gsap.TweenVars) =>
  new Promise<void>((resolve) => {
    gsap.to(target, { ...vars, onComplete: resolve });
  });

/**
 * Mantem uma copia visual do header fora das paginas durante a troca de rota.
 * A galeria inteira e um elemento `fixed`, portanto o seu z-index interno nao
 * consegue ultrapassar o veu anexado ao `body`. A copia vive no mesmo contexto
 * do veu e impede que logo e controles sejam encobertos por alguns frames.
 */
const createHeaderGuard = () => {
  const guard = document.createElement('div');
  guard.setAttribute('aria-hidden', 'true');
  guard.setAttribute('inert', '');
  Object.assign(guard.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '80',
    pointerEvents: 'none',
  });

  document
    .querySelectorAll<HTMLElement>('.gallery-case-shared-header')
    .forEach((source) => {
      const clone = source.cloneNode(true) as HTMLElement;
      clone.removeAttribute('id');
      clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
      clone.style.pointerEvents = 'none';
      guard.appendChild(clone);
    });

  return guard.childElementCount > 0 ? guard : null;
};

const TRANSITION_BLUR_HEIGHT = 96;

/** Mantem o GradualBlur fixo no rodape enquanto a capa cresce por tras. */
const createTransitionBlur = () => {
  const blur = document.createElement('div');
  blur.setAttribute('aria-hidden', 'true');
  blur.dataset.galleryCaseTransitionBlur = '';
  Object.assign(blur.style, {
    position: 'fixed',
    left: '0',
    right: '0',
    bottom: '0',
    width: '100%',
    height: `${TRANSITION_BLUR_HEIGHT}px`,
    zIndex: '37',
    pointerEvents: 'none',
    opacity: '1',
    isolation: 'isolate',
  });

  const inner = document.createElement('div');
  Object.assign(inner.style, {
    position: 'relative',
    width: '100%',
    height: '100%',
  });

  const divCount = 5;
  const increment = 100 / divCount;
  for (let index = 1; index <= divCount; index++) {
    const rawProgress = index / divCount;
    const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
    const blurValue = Math.pow(2, progress * 4) * 0.125;
    const p1 = Math.round((increment * index - increment) * 10) / 10;
    const p2 = Math.round(increment * index * 10) / 10;
    const p3 = Math.round((increment * index + increment) * 10) / 10;
    const p4 = Math.round((increment * index + increment * 2) * 10) / 10;

    let gradient = `transparent ${p1}%, black ${p2}%`;
    if (p3 <= 100) gradient += `, black ${p3}%`;
    if (p4 <= 100) gradient += `, transparent ${p4}%`;

    const layer = document.createElement('div');
    Object.assign(layer.style, {
      position: 'absolute',
      inset: '0',
      maskImage: `linear-gradient(to bottom, ${gradient})`,
      webkitMaskImage: `linear-gradient(to bottom, ${gradient})`,
      backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
      webkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
    });
    inner.appendChild(layer);
  }

  blur.appendChild(inner);
  return blur;
};

/**
 * Faz a capa clicada sair do canvas, crescer até o hero e sobreviver à troca
 * de rota. A navegação é interna apenas neste fluxo para manter a mesma
 * camada DOM viva entre a galeria e o case.
 */
export const runGalleryCaseTransition = async ({
  bounds,
  cover,
  slug,
}: GalleryCaseTransitionOptions) => {
  if (running) return;
  running = true;

  const href = `/case/${slug}`;
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  let veil: HTMLDivElement | null = null;
  let image: HTMLImageElement | null = null;
  let headerGuard: HTMLDivElement | null = null;
  let transitionBlur: HTMLDivElement | null = null;

  try {
    // Traz o chunk do case enquanto a imagem cresce; evita o fallback do
    // Suspense aparecer no instante da troca de rota.
    const caseModuleReady = import('@/pages/CasePage');
    if (reducedMotion) {
      await caseModuleReady;
      navigateInApp(href);
      return;
    }

    veil = document.createElement('div');
    veil.setAttribute('aria-hidden', 'true');
    veil.dataset.galleryCaseTransitionVeil = '';
    Object.assign(veil.style, {
      position: 'fixed',
      inset: '0',
      // Abaixo dos headers/CTAs (z-40+): eles permanecem visualmente contínuos.
      zIndex: '35',
      pointerEvents: 'all',
      opacity: '0',
      background: 'var(--color-surface)',
      willChange: 'opacity',
    });

    image = document.createElement('img');
    image.src = cover;
    image.alt = '';
    image.decoding = 'async';
    image.setAttribute('aria-hidden', 'true');
    image.dataset.galleryCaseTransitionImage = '';
    Object.assign(image.style, {
      position: 'fixed',
      zIndex: '36',
      pointerEvents: 'none',
      left: `${bounds.left}px`,
      top: `${bounds.top}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
      objectFit: 'cover',
      objectPosition: 'center',
      borderRadius: '4px',
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0)',
      opacity: '1',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      willChange: 'left, top, width, height, border-radius, opacity',
    });

    headerGuard = createHeaderGuard();
    transitionBlur = createTransitionBlur();
    document.body.append(veil, image, transitionBlur);
    if (headerGuard) document.body.append(headerGuard);
    document.documentElement.dataset.galleryCaseTransition = slug;

    // A textura do canvas normalmente já deixou a capa em cache. Ainda assim,
    // damos uma janela curta para o elemento DOM decodificá-la sem atrasar o clique.
    await Promise.race([
      image.decode().catch(() => undefined),
      new Promise<void>((resolve) => window.setTimeout(resolve, 180)),
    ]);

    const target = heroTarget();
    await Promise.all([
      tween(veil, {
        opacity: 1,
        duration: 0.72,
        delay: 0.12,
        ease: 'power2.inOut',
      }),
      tween(image, {
        ...target,
        autoRound: false,
        borderRadius: 24,
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.18)',
        duration: 0.96,
        ease: 'power4.inOut',
      }),
    ]);

    await caseModuleReady;
    navigateInApp(href);

    const hero = await waitForHero();
    if (hero) {
      const exact = hero.getBoundingClientRect();
      await Promise.all([
        waitForHeroImage(hero),
        tween(image, {
          autoRound: false,
          left: exact.left,
          top: exact.top,
          width: exact.width,
          height: exact.height,
          borderRadius:
            Number.parseFloat(getComputedStyle(hero).borderRadius) || 24,
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
          duration: 0.16,
          ease: 'power2.out',
        }),
      ]);
    }

    // O veu sai primeiro com a capa ainda 100% opaca. Se os dois esmaecem ao
    // mesmo tempo, o branco do veu aparece entre a capa e o hero no meio da
    // composicao e parece um flash. Depois, a capa cruza suavemente para o hero.
    await tween(veil, {
      opacity: 0,
      duration: 0.28,
      ease: 'power2.out',
    });
    await tween(image, {
      opacity: 0,
      duration: 0.64,
      ease: 'power2.inOut',
    });

    headerGuard?.remove();
    transitionBlur.remove();
    image.remove();
    veil.remove();
    delete document.documentElement.dataset.galleryCaseTransition;
  } catch {
    headerGuard?.remove();
    transitionBlur?.remove();
    image?.remove();
    veil?.remove();
    delete document.documentElement.dataset.galleryCaseTransition;
    window.location.assign(href);
  } finally {
    running = false;
  }
};
