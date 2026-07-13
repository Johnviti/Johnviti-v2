import { motion } from 'framer-motion';
import { PROJECTS, SOCIALS } from '@/data/site';

type Project = (typeof PROJECTS)[number];

const Card = ({ project, index }: { project: Project; index: number }) => {
  const featured = 'featured' in project && project.featured;

  return (
    <motion.a
      href={project.href}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group block ${featured ? 'md:col-span-2' : ''}`}
    >
      <div
        className={`overflow-hidden rounded-xl bg-cream-soft ${
          featured ? 'aspect-[16/8]' : 'aspect-[4/3]'
        }`}
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-medium leading-snug tracking-tight md:text-2xl">
          {project.title}
        </h3>
        <span className="hidden shrink-0 text-sm text-stone-soft transition-transform duration-300 group-hover:translate-x-1 md:block">
          →
        </span>
      </div>
      <p className="mt-1 text-sm text-stone-soft">
        {project.client} · {project.category}
      </p>
    </motion.a>
  );
};

export const CaseStudies = () => {
  const github = SOCIALS.find((s) => s.label === 'GitHub')?.href ?? '#';

  return (
    <section id="projetos" className="scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <div className="mb-10 flex items-end justify-between border-b border-ink/15 pb-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-stone-soft">
          Projetos em destaque
        </h2>
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 text-sm"
        >
          <span className="underline decoration-1 underline-offset-4 transition-opacity group-hover:opacity-60">
            Ver todos
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <Card key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};
