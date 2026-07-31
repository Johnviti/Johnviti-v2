import { projects } from '@/data/ux-portfolio';
import { Container, Grid, ButtonLink } from './primitives';
import SectionHeader from './SectionHeader';
import ProjectCard from './ProjectCard';
import Reveal from './Reveal';

/**
 * Grid editorial assimétrico. O ritmo é fixo e se repete a cada cinco projetos:
 * 8+4, largura total, 6+6 — combinando capas horizontais e verticais.
 */
const layout = [
  { span: 'lg:col-span-8', size: 'default' as const },
  { span: 'lg:col-span-4', size: 'tall' as const },
  { span: 'lg:col-span-12', size: 'wide' as const },
  { span: 'lg:col-span-6', size: 'default' as const },
  { span: 'lg:col-span-6', size: 'default' as const },
];

export default function ProjectGrid() {
  return (
    <section id="projetos" className="scroll-mt-24 py-24 md:py-32" aria-labelledby="projetos-title">
      <Container>
        <SectionHeader
          id="projetos-title"
          eyebrow="Portfólio"
          title="Projetos selecionados"
          description="Seis produtos entre plataformas de dados, especiais editoriais e consumo. Cada card abre um estudo de caso completo, do problema de negócio ao resultado."
          align="between"
          action={
            <ButtonLink href="#contato" variant="secondary" arrow>
              Trabalhar juntos
            </ButtonLink>
          }
        />

        <Grid className="mt-14 md:mt-16">
          {projects.map((project, index) => {
            const slot = layout[index % layout.length];
            return (
              <Reveal
                key={project.slug}
                as="div"
                delay={(index % 2) * 0.06}
                className={`col-span-4 md:col-span-8 ${slot.span}`}
              >
                <ProjectCard
                  project={project}
                  size={slot.size}
                  priority={index === 0}
                  className="h-full"
                />
              </Reveal>
            );
          })}
        </Grid>
      </Container>
    </section>
  );
}
