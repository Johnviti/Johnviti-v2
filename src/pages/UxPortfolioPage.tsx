import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { profile, designSystem, processSteps } from '@/data/ux-portfolio';
import '@/styles/ux-portfolio.css';

import Header from '@/components/ux/Header';
import ScrollProgress from '@/components/ux/ScrollProgress';
import HeroSection from '@/components/ux/HeroSection';
import ProjectGrid from '@/components/ux/ProjectGrid';
import ProcessTimeline from '@/components/ux/ProcessTimeline';
import SectionHeader from '@/components/ux/SectionHeader';
import EditorialGrid from '@/components/ux/EditorialGrid';
import MetricCard from '@/components/ux/MetricCard';
import Footer from '@/components/ux/Footer';
import Reveal from '@/components/ux/Reveal';
import { Container, Eyebrow, Rule } from '@/components/ux/primitives';

/**
 * Página principal do portfólio: hero, grid de projetos, sobre e processo.
 * Os estudos de caso vivem em `/ux/<slug>` (ver `UxCasePage`).
 */
export default function UxPortfolioPage() {
  useDocumentMeta({
    title: `${profile.name} — UX/UI Designer e Product Designer`,
    description: profile.headline,
    path: '/ux',
  });

  /* Processo genérico do índice — não faz parte do estudo de caso. */
  const process = processSteps;

  return (
    <div className="ux-root min-h-svh">
      <ScrollProgress />
      <Header />

      <main id="conteudo">
        <HeroSection />
        <ProjectGrid />

        {/* ---------------------------------------------------------- sobre */}
        <section id="sobre" className="scroll-mt-24 py-24 md:py-32">
          <Container>
            <EditorialGrid
              ratio="5-7"
              left={
                <SectionHeader
                  eyebrow="Sobre"
                  title="Design de produto com responsabilidade sobre o resultado"
                  className="lg:pr-10"
                />
              }
              right={
                <div className="space-y-8">
                  <Reveal>
                    <p className="text-[19px] leading-[1.55] tracking-[-0.01em] md:text-[21px]">
                      Comecei em interface e fui parar em problema de negócio. Hoje meu trabalho
                      começa antes do Figma: entender a operação, achar onde ela trava e decidir,
                      com o time, o que vale construir.
                    </p>
                  </Reveal>
                  <Reveal delay={0.05}>
                    <p className="text-[16px] leading-[1.7] text-[var(--color-muted)]">
                      Trabalho bem em contextos densos — plataformas de dados, ferramentas internas,
                      produtos com muitas regras e pouca margem para erro. Gosto de sistemas: um
                      design system que outras pessoas conseguem usar sem me perguntar nada vale
                      mais do que uma tela impecável.
                    </p>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="text-[16px] leading-[1.7] text-[var(--color-muted)]">
                      Na prática isso significa pesquisa antes de solução, protótipo testado antes
                      de código e uma métrica combinada antes do primeiro pixel. E ficar por perto
                      depois do lançamento, para ver se a métrica se mexeu.
                    </p>
                  </Reveal>

                  <Reveal delay={0.14}>
                    <Rule className="my-4" />
                    <ul className="grid gap-4 sm:grid-cols-3">
                      {profile.stats.map((stat) => (
                        <li key={stat.label}>
                          <MetricCard value={stat.value} label={stat.label} />
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal delay={0.18}>
                    <Eyebrow>Como trabalho</Eyebrow>
                    <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {[
                        'Pesquisa aplicada, não decorativa',
                        'Decisão documentada, não defendida por gosto',
                        'Design system como produto interno',
                        'Acessibilidade desde o wireframe',
                        'Handoff com estados especificados',
                        'Medição depois do lançamento',
                      ].map((item) => (
                        <li key={item} className="flex gap-2.5 text-[15px] leading-[1.5]">
                          <span
                            aria-hidden="true"
                            className="mt-[9px] size-1 shrink-0 rounded-full bg-[var(--color-primary)]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              }
            />
          </Container>
        </section>

        {/* ------------------------------------------------------- processo */}
        <section
          id="processo"
          className="scroll-mt-24 bg-[var(--color-ink)] py-24 md:py-32"
          aria-labelledby="processo-title"
        >
          <Container>
            <SectionHeader
              id="processo-title"
              eyebrow="Processo"
              title="Seis etapas, sempre na mesma ordem"
              description="O grau de profundidade muda conforme o projeto, mas a sequência não. Cada etapa tem entregável combinado e critério para seguir adiante."
              tone="inverse"
            />
            <div className="mt-14">
              <ProcessTimeline steps={process} tone="inverse" />
            </div>
          </Container>
        </section>

        {/* -------------------------------------------- design system (teaser) */}
        <section className="py-24 md:py-32" aria-labelledby="ds-title">
          <Container>
            <SectionHeader
              id="ds-title"
              eyebrow="Design system"
              title="Um sistema, vários produtos"
              description={designSystem.intro}
              align="between"
            />
            <Reveal className="mt-14 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)]">
              <ul className="grid sm:grid-cols-3 lg:grid-cols-7">
                {designSystem.colors.map((color) => (
                  <li key={color.name} className="flex min-h-[140px] flex-col justify-end p-5"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span
                      className={`text-[12px] font-medium ${
                        color.on === 'dark' ? 'text-white/90' : 'text-black/70'
                      }`}
                    >
                      {color.name}
                    </span>
                    <span
                      className={`mt-1 font-mono text-[11px] ${
                        color.on === 'dark' ? 'text-white/60' : 'text-black/50'
                      }`}
                    >
                      {color.hex}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 text-[14px] text-[var(--color-muted)]">
                A documentação completa — logotipo, tipografia, grid, ícones e componentes — está
                dentro de cada estudo de caso.
              </p>
            </Reveal>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
