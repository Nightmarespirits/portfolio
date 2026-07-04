'use client';

import ModuleState from '@/components/public/ModuleState';
import { Skill } from '@/lib/types';

interface SkillsModuleProps {
    skills: Skill[];
    loading: boolean;
    error: string | null;
}

export default function SkillsModule({ skills, loading, error }: SkillsModuleProps) {
    if (loading) {
        return <ModuleState title="Cargando habilidades" message="Agrupando competencias y niveles desde Supabase." />;
    }

    if (error) {
        return <ModuleState title="Habilidades no disponibles" message={error} tone="error" />;
    }

    if (skills.length === 0) {
        return <ModuleState title="Sin habilidades publicadas" message="Agrega habilidades en el CMS para poblar este modulo." />;
    }

    const categories = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});

    return (
        <div className="module">
            <div className="module__section">
                <div className="module__label">Competencias tecnicas</div>
                <div className="skills-grid stagger-children">
                    {Object.entries(categories).map(([category, categorySkills]) => (
                        <div key={category} className="skill-category">
                            <h3 className="skill-category__title">{category}</h3>
                            {categorySkills.sort((a, b) => a.sort_order - b.sort_order).map((skill) => (
                                <div key={skill.id} className="skill-item">
                                    <div className="skill-item__header">
                                        <span className="skill-item__name">{skill.name}</span>
                                        <span className="skill-item__level">{skill.proficiency}%</span>
                                    </div>
                                    <div className="skill-item__bar">
                                        <div className="skill-item__fill" style={{ width: `${skill.proficiency}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
