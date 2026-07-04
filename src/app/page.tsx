'use client';

import type { PointerEvent, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ContactModule from '@/components/public/ContactModule';
import ExperienceModule from '@/components/public/ExperienceModule';
import ProfileModule from '@/components/public/ProfileModule';
import ProjectsModule from '@/components/public/ProjectsModule';
import SkillsModule from '@/components/public/SkillsModule';
import StatusBar from '@/components/public/StatusBar';
import ThemeToggle from '@/components/public/ThemeToggle';
import BrandMark from '@/components/shared/BrandMark';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { NAV_NODES } from '@/lib/data';
import { applyRuntimeSeo } from '@/lib/portfolio-client';
import { NodeId } from '@/lib/types';

type ActiveModuleConfig = {
    index: string;
    title: string;
    render: () => ReactNode;
};

export default function Home() {
    const [activeNode, setActiveNode] = useState<NodeId | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const portfolio = usePortfolioData();

    const moduleMap = useMemo<Record<NodeId, ActiveModuleConfig>>(() => ({
        about: {
            index: '01',
            title: 'Perfil',
            render: () => <ProfileModule profile={portfolio.profile} stats={portfolio.stats} loading={portfolio.loading} error={portfolio.error} />,
        },
        projects: {
            index: '02',
            title: 'Proyectos',
            render: () => <ProjectsModule projects={portfolio.projects} loading={portfolio.loading} error={portfolio.error} />,
        },
        experience: {
            index: '03',
            title: 'Trayectoria',
            render: () => <ExperienceModule experience={portfolio.experience} loading={portfolio.loading} error={portfolio.error} />,
        },
        skills: {
            index: '04',
            title: 'Dominio',
            render: () => <SkillsModule skills={portfolio.skills} loading={portfolio.loading} error={portfolio.error} />,
        },
        contact: {
            index: '05',
            title: 'Contacto',
            render: () => <ContactModule contactLinks={portfolio.contactLinks} profile={portfolio.profile} loading={portfolio.loading} error={portfolio.error} />,
        },
    }), [portfolio]);

    const openNode = useCallback((id: NodeId) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveNode(id);
        window.setTimeout(() => setIsAnimating(false), 650);
    }, [isAnimating]);

    const closeNode = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveNode(null);
        window.setTimeout(() => setIsAnimating(false), 650);
    }, [isAnimating]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && activeNode) {
                closeNode();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [activeNode, closeNode]);

    useEffect(() => {
        applyRuntimeSeo(portfolio.profile);
    }, [portfolio.profile]);

    const handleNodePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        event.currentTarget.style.setProperty('--pointer-x', `${x}%`);
        event.currentTarget.style.setProperty('--pointer-y', `${y}%`);
    };

    const activeModule = activeNode ? moduleMap[activeNode] : null;

    return (
        <div className="interface">
            <div className="interface__atmosphere" aria-hidden="true" />
            <div className="interface__grain" aria-hidden="true" />

            <header className="interface__header">
                <BrandMark className="interface__logo" size="md" />
                <div className="interface__controls">
                    {activeNode && (
                        <button className="panel__close" onClick={closeNode} aria-label="Volver al inicio" style={{ marginRight: '8px' }}>
                            {'<-'}
                        </button>
                    )}
                    <ThemeToggle />
                </div>
            </header>

            {!activeNode && (
                <main className="spatial-grid" role="navigation" aria-label="Navegacion principal">
                    {NAV_NODES.map((node) => (
                        <button
                            key={node.id}
                            className={`node node--${node.id}`}
                            onClick={() => openNode(node.id)}
                            onPointerMove={handleNodePointerMove}
                            aria-label={`Abrir seccion ${node.label}`}
                            style={{ gridArea: node.gridArea }}
                        >
                            <span className="node__wash" aria-hidden="true" />
                            <span className="node__sheen" aria-hidden="true" />
                            <span className="node__sublabel">{node.sublabel}</span>
                            <span className="node__label">{node.label}</span>
                            <span className="node__arrow" aria-hidden="true">{'->'}</span>
                            <span className="node__line" aria-hidden="true" />
                        </button>
                    ))}
                </main>
            )}

            {activeNode && activeModule && (
                <div className="panel" role="main" aria-label={activeModule.title}>
                    <div className="panel__header">
                        <div className="panel__title-group">
                            <span className="panel__index">{activeModule.index}</span>
                            <h1 className="panel__title">{activeModule.title}</h1>
                        </div>
                        <button className="panel__close" onClick={closeNode} aria-label="Cerrar panel">x</button>
                    </div>
                    <div className="panel__content">{activeModule.render()}</div>
                </div>
            )}

            <StatusBar
                statusLabel={portfolio.error ? 'Error al cargar datos' : portfolio.loading ? 'Cargando...' : 'Clider Fernando Tutaya Rivera'}
                statusTone={portfolio.error ? 'warn' : 'ok'}
                trailingLabel={portfolio.profile?.updated_at ? `CFDev ${new Date(portfolio.profile.updated_at).getFullYear()}` : 'Disenado con criterio'}
            />
        </div>
    );
}
