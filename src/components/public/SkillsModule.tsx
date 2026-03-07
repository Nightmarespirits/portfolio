'use client';

import { usePortfolioData } from '@/hooks/usePortfolioData';
import { Skill } from '@/lib/types';

export default function SkillsModule() {
    const { skills } = usePortfolioData();

    // Group by category
    const categories = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    return (
        <div className="module">
            <div className="module__section">
                <div className="module__label">Competencias técnicas</div>
                <div className="skills-grid stagger-children">
                    {Object.entries(categories).map(([category, categorySkills]) => (
                        <div key={category} className="skill-category">
                            <h3 className="skill-category__title">{category}</h3>
                            {categorySkills
                                .sort((a, b) => a.sort_order - b.sort_order)
                                .map((skill) => (
                                    <div key={skill.id} className="skill-item">
                                        <div className="skill-item__header">
                                            <span className="skill-item__name">{skill.name}</span>
                                            <span className="skill-item__level">{skill.proficiency}%</span>
                                        </div>
                                        <div className="skill-item__bar">
                                            <div
                                                className="skill-item__fill"
                                                style={{ width: `${skill.proficiency}%` }}
                                            />
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
