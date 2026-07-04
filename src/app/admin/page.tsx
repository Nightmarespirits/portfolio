'use client';

import Link from 'next/link';
import AdminStatus from '@/components/admin/AdminStatus';
import { useAdmin } from '@/lib/admin-context';

export default function AdminDashboard() {
    const { profile, projects, experience, skills, contactLinks, sessionEmail, hasSupabase, loadingData, siteTheme } = useAdmin();

    const cards = [
        { href: '/admin/profile', icon: 'O', label: 'Perfil', value: profile.name || 'Sin configurar', caption: 'Identidad, CV y avatar' },
        { href: '/admin/projects', icon: '<>', label: 'Proyectos', value: `${projects.length}`, caption: 'Cards, orden e imagenes' },
        { href: '/admin/experience', icon: '()', label: 'Experiencia', value: `${experience.length}`, caption: 'Timeline profesional' },
        { href: '/admin/skills', icon: '/\\', label: 'Habilidades', value: `${skills.length}`, caption: 'Categorias y niveles' },
        { href: '/admin/contact', icon: '->', label: 'Contacto', value: `${contactLinks.length}`, caption: 'Redes y enlaces visibles' },
        { href: '/admin/seo', icon: '::', label: 'SEO', value: profile.seo_title ? 'Listo' : 'Pendiente', caption: 'Title, description y keywords' },
        { href: '/admin/appearance', icon: '{}', label: 'Apariencia', value: `${siteTheme.theme_preset}/${siteTheme.theme_mode}`, caption: 'Tema global y paletas' },
    ];

    return (
        <>
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Dashboard</h1>
                    <p className="admin-header__subtitle">CMS estatico conectado a Supabase para editar el contenido publicado.</p>
                </div>
                <div className="admin-header__actions">
                    <span className={`badge ${hasSupabase ? 'badge--success' : 'badge--error'}`}>{hasSupabase ? 'Supabase online' : 'Falta config'}</span>
                </div>
            </div>
            <div className="admin-content">
                <AdminStatus />

                <div className="dashboard-hero">
                    <div>
                        <div className="dashboard-hero__eyebrow">Sesion activa</div>
                        <h2 className="dashboard-hero__title">{sessionEmail || 'Sin correo asociado'}</h2>
                        <p className="dashboard-hero__copy">
                            {loadingData ? 'Sincronizando la ultima version del contenido...' : 'Todo el panel trabaja directo sobre Supabase y se refleja en el sitio al recargar.'}
                        </p>
                    </div>
                    <div className="dashboard-hero__meta">
                        <span className="dashboard-hero__metric">7 modulos</span>
                        <span className="dashboard-hero__metric">Paleta {siteTheme.theme_preset}</span>
                        <span className="dashboard-hero__metric">GitHub Pages ready</span>
                    </div>
                </div>

                <div className="dashboard-grid stagger-children">
                    {cards.map((card) => (
                        <Link key={card.href} href={card.href} className="dashboard-card">
                            <div className="dashboard-card__icon">{card.icon}</div>
                            <div className="dashboard-card__label">{card.label}</div>
                            <div className="dashboard-card__value">{card.value}</div>
                            <div className="dashboard-card__caption">{card.caption}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

