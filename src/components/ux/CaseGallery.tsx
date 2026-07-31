import { useState, type ReactNode } from 'react';
import { Expand } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductShowcase, ShowcaseImage } from '@/data/ux-portfolio';
import { Container, Eyebrow } from './primitives';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import Img from './Img';
import Lightbox, { type LightboxItem } from './Lightbox';

/**
 * Vitrine do produto — blocos 15 a 18:
 *
 *   15 texto de apresentação (introduction)
 *   16+ imagens com título e legenda
 *
 * Cada imagem respeita seu `display`: `full` ocupa a largura toda, `half`
 * divide a linha em dois. Clicar amplia no `Lightbox` (zoom).
 */
export default function CaseGallery({ showcase }: { showcase: ProductShowcase }) {
  const [zoomed, setZoomed] = useState<number | null>(null);

  const items: LightboxItem[] = showcase.images.map((image) => ({
    src: image.src,
    alt: image.alt,
    title: image.title,
    caption: image.caption,
  }));

  return (
    <section
      id="produto"
      className="scroll-mt-24 border-y border-[var(--color-border)] bg-[var(--color-surface)] py-24 md:py-32"
    >
      <Container>
        <SectionHeader
          eyebrow="Produto"
          title="O produto em uso"
          description={showcase.introduction}
        />

        <div className="mt-14 space-y-6">
          {groupImages(showcase.images).map((row, rowIndex) =>
            row.length === 1 ? (
              <GalleryItem
                key={row[0].idx}
                image={row[0].image}
                index={row[0].idx}
                onZoom={() => setZoomed(row[0].idx)}
                priority={row[0].idx === 0}
              />
            ) : (
              <div key={`row-${rowIndex}`} className="grid gap-6 md:grid-cols-2">
                {row.map((cell) => (
                  <GalleryItem
                    key={cell.idx}
                    image={cell.image}
                    index={cell.idx}
                    onZoom={() => setZoomed(cell.idx)}
                  />
                ))}
              </div>
            ),
          )}
        </div>

        <Lightbox
          items={items}
          index={zoomed}
          onIndexChange={setZoomed}
          onClose={() => setZoomed(null)}
        />
      </Container>
    </section>
  );
}

/**
 * Agrupa as imagens em linhas: cada `full` fica sozinha; `half` consecutivas
 * se juntam em pares. Preserva a ordem original.
 */
function groupImages(images: ShowcaseImage[]) {
  const rows: { image: ShowcaseImage; idx: number }[][] = [];
  let halfBuffer: { image: ShowcaseImage; idx: number }[] = [];

  const flush = () => {
    if (halfBuffer.length) {
      rows.push(halfBuffer);
      halfBuffer = [];
    }
  };

  images.forEach((image, idx) => {
    if (image.display === 'full') {
      flush();
      rows.push([{ image, idx }]);
    } else {
      halfBuffer.push({ image, idx });
      if (halfBuffer.length === 2) flush();
    }
  });
  flush();

  return rows;
}

function GalleryItem({
  image,
  index,
  onZoom,
  priority,
}: {
  image: ShowcaseImage;
  index: number;
  onZoom: () => void;
  priority?: boolean;
}) {
  return (
    <Reveal
      as="figure"
      delay={(index % 2) * 0.06}
      className="flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <figcaption>
          <Eyebrow>{String(index + 1).padStart(2, '0')}</Eyebrow>
          <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.025em] md:text-[26px]">
            {image.title}
          </h3>
          <p className="mt-2 max-w-[52ch] text-[14px] leading-[1.55] text-[var(--color-muted)]">
            {image.caption}
          </p>
        </figcaption>

        <ZoomButton title={image.title} onClick={onZoom}>
          <Img
            src={image.src}
            alt={image.alt}
            aspect={16 / 10}
            priority={priority}
            sizes={
              image.display === 'full'
                ? '(min-width: 1024px) 80vw, 100vw'
                : '(min-width: 768px) 45vw, 100vw'
            }
            wrapperClassName="w-full"
            className="transition-transform duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/zoom:scale-[1.03]"
          />
        </ZoomButton>
      </div>
    </Reveal>
  );
}

function ZoomButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/zoom relative block w-full cursor-zoom-in overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-background)] text-left"
    >
      <span className="sr-only">{`Ampliar imagem: ${title}`}</span>
      {children}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-[var(--color-ink)]/85 text-white opacity-0 transition-opacity duration-200',
          'group-hover/zoom:opacity-100 group-focus-visible/zoom:opacity-100',
        )}
      >
        <Expand size={16} strokeWidth={1.5} />
      </span>
    </button>
  );
}
