'use client';

import { FormEvent, useMemo, useState } from 'react';
import AssetUploadField from '@/components/admin/AssetUploadField';
import AdminStatus from '@/components/admin/AdminStatus';
import { useAdmin } from '@/lib/admin-context';
import { Profile } from '@/lib/types';

function ProfileForm({ profile }: { profile: Profile }) {
    const { updateProfile } = useAdmin();
    const [form, setForm] = useState<Profile>(profile);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        await updateProfile(form);
        setSaving(false);
    };

    const setField = <K extends keyof Profile>(field: K, value: Profile[K]) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    return (
        <form id="profile-form" onSubmit={handleSubmit} className="admin-stack admin-stack--wide">
            <div className="admin-card admin-card--split">
                <div className="admin-card__main">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label form-label--required">Nombre completo</label>
                            <input className="form-input" value={form.name} onChange={(event) => setField('name', event.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label form-label--required">Titulo profesional</label>
                            <input className="form-input" value={form.title} onChange={(event) => setField('title', event.target.value)} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label form-label--required">Biografia</label>
                        <textarea className="form-input form-textarea" rows={5} value={form.bio} onChange={(event) => setField('bio', event.target.value)} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Ubicacion</label>
                            <input className="form-input" value={form.location || ''} onChange={(event) => setField('location', event.target.value || null)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email visible</label>
                            <input className="form-input" type="email" value={form.email || ''} onChange={(event) => setField('email', event.target.value || null)} />
                        </div>
                    </div>
                </div>

                <aside className="admin-card__side">
                    <div className="profile-preview">
                        {form.avatar_url ? <img src={form.avatar_url} alt="Avatar actual" className="profile-preview__avatar" /> : <div className="profile-preview__avatar profile-preview__avatar--empty">Sin avatar</div>}
                        <div className="profile-preview__name">{form.name || 'Tu nombre'}</div>
                        <div className="profile-preview__title">{form.title || 'Tu titulo'}</div>
                    </div>
                </aside>
            </div>

            <div className="admin-card">
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">URL manual del avatar</label>
                        <input className="form-input" value={form.avatar_url || ''} onChange={(event) => setField('avatar_url', event.target.value || null)} placeholder="https://..." />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Storage path del avatar</label>
                        <input className="form-input" value={form.avatar_storage_path || ''} onChange={(event) => setField('avatar_storage_path', event.target.value || null)} placeholder="avatars/archivo.webp" />
                    </div>
                </div>

                <AssetUploadField
                    kind="avatar"
                    label="Subir avatar"
                    accept="image/*"
                    currentUrl={form.avatar_url}
                    helper="PNG, JPG, WEBP o SVG ligero."
                    onUploaded={({ url, path }) => setForm((current) => ({ ...current, avatar_url: url, avatar_storage_path: path }))}
                />
            </div>

            <div className="admin-card">
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">URL publica del CV</label>
                        <input className="form-input" value={form.cv_url || ''} onChange={(event) => setField('cv_url', event.target.value || null)} placeholder="https://..." />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Storage path del CV</label>
                        <input className="form-input" value={form.cv_storage_path || ''} onChange={(event) => setField('cv_storage_path', event.target.value || null)} placeholder="cv/archivo.pdf" />
                    </div>
                </div>

                <AssetUploadField
                    kind="cv"
                    label="Subir CV"
                    accept=".pdf,.doc,.docx"
                    currentUrl={form.cv_url}
                    helper="Preferible PDF final para descarga directa."
                    onUploaded={({ url, path }) => setForm((current) => ({ ...current, cv_url: url, cv_storage_path: path }))}
                />
            </div>

            <div className="admin-header__actions" style={{ justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </div>
        </form>
    );
}

export default function ProfilePage() {
    const { profile } = useAdmin();
    const profileKey = useMemo(() => `${profile.id}-${profile.updated_at || 'draft'}`, [profile.id, profile.updated_at]);

    return (
        <>
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Perfil</h1>
                    <p className="admin-header__subtitle">Identidad principal, avatar, CV y datos visibles del modulo de presentacion.</p>
                </div>
            </div>
            <div className="admin-content">
                <AdminStatus />
                <ProfileForm key={profileKey} profile={profile} />
            </div>
        </>
    );
}
