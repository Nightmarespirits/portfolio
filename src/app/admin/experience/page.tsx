'use client';

import { useState, FormEvent } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { Experience } from '@/lib/types';

const emptyExperience: Omit<Experience, 'id'> = {
    company: '',
    role: '',
    description: '',
    start_date: '',
    end_date: null,
    location: '',
    tech_used: [],
    sort_order: 0,
    is_visible: true,
};

export default function ExperiencePage() {
    const { experience, addExperience, updateExperience, deleteExperience } = useAdmin();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyExperience);
    const [techInput, setTechInput] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const openNew = () => {
        setForm(emptyExperience);
        setTechInput('');
        setIsCurrent(false);
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (exp: Experience) => {
        setForm(exp);
        setTechInput(exp.tech_used.join(', '));
        setIsCurrent(!exp.end_date);
        setEditingId(exp.id);
        setShowModal(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const data = {
            ...form,
            end_date: isCurrent ? null : form.end_date,
            tech_used: techInput.split(',').map((t) => t.trim()).filter(Boolean),
        };

        if (editingId) {
            updateExperience(editingId, data);
        } else {
            addExperience(data);
        }
        setShowModal(false);
    };

    return (
        <>
            <div className="admin-header">
                <h1 className="admin-header__title">Experiencia</h1>
                <div className="admin-header__actions">
                    <button className="btn btn--primary" onClick={openNew}>
                        + Nueva experiencia
                    </button>
                </div>
            </div>
            <div className="admin-content">
                {experience.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">◎</div>
                        <div className="empty-state__title">Sin experiencia</div>
                        <div className="empty-state__desc">Agrega tu experiencia laboral.</div>
                        <button className="btn btn--primary" onClick={openNew}>Agregar experiencia</button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Empresa</th>
                                <th>Rol</th>
                                <th>Período</th>
                                <th>Visible</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {experience.map((exp) => (
                                <tr key={exp.id}>
                                    <td style={{ fontWeight: 500 }}>{exp.company}</td>
                                    <td>{exp.role}</td>
                                    <td>
                                        <span className="badge badge--muted">
                                            {exp.start_date} → {exp.end_date || 'Presente'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={`toggle ${exp.is_visible ? 'toggle--active' : ''}`}
                                            onClick={() => updateExperience(exp.id, { is_visible: !exp.is_visible })}
                                        >
                                            <span className="toggle__dot" />
                                        </button>
                                    </td>
                                    <td>
                                        <div className="data-table__actions">
                                            <button className="btn btn--ghost btn--sm" onClick={() => openEdit(exp)}>Editar</button>
                                            {confirmDelete === exp.id ? (
                                                <>
                                                    <button className="btn btn--danger btn--sm" onClick={() => { deleteExperience(exp.id); setConfirmDelete(null); }}>Confirmar</button>
                                                    <button className="btn btn--ghost btn--sm" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                                                </>
                                            ) : (
                                                <button className="btn btn--danger btn--sm" onClick={() => setConfirmDelete(exp.id)}>Eliminar</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__header">
                            <h2 className="modal__title">{editingId ? 'Editar experiencia' : 'Nueva experiencia'}</h2>
                            <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal__body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Empresa</label>
                                        <input
                                            className="form-input"
                                            value={form.company}
                                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Rol</label>
                                        <input
                                            className="form-input"
                                            value={form.role}
                                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Descripción</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Fecha de inicio</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={form.start_date}
                                            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Fecha de fin</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={form.end_date || ''}
                                            onChange={(e) => setForm({ ...form, end_date: e.target.value || null })}
                                            disabled={isCurrent}
                                        />
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                                            <input type="checkbox" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} />
                                            Posición actual
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Ubicación</label>
                                    <input
                                        className="form-input"
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tecnologías (separadas por coma)</label>
                                    <input
                                        className="form-input"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        placeholder="React, Node.js, PostgreSQL"
                                    />
                                </div>
                            </div>
                            <div className="modal__footer">
                                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn--primary">{editingId ? 'Guardar' : 'Crear'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
