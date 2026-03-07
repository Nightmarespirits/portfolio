'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '@/lib/admin-context';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '◫' },
    { href: '/admin/profile', label: 'Perfil', icon: '◉' },
    { href: '/admin/projects', label: 'Proyectos', icon: '◈' },
    { href: '/admin/experience', label: 'Experiencia', icon: '◎' },
    { href: '/admin/skills', label: 'Habilidades', icon: '◇' },
    { href: '/admin/contact', label: 'Contacto', icon: '◆' },
    { href: '/admin/seo', label: 'SEO', icon: '◊' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAdmin();

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__brand">
                <div className="admin-sidebar__brand-name">
                    <span className="admin-sidebar__brand-dot" />
                    Portfolio
                </div>
                <div className="admin-sidebar__brand-sub">Panel de gestión</div>
            </div>

            <nav className="admin-sidebar__nav">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`admin-sidebar__link ${pathname === item.href ? 'admin-sidebar__link--active' : ''
                            }`}
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
                    <span>↗</span> Ver sitio público
                </Link>
                <button className="admin-sidebar__footer-link" onClick={logout}>
                    <span>⏻</span> Cerrar sesión
                </button>
            </div>
        </aside>
    );
}
