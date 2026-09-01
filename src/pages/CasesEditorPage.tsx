import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Editor local de cases — rota `/revisao`.
 *
 * Existe só em `npm run dev` com `VITE_CASES_EDITOR=true` no `.env`. Lê e grava
 * em `src/data/cases.json` (+ `cases.en.json` e o tile em `projects.json`)
 * através do middleware `vite/casesEditor.ts`, que por sua vez só aceita
 * requisições vindas de localhost.
 *
 * Ao salvar, o Vite detecta a mudança no JSON e recarrega a página — por isso o
 * slug selecionado fica no `sessionStorage`, para a revisão continuar de onde
 * parou. Toda alteração vale imediatamente no site, sem passo extra.
 */

/* ------------------------------------------------------------------- tipos */

type Json = Record<string, unknown>;
type CaseStudy = { slug: string; title: string } & Json;
type Payload = {
  cases: CaseStudy[];
  en: Record<string, Json>;
  projects: { slug: string; name: string; cover: string; aspect: number }[];
};

/* --------------------------------------------------------------- utilitários */

/** Lê `a.b.0.c` dentro de um objeto, sem estourar em caminho inexistente. */
const get = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined;
    return (acc as Json)[key];
  }, obj);

/** Devolve uma cópia com `path` alterado — arrays e objetos são clonados. */
const set = <T,>(obj: T, path: string, value: unknown): T => {
  const [head, ...rest] = path.split('.');
  const clone: unknown = Array.isArray(obj) ? [...obj] : { ...(obj as object) };
  const target = clone as Json;
  target[head] = rest.length
    ? set((target[head] ?? {}) as Json, rest.join('.'), value)
    : value;
  return clone as T;
};

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');
const asList = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

/** Campos que contam para a barra de completude de cada case. */
const SCORED = [
  'client', 'category', 'year', 'services', 'industries',
  'cover', 'visualIdentity', 'intro', 'challenge', 'approach',
  'learnings',
  'captionOne', 'captionTwo', 'websiteNote', 'websiteUrl', 'testimonial',
  'showcase',
] as const;

const filled = (v: unknown): boolean => {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.values(v as Json).some(filled);
  return true;
};

const score = (c: CaseStudy) => SCORED.filter((k) => filled(c[k])).length;

/* ------------------------------------------------------------- componentes */

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-soft">
    {children}
  </span>
);

const inputCls =
  'w-full rounded-md border border-ink/15 bg-surface px-3 py-2 text-[14px] text-ink outline-none transition-colors placeholder:text-stone-soft/60 focus:border-ink/40';

type FieldProps = {
  label: string;
  path: string;
  value: unknown;
  onChange: (path: string, value: unknown) => void;
  hint?: string;
};

const TextField = ({ label, path, value, onChange, hint }: FieldProps) => (
  <label className="block">
    <Label>{label}</Label>
    <input
      className={inputCls}
      value={asText(value)}
      placeholder={hint}
      onChange={(e) => onChange(path, e.target.value || null)}
    />
  </label>
);

const AreaField = ({
  label, path, value, onChange, rows = 3,
}: FieldProps & { rows?: number }) => (
  <label className="block">
    <Label>{label}</Label>
    <textarea
      className={`${inputCls} resize-y leading-relaxed`}
      rows={rows}
      value={asText(value)}
      onChange={(e) => onChange(path, e.target.value || null)}
    />
  </label>
);

/** Lista de strings, uma por linha — usada em serviços, setores e ícones. */
const ListField = ({ label, path, value, onChange }: FieldProps) => (
  <label className="block">
    <Label>
      {label} <span className="normal-case tracking-normal">(uma por linha)</span>
    </Label>
    <textarea
      className={`${inputCls} resize-y font-mono text-[13px]`}
      rows={Math.max(3, asList(value).length + 1)}
      value={asList(value).join('\n')}
      onChange={(e) => {
        const list = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
        onChange(path, list.length ? list : null);
      }}
    />
  </label>
);

const ColorField = ({
  label, path, value, onChange,
}: { label: string; path: string; value: unknown; onChange: FieldProps['onChange'] }) => {
  const name = asText(get(value, 'name'));
  const hex = asText(get(value, 'hex')) || '#000000';
  const valid = /^#[0-9a-fA-F]{6}$/.test(hex);
  return (
    <div className="flex items-end gap-2">
      <label className="flex-1">
        <Label>{label}</Label>
        <input
          className={inputCls}
          value={name}
          placeholder="nome da cor"
          onChange={(e) => onChange(`${path}.name`, e.target.value)}
        />
      </label>
      <input
        className={`${inputCls} w-[110px] font-mono uppercase`}
        value={hex}
        onChange={(e) => onChange(`${path}.hex`, e.target.value.toUpperCase())}
      />
      <input
        type="color"
        aria-label={`Seletor de ${label}`}
        className="h-[38px] w-[46px] shrink-0 cursor-pointer rounded-md border border-ink/15 bg-surface p-1"
        value={valid ? hex : '#000000'}
        onChange={(e) => onChange(`${path}.hex`, e.target.value.toUpperCase())}
      />
    </div>
  );
};

/** Caminho de imagem + miniatura, para conferir o arquivo sem sair da tela. */
const ImageField = ({
  label, path, value, onChange, onRemove,
}: FieldProps & { onRemove?: () => void }) => {
  const src = asText(value);
  return (
    <div className="flex items-end gap-3">
      <div className="size-16 shrink-0 overflow-hidden rounded-md border border-ink/15 bg-cream-soft">
        {src ? (
          <img src={src} alt="" className="size-full object-cover" loading="lazy" />
        ) : null}
      </div>
      <label className="min-w-0 flex-1">
        <Label>{label}</Label>
        <input
          className={`${inputCls} font-mono text-[12px]`}
          value={src}
          onChange={(e) => onChange(path, e.target.value || null)}
        />
      </label>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="h-[38px] shrink-0 rounded-md border border-ink/15 px-3 text-[12px] text-stone-soft transition-colors hover:border-ink/40 hover:text-ink"
        >
          remover
        </button>
      ) : null}
    </div>
  );
};

const Section = ({
  title, children, right,
}: { title: string; children: React.ReactNode; right?: React.ReactNode }) => (
  <section className="border-t border-ink/10 py-7 first:border-t-0 first:pt-0">
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
      {right}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

/* -------------------------------------------------------------------- página */

export default function CasesEditorPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [slug, setSlug] = useState<string | null>(
    () => sessionStorage.getItem('revisao:slug'),
  );
  const [draft, setDraft] = useState<CaseStudy | null>(null);
  const [draftEn, setDraftEn] = useState<Json | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [rawOpen, setRawOpen] = useState(false);
  const [raw, setRaw] = useState('');
  const loaded = useRef(false);

  /* ------------------------------------------------------------ carregamento */

  const load = useCallback(async () => {
    try {
      const res = await fetch('/__cases');
      if (!res.ok) throw new Error((await res.json()).error ?? res.statusText);
      const payload = (await res.json()) as Payload;
      setData(payload);
      setSlug((current) => current ?? payload.cases[0]?.slug ?? null);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    void load();
  }, [load]);

  /* Troca de case: recarrega o rascunho a partir do que está em disco. */
  useEffect(() => {
    if (!data || !slug) return;
    const found = data.cases.find((c) => c.slug === slug) ?? null;
    setDraft(found ? structuredClone(found) : null);
    setDraftEn(found ? structuredClone(data.en[slug] ?? {}) : null);
    setRaw(found ? JSON.stringify(found, null, 2) : '');
    sessionStorage.setItem('revisao:slug', slug);
  }, [data, slug]);

  const original = useMemo(
    () => data?.cases.find((c) => c.slug === slug) ?? null,
    [data, slug],
  );
  const dirty = useMemo(
    () =>
      Boolean(draft && original) &&
      (JSON.stringify(draft) !== JSON.stringify(original) ||
        JSON.stringify(draftEn) !== JSON.stringify(data?.en[slug ?? ''] ?? {})),
    [draft, original, draftEn, data, slug],
  );

  /* Aviso do navegador se houver alteração não salva. */
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = useCallback((path: string, value: unknown) => {
    setDraft((d) => (d ? set(d, path, value) : d));
  }, []);
  const updateEn = useCallback((path: string, value: unknown) => {
    setDraftEn((d) => (d ? set(d, path, value) : d));
  }, []);

  const save = useCallback(async () => {
    if (!draft || !slug) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/__cases', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          case: draft,
          en: draftEn && Object.keys(draftEn).length ? draftEn : null,
        }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error ?? res.statusText);
      setStatus(`Salvo às ${new Date().toLocaleTimeString('pt-BR')}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }, [draft, draftEn, slug, load]);

  /* Ctrl/Cmd+S salva sem tirar a mão do teclado. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (dirty && !saving) void save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dirty, saving, save]);

  const applyRaw = () => {
    try {
      const parsed = JSON.parse(raw) as CaseStudy;
      if (parsed.slug !== slug) throw new Error('O slug do JSON não bate com o case aberto.');
      setDraft(parsed);
      setError(null);
      setStatus('JSON aplicado ao rascunho — falta salvar.');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  /* ---------------------------------------------------------------- render */

  if (error && !data) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface p-8 text-ink">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="text-lg font-semibold">Editor indisponível</h1>
          <p className="text-sm text-charcoal">{error}</p>
          <p className="text-xs text-stone-soft">
            Confirme <code>VITE_CASES_EDITOR=true</code> no <code>.env</code> e
            reinicie o <code>npm run dev</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!data || !draft) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface text-sm text-stone-soft">
        carregando cases…
      </div>
    );
  }

  const identity = draft.visualIdentity as Json | null;
  const showcase = (draft.showcase ?? {}) as Json;
  const mockups = (Array.isArray(showcase.mockups) ? showcase.mockups : []) as {
    src: string; title: string;
  }[];

  return (
    <div className="min-h-svh bg-surface text-ink">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-ink/10 bg-surface/95 px-5 py-3 backdrop-blur">
        <div className="mr-auto">
          <h1 className="text-[15px] font-semibold tracking-tight">Revisão de cases</h1>
          <p className="text-[11px] text-stone-soft">
            {data.cases.length} cases · grava em src/data/cases.json · só localhost
          </p>
        </div>
        {status ? <span className="text-[12px] text-stone-soft">{status}</span> : null}
        {error ? <span className="text-[12px] text-[#c0392b]">{error}</span> : null}
        <a
          href={`/case/${draft.slug}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-ink/15 px-3 py-2 text-[12px] transition-colors hover:border-ink/40"
        >
          Abrir case ↗
        </a>
        <button
          type="button"
          disabled={!dirty}
          onClick={() => {
            if (!original) return;
            setDraft(structuredClone(original));
            setDraftEn(structuredClone(data.en[draft.slug] ?? {}));
            setRaw(JSON.stringify(original, null, 2));
            setStatus(null);
          }}
          className="rounded-md border border-ink/15 px-3 py-2 text-[12px] transition-colors enabled:hover:border-ink/40 disabled:opacity-35"
        >
          Reverter
        </button>
        <button
          type="button"
          disabled={!dirty || saving}
          onClick={() => void save()}
          className="rounded-md bg-ink px-4 py-2 text-[12px] font-medium text-cream transition-opacity enabled:hover:opacity-85 disabled:opacity-35"
        >
          {saving ? 'Salvando…' : dirty ? 'Salvar (Ctrl+S)' : 'Salvo'}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* ------------------------------------------------------- lista lateral */}
        <nav className="shrink-0 border-b border-ink/10 lg:h-[calc(100svh-61px)] lg:w-[320px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <ol>
            {data.cases.map((c, i) => {
              const n = score(c);
              const active = c.slug === draft.slug;
              return (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      if (dirty && !window.confirm('Há alterações não salvas. Trocar de case?')) return;
                      setSlug(c.slug);
                      setStatus(null);
                    }}
                    className={`flex w-full items-center gap-3 border-b border-ink/5 px-4 py-2.5 text-left transition-colors ${
                      active ? 'bg-cream-soft' : 'hover:bg-cream-soft/50'
                    }`}
                  >
                    <span className="w-6 shrink-0 font-mono text-[11px] text-stone-soft">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{c.title}</span>
                      <span className="mt-1 flex h-1 overflow-hidden rounded-full bg-ink/10">
                        <span
                          className="bg-ink/45"
                          style={{ width: `${(n / SCORED.length) * 100}%` }}
                        />
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-stone-soft">
                      {n}/{SCORED.length}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* ------------------------------------------------------------ formulário */}
        <main className="min-w-0 flex-1 px-5 py-6 lg:h-[calc(100svh-61px)] lg:overflow-y-auto lg:px-8">
          <div className="mx-auto max-w-[820px]">
            <Section title="Identificação">
              <TextField label="Título" path="title" value={draft.title} onChange={update} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Cliente" path="client" value={draft.client} onChange={update} />
                <TextField label="Categoria" path="category" value={draft.category} onChange={update} />
                <TextField label="Ano" path="year" value={draft.year} onChange={update} hint="2024" />
                <TextField label="Estágio (não aparece na página)" path="growthStage" value={draft.growthStage} onChange={update} />
                <TextField
                  label="Site no ar (botão do hero)"
                  path="websiteUrl"
                  value={draft.websiteUrl}
                  onChange={update}
                  hint="https://exemplo.com.br/"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ListField label="Serviços" path="services" value={draft.services} onChange={update} />
                <ListField label="Setor" path="industries" value={draft.industries} onChange={update} />
              </div>
              <ImageField label="Capa" path="cover" value={draft.cover} onChange={update} />
            </Section>

            <Section title="Narrativa">
              <AreaField label="Introdução" path="intro" value={draft.intro} onChange={update} />
              <AreaField label="Desafio" path="challenge" value={draft.challenge} onChange={update} />
              <AreaField label="Abordagem" path="approach" value={draft.approach} onChange={update} />
              <ListField label="Aprendizados" path="learnings" value={draft.learnings} onChange={update} />
              <div className="grid gap-4 sm:grid-cols-2">
                <AreaField label="Legenda 1" path="captionOne" value={draft.captionOne} onChange={update} rows={2} />
                <AreaField label="Legenda 2" path="captionTwo" value={draft.captionTwo} onChange={update} rows={2} />
              </div>
              <AreaField label="Nota do website" path="websiteNote" value={draft.websiteNote} onChange={update} rows={2} />
            </Section>

            <Section
              title="Depoimento"
              right={
                <button
                  type="button"
                  onClick={() =>
                    update(
                      'testimonial',
                      draft.testimonial ? null : { quote: '', author: '', role: '', logo: null },
                    )
                  }
                  className="rounded-md border border-ink/15 px-2.5 py-1 text-[11px] transition-colors hover:border-ink/40"
                >
                  {draft.testimonial ? 'remover' : 'adicionar'}
                </button>
              }
            >
              {draft.testimonial ? (
                <>
                  <AreaField label="Fala" path="testimonial.quote" value={get(draft, 'testimonial.quote')} onChange={update} rows={2} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Autor" path="testimonial.author" value={get(draft, 'testimonial.author')} onChange={update} />
                    <TextField label="Cargo" path="testimonial.role" value={get(draft, 'testimonial.role')} onChange={update} />
                  </div>
                  <ImageField label="Logo" path="testimonial.logo" value={get(draft, 'testimonial.logo')} onChange={update} />
                </>
              ) : (
                <p className="text-[13px] text-stone-soft">Sem depoimento cadastrado.</p>
              )}
            </Section>

            <Section title="Vitrine">
              <ImageField label="Imagem full-width" path="showcase.full" value={showcase.full} onChange={update} />
              <ListField label="Páginas (retrato, sem corte)" path="showcase.pages" value={showcase.pages} onChange={update} />
              <ListField label="Grade 2×2 (paisagem, recorta 16/10)" path="showcase.grid" value={showcase.grid} onChange={update} />
              <div>
                <Label>Mockups (janela de navegador)</Label>
                <div className="space-y-3">
                  {mockups.map((m, i) => (
                    <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                      <ImageField label={`Imagem ${i + 1}`} path={`showcase.mockups.${i}.src`} value={m.src} onChange={update} />
                      <TextField label="Título" path={`showcase.mockups.${i}.title`} value={m.title} onChange={update} />
                      <button
                        type="button"
                        onClick={() => update('showcase.mockups', mockups.filter((_, j) => j !== i))}
                        className="mt-[22px] h-[38px] rounded-md border border-ink/15 px-3 text-[12px] text-stone-soft transition-colors hover:border-ink/40 hover:text-ink"
                      >
                        remover
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => update('showcase.mockups', [...mockups, { src: '', title: '' }])}
                    className="rounded-md border border-dashed border-ink/25 px-3 py-2 text-[12px] text-stone-soft transition-colors hover:border-ink/50 hover:text-ink"
                  >
                    + adicionar mockup
                  </button>
                </div>
              </div>
            </Section>

            <Section
              title="Identidade visual"
              right={
                <button
                  type="button"
                  onClick={() =>
                    update(
                      'visualIdentity',
                      identity
                        ? null
                        : {
                            secondaryImage: { src: draft.cover, alt: '', caption: '' },
                            colors: {
                              primary: { name: 'Primária', hex: '#000000' },
                              background: { name: 'Fundo', hex: '#FFFFFF' },
                              text: { name: 'Texto', hex: '#1E1E1E' },
                              additional: [],
                              gradient: null,
                            },
                            brandAsset: { type: 'logo', 'src-img': null, bgColor: '#FFFFFF', alt: '', title: draft.title, monogram: '' },
                            typography: {
                              primary: { family: 'Inter', usage: '', weights: [400, 700] },
                              secondary: null,
                              sample: { uppercase: '', lowercase: '', title: draft.title, text: '' },
                            },
                            icons: { library: 'Lucide Icons', package: 'lucide-react', website: 'https://lucide.dev', items: [] },
                          },
                    )
                  }
                  className="rounded-md border border-ink/15 px-2.5 py-1 text-[11px] transition-colors hover:border-ink/40"
                >
                  {identity ? 'remover' : 'adicionar'}
                </button>
              }
            >
              {identity ? (
                <>
                  <ImageField
                    label="Imagem de apoio (recortada em paisagem — evite retrato)"
                    path="visualIdentity.secondaryImage.src"
                    value={get(draft, 'visualIdentity.secondaryImage.src')}
                    onChange={update}
                  />
                  <AreaField label="Legenda da imagem" path="visualIdentity.secondaryImage.caption" value={get(draft, 'visualIdentity.secondaryImage.caption')} onChange={update} rows={2} />

                  <div className="space-y-3 rounded-lg border border-ink/10 p-4">
                    <ColorField label="Cor primária" path="visualIdentity.colors.primary" value={get(draft, 'visualIdentity.colors.primary')} onChange={update} />
                    <ColorField label="Fundo" path="visualIdentity.colors.background" value={get(draft, 'visualIdentity.colors.background')} onChange={update} />
                    <ColorField label="Texto" path="visualIdentity.colors.text" value={get(draft, 'visualIdentity.colors.text')} onChange={update} />
                    {asList(get(draft, 'visualIdentity.colors.additional')).length === 0 ? null : null}
                    {((get(draft, 'visualIdentity.colors.additional') as Json[] | undefined) ?? []).map((_, i) => (
                      <div key={i} className="flex items-end gap-2">
                        <div className="flex-1">
                          <ColorField
                            label={`Cor extra ${i + 1}`}
                            path={`visualIdentity.colors.additional.${i}`}
                            value={get(draft, `visualIdentity.colors.additional.${i}`)}
                            onChange={update}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            update(
                              'visualIdentity.colors.additional',
                              ((get(draft, 'visualIdentity.colors.additional') as Json[]) ?? []).filter((_, j) => j !== i),
                            )
                          }
                          className="h-[38px] rounded-md border border-ink/15 px-3 text-[12px] text-stone-soft transition-colors hover:border-ink/40 hover:text-ink"
                        >
                          remover
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        update('visualIdentity.colors.additional', [
                          ...(((get(draft, 'visualIdentity.colors.additional') as Json[]) ?? [])),
                          { name: '', hex: '#000000' },
                        ])
                      }
                      className="rounded-md border border-dashed border-ink/25 px-3 py-1.5 text-[12px] text-stone-soft transition-colors hover:border-ink/50 hover:text-ink"
                    >
                      + cor extra
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Fonte principal" path="visualIdentity.typography.primary.family" value={get(draft, 'visualIdentity.typography.primary.family')} onChange={update} />
                    <TextField label="Uso da principal" path="visualIdentity.typography.primary.usage" value={get(draft, 'visualIdentity.typography.primary.usage')} onChange={update} />
                    <TextField label="Fonte secundária" path="visualIdentity.typography.secondary.family" value={get(draft, 'visualIdentity.typography.secondary.family')} onChange={update} />
                    <TextField label="Uso da secundária" path="visualIdentity.typography.secondary.usage" value={get(draft, 'visualIdentity.typography.secondary.usage')} onChange={update} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Marca — título" path="visualIdentity.brandAsset.title" value={get(draft, 'visualIdentity.brandAsset.title')} onChange={update} />
                    <TextField label="Marca — monograma" path="visualIdentity.brandAsset.monogram" value={get(draft, 'visualIdentity.brandAsset.monogram')} onChange={update} />
                  </div>
                  <ImageField label="Marca — logo (SVG/PNG)" path="visualIdentity.brandAsset.src" value={get(draft, 'visualIdentity.brandAsset.src')} onChange={update} />
                  <ListField label="Ícones Lucide" path="visualIdentity.icons.items" value={get(draft, 'visualIdentity.icons.items')} onChange={update} />
                </>
              ) : (
                <p className="text-[13px] text-stone-soft">Sem identidade visual cadastrada.</p>
              )}
            </Section>

            <Section title="Tradução (EN)">
              {draftEn ? (
                <>
                  <TextField label="Title" path="title" value={draftEn.title} onChange={updateEn} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Client" path="client" value={draftEn.client} onChange={updateEn} />
                    <TextField label="Category" path="category" value={draftEn.category} onChange={updateEn} />
                    <TextField label="Growth stage" path="growthStage" value={draftEn.growthStage} onChange={updateEn} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ListField label="Services" path="services" value={draftEn.services} onChange={updateEn} />
                    <ListField label="Industries" path="industries" value={draftEn.industries} onChange={updateEn} />
                  </div>
                  <AreaField label="Intro" path="intro" value={draftEn.intro} onChange={updateEn} />
                  <AreaField label="Challenge" path="challenge" value={draftEn.challenge} onChange={updateEn} />
                  <AreaField label="Approach" path="approach" value={draftEn.approach} onChange={updateEn} />
                  <ListField label="Learnings" path="learnings" value={draftEn.learnings} onChange={updateEn} />
                  <AreaField label="Website note" path="websiteNote" value={draftEn.websiteNote} onChange={updateEn} rows={2} />
                </>
              ) : null}
            </Section>

            <Section
              title="JSON completo"
              right={
                <button
                  type="button"
                  onClick={() => {
                    setRaw(JSON.stringify(draft, null, 2));
                    setRawOpen((v) => !v);
                  }}
                  className="rounded-md border border-ink/15 px-2.5 py-1 text-[11px] transition-colors hover:border-ink/40"
                >
                  {rawOpen ? 'fechar' : 'abrir'}
                </button>
              }
            >
              {rawOpen ? (
                <>
                  <p className="text-[12px] text-stone-soft">
                    Escape para qualquer campo que o formulário não cobre. Aplique
                    ao rascunho e depois salve.
                  </p>
                  <textarea
                    className={`${inputCls} resize-y font-mono text-[12px] leading-relaxed`}
                    rows={24}
                    value={raw}
                    onChange={(e) => setRaw(e.target.value)}
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    onClick={applyRaw}
                    className="rounded-md border border-ink/25 px-3 py-2 text-[12px] transition-colors hover:border-ink/50"
                  >
                    Aplicar ao rascunho
                  </button>
                </>
              ) : null}
            </Section>

            <div className="h-20" />
          </div>
        </main>
      </div>
    </div>
  );
}
