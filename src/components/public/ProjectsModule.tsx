'use client';

import ModuleState from '@/components/public/ModuleState';
import { Project } from '@/lib/types';

interface ProjectsModuleProps {
    projects: Project[];
    loading: boolean;
    error: string | null;
}

export default function ProjectsModule({ projects, loading, error }: ProjectsModuleProps) {
    if (loading) {
        return <ModuleState title="Cargando proyectos" message="Trazando el catalogo visible desde Supabase." />;
    }

    if (error) {
        return <ModuleState title="Proyectos no disponibles" message={error} tone="error" />;
    }

    if (projects.length === 0) {
        return <ModuleState title="Sin proyectos visibles" message="Activa o crea proyectos desde el panel administrativo para poblar este modulo." />;
    }

    return (
        <div className="module">
            <div className="module__section">
                <div className="module__label">Proyectos destacados</div>
                <div className="projects-grid stagger-children">
                    {projects.map((project, idx) => (
                        <article key={project.id} className={`project-card ${project.is_featured ? 'project-card--featured' : ''}`}>
                            <div className="project-card__wash" aria-hidden="true" />
                            <div>
                                <div className="project-card__header">
                                    <span className="project-card__index">{String(idx + 1).padStart(2, '0')}</span>
                                    {project.is_featured && <span className="project-card__featured-badge">Destacado</span>}
                                </div>
                                <h3 className="project-card__title">{project.title}</h3>
                                <p className="project-card__desc">{project.description}</p>
                            </div>

                            {project.image_url && <div className="project-card__media"><img src={project.image_url} alt={project.title} /></div>}

                            <div>
                                <div className="project-card__tech">
                                    {project.tech_stack.map((tech) => <span key={tech} className="project-card__tech-tag">{tech}</span>)}
                                </div>
                                <div className="project-card__links">
                                    {project.live_url && (
                                        <a href={project.live_url} className="project-card__link" target="_blank" rel="noopener noreferrer">Ver proyecto {'->'}</a>
                                    )}
                                    {project.repo_url && (
                                        <a href={project.repo_url} className="project-card__link" target="_blank" rel="noopener noreferrer">Codigo fuente {'->'}</a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
