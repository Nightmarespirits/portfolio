'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/lib/admin-context';
import AdminSidebar from '@/components/admin/AdminSidebar';
import '../../styles/admin.css';

function AdminGuard({ children }: { children: ReactNode }) {
    const { initialized, isAuthenticated, loadingData } = useAdmin();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (initialized && !isAuthenticated && pathname !== '/admin/login') {
            router.replace('/admin/login');
        }
    }, [initialized, isAuthenticated, pathname, router]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!initialized || (!isAuthenticated && pathname !== '/admin/login')) {
        return (
            <div className="admin-shell admin-shell--loading">
                <div className="admin-loading-card">
                    <span className="admin-loading-card__dot" />
                    <span>{initialized ? 'Redirigiendo al acceso...' : 'Recuperando sesion...'}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-layout__content">
                {loadingData && <div className="admin-sync-banner">Sincronizando contenido con Supabase...</div>}
                {children}
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AdminProvider>
            <AdminGuard>{children}</AdminGuard>
        </AdminProvider>
    );
}
