'use client';

import { useState, useCallback, useEffect } from 'react';
import { NAV_NODES } from '@/lib/data';
import { NodeId } from '@/lib/types';
import ThemeToggle from '@/components/public/ThemeToggle';
import StatusBar from '@/components/public/StatusBar';
import ProfileModule from '@/components/public/ProfileModule';
import ProjectsModule from '@/components/public/ProjectsModule';
import ExperienceModule from '@/components/public/ExperienceModule';
import SkillsModule from '@/components/public/SkillsModule';
import ContactModule from '@/components/public/ContactModule';

const moduleMap: Record<NodeId, { component: React.ComponentType; index: string; title: string }> = {
  about: { component: ProfileModule, index: '01', title: 'Perfil' },
  projects: { component: ProjectsModule, index: '02', title: 'Proyectos' },
  experience: { component: ExperienceModule, index: '03', title: 'Trayectoria' },
  skills: { component: SkillsModule, index: '04', title: 'Dominio' },
  contact: { component: ContactModule, index: '05', title: 'Contacto' },
};

export default function Home() {
  const [activeNode, setActiveNode] = useState<NodeId | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const openNode = useCallback((id: NodeId) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveNode(id);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const closeNode = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveNode(null);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeNode) {
        closeNode();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeNode, closeNode]);

  const ActiveModule = activeNode ? moduleMap[activeNode] : null;

  return (
    <div className="interface">
      {/* ─── Header ─── */}
      <header className="interface__header">
        <div className="interface__logo">
          <span className="interface__logo-dot" />
          <span>Portfolio</span>
        </div>
        <div className="interface__controls">
          {activeNode && (
            <button
              className="panel__close"
              onClick={closeNode}
              aria-label="Volver al inicio"
              style={{ marginRight: '8px' }}
            >
              ←
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* ─── Spatial Grid ─── */}
      {!activeNode && (
        <main
          className="spatial-grid"
          role="navigation"
          aria-label="Navegación principal"
        >
          {NAV_NODES.map((node) => (
            <button
              key={node.id}
              className={`node node--${node.id}`}
              onClick={() => openNode(node.id)}
              aria-label={`Abrir sección ${node.label}`}
              style={{ gridArea: node.gridArea }}
            >
              <span className="node__sublabel">{node.sublabel}</span>
              <span className="node__label">{node.label}</span>
              <span className="node__arrow" aria-hidden="true">↗</span>
              <span className="node__line" aria-hidden="true" />
            </button>
          ))}
        </main>
      )}

      {/* ─── Expanded Panel ─── */}
      {activeNode && ActiveModule && (
        <div className="panel" role="main" aria-label={ActiveModule.title}>
          <div className="panel__header">
            <div className="panel__title-group">
              <span className="panel__index">{ActiveModule.index}</span>
              <h1 className="panel__title">{ActiveModule.title}</h1>
            </div>
            <button
              className="panel__close"
              onClick={closeNode}
              aria-label="Cerrar panel"
            >
              ✕
            </button>
          </div>
          <div className="panel__content">
            <ActiveModule.component />
          </div>
        </div>
      )}

      {/* ─── Status Bar ─── */}
      <StatusBar />
    </div>
  );
}
