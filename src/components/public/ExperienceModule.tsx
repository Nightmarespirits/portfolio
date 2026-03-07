'use client';

import { usePortfolioData } from '@/hooks/usePortfolioData';

function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
}

export default function ExperienceModule() {
    const { experience } = usePortfolioData();

    return (
        <div className="module">
            <div className="module__section">
                <div className="module__label">Trayectoria profesional</div>
                <div className="timeline stagger-children">
                    {experience.map((exp) => (
                        <div
                            key={exp.id}
                            className={`timeline__item ${!exp.end_date ? 'timeline__item--current' : ''}`}
                        >
                            <div className="timeline__date">
                                <div>{formatDate(exp.start_date)}</div>
                                <div>{exp.end_date ? formatDate(exp.end_date) : 'Presente'}</div>
                            </div>
                            <div className="timeline__content">
                                <h3 className="timeline__role">{exp.role}</h3>
                                <div className="timeline__company">{exp.company}</div>
                                <div className="timeline__location">{exp.location}</div>
                                <p className="timeline__desc">{exp.description}</p>
                                <div className="timeline__tech">
                                    {exp.tech_used.map((tech) => (
                                        <span key={tech} className="project-card__tech-tag">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
