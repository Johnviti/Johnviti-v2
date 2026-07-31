import { useState } from 'react';
import {
  Search,
  Filter,
  Menu,
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Bell,
  Calendar,
  MapPin,
  Download,
  Check,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  Share2,
  ArrowRight,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VisualIdentity } from '@/data/ux-portfolio';
import { Container, Eyebrow } from './primitives';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import Img from './Img';

/**
 * Identidade visual do case — blocos 10 a 14:
 *
 *   10 imagem secundária
 *   11 cores (principal, background, texto, adicionais e gradiente)
 *   12 logo (com fallback para monograma) ou imagem terciária
 *   13 fonte (amostra + pesos)
 *   14 biblioteca de ícones
 *
 * Bento de 12 colunas no desktop; empilha no mobile.
 */

/** Nomes PascalCase da lucide-react → componente. Nomes fora do mapa somem. */
const iconMap: Record<string, LucideIcon> = {
  Search,
  Filter,
  Menu,
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Bell,
  Calendar,
  MapPin,
  Download,
  Check,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  Share2,
  ArrowRight,
  ExternalLink,
};

export default function CaseIdentity({ identity }: { identity: VisualIdentity }) {
  const { colors } = identity;
  /* Reúne as cores nomeadas numa lista única para os swatches. */
  const swatches = [
    { ...colors.primary, role: 'Principal' },
    { ...colors.background, role: 'Background' },
    { ...colors.text, role: 'Texto' },
    ...colors.additional.map((c) => ({ ...c, role: 'Adicional' })),
  ];

  return (
    <section id="identidade" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <SectionHeader
          eyebrow="Identidade visual"
          title="A cara do produto em cinco peças"
          description="Um resumo visual do projeto: a imagem, a paleta, a marca, a fonte e os ícones que sustentam a interface."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          {/* 10 — imagem secundária */}
          <Tile label="Imagem secundária" className="lg:col-span-5 lg:row-span-2" bodyClassName="p-0">
            <figure className="flex h-full flex-col">
              <div className="relative h-full min-h-[220px] overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--color-background)] lg:min-h-[360px]">
                <Img
                  src={identity.secondaryImage.src}
                  alt={identity.secondaryImage.alt}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              </div>
              {identity.secondaryImage.caption && (
                <figcaption className="px-5 py-4 text-[13px] leading-[1.5] text-[var(--color-muted)]">
                  {identity.secondaryImage.caption}
                </figcaption>
              )}
            </figure>
          </Tile>

          {/* 11 — cores */}
          <Tile label="Cores" className="lg:col-span-4">
            <ul className="grid grid-cols-2 gap-3">
              {swatches.map((color, i) => (
                <li
                  key={`${color.hex}-${i}`}
                  className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]"
                >
                  <span
                    className="flex h-14 items-end p-2.5"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span
                      className={cn(
                        'font-mono text-[11px]',
                        isLight(color.hex) ? 'text-black/65' : 'text-white/85',
                      )}
                    >
                      {color.hex}
                    </span>
                  </span>
                  <span className="block px-2.5 py-2 text-[12px] leading-tight">
                    {color.name}
                  </span>
                </li>
              ))}
            </ul>

            {colors.gradient && (
              <div className="mt-3">
                <span
                  className="flex h-12 items-end rounded-[var(--radius-md)] border border-[var(--color-border)] p-2.5"
                  style={{ background: colors.gradient.css }}
                >
                  <span className="font-mono text-[11px] text-white/90">
                    {colors.gradient.name}
                  </span>
                </span>
              </div>
            )}
          </Tile>

          {/* 12 — logo ou imagem terciária */}
          <BrandTile brandAsset={identity.brandAsset} />

          {/* 13 — fonte */}
          <Tile label="Fonte" className="lg:col-span-4">
            <div className="flex h-full flex-col">
              <p
                className="leading-none tracking-[-0.03em]"
                style={{ fontFamily: 'var(--font-display)', fontSize: '64px' }}
              >
                {identity.typography.sample.uppercase}
              </p>
              <div className="mt-6 flex items-baseline justify-between gap-3">
                <span className="text-[17px] font-semibold tracking-[-0.01em]">
                  {identity.typography.primary.family}
                </span>
                <span className="font-mono text-[12px] text-[var(--color-muted)]">
                  {identity.typography.primary.weights.join(' · ')}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[var(--color-muted)]">
                {identity.typography.primary.usage}
              </p>
              <p className="mt-4 border-t border-[var(--color-border)] pt-4 text-[14px] leading-[1.5]">
                {identity.typography.sample.text}
              </p>
              {identity.typography.secondary && (
                <p className="mt-3 text-[12px] text-[var(--color-muted)]">
                  Secundária: {identity.typography.secondary.family}
                </p>
              )}
            </div>
          </Tile>

          {/* 14 — biblioteca de ícones */}
          <Tile label="Ícones" className="lg:col-span-3">
            <div className="flex h-full flex-col">
              <ul className="grid grid-cols-3 gap-2">
                {identity.icons.items.map((name) => {
                  const Icon = iconMap[name];
                  if (!Icon) return null;
                  return (
                    <li
                      key={name}
                      className="flex aspect-square items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)]"
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="text-[var(--color-text)]"
                      />
                    </li>
                  );
                })}
              </ul>
              <p className="mt-auto pt-4 text-[12px] text-[var(--color-muted)]">
                {identity.icons.library} ·{' '}
                <a
                  href={identity.icons.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ux-link"
                >
                  {identity.icons.package}
                </a>
              </p>
            </div>
          </Tile>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------ bloco da marca */

function BrandTile({ brandAsset }: { brandAsset: VisualIdentity['brandAsset'] }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage =
    (brandAsset.type === 'image' || (brandAsset.type === 'logo' && brandAsset.src)) &&
    !imgFailed;
  const label = brandAsset.type === 'image' ? 'Imagem terciária' : 'Logo';

  return (
    <Tile label={label} className="lg:col-span-3" bodyClassName={showImage ? 'p-0' : undefined}>
      {showImage && brandAsset.src ? (
        <div className="relative h-full min-h-[160px] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-background)]">
          {/* SVG e assets ausentes caem para o monograma via onError. */}
          <img
            src={brandAsset.src}
            alt={brandAsset.alt}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-contain p-6"
          />
        </div>
      ) : (
        <div className="flex h-full min-h-[128px] flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] bg-[var(--color-background)] py-6">
          <span
            aria-hidden="true"
            className="flex size-16 items-center justify-center rounded-[14px] bg-[var(--color-primary)] text-[20px] font-semibold tracking-[-0.02em] text-white"
          >
            {brandAsset.monogram ?? '—'}
          </span>
          <span className="px-4 text-center text-[13px] font-medium">{brandAsset.title}</span>
        </div>
      )}
    </Tile>
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

function Tile({
  label,
  className,
  bodyClassName,
  children,
}: {
  label: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        'flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]',
        className,
      )}
    >
      <div className="px-5 pt-5">
        <Eyebrow>{label}</Eyebrow>
      </div>
      <div className={cn('flex-1 p-5', bodyClassName)}>{children}</div>
    </Reveal>
  );
}
