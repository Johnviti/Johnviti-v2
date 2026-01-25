import { projects } from '@/components/data/Projetcs';

export const Projects = () => {
  return (
    <section id="projects" className="py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2 className="text-4xl font-bold mb-4 text-text-primary">Projetos Selecionados</h2>
          <p className="text-base text-text-muted leading-relaxed">
            Uma coleção de projetos que demonstram minha paixão por desenvolver experiências web complexas e performáticas.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-border-lighter/50 border border-border-light rounded-2xl p-6 hover:border-border-highlight hover:bg-border-lighter transition-all duration-300 group cursor-pointer">
              <div className="aspect-video bg-black/40 rounded-lg mb-6 overflow-hidden border border-border-light">
                {/* Placeholder for image if it fails to load or empty */}
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                   {project.image ? (
                     <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                     <span>Sem imagem</span>
                   )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-text-primary group-hover:text-primary-main transition-colors">{project.name}</h3>
              <p className="text-text-secondary text-sm mb-6 leading-relaxed line-clamp-3">{project.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-primary-light/10 text-primary-main border border-primary-light/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
