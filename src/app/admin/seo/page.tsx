'use client';

import { FormEvent, useMemo, useState } from 'react';
import AdminStatus from '@/components/admin/AdminStatus';
import { useAdmin } from '@/lib/admin-context';

interface SeoFormState {
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
}

function SeoForm({ initialValue }: { initialValue: SeoFormState }) {
    const { updateProfile } = useAdmin();
    const [form, setForm] = useState(initialValue);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        await updateProfile(form);
        setSaving(false);
    };

    return (
        <form id="seo-form" onSubmit={handleSubmit} className="admin-stack admin-stack--wide">
            <div className="admin-card">
                <div className="form-group">
                    <label className="form-label">Titulo SEO</label>
                    <input
                        className="form-input"
                        value={form.seo_title}
                        onChange={(event) => setForm((current) => ({ ...current, seo_title: event.target.value }))}
                        placeholder="Tu nombre - Tu especialidad"
                    />
                    <span className={`field-help ${form.seo_title.length > 60 ? 'field-help--error' : ''}`}>{form.seo_title.length}/60 recomendado</span>
                </div>

                <div className="form-group">
                    <label className="form-label">Meta descripcion</label>
                    <textarea
                        className="form-input form-textarea"
                        rows={4}
                        value={form.seo_description}
                        onChange={(event) => setForm((current) => ({ ...current, seo_description: event.target.value }))}
                        placeholder="Resumen claro de tu propuesta profesional."
                    />
                    <span className={`field-help ${form.seo_description.length > 160 ? 'field-help--error' : ''}`}>{form.seo_description.length}/160 recomendado</span>
                </div>

                <div className="form-group">
                    <label className="form-label">Keywords</label>
                    <input
                        className="form-input"
                        value={form.seo_keywords}
                        onChange={(event) => setForm((current) => ({ ...current, seo_keywords: event.target.value }))}
                        placeholder="portfolio, software engineer, java, react"
                    />
                    <span className="field-help">Separalas por comas para mantenerlas legibles.</span>
                </div>
            </div>

            <div className="admin-card">
                <div className="module__label">Vista previa</div>
                <div className="seo-preview">
                    <div className="seo-preview__title">{form.seo_title || 'Titulo del sitio'}</div>
                    <div className="seo-preview__url">nightmarespirits.github.io/portfolio</div>
                    <div className="seo-preview__description">
                        {form.seo_description || 'La descripcion SEO aparecera aqui cuando completes el formulario.'}
                    </div>
                </div>
            </div>

            <div className="admin-header__actions" style={{ justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar SEO'}
                </button>
            </div>
        </form>
    );
}

export default function SeoPage() {
    const { profile } = useAdmin();
    const initialValue = useMemo<SeoFormState>(() => ({
        seo_title: profile.seo_title || '',
        seo_description: profile.seo_description || '',
        seo_keywords: profile.seo_keywords || '',
    }), [profile.seo_description, profile.seo_keywords, profile.seo_title]);
    const formKey = useMemo(() => `${profile.id}-${profile.updated_at || 'draft'}-seo`, [profile.id, profile.updated_at]);

    return (
        <>
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">SEO</h1>
                    <p className="admin-header__subtitle">Metadatos runtime para titulo, descripcion y keywords del portfolio.</p>
                </div>
            </div>
            <div className="admin-content">
                <AdminStatus />
                <SeoForm key={formKey} initialValue={initialValue} />
            </div>
        </>
    );
}
