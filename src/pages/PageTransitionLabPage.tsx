import { useCallback, useState } from 'react';
import {
  PAGE_TRANSITIONS,
  PageTransitionStage,
  type PageTransitionId,
} from '@/components/loader/pageTransitionVariants';

type MockPage = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  tone: 'cream' | 'ink';
};

const MOCK_PAGES: MockPage[] = [
  {
    id: 'galeria',
    label: 'Galeria',
    eyebrow: 'Portfólio',
    title: 'Espaço imersivo',
    body: 'A página de origem — onde o visitante chega e escolhe um case.',
    tone: 'cream',
  },
  {
    id: 'case',
    label: 'Case',
    eyebrow: 'Projeto',
    title: 'Detalhe do trabalho',
    body: 'A página de destino — narrativa, mídia e próximo passo.',
    tone: 'ink',
  },
  {
    id: 'contato',
    label: 'Contato',
    eyebrow: 'Conversa',
    title: 'Vamos falar',
    body: 'Formulário e canais — transição leve entre rotas de conteúdo.',
    tone: 'cream',
  },
];

/**
 * Laboratório local de transições entre páginas — `/dev/transitions` (só em dev).
 * Simula origem → destino com o véu no meio (onCovered troca o mock).
 */
const PageTransitionLabPage = () => {
  const [variant, setVariant] = useState<PageTransitionId>('wipe-pulse');
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [pageIdx, setPageIdx] = useState(0);
  const [runId, setRunId] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const page = MOCK_PAGES[pageIdx];

  const play = useCallback(() => {
    setPageIdx(fromIdx);
    setPlaying(true);
    setRunId((n) => n + 1);
  }, [fromIdx]);

  const pick = (id: PageTransitionId) => {
    setVariant(id);
    setPageIdx(fromIdx);
    setPlaying(true);
    setRunId((n) => n + 1);
  };

  const onCovered = useCallback(() => {
    setPageIdx(toIdx);
  }, [toIdx]);

  return (
    <div className="relative min-h-svh bg-cream text-ink">
      {/* Stage — duas “páginas” mock */}
      <div
        className={`relative h-svh overflow-hidden transition-colors duration-300 ${
          page.tone === 'ink' ? 'bg-ink text-cream' : 'bg-cream text-ink'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-8 py-10 md:px-14 md:py-14">
          <p className="text-[11px] uppercase tracking-[0.28em] opacity-55">
            {page.eyebrow}
          </p>
          <div className="max-w-xl">
            <p className="text-[12px] uppercase tracking-[0.2em] opacity-50">
              {page.label}
            </p>
            <h1 className="mt-3 text-[clamp(2rem,6vw,3.5rem)] font-medium tracking-tight">
              {page.title}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed opacity-70 md:text-[17px]">
              {page.body}
            </p>
          </div>
          <p className="text-[11px] tracking-[0.16em] opacity-40">
            Mock · origem → destino
          </p>
        </div>

        {playing && (
          <PageTransitionStage
            key={`${variant}-${runId}`}
            variant={variant}
            onCovered={onCovered}
            onDone={() => setPlaying(false)}
          />
        )}

        {!playing && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center px-6">
            <p className="rounded-full border border-current/15 bg-current/5 px-4 py-2 text-[12px] tracking-[0.08em] opacity-50 backdrop-blur-sm">
              Escolha uma variante e rode a transição
            </p>
          </div>
        )}
      </div>

      {/* Painel */}
      <aside
        className={`fixed bottom-0 right-0 z-20 flex max-h-[75vh] w-full flex-col border-t border-ink/10 bg-cream/95 text-ink backdrop-blur-md transition-transform duration-300 md:bottom-4 md:right-4 md:max-h-[min(82vh,680px)] md:w-[400px] md:rounded-2xl md:border ${
          panelOpen
            ? 'translate-y-0'
            : 'translate-y-[calc(100%-3rem)] md:translate-y-[calc(100%-3.25rem)]'
        }`}
      >
        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          className="flex shrink-0 items-center justify-between px-5 py-3 text-left md:px-6"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.22em]">
            Lab · Transições
          </span>
          <span className="text-[13px] text-stone-soft">
            {panelOpen ? 'recolher' : 'abrir'}
          </span>
        </button>

        <div className="overflow-y-auto px-5 pb-6 md:px-6">
          <p className="text-[13px] leading-relaxed text-charcoal">
            Variantes curtas baseadas no DNA do pré-loader (grade, onda, scan,
            cursor). No meio da cobertura o mock troca de página — simula a
            navegação real.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.18em] text-stone-soft">
                De
              </span>
              <select
                value={fromIdx}
                onChange={(e) => setFromIdx(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-[13px]"
              >
                {MOCK_PAGES.map((p, i) => (
                  <option key={p.id} value={i}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.18em] text-stone-soft">
                Para
              </span>
              <select
                value={toIdx}
                onChange={(e) => setToIdx(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-[13px]"
              >
                {MOCK_PAGES.map((p, i) => (
                  <option key={p.id} value={i}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={play}
              disabled={playing || fromIdx === toIdx}
              className="rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-cream disabled:opacity-40"
            >
              {playing ? 'Rodando…' : 'Rodar transição'}
            </button>
            <a
              href="/dev/preloader"
              className="rounded-full border border-ink/15 px-4 py-2 text-[12px] transition-colors hover:border-ink/40"
            >
              Lab preloader
            </a>
            <a
              href="/"
              className="rounded-full border border-ink/15 px-4 py-2 text-[12px] transition-colors hover:border-ink/40"
            >
              ← Galeria
            </a>
          </div>

          <ul className="mt-5 space-y-2">
            {PAGE_TRANSITIONS.map((v) => {
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
              Em foco
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-charcoal">
              Padrão em produção:{' '}
              <strong className="font-medium text-ink">Wipe + pulse</strong>{' '}
              (Galeria ↔ Contato). As outras variantes ficam no lab para
              comparar — não entram na navegação real por enquanto.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default PageTransitionLabPage;
