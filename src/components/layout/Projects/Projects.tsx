import { projects } from '@/data/Projects';
import { projectsStyles } from './Projects.styles'
import { ProjectCard } from '@/components/ui/ProjectCard'


export const Projects = () => {
    return (
       <div>
        {projects.map((projeto) => (
        <div key={projeto.id}>
            {projeto.nome}
        </div>
        ))}
    </div>
    );
};