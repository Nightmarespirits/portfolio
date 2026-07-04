'use client';

import { useAdmin } from '@/lib/admin-context';

export default function AdminStatus() {
    const { feedback, lastSyncedAt } = useAdmin();

    return (
        <div className="admin-statusbar">
            <div className="admin-statusbar__group">
                {feedback.message ? (
                    <span className={`badge badge--${feedback.tone}`}>{feedback.message}</span>
                ) : (
                    <span className="badge badge--muted">Sin cambios pendientes</span>
                )}
            </div>
            <div className="admin-statusbar__meta">
                {lastSyncedAt ? `Sync ${new Date(lastSyncedAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}` : 'Sin sync'}
            </div>
        </div>
    );
}
