'use client';

import ModuleState from '@/components/public/ModuleState';
import { PortfolioStats, Profile } from '@/lib/types';

interface ProfileModuleProps {
    profile: Profile | null;
    stats: PortfolioStats;
    loading: boolean;
    error: string | null;
}

export default function ProfileModule({ profile, stats, loading, error }: ProfileModuleProps) {
    if (loading) {
        return <ModuleState title="Cargando perfil" message="Sincronizando identidad y metricas desde Supabase." />;
    }

    if (error) {
        return <ModuleState title="Perfil no disponible" message={error} tone="error" />;
    }

    if (!profile) {
        return <ModuleState title="Perfil vacio" message="Todavia no hay un perfil cargado desde el panel administrativo." />;
    }

    return (
        <div className="module stagger-children">
            <div className="about">
                <div className="about__intro">
                    <div>
                        <h2 className="about__name">{profile.name}</h2>
                        <p className="about__title">{profile.title}</p>
                    </div>

                    <p className="about__bio">{profile.bio}</p>

                    <div className="about__meta">
                        {profile.location && <div className="about__meta-item"><span className="about__meta-icon" aria-hidden="true">*</span><span>{profile.location}</span></div>}
                        {profile.email && <div className="about__meta-item"><span className="about__meta-icon" aria-hidden="true">@</span><span>{profile.email}</span></div>}
                    </div>

                    {profile.cv_url && (
                        <a href={profile.cv_url} className="about__cv-btn" target="_blank" rel="noopener noreferrer">
                            <span aria-hidden="true">v</span>
                            Descargar CV
                        </a>
                    )}
                </div>

                <div className="about__details">
                    <div className="about__stat-grid">
                        <div className="about__stat"><div className="about__stat-value">{stats.yearsOfExperience}+</div><div className="about__stat-label">Anos de experiencia</div></div>
                        <div className="about__stat"><div className="about__stat-value">{stats.projectCount}</div><div className="about__stat-label">Proyectos visibles</div></div>
                        <div className="about__stat"><div className="about__stat-value">{stats.techCount}</div><div className="about__stat-label">Tecnologias activas</div></div>
                        <div className="about__stat"><div className="about__stat-value">{stats.companyCount}</div><div className="about__stat-label">Contextos impactados</div></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
