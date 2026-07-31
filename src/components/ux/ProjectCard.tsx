import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/data/ux-portfolio';
import { Eyebrow, Tag } from './primitives';
import Img from './Img';

/**
 * Card de projeto do grid editorial.
 *
 * O layout muda conforme o `size`: `wide` coloca texto e imagem lado a lado,
 * os demais empilham. No hover a imagem cresce levemente, o título desliza e a
 * seta aparece — tudo dentro do mesmo card clicável.
 */
type ProjectCardProps = {
  project: Project;
  size?: 'default' | 'wide' | 'tall';
  /** Prioriza o carregamento da capa (usar apenas no primeiro card visível). */
  priority?: boolean;
  className?: string;
};

export default function ProjectCard({
  project,
  size = 'default',
  priority,
  className,
}: ProjectCardProps) {
  const isWide = size === 'wide';

  /* Campos do card derivados do schema do case. */
  const { project: meta } = project.projectSummary;
  const cover = project.heroImage;
  const coverAspect = 1.6;
  const industries = project.projectSummary.industries;
  const services = project.projectSummary.services;

  return (
    <article
      className={cn(
        'group relative flex overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-300 hover:border-[var(--color-text)]/25',
        isWide ? 'flex-col lg:flex-row' : 'flex-col',
        className,
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-[var(--color-background)]',
          isWide ? 'lg:w-[58%]' : 'w-full',
        )}
      >
        <span
          className="relative block w-full overflow-hidden"
          style={{ aspectRatio: size === 'tall' ? '4 / 5' : String(coverAspect) }}
        >
          <Img
            src={cover.src}
            alt={cover.alt}
            fill
            priority={priority}
            sizes={isWide ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 50vw, 100vw'}
            className="transition-transform duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </span>
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col p-6 md:p-8',
          isWide && 'lg:justify-between lg:p-10',
        )}
      >
        <div>
          <div className="flex items-center gap-3">
            <Eyebrow>{meta.category}</Eyebrow>
            <span aria-hidden="true" className="text-[var(--color-border)]">
              ·
            </span>
            <Eyebrow>{meta.year}</Eyebrow>
          </div>

          <h3
            className={cn(
              'mt-4 font-semibold tracking-[-0.025em] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1',
              isWide ? 'text-[28px] leading-[1.1] lg:text-[34px]' : 'text-[22px] leading-[1.15]',
            )}
          >
            <a href={`/ux/${project.slug}`} className="before:absolute before:inset-0">
              {meta.title}
            </a>
          </h3>

          <p
            className={cn(
              'mt-3 text-[var(--color-muted)]',
              isWide ? 'max-w-[52ch] text-[16px] leading-[1.6]' : 'text-[15px] leading-[1.6]',
            )}
          >
            {project.overview.intro}
          </p>

          <div className="mt-6">
            <Eyebrow>Indústrias</Eyebrow>
            <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[13px] text-[var(--color-muted)]">
              {industries.map((item, i) => (
                <li key={item} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-[var(--color-border)]">
                      ·
                    </span>
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-2">
            {services.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--color-text)]">
            Ver estudo de caso
            <ArrowUpRight
              size={16}
              strokeWidth={1.5}
              aria-hidden="true"
              className="translate-y-px opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
