'use client';

import Link from 'next/link';
import { useAdmin } from '@/lib/admin-context';

export default function AdminDashboard() {
    const { profile, projects, experience, skills, contactLinks } = useAdmin();

    const cards = [
        { href: '/admin/profile', icon: '◉', label: 'Perfil', value: profile.name || 'Sin configurar' },
        { href: '/admin/projects', icon: '◈', label: 'Proyectos', value: `${projects.length} elementos` },
        { href: '/admin/experience', icon: '◎', label: 'Experiencia', value: `${experience.length} posiciones` },
        { href: '/admin/skills', icon: '◇', label: 'Habilidades', value: `${skills.length} skills` },
        { href: '/admin/contact', icon: '◆', label: 'Contacto', value: `${contactLinks.length} enlaces` },
        { href: '/admin/seo', icon: '◊', label: 'SEO', value: profile.seo_title ? 'Configurado' : 'Pendiente' },
    ];

    return (
        <>
            <div className="admin-header">
                <h1 className="admin-header__title">Dashboard</h1>
                <div className="admin-header__actions">
                    <span className="badge badge--success">● Online</span>
                </div>
            </div>
            <div className="admin-content">
                <div className="dashboard-grid stagger-children">
                    {cards.map((card) => (
                        <Link key={card.href} href={card.href} className="dashboard-card">
                            <div className="dashboard-card__icon">{card.icon}</div>
                            <div className="dashboard-card__label">{card.label}</div>
                            <div className="dashboard-card__value">{card.value}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
