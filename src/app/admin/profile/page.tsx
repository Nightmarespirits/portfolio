'use client';

import { useState, FormEvent } from 'react';
import { useAdmin } from '@/lib/admin-context';

export default function ProfilePage() {
    const { profile, updateProfile } = useAdmin();
    const [form, setForm] = useState({ ...profile });
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateProfile(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    return (
        <>
            <div className="admin-header">
                <h1 className="admin-header__title">Perfil</h1>
                <div className="admin-header__actions">
                    {saved && <span className="badge badge--success">✓ Guardado</span>}
                </div>
            </div>
            <div className="admin-content">
                <form onSubmit={handleSubmit} style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label form-label--required">Nombre completo</label>
                            <input
                                className="form-input"
                                value={form.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label form-label--required">Título profesional</label>
                            <input
                                className="form-input"
                                value={form.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Biografía</label>
                        <textarea
                            className="form-input form-textarea"
                            value={form.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Ubicación</label>
                            <input
                                className="form-input"
                                value={form.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                className="form-input"
                                type="email"
                                value={form.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">URL del CV</label>
                        <input
                            className="form-input"
                            value={form.cv_url}
                            onChange={(e) => handleChange('cv_url', e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">URL del Avatar</label>
                        <input
                            className="form-input"
                            value={form.avatar_url}
                            onChange={(e) => handleChange('avatar_url', e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <button type="submit" className="btn btn--primary">
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
