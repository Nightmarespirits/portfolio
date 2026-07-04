'use client';

import ModuleState from '@/components/public/ModuleState';
import { Experience } from '@/lib/types';

function formatDate(dateStr: string | null): string {
    if (!dateStr) {
        return 'Sin fecha';
    }

    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString('es-PE', { month: 'short', year: 'numeric' });
}

interface ExperienceModuleProps {
    experience: Experience[];
    loading: boolean;
    error: string | null;
}

export default function ExperienceModule({ experience, loading, error }: ExperienceModuleProps) {
    if (loading) {
        return <ModuleState title="Cargando trayectoria" message="Armando la linea temporal desde Supabase." />;
    }

    if (error) {
        return <ModuleState title="Trayectoria no disponible" message={error} tone="error" />;
    }

    if (experience.length === 0) {
        return <ModuleState title="Sin trayectoria publicada" message="Agrega entradas de experiencia para activar la timeline." />;
    }

    return (
        <div className="module">
            <div className="module__section">
                <div className="module__label">Trayectoria profesional</div>
                <div className="timeline stagger-children">
                    {experience.map((entry) => (
                        <div key={entry.id} className={`timeline__item ${!entry.end_date ? 'timeline__item--current' : ''}`}>
                            <div className="timeline__date">
                                <div>{formatDate(entry.start_date)}</div>
                                <div>{entry.end_date ? formatDate(entry.end_date) : 'Presente'}</div>
                            </div>
                            <div className="timeline__content">
                                <h3 className="timeline__role">{entry.role}</h3>
                                <div className="timeline__company">{entry.company}</div>
                                {entry.location && <div className="timeline__location">{entry.location}</div>}
                                <p className="timeline__desc">{entry.description}</p>
                                <div className="timeline__tech">
                                    {entry.tech_used.map((tech) => <span key={tech} className="project-card__tech-tag">{tech}</span>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
