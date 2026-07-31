import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Imagem otimizada.
 *
 * O projeto roda em Vite, então o `next/image` não existe aqui — este wrapper
 * cobre a mesma superfície de API (`fill`, `sizes`, `priority`) sobre a tag
 * nativa, com lazy loading, `decoding="async"` e placeholder de baixa
 * intensidade enquanto carrega. Ao portar para Next.js, troque o `<img>` por
 * `<Image>`: as props já batem.
 */
type ImgProps = {
  src: string;
  alt: string;
  /** Preenche o container posicionado (que precisa ser `relative`). */
  fill?: boolean;
  width?: number;
  height?: number;
  /** Proporção usada para reservar espaço e evitar reflow. */
  aspect?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  wrapperClassName?: string;
};

export default function Img({
  src,
  alt,
  fill,
  width,
  height,
  aspect,
  sizes = '100vw',
  priority = false,
  className,
  wrapperClassName,
}: ImgProps) {
  const [loaded, setLoaded] = useState(false);

  const image = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      className={cn(
        fill ? 'absolute inset-0 h-full w-full object-cover' : 'h-auto w-full',
        'transition-opacity duration-500',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  );

  if (fill) return image;

  return (
    <span
      className={cn(
        'relative block overflow-hidden bg-[var(--color-border)]/40',
        wrapperClassName,
      )}
      style={aspect ? { aspectRatio: String(aspect) } : undefined}
    >
      {image}
    </span>
  );
}
