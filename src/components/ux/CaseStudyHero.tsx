import { ArrowLeft } from 'lucide-react';
import type { Project } from '@/data/ux-portfolio';
import { Container, Eyebrow, Tag, MetaList } from './primitives';
import Reveal from './Reveal';
import Img from './Img';

/**
 * Abertura do estudo de caso — blocos 1 a 6 da ordem:
 *
 *   1  imagem principal
 *   2  nome do projeto
 *   3  o que fizemos (services)
 *   4  indústrias
 *   5  localização
 *   6  estágio
 */
export default function CaseStudyHero({ project }: { project: Project }) {
  const { projectSummary: s } = project;

  return (
    <header className="pt-[112px] md:pt-[144px]">
      <Container>
        <Reveal>
          <a
            href="/ux#projetos"
            className="ux-link inline-flex items-center gap-2 text-[13px] text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
          >
            <ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" />
            Todos os projetos
          </a>
        </Reveal>

        <Reveal delay={0.04} className="mt-10 max-w-[24ch]">
          <Eyebrow tone="primary">
            {s.project.category} · {s.project.year}
          </Eyebrow>
          <h1 className="mt-5 text-[40px] font-semibold leading-[1.03] tracking-[-0.04em] sm:text-[56px]">
            {s.project.title}
          </h1>
          <p className="mt-5 text-[15px] text-[var(--color-muted)]">{s.project.client}</p>
        </Reveal>

        {/* Bloco 1 — imagem principal */}
        <Reveal delay={0.08} className="mt-12">
          <figure className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
            <Img
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              aspect={16 / 9}
              priority
              sizes="100vw"
              wrapperClassName="rounded-[var(--radius-lg)]"
            />
          </figure>
        </Reveal>

        {/* Blocos 3 a 6 — o que fizemos, indústrias, localização, estágio */}
        <Reveal delay={0.12} className="mt-12">
          <div className="grid gap-8 border-t border-[var(--color-border)] pt-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Eyebrow>O que fizemos</Eyebrow>
              <ul className="mt-4 flex flex-wrap gap-2">
                {s.services.map((service) => (
                  <li key={service}>
                    <Tag tone="primary">{service}</Tag>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-6">
              <MetaList
                items={[
                  { label: 'Indústrias', value: s.industries.join(', ') },
                  { label: 'Localização', value: s.location },
                  { label: 'Estágio', value: s.stage },
                  { label: 'Cliente', value: s.project.client },
                ]}
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </header>
  );
}
