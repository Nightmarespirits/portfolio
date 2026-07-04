'use client';

import { FormEvent, useMemo, useState } from 'react';
import AdminStatus from '@/components/admin/AdminStatus';
import { useAdmin } from '@/lib/admin-context';
import { Experience } from '@/lib/types';

const emptyExperience: Omit<Experience, 'id' | 'created_at'> = {
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
    const { experience, addExperience, updateExperience, deleteExperience, moveExperience } = useAdmin();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyExperience);
    const [techInput, setTechInput] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const rows = useMemo(() => [...experience].sort((a, b) => a.sort_order - b.sort_order), [experience]);

    const openNew = () => {
        setForm({ ...emptyExperience, sort_order: rows.length });
        setTechInput('');
        setIsCurrent(false);
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (entry: Experience) => {
        setForm({
            company: entry.company,
            role: entry.role,
            description: entry.description,
            start_date: entry.start_date,
            end_date: entry.end_date,
            location: entry.location,
            tech_used: entry.tech_used,
            sort_order: entry.sort_order,
            is_visible: entry.is_visible,
        });
        setTechInput(entry.tech_used.join(', '));
        setIsCurrent(!entry.end_date);
        setEditingId(entry.id);
        setShowModal(true);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        const payload = {
            ...form,
            end_date: isCurrent ? null : form.end_date,
            tech_used: techInput.split(',').map((item) => item.trim()).filter(Boolean),
        };

        if (editingId) {
            await updateExperience(editingId, payload);
        } else {
            await addExperience(payload);
        }

        setSubmitting(false);
        setShowModal(false);
    };

    return (
        <>
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Experiencia</h1>
                    <p className="admin-header__subtitle">Controla la timeline, visibilidad y orden de cada etapa profesional.</p>
                </div>
                <div className="admin-header__actions">
                    <button className="btn btn--primary" onClick={openNew}>+ Nueva experiencia</button>
                </div>
            </div>
            <div className="admin-content">
                <AdminStatus />
                <div className="table-shell">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Orden</th>
                                <th>Empresa</th>
                                <th>Rol</th>
                                <th>Periodo</th>
                                <th>Visible</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((entry, index) => (
                                <tr key={entry.id}>
                                    <td>
                                        <div className="table-order">
                                            <span className="badge badge--muted">#{index + 1}</span>
                                            <div className="table-order__buttons">
                                                <button className="btn btn--ghost btn--sm" onClick={() => void moveExperience(entry.id, 'up')} disabled={index === 0}>Subir</button>
                                                <button className="btn btn--ghost btn--sm" onClick={() => void moveExperience(entry.id, 'down')} disabled={index === rows.length - 1}>Bajar</button>
                                            </div>
                                        </div>
                                    </td>
                                    <td><strong>{entry.company}</strong></td>
                                    <td>{entry.role}</td>
                                    <td><span className="badge badge--muted">{entry.start_date} {'->'} {entry.end_date || 'Actual'}</span></td>
                                    <td>
                                        <button className={`toggle ${entry.is_visible ? 'toggle--active' : ''}`} onClick={() => void updateExperience(entry.id, { is_visible: !entry.is_visible })}>
                                            <span className="toggle__dot" />
                                        </button>
                                    </td>
                                    <td>
                                        <div className="data-table__actions">
                                            <button className="btn btn--ghost btn--sm" onClick={() => openEdit(entry)}>Editar</button>
                                            {confirmDelete === entry.id ? (
                                                <>
                                                    <button className="btn btn--danger btn--sm" onClick={() => void deleteExperience(entry.id).then(() => setConfirmDelete(null))}>Confirmar</button>
                                                    <button className="btn btn--ghost btn--sm" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                                                </>
                                            ) : (
                                                <button className="btn btn--danger btn--sm" onClick={() => setConfirmDelete(entry.id)}>Eliminar</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(event) => event.stopPropagation()}>
                        <div className="modal__header">
                            <h2 className="modal__title">{editingId ? 'Editar experiencia' : 'Nueva experiencia'}</h2>
                            <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>x</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal__body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Empresa</label>
                                        <input className="form-input" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Rol</label>
                                        <input className="form-input" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label form-label--required">Descripcion</label>
                                    <textarea className="form-input form-textarea" rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Inicio</label>
                                        <input type="date" className="form-input" value={form.start_date || ''} onChange={(event) => setForm({ ...form, start_date: event.target.value || '' })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Fin</label>
                                        <input type="date" className="form-input" value={form.end_date || ''} onChange={(event) => setForm({ ...form, end_date: event.target.value || null })} disabled={isCurrent} />
                                        <label className="check-row"><input type="checkbox" checked={isCurrent} onChange={(event) => setIsCurrent(event.target.checked)} /> Posicion actual</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Ubicacion</label>
                                        <input className="form-input" value={form.location || ''} onChange={(event) => setForm({ ...form, location: event.target.value || null })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Orden</label>
                                        <input type="number" className="form-input" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) || 0 })} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tecnologias</label>
                                    <input className="form-input" value={techInput} onChange={(event) => setTechInput(event.target.value)} placeholder="Java, Spring Boot, PostgreSQL" />
                                </div>

                                <label className="check-row"><input type="checkbox" checked={form.is_visible} onChange={(event) => setForm({ ...form, is_visible: event.target.checked })} /> Visible en la timeline</label>
                            </div>
                            <div className="modal__footer">
                                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear experiencia'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
