import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';
import { useI18n } from '../../i18n/context';
import { GRID_COLUMNS } from '../layout/GridLines';

interface PreloaderProps {
  /** Chamado no início da dissolução do wireframe — o site entra enquanto ele sai. */
  onReveal: () => void;
}

const CROSSHAIRS = [
  { left: '8.333%', top: '12%' },
  { left: '50%', top: '30%' },
  { left: '91.666%', top: '48%' },
  { left: '25%', top: '74%' },
  { left: '66.666%', top: '84%' },
];

const STAGE_KEYS = ['grid', 'type', 'layout', 'assets'] as const;

export function Preloader({ onReveal }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);
  const reducedMotion = useReducedMotion();
  const { t } = useI18n();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Scroll travado enquanto a interface está sendo montada
    document.documentElement.style.overflow = 'hidden';
    const unlockScroll = () => {
      document.documentElement.style.overflow = '';
    };

    // Reduced motion: sem coreografia — 100% direto e revelação imediata.
    if (reducedMotion) {
      if (counterRef.current) counterRef.current.textContent = '100';
      const id = setTimeout(() => {
        unlockScroll();
        onReveal();
        setHidden(true);
      }, 500);
      return () => {
        clearTimeout(id);
        unlockScroll();
      };
    }

    let cancelled = false;

    const ctx = gsap.context(() => {
      gsap.set('[data-draw]', { strokeDasharray: 1, strokeDashoffset: 1 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

      // Aid de desenvolvimento: ?slow desacelera a coreografia para inspeção
      if (new URLSearchParams(window.location.search).has('slow')) tl.timeScale(0.2);

      tl.to('.pl-meta', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.1)
        .to('.pl-grid line', { strokeDashoffset: 0, duration: 1.0, stagger: 0.05 }, 0.2)
        .to('.pl-frame line', { strokeDashoffset: 0, duration: 0.8 }, 0.7)
        .to('.pl-header [data-draw]', { strokeDashoffset: 0, duration: 0.6, stagger: 0.08 }, 1.0)
        .to('.pl-stage-0', { opacity: 1, duration: 0.2 }, 1.2)
        .to('.pl-title rect', { strokeDashoffset: 0, duration: 0.9, stagger: 0.2 }, 1.4)
        .to('.pl-stage-1', { opacity: 1, duration: 0.2 }, 1.9)
        .to('.pl-para line', { strokeDashoffset: 0, duration: 0.5, stagger: 0.08 }, 1.9)
        .to('.pl-band [data-draw]', { strokeDashoffset: 0, duration: 0.7, stagger: 0.1 }, 2.2)
        .to('.pl-stage-2', { opacity: 1, duration: 0.2 }, 2.6)
        .to('.pl-cross', { opacity: 0.9, duration: 0.25, stagger: 0.07, ease: 'power2.out' }, 2.7)
        .to('.pl-stage-3', { opacity: 1, duration: 0.2 }, 3.1);

      // A porcentagem acompanha a montagem do wireframe do início ao fim.
      const counter = { value: 0 };
      tl.to(
        counter,
        {
          value: 100,
          duration: tl.duration(),
          ease: 'power1.inOut',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0');
            }
          },
        },
        0,
      );

      tl.eventCallback('onComplete', () => {
        void revealSite();
      });

      async function revealSite() {
        await document.fonts.ready;
        if (cancelled) return;

        unlockScroll();
        onReveal();

        gsap
          .timeline({
            onComplete: () => {
              if (!cancelled) setHidden(true);
            },
          })
          .to('.pl-detail', { opacity: 0, y: 6, duration: 0.45, ease: 'power2.inOut' }, 0)
          .to('.pl-counter', { opacity: 0, y: 24, duration: 0.5, ease: 'power2.inOut' }, 0.05)
          .to('.pl-svg', { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 0.15)
          .to(root, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0.4);
      }
    }, root);

    return () => {
      cancelled = true;
      unlockScroll();
      ctx.revert();
    };
  }, [reducedMotion, onReveal]);

  if (hidden) return null;

  const gridX = Array.from({ length: GRID_COLUMNS - 1 }, (_, i) => ((i + 1) / GRID_COLUMNS) * 100);

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label={t('preloader.loading')}
      className="fixed inset-0 z-[100] bg-base"
    >
      <svg
        aria-hidden
        className="pl-svg absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Grid de 12 colunas — mesmas posições do GridLines persistente */}
        <g className="pl-grid stroke-line-faint" strokeWidth="1" vectorEffect="non-scaling-stroke">
          {gridX.map((x) => (
            <line
              key={x}
              data-draw
              x1={x}
              y1="0"
              x2={x}
              y2="100"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Linhas estruturais: base do header e rodapé */}
        <g className="pl-frame stroke-line">
          <line data-draw x1="0" y1="9" x2="100" y2="9" pathLength={1} vectorEffect="non-scaling-stroke" />
          <line data-draw x1="0" y1="93" x2="100" y2="93" pathLength={1} vectorEffect="non-scaling-stroke" />
        </g>

        {/* Header: logo + itens de navegação */}
        <g className="pl-header fill-none stroke-line">
          <rect data-draw x="3.5" y="4" width="9" height="1.8" pathLength={1} vectorEffect="non-scaling-stroke" />
          <rect data-draw x="70" y="4.4" width="5" height="1" pathLength={1} vectorEffect="non-scaling-stroke" />
          <rect data-draw x="77" y="4.4" width="5" height="1" pathLength={1} vectorEffect="non-scaling-stroke" />
          <rect data-draw x="84" y="4.4" width="5" height="1" pathLength={1} vectorEffect="non-scaling-stroke" />
          <rect data-draw x="91.5" y="3.9" width="4.5" height="2" pathLength={1} vectorEffect="non-scaling-stroke" />
        </g>

        {/* Barras do título gigante do hero (duas linhas full-width) */}
        <g className="pl-title fill-none stroke-ink/40">
          <rect data-draw x="3.5" y="12" width="93" height="16" pathLength={1} vectorEffect="non-scaling-stroke" />
          <rect data-draw x="3.5" y="30" width="93" height="16" pathLength={1} vectorEffect="non-scaling-stroke" />
        </g>

        {/* Linha de status à esquerda + parágrafo de introdução à direita */}
        <g className="pl-para stroke-line">
          <line data-draw x1="3.5" y1="55" x2="25" y2="55" pathLength={1} vectorEffect="non-scaling-stroke" />
          <line data-draw x1="62" y1="52" x2="93" y2="52" pathLength={1} vectorEffect="non-scaling-stroke" />
          <line data-draw x1="62" y1="54.5" x2="93" y2="54.5" pathLength={1} vectorEffect="non-scaling-stroke" />
          <line data-draw x1="62" y1="57" x2="85" y2="57" pathLength={1} vectorEffect="non-scaling-stroke" />
          <rect data-draw x="62" y="60.5" width="12" height="4" rx="2" pathLength={1} vectorEffect="non-scaling-stroke" fill="none" />
        </g>

        {/* Faixa do marquee com blocos de palavras */}
        <g className="pl-band fill-none stroke-line">
          <line data-draw x1="0" y1="74" x2="100" y2="74" pathLength={1} vectorEffect="non-scaling-stroke" />
          <line data-draw x1="0" y1="84" x2="100" y2="84" pathLength={1} vectorEffect="non-scaling-stroke" />
          <rect data-draw x="8" y="77.5" width="13" height="3" pathLength={1} vectorEffect="non-scaling-stroke" />
          <rect data-draw x="30" y="77.5" width="10" height="3" pathLength={1} vectorEffect="non-scaling-stroke" />
          <rect data-draw x="49" y="77.5" width="15" height="3" pathLength={1} vectorEffect="non-scaling-stroke" />
          <rect data-draw x="73" y="77.5" width="11" height="3" pathLength={1} vectorEffect="non-scaling-stroke" />
        </g>
      </svg>

      {/* Crosshairs de medição nas interseções do grid */}
      {CROSSHAIRS.map((pos, i) => (
        <span
          key={i}
          aria-hidden
          className="pl-cross pl-detail tech-label absolute -translate-x-1/2 -translate-y-1/2 text-muted opacity-0"
          style={pos}
        >
          +
        </span>
      ))}

      {/* Dimensões do viewport — detalhe de blueprint */}
      <span
        aria-hidden
        className="pl-meta pl-detail tech-label absolute top-[11%] right-5 text-muted opacity-0 md:right-10"
      >
        {typeof window !== 'undefined' ? `${window.innerWidth} × ${window.innerHeight}` : ''}
      </span>

      {/* Etapas da montagem */}
      <div
        aria-hidden
        className="pl-meta absolute right-5 bottom-8 flex flex-col items-end gap-1.5 opacity-0 md:right-10"
      >
        {STAGE_KEYS.map((key, i) => (
          <span key={key} className={`pl-stage-${i} pl-detail tech-label text-muted opacity-25`}>
            {String(i + 1).padStart(2, '0')} / {t(`preloader.stages.${key}`)}
          </span>
        ))}
      </div>

      {/* Contador de progresso */}
      <div className="pl-counter absolute bottom-8 left-5 md:left-10">
        <p className="pl-meta pl-detail tech-label flex items-center gap-2 text-muted opacity-0">
          <span className="inline-block size-1.5 animate-pulse bg-accent" />
          {t('preloader.assembling')}
        </p>
        <p className="mt-3 font-mono text-6xl font-extralight tracking-tight tabular-nums md:text-7xl">
          <span ref={counterRef}>000</span>
          <span className="ml-1 text-base text-muted">%</span>
        </p>
      </div>
    </div>
  );
}
