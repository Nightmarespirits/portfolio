'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/lib/admin-context';
import AdminSidebar from '@/components/admin/AdminSidebar';
import '../../styles/admin.css';

function AdminGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAdmin();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated && pathname !== '/admin/login') {
            router.replace('/admin/login');
        }
    }, [isAuthenticated, pathname, router]);

    // Login page — no sidebar
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Not authenticated — show nothing while redirecting
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-layout__content">
                {children}
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminProvider>
            <AdminGuard>{children}</AdminGuard>
        </AdminProvider>
    );
}
