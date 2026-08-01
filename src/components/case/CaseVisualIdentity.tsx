import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  MapPin, ArrowRight, Menu, Search, ExternalLink, CloudSun, Calendar,
  RefreshCw, Bell, BarChart3, TrendingUp, Table2, Download, Map, TreePine,
  Flame, Filter, Leaf, Users, ShieldCheck, Globe2, ShoppingCart, Check, Plus,
  Trash2, Anchor, Waves, Ship, Layout, Grid3X3, Code2, ArrowUpRight, Mail,
  PawPrint, Heart, Share2, MousePointerClick, Rocket, LayoutDashboard, Settings,
  Bot, MessageSquare, Pause, Tag, Send, FileText, School, AlertTriangle,
  MessageCircle, Sparkles, Zap, Sun, Wind, Factory, ListOrdered, Telescope, Eye,
  type LucideIcon,
} from 'lucide-react';
import type { VisualIdentity } from '@/data/ux-portfolio';

/**
 * Identidade visual do case (blocos 10 a 14 do modelo), montada como bento:
 *
 *   Linha 1 →  imagem secundária        |  cores (100% HTML)
 *   Linha 2 →  marca/logo  |  fonte utilizada  |  biblioteca de ícones
 *
 * Usa os tokens da própria CasePage (ink/surface/cream/stone-soft), então a
 * paleta inteira inverte sozinha no modo escuro — só os swatches mostram os
 * hexadecimais reais da marca (que, por definição, são fixos).
 */

/** Nomes PascalCase da lucide-react → componente. Nomes fora do mapa somem. */
const iconMap: Record<string, LucideIcon> = {
  MapPin, ArrowRight, Menu, Search, ExternalLink, CloudSun, Calendar, RefreshCw,
  Bell, BarChart3, TrendingUp, Table2, Download, Map, TreePine, Flame, Filter,
  Leaf, Users, ShieldCheck, Globe2, ShoppingCart, Check, Plus, Trash2, Anchor,
  Waves, Ship, Layout, Grid3X3, Code2, ArrowUpRight, Mail, PawPrint, Heart,
  Share2, MousePointerClick, Rocket, LayoutDashboard, Settings, Bot,
  MessageSquare, Pause, Tag, Send, FileText, School, AlertTriangle,
  MessageCircle, Sparkles, Zap, Sun, Wind, Factory, ListOrdered, Telescope, Eye,
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const VIEWPORT = { once: true, margin: '-80px' } as const;

const LABEL =
  'text-[11px] font-medium uppercase tracking-[0.16em] text-stone-soft';

export default function CaseVisualIdentity({
  identity,
}: {
  identity: VisualIdentity;
}) {
  const { colors, typography, icons } = identity;
  const hasTypographySpecimen = Boolean(typography.specimen);

  /* Reúne as cores nomeadas numa lista única para os swatches. */
  const swatches = [
    { ...colors.primary, role: 'Principal' },
    { ...colors.background, role: 'Fundo' },
    { ...colors.text, role: 'Texto' },
    ...colors.additional.map((c) => ({ ...c, role: 'Adicional' })),
  ];

  const fontStack = `'${typography.primary.family}', ui-sans-serif, system-ui, sans-serif`;

  /* Mosaico de cores: preenche o retângulo por completo qualquer que seja a
     quantidade de cores. As colunas/linhas vêm da raiz quadrada do total e a
     cor principal estica para absorver as células que sobram. */
  const count = swatches.length;
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const leftover = cols * rows - count; // células a mais que a 1ª cor absorve

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12"
    >
      {/* 10 — imagem secundária: só a imagem, cobrindo a seção inteira. */}
      <motion.div
        variants={item}
        className="relative min-h-[280px] overflow-hidden rounded-2xl border border-ink/10 bg-cream-soft sm:col-span-2 lg:col-span-7 lg:min-h-[420px]"
      >
        <img
          src={identity.secondaryImage.src}
          alt={identity.secondaryImage.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>

      {/* 11 — cores: a SEÇÃO tem fundo cinza; o mosaico (que completa o
          retângulo) vive dentro, emoldurado por esse cinza. */}
      <motion.div
        variants={item}
        className="flex flex-col overflow-hidden rounded-2xl bg-cream-soft sm:col-span-2 lg:col-span-5"
      >
        <div className="px-5 pt-5">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone-soft">
            Cores
          </span>
        </div>
        <div className="flex-1 p-5">
          <div
            className="grid h-full min-h-[200px] w-full grid-flow-row-dense overflow-hidden rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
          >
            {swatches.map((color, i) => {
              const light = isLight(color.hex);
              return (
                <div
                  key={`${color.hex}-${i}`}
                  className="relative flex flex-col p-3"
                  style={{
                    backgroundColor: color.hex,
                    ...(i === 0 && leftover > 0
                      ? { gridRow: `span ${leftover + 1}` }
                      : {}),
                  }}
                >
                  <span
                    className={`font-mono text-[10px] leading-tight tracking-wide ${
                      light ? 'text-black/70' : 'text-white/80'
                    }`}
                  >
                    {color.hex.toUpperCase()}
                  </span>
                  <span
                    className={`text-[11px] leading-tight ${
                      light ? 'text-black/55' : 'text-white/65'
                    }`}
                  >
                    {color.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 12 — marca / logo */}
      <BrandTile
        brandAsset={identity.brandAsset}
        primaryHex={colors.primary.hex}
        compact={hasTypographySpecimen}
      />

      {/* 13 — fonte utilizada. Cases com `specimen` recebem a prancha editorial;
          os demais continuam no formato compacto do design system. */}
      {typography.specimen ? (
        <TypographySpecimenTile
          fontStack={fontStack}
          specimen={typography.specimen}
        />
      ) : (
        <Tile label="Fonte" className="sm:col-span-2 lg:col-span-6">
          <div className="flex h-full flex-col">
            {/* Cabeçalho: família + uso + pesos */}
            <div className="flex items-end justify-between gap-3 border-b border-ink/10 pb-4">
              <div className="flex flex-col">
                <span
                  className="text-[22px] font-semibold leading-none tracking-[-0.02em] text-ink"
                  style={{ fontFamily: fontStack }}
                >
                  {typography.primary.family}
                </span>
                <span className="mt-1.5 text-[12px] text-stone-soft">
                  {typography.primary.usage}
                </span>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-stone-soft">
                {typography.primary.weights.join(' · ')}
              </span>
            </div>

            {/* Escala tipográfica — cada papel com a sua amostra viva */}
            <dl className="divide-y divide-ink/10">
              <TypeRow role="Título" meta="600">
                <span
                  className="block leading-[1.05] tracking-[-0.02em] text-ink"
                  style={{ fontFamily: fontStack, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 600 }}
                >
                  {typography.sample.title}
                </span>
              </TypeRow>
              <TypeRow role="Corpo" meta="400">
                <p
                  className="text-[14px] leading-[1.55] text-charcoal"
                  style={{ fontFamily: fontStack }}
                >
                  {typography.sample.text}
                </p>
              </TypeRow>
            </dl>

            {typography.secondary && (
              <p className="mt-4 text-[12px] text-stone-soft">
                Secundária: {typography.secondary.family}
              </p>
            )}
          </div>
        </Tile>
      )}

      {/* 14 — biblioteca de ícones */}
      <Tile
        label="Ícones"
        surface="soft"
        bordered={false}
        className={`sm:col-span-1 ${hasTypographySpecimen ? 'lg:col-span-2' : 'lg:col-span-3'}`}
      >
        <div className="flex h-full flex-col">
          <ul
            className={`grid ${
              hasTypographySpecimen
                ? 'flex-1 grid-cols-5 grid-rows-7 gap-1'
                : 'grid-cols-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {icons.items.map((name) => {
              const Icon = iconMap[name];
              if (!Icon) return null;
              return (
                <li
                  key={name}
                  className={`flex items-center justify-center ${hasTypographySpecimen ? 'min-h-0' : 'aspect-square'}`}
                >
                  <Icon
                    size={hasTypographySpecimen ? 15 : 22}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="text-ink transition-colors duration-300"
                  />
                </li>
              );
            })}
          </ul>
          <p className="mt-auto pt-4 text-[12px] text-stone-soft">
            {icons.library} ·{' '}
            <a
              href={icons.website}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
            >
              {icons.package}
            </a>
          </p>
        </div>
      </Tile>
    </motion.div>
  );
}

/* ------------------------------------------------------ bloco da marca */

function BrandTile({
  brandAsset,
  primaryHex,
  compact = false,
}: {
  brandAsset: VisualIdentity['brandAsset'];
  primaryHex: string;
  compact?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage =
    (brandAsset.type === 'image' ||
      (brandAsset.type === 'logo' && brandAsset.src)) &&
    !imgFailed;

  // Com imagem: só a imagem, cobrindo a seção (SVG/assets ausentes caem para o
  // monograma via onError).
  if (showImage && brandAsset.src) {
    return (
      <motion.div
        variants={item}
        className={`relative min-h-[200px] overflow-hidden rounded-2xl border border-ink/10 bg-cream-soft sm:col-span-1 ${compact ? 'lg:col-span-2' : 'lg:col-span-3'}`}
      >
        <img
          src={brandAsset.src}
          alt={brandAsset.alt}
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>
    );
  }

  // Sem imagem: monograma na cor da marca preenchendo a seção.
  return (
    <motion.div
      variants={item}
      className={`flex min-h-[200px] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-ink/10 bg-cream-soft sm:col-span-1 ${compact ? 'lg:col-span-2' : 'lg:col-span-3'}`}
    >
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-[14px] text-[20px] font-semibold tracking-[-0.02em] text-white"
        style={{ backgroundColor: primaryHex }}
      >
        {brandAsset.monogram ?? '—'}
      </span>
      <span className="px-4 text-center text-[13px] font-medium text-ink">
        {brandAsset.title}
      </span>
    </motion.div>
  );
}

/* --------------------------------------------------------------- helpers */

/** Luminância aproximada para decidir texto claro/escuro sobre o swatch. */
function isLight(hex: string) {
  const clean = hex.replace('#', '');
  if (clean.length < 6) return true;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

/**
 * Linha do espécime de tipografia: meta à esquerda (papel + fonte/peso) e a
 * amostra viva à direita, separadas por um filete — como num guia de marca.
 */
function TypeRow({
  role,
  meta,
  children,
}: {
  role: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(76px,auto)_1fr] gap-4 py-4 sm:gap-6">
      <dt className="pt-1">
        <span className={LABEL}>{role}</span>
        <span className="mt-1 block font-mono text-[11px] text-stone-soft">
          {meta}
        </span>
      </dt>
      <dd className="min-w-0 self-center">{children}</dd>
    </div>
  );
}

function TypographySpecimenTile({
  fontStack,
  specimen,
}: {
  fontStack: string;
  specimen: NonNullable<VisualIdentity['typography']['specimen']>;
}) {
  if (specimen.layout === 'alphabet' && specimen.alphabet) {
    return <AlphabetSpecimenTile alphabet={specimen.alphabet} />;
  }

  return (
    <motion.section
      variants={item}
      aria-label="Fonte"
      className="case-typography-specimen flex min-h-[580px] flex-col overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-8"
    >
      <div className="flex h-full flex-1 flex-col px-6 py-6 sm:px-8 sm:py-7">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-normal leading-none">
            {specimen.eyebrow}
          </p>
          <ul className="flex items-center gap-7 text-[14px] leading-none">
            {specimen.weights.map((weight) => (
              <li
                key={`${weight.label}-${weight.value}`}
                style={{ fontFamily: fontStack, fontWeight: weight.value }}
              >
                {weight.label}
              </li>
            ))}
          </ul>
        </header>

        <div className="flex flex-1 items-center justify-center py-14 sm:py-16">
          <p
            className="text-[clamp(8rem,23vw,18rem)] font-medium leading-[0.82] tracking-[-0.075em]"
            style={{ fontFamily: fontStack }}
          >
            {specimen.display}
          </p>
        </div>

        <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-3">
          {specimen.roles.slice(0, 3).map((role, index) => (
            <div key={role.label} className="min-w-0">
              <dt className="pb-3 text-[13px] font-semibold leading-none">
                {role.label}
              </dt>
              <dd
                className={`whitespace-pre-line pt-4 font-light opacity-45 ${
                  index === 0
                    ? 'text-[19px] leading-[1.2]'
                    : index === 1
                      ? 'text-[13px] leading-[1.25]'
                      : 'text-[10px] leading-[1.25]'
                }`}
                style={{ fontFamily: fontStack }}
              >
                {role.text}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.section>
  );
}

function AlphabetSpecimenTile({
  alphabet,
}: {
  alphabet: NonNullable<
    NonNullable<VisualIdentity['typography']['specimen']>['alphabet']
  >;
}) {
  const alphabetFontStack = `'${alphabet.family}', ui-sans-serif, system-ui, sans-serif`;

  return (
    <motion.section
      variants={item}
      aria-label="Fonte"
      className="case-typography-specimen flex min-h-[380px] flex-col overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-8"
    >
      <div className="grid h-full flex-1 px-6 py-6 sm:grid-cols-[1.15fr_0.85fr] sm:gap-12 sm:px-8 sm:py-8">
        <div className="flex min-w-0 flex-col">
          <p
            className="text-[18px] italic leading-none"
            style={{ fontFamily: alphabetFontStack }}
          >
            {alphabet.eyebrow}
          </p>

          <p
            className="mt-4 inline-flex gap-[0.04em] text-[clamp(9rem,19vw,16rem)] font-normal leading-[0.8]"
            style={{ fontFamily: alphabetFontStack }}
          >
            {Array.from(alphabet.display).map((character, index) => (
              <span key={`${character}-${index}`}>{character}</span>
            ))}
          </p>

          <ul className="mt-auto grid grid-cols-4 gap-3 pt-4 text-[12px] leading-none">
            {alphabet.weights.map((weight) => (
              <li
                key={`${weight.label}-${weight.value}`}
                style={{ fontFamily: alphabetFontStack, fontWeight: weight.value }}
              >
                {weight.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex min-w-0 flex-col justify-between sm:mt-0">
          <p
            className="text-[clamp(2.7rem,5vw,4rem)] font-light leading-none tracking-[-0.04em]"
            style={{ fontFamily: alphabetFontStack }}
          >
            {alphabet.family}
          </p>

          <div
            className="mt-12 space-y-2 break-all text-[14px] font-medium leading-[1.2] sm:mt-0"
            style={{ fontFamily: alphabetFontStack }}
          >
            <p>{alphabet.uppercase}</p>
            <p>{alphabet.lowercase}</p>
            <p>{alphabet.numerals}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Tile({
  label,
  className,
  bodyClassName,
  surface = 'default',
  bordered = true,
  children,
}: {
  label: string;
  className?: string;
  bodyClassName?: string;
  surface?: 'default' | 'soft';
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={item}
      className={`flex flex-col overflow-hidden rounded-2xl ${bordered ? 'border border-ink/10' : ''} ${surface === 'soft' ? 'bg-cream-soft' : 'bg-surface'} ${className ?? ''}`}
    >
      <div className="px-5 pt-5">
        <span className={LABEL}>{label}</span>
      </div>
      <div className={`flex-1 p-5 ${bodyClassName ?? ''}`}>{children}</div>
    </motion.div>
  );
}
