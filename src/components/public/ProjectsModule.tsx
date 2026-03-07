'use client';

import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function ProjectsModule() {
    const { projects } = usePortfolioData();

    return (
        <div className="module">
            <div className="module__section">
                <div className="module__label">Proyectos destacados</div>
                <div className="projects-grid stagger-children">
                    {projects.map((project, idx) => (
                        <article
                            key={project.id}
                            className={`project-card ${project.is_featured ? 'project-card--featured' : ''}`}
                        >
                            <div>
                                <div className="project-card__header">
                                    <span className="project-card__index">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    {project.is_featured && (
                                        <span className="project-card__featured-badge">Destacado</span>
                                    )}
                                </div>
                                <h3 className="project-card__title">{project.title}</h3>
                                <p className="project-card__desc">{project.description}</p>
                            </div>

                            <div>
                                <div className="project-card__tech">
                                    {project.tech_stack.map((tech) => (
                                        <span key={tech} className="project-card__tech-tag">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="project-card__links">
                                    {project.live_url && project.live_url !== '#' && (
                                        <a
                                            href={project.live_url}
                                            className="project-card__link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Ver proyecto →
                                        </a>
                                    )}
                                    {project.repo_url && project.repo_url !== '#' && (
                                        <a
                                            href={project.repo_url}
                                            className="project-card__link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Código fuente →
                                        </a>
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
