'use client';

import { useState, FormEvent } from 'react';
import { useAdmin } from '@/lib/admin-context';

export default function SeoPage() {
    const { profile, updateProfile } = useAdmin();
    const [form, setForm] = useState({
        seo_title: profile.seo_title,
        seo_description: profile.seo_description,
        seo_keywords: profile.seo_keywords,
    });
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateProfile(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <>
            <div className="admin-header">
                <h1 className="admin-header__title">SEO</h1>
                <div className="admin-header__actions">
                    {saved && <span className="badge badge--success">✓ Guardado</span>}
                </div>
            </div>
            <div className="admin-content">
                <form onSubmit={handleSubmit} style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div className="form-group">
                        <label className="form-label">Título SEO</label>
                        <input
                            className="form-input"
                            value={form.seo_title}
                            onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                            placeholder="Tu nombre — Tu título profesional"
                        />
                        <span style={{ fontSize: 'var(--text-xs)', color: form.seo_title.length > 60 ? 'var(--color-error)' : 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                            {form.seo_title.length}/60 caracteres
                        </span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Meta descripción</label>
                        <textarea
                            className="form-input form-textarea"
                            value={form.seo_description}
                            onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                            rows={3}
                            placeholder="Descripción breve de tu portafolio para buscadores..."
                        />
                        <span style={{ fontSize: 'var(--text-xs)', color: form.seo_description.length > 160 ? 'var(--color-error)' : 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                            {form.seo_description.length}/160 caracteres
                        </span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Palabras clave</label>
                        <input
                            className="form-input"
                            value={form.seo_keywords}
                            onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })}
                            placeholder="portafolio, desarrollador, ingeniero..."
                        />
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                            Separadas por comas
                        </span>
                    </div>

                    {/* Preview */}
                    <div style={{ marginTop: 'var(--space-4)' }}>
                        <div className="module__label">Vista previa en Google</div>
                        <div style={{
                            background: 'var(--color-bg-surface)',
                            padding: 'var(--space-5)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border-subtle)',
                        }}>
                            <div style={{ color: '#1a0dab', fontSize: 'var(--text-md)', fontWeight: 500, marginBottom: '4px' }}>
                                {form.seo_title || 'Título de tu sitio'}
                            </div>
                            <div style={{ color: '#006621', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                                tu-sitio.com
                            </div>
                            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                                {form.seo_description || 'Tu meta descripción aparecerá aquí en los resultados de búsqueda...'}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn--primary" style={{ width: 'fit-content' }}>
                        Guardar configuración SEO
                    </button>
                </form>
            </div>
        </>
    );
}
