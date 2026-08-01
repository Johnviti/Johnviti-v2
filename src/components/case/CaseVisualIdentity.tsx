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
 *   Linha 2 →  marca/logo (7/24) | fonte (10/24) | ícones (7/24)
 *
 * Usa os tokens da própria CasePage (ink/surface/cream/stone-soft), então a
 * paleta inteira inverte sozinha no modo escuro — só os swatches mostram os
 * hexadecimais reais da marca (que, por definição, são fixos).
 */

/** Nomes PascalCase da lucide-react → componente. Nomes fora do mapa somem. */
const iconMap: Partial<Record<string, LucideIcon>> = {
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

  /* Reúne as cores nomeadas numa lista única para os swatches. */
  const swatches = [
    { ...colors.primary, role: 'Principal' },
    { ...colors.background, role: 'Fundo' },
    { ...colors.text, role: 'Texto' },
    ...colors.additional.map((c) => ({ ...c, role: 'Adicional' })),
  ];

  const alphabetSpecimen = resolveAlphabetSpecimen(typography);
  const resolvedIcons = icons.items.flatMap((name) => {
    const Icon = iconMap[name];
    return Icon ? [{ name, Icon }] : [];
  });
  const iconColumns = Math.min(5, Math.max(1, resolvedIcons.length));
  const iconRows = Math.max(1, Math.ceil(resolvedIcons.length / iconColumns));

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
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(24,minmax(0,1fr))]"
    >
      {/* 10 — imagem secundária: só a imagem, em 16:9, cobrindo a seção. */}
      <motion.div
        variants={item}
        className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-ink/10 bg-cream-soft sm:col-span-2 lg:col-span-14"
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
        className="flex flex-col overflow-hidden rounded-2xl bg-cream-soft sm:col-span-2 lg:col-span-10"
      >
        <div className="px-5 pt-5">
          <span className="text-[18px] font-normal leading-none text-ink">
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
        compact
      />

      {/* 13 — a mesma prancha editorial é alimentada pelos dados de tipografia
          de cada case; `specimen.alphabet` apenas sobrescreve os defaults. */}
      <AlphabetSpecimenTile alphabet={alphabetSpecimen} />

      {/* 14 — biblioteca de ícones */}
      <Tile
        label="Ícones"
        surface="soft"
        bordered={false}
        labelClassName="text-[18px] font-normal leading-none text-ink"
        className="sm:col-span-1 lg:col-span-7"
      >
        <div className="flex h-full flex-col">
          <ul
            className="grid flex-1 gap-2"
            style={{
              gridTemplateColumns: `repeat(${iconColumns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${iconRows}, minmax(0, 1fr))`,
            }}
          >
            {resolvedIcons.map(({ name, Icon }) => (
              <li key={name} className="flex min-h-0 items-center justify-center">
                <Icon
                  size={21}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-ink transition-colors duration-300"
                />
              </li>
            ))}
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
  const [coverFailed, setCoverFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const colSpan = compact ? 'lg:col-span-7' : 'lg:col-span-6';
  const frame = `overflow-hidden rounded-2xl border border-ink/10 sm:col-span-1 ${colSpan}`;

  // `src-img` (ou type image) → imagem COMO ESTÁ, cobrindo a seção inteira.
  const coverSrc =
    brandAsset['src-img'] ??
    (brandAsset.type === 'image' ? brandAsset.src : null);
  // type logo + `src` → logo CENTRALIZADA sobre `bgColor`.
  const logoSrc = brandAsset.type === 'logo' ? brandAsset.src : null;

  if (coverSrc && !coverFailed) {
    return (
      <motion.div variants={item} className={`relative min-h-[200px] bg-cream-soft ${frame}`}>
        <img
          src={coverSrc}
          alt={brandAsset.alt}
          loading="lazy"
          decoding="async"
          onError={() => setCoverFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>
    );
  }

  if (logoSrc && !logoFailed) {
    return (
      <motion.div
        variants={item}
        className={`flex min-h-[200px] items-center justify-center p-6 ${frame}`}
        style={{ backgroundColor: brandAsset.bgColor ?? '#ffffff' }}
      >
        <img
          src={logoSrc}
          alt={brandAsset.alt}
          loading="lazy"
          decoding="async"
          onError={() => setLogoFailed(true)}
          className="max-h-full max-w-full object-contain"
        />
      </motion.div>
    );
  }

  // Sem imagem: monograma na cor da marca preenchendo a seção.
  return (
    <motion.div
      variants={item}
      className={`flex min-h-[200px] flex-col items-center justify-center gap-4 bg-cream-soft ${frame}`}
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
      className="case-typography-specimen flex min-h-[380px] flex-col overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-10"
    >
      <div className="grid h-full flex-1 px-6 py-6 sm:grid-cols-[1.05fr_0.95fr] sm:gap-8 sm:px-8 sm:py-8">
        <div className="flex min-w-0 flex-col">
          <p
            className="text-[18px] font-normal leading-none"
            style={{ fontFamily: alphabetFontStack }}
          >
            {alphabet.eyebrow}
          </p>

          <p
            className="mt-4 inline-flex gap-[0.04em] text-[clamp(7.5rem,14vw,12rem)] font-normal leading-[0.8]"
            style={{ fontFamily: alphabetFontStack }}
          >
            {Array.from(alphabet.display).map((character, index) => (
              <span key={`${character}-${index}`}>{character}</span>
            ))}
          </p>

          <ul className="mt-auto flex items-end justify-between gap-2 pt-4 text-[11px] leading-none">
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
            className="text-[clamp(2.2rem,3.4vw,3.35rem)] font-light leading-none tracking-[-0.04em]"
            style={{ fontFamily: alphabetFontStack }}
          >
            {alphabet.family}
          </p>

          <div
            className="mt-12 space-y-2 break-all text-[12px] font-medium leading-[1.2] sm:mt-0"
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

type TypographyData = VisualIdentity['typography'];
type AlphabetData = NonNullable<
  NonNullable<TypographyData['specimen']>['alphabet']
>;

/** Converte o bloco compacto do JSON na prancha editorial usada pelo layout. */
function resolveAlphabetSpecimen(typography: TypographyData): AlphabetData {
  const override = typography.specimen?.alphabet;
  const weightLabels: Record<number, string> = {
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'SemiBold',
    700: 'Bold',
  };

  return {
    eyebrow:
      override?.eyebrow ?? typography.specimen?.eyebrow ?? 'Typography',
    display: override?.display ?? typography.specimen?.display ?? 'Aa',
    family: override?.family ?? typography.primary.family,
    weights:
      override?.weights ??
      typography.primary.weights.slice(0, 4).map((value) => ({
        label: weightLabels[value] ?? String(value),
        value,
      })),
    uppercase: override?.uppercase ?? typography.sample.uppercase,
    lowercase: override?.lowercase ?? typography.sample.lowercase,
    numerals: override?.numerals ?? '0123456789',
  };
}

function Tile({
  label,
  className,
  bodyClassName,
  labelClassName,
  surface = 'default',
  bordered = true,
  children,
}: {
  label: string;
  className?: string;
  bodyClassName?: string;
  labelClassName?: string;
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
        <span className={labelClassName ?? LABEL}>{label}</span>
      </div>
      <div className={`flex-1 p-5 ${bodyClassName ?? ''}`}>{children}</div>
    </motion.div>
  );
}
