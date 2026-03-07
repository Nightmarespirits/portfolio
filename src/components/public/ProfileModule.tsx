'use client';

import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function ProfileModule() {
    const { profile } = usePortfolioData();
    const p = profile;

    return (
        <div className="module stagger-children">
            <div className="about">
                <div className="about__intro">
                    <div>
                        <h2 className="about__name">{p.name}</h2>
                        <p className="about__title">{p.title}</p>
                    </div>

                    <p className="about__bio">{p.bio}</p>

                    <div className="about__meta">
                        <div className="about__meta-item">
                            <span className="about__meta-icon" aria-hidden="true">◉</span>
                            <span>{p.location}</span>
                        </div>
                        <div className="about__meta-item">
                            <span className="about__meta-icon" aria-hidden="true">◈</span>
                            <span>{p.email}</span>
                        </div>
                    </div>

                    {p.cv_url && (
                        <a
                            href={p.cv_url}
                            className="about__cv-btn"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span aria-hidden="true">↓</span>
                            Descargar CV
                        </a>
                    )}
                </div>

                <div className="about__details">
                    <div className="about__stat-grid">
                        <div className="about__stat">
                            <div className="about__stat-value">5+</div>
                            <div className="about__stat-label">Años de experiencia</div>
                        </div>
                        <div className="about__stat">
                            <div className="about__stat-value">15+</div>
                            <div className="about__stat-label">Proyectos entregados</div>
                        </div>
                        <div className="about__stat">
                            <div className="about__stat-value">8+</div>
                            <div className="about__stat-label">Tecnologías dominadas</div>
                        </div>
                        <div className="about__stat">
                            <div className="about__stat-value">3</div>
                            <div className="about__stat-label">Empresas impactadas</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
