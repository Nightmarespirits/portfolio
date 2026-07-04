'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandMark from '@/components/shared/BrandMark';
import { useAdmin } from '@/lib/admin-context';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '[ ]' },
    { href: '/admin/profile', label: 'Perfil', icon: 'O' },
    { href: '/admin/projects', label: 'Proyectos', icon: '<>' },
    { href: '/admin/experience', label: 'Experiencia', icon: '()' },
    { href: '/admin/skills', label: 'Habilidades', icon: '/\\' },
    { href: '/admin/contact', label: 'Contacto', icon: '->' },
    { href: '/admin/seo', label: 'SEO', icon: '::' },
    { href: '/admin/appearance', label: 'Apariencia', icon: '{}' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout, sessionEmail, lastSyncedAt } = useAdmin();

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__brand">
                <BrandMark className="admin-sidebar__brand-mark" size="md" />
                <div className="admin-sidebar__brand-sub">CMS conectado a Supabase</div>
            </div>

            <div className="admin-sidebar__session">
                <div className="admin-sidebar__session-label">Sesion activa</div>
                <div className="admin-sidebar__session-value">{sessionEmail || 'Sin correo'}</div>
                <div className="admin-sidebar__session-meta">
                    {lastSyncedAt ? `Ultima sincronizacion ${new Date(lastSyncedAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}` : 'Sin sincronizacion aun'}
                </div>
            </div>

            <nav className="admin-sidebar__nav">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`admin-sidebar__link ${pathname === item.href ? 'admin-sidebar__link--active' : ''}`}
                    >
                        <span className="admin-sidebar__link-icon" aria-hidden="true">
                            {item.icon}
                        </span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="admin-sidebar__footer">
                <Link href="/" className="admin-sidebar__footer-link" target="_blank">
                    <span>{'->'}</span> Ver sitio publico
                </Link>
                <button className="admin-sidebar__footer-link" onClick={() => void logout()}>
                    <span>x</span> Cerrar sesion
                </button>
            </div>
        </aside>
    );
}

