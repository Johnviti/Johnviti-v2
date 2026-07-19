import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CustomCursor from '@/components/galeria-imersiva/CustomCursor';
import FixedHeader from '@/components/galeria-imersiva/FixedHeader';
import IntroOverlay from '@/components/galeria-imersiva/IntroOverlay';
import { galleryConfig } from '@/components/galeria-imersiva/galleryConfig';
import { galleryItems } from '@/components/galeria-imersiva/galleryItems';
import { GalleryApp } from '@/components/galeria-imersiva/three/GalleryApp';

/**
 * Experiência fullscreen: parede digital curva de imagens explorável em 2D.
 * A cena WebGL vive em GalleryApp (imperativo); este componente monta o
 * canvas, a interface fixa, o cursor e a coreografia de introdução.
 */
const INTRO_STORAGE_KEY = 'galeria-imersiva-intro-vista';

const GaleriaImersivaPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<GalleryApp | null>(null);

  // Overlay de instrução: exibido uma vez por sessão, dispensado na primeira
  // interação (ou por timeout). "visible" controla o fade; "mounted" desmonta
  // o componente após a transição de saída.
  const [introVisible, setIntroVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(INTRO_STORAGE_KEY);
    } catch {
      return true;
    }
  });
  const [introMounted, setIntroMounted] = useState(introVisible);

  const dismissIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
    } catch {
      // sessionStorage indisponível — apenas não persiste.
    }
    setIntroVisible(false);
    window.setTimeout(() => setIntroMounted(false), 800);
  }, []);

  useEffect(() => {
    document.title = 'john amorim — galeria imersiva';
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let intro: gsap.core.Timeline | null = null;

    const app = new GalleryApp({
      canvas,
      container,
      items: galleryItems,
      config: galleryConfig,
      reducedMotion,
      // A primeira interação interrompe a coreografia e dispensa o overlay.
      onUserInteract: () => {
        intro?.kill();
        dismissIntro();
      },
      // Clique (tap sem arraste) em um tile abre a página do case.
      onItemClick: (item) => {
        window.location.href = `/case/${item.caseSlug}`;
      },
    });
    appRef.current = app;

    // Coreografia inicial: três impulsos com pausas, timing guiado pelo vídeo.
    if (!reducedMotion) {
      intro = gsap.timeline({ delay: 0.4 });
      intro
        // Primeiro deslocamento diagonal (0,4s–1,5s)
        .to(app.target, { x: '+=0.85', y: '+=1.7', duration: 1.1, ease: 'power2.out' }, 0)
        // Segundo impulso, mais amplo (2,5s–3,6s)
        .to(app.target, { x: '-=1.4', y: '+=2.35', duration: 1.1, ease: 'power3.inOut' }, 2.1)
        // Terceiro movimento combinando os dois eixos (4,8s–6,5s)
        .to(app.target, { x: '+=2.15', y: '-=2.75', duration: 1.7, ease: 'power2.inOut' }, 4.4);
    }

    return () => {
      intro?.kill();
      app.destroy();
      appRef.current = null;
    };
  }, [dismissIntro]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      <div
        ref={containerRef}
        role="application"
        aria-label="Galeria imersiva de imagens. Arraste com o mouse ou use as setas do teclado para explorar a parede de imagens em qualquer direção. Clique em uma imagem para abrir o case do projeto."
        tabIndex={0}
        className="absolute inset-0 outline-none [@media(pointer:fine)]:cursor-none"
        style={{ touchAction: 'none', overscrollBehavior: 'none' }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      {/* Descrição das imagens + acesso aos cases para leitores de tela */}
      <ul className="sr-only">
        {galleryItems.map((item) => (
          <li key={item.id}>
            <a href={`/case/${item.caseSlug}`}>{item.alt} — ver case</a>
          </li>
        ))}
      </ul>

      {introMounted && (
        <IntroOverlay visible={introVisible} onDismiss={dismissIntro} />
      )}

      <FixedHeader />
      <CustomCursor appRef={appRef} />
    </div>
  );
};

export default GaleriaImersivaPage;
