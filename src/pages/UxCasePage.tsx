import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { getProject } from '@/data/ux-portfolio';
import '@/styles/ux-portfolio.css';

import Header from '@/components/ux/Header';
import ScrollProgress from '@/components/ux/ScrollProgress';
import CaseNav, { type CaseNavItem } from '@/components/ux/CaseNav';
import CaseStudyHero from '@/components/ux/CaseStudyHero';
import CaseOverview from '@/components/ux/CaseOverview';
import CaseIdentity from '@/components/ux/CaseIdentity';
import CaseGallery from '@/components/ux/CaseGallery';
import TestimonialCard from '@/components/ux/TestimonialCard';
import Footer from '@/components/ux/Footer';
import { Container, ButtonLink } from '@/components/ux/primitives';

/**
 * Template do estudo de caso — segue a ordem de 21 blocos definida em
 * `ux-portfolio.ts`: hero + resumo → overview → identidade visual → vitrine do
 * produto → depoimento. Todo o conteúdo vem dos dados; um projeto novo é só uma
 * entrada em `projects`.
 */
export default function UxCasePage({ slug }: { slug: string }) {
  const project = getProject(slug);

  useDocumentMeta({
    title: project
      ? `${project.projectSummary.project.title} — Estudo de caso · John Amorim`
      : 'Projeto não encontrado · John Amorim',
    description: project?.overview.intro ?? 'Estudo de caso de produto digital.',
    path: `/ux/${slug}`,
    image: project?.heroImage.src,
  });

  if (!project) {
    return (
      <div className="ux-root flex min-h-svh flex-col">
        <Header />
        <main id="conteudo" className="flex flex-1 items-center">
          <Container>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Erro 404
            </p>
            <h1 className="mt-4 max-w-[16ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.04em]">
              Este estudo de caso não existe.
            </h1>
            <ButtonLink href="/ux#projetos" className="mt-10" arrow>
              Ver todos os projetos
            </ButtonLink>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  const navItems: CaseNavItem[] = [
    { id: 'overview', label: 'Visão geral' },
    { id: 'identidade', label: 'Identidade' },
    { id: 'produto', label: 'Produto' },
    ...(project.testimonial ? [{ id: 'depoimento', label: 'Depoimento' }] : []),
  ];

  return (
    <div className="ux-root min-h-svh">
      <ScrollProgress />
      <Header />
      <CaseNav items={navItems} />

      <main id="conteudo">
        {/* 1–6 — imagem principal e resumo do projeto */}
        <CaseStudyHero project={project} />
        {/* 7–9 — introdução, desafio e abordagem */}
        <CaseOverview overview={project.overview} />
        {/* 10–14 — identidade visual */}
        <CaseIdentity identity={project.visualIdentity} />
        {/* 15–18 — vitrine do produto */}
        <CaseGallery showcase={project.productShowcase} />
        {/* 19–21 — depoimento (quando existe) */}
        {project.testimonial && <TestimonialCard testimonial={project.testimonial} />}
      </main>

      <Footer />
    </div>
  );
}
