import { useCallback, useState } from 'react';
import {
  PRELOADER_VARIANTS,
  PreloaderVariantStage,
  type PreloaderVariantId,
} from '@/components/loader/preloaderVariants';

/**
 * Laboratório local do pré-loader — só em `npm run dev` via `/dev/preloader`.
 * Compara a versão atual com sugestões de melhoria e permite replay.
 */
const PreloaderLabPage = () => {
  const [variant, setVariant] = useState<PreloaderVariantId>('atual');
  const [runId, setRunId] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);

  const meta = PRELOADER_VARIANTS.find((v) => v.id === variant)!;

  const replay = useCallback(() => {
    setPlaying(true);
    setRunId((n) => n + 1);
  }, []);

  const pick = (id: PreloaderVariantId) => {
    setVariant(id);
    setPlaying(true);
    setRunId((n) => n + 1);
  };

  return (
    <div className="relative min-h-svh bg-cream text-ink">
      {/* Stage */}
      <div className="relative h-svh overflow-hidden bg-white">
        {playing ? (
          <PreloaderVariantStage
            key={`${variant}-${runId}`}
            variant={variant}
            onDone={() => setPlaying(false)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-soft">
              Fim da variante
            </p>
            <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-medium tracking-tight">
              {meta.title}
            </h1>
            <button
              type="button"
              onClick={replay}
              className="rounded-full bg-ink px-6 py-3 text-[13px] font-medium text-cream transition-opacity hover:opacity-80"
            >
              Repetir
            </button>
          </div>
        )}
      </div>

      {/* Painel de controle */}
      <aside
        className={`fixed bottom-0 right-0 z-20 flex max-h-[70vh] w-full flex-col border-t border-ink/10 bg-cream/95 backdrop-blur-md transition-transform duration-300 md:bottom-4 md:right-4 md:max-h-[min(80vh,640px)] md:w-[380px] md:rounded-2xl md:border ${
          panelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)] md:translate-y-[calc(100%-3.25rem)]'
        }`}
      >
        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          className="flex shrink-0 items-center justify-between px-5 py-3 text-left md:px-6"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.22em]">
            Lab · Preloader
          </span>
          <span className="text-[13px] text-stone-soft">
            {panelOpen ? 'recolher' : 'abrir'}
          </span>
        </button>

        <div className="overflow-y-auto px-5 pb-6 md:px-6">
          <p className="text-[13px] leading-relaxed text-charcoal">
            Compare a montagem atual com sugestões mais rápidas, alinhadas ao
            cursor pixel e à marca JA. Escolha uma variante e use{' '}
            <strong className="font-medium text-ink">Repetir</strong>.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={replay}
              className="rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-cream"
            >
              Repetir
            </button>
            <a
              href="/dev/transitions"
              className="rounded-full border border-ink/15 px-4 py-2 text-[12px] transition-colors hover:border-ink/40"
            >
              Lab transições
            </a>
            <a
              href="/"
              className="rounded-full border border-ink/15 px-4 py-2 text-[12px] transition-colors hover:border-ink/40"
            >
              ← Galeria
            </a>
          </div>

          <ul className="mt-5 space-y-2">
            {PRELOADER_VARIANTS.map((v) => {
              const active = v.id === variant;
              return (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => pick(v.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                      active
                        ? 'border-ink bg-ink text-cream'
                        : 'border-ink/10 bg-white hover:border-ink/25'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] font-medium">{v.title}</span>
                      <span
                        className={`shrink-0 text-[10px] uppercase tracking-[0.16em] ${
                          active ? 'text-cream/60' : 'text-stone-soft'
                        }`}
                      >
                        {v.tag}
                      </span>
                    </div>
                    <p
                      className={`mt-1.5 text-[12px] leading-snug ${
                        active ? 'text-cream/75' : 'text-charcoal'
                      }`}
                    >
                      {v.why}
                    </p>
                    <p
                      className={`mt-2 text-[10px] tracking-[0.12em] ${
                        active ? 'text-cream/50' : 'text-stone-soft'
                      }`}
                    >
                      {v.duration}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 rounded-xl border border-ink/10 bg-white px-4 py-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-stone-soft">
              Recomendação
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-charcoal">
              Para um tom mais{' '}
              <strong className="font-medium text-ink">moderno e premium</strong>,
              experimente <em>Flip 3D</em>, <em>Convergência</em>,{' '}
              <em>Camadas</em> ou <em>Sheen</em> — todas sem grade nem cursor, foco
              total na marca. Para <strong className="font-medium text-ink">revisitas</strong>,
              mantenha o <em>Minimal pulse</em>.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default PreloaderLabPage;
