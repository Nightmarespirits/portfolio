'use client';

import { FormEvent, useMemo, useState } from 'react';
import AdminStatus from '@/components/admin/AdminStatus';
import { useAdmin } from '@/lib/admin-context';
import { Skill } from '@/lib/types';

const categories = ['Frontend', 'Backend & Core', 'Bases de Datos', 'DevOps & Herramientas', 'Producto', 'Otro'];

const emptySkill: Omit<Skill, 'id' | 'created_at'> = {
    name: '',
    category: 'Frontend',
    proficiency: 60,
    sort_order: 0,
    is_visible: true,
};

export default function SkillsPage() {
    const { skills, addSkill, updateSkill, deleteSkill, moveSkill } = useAdmin();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptySkill);
    const [submitting, setSubmitting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const rows = useMemo(() => [...skills].sort((a, b) => a.sort_order - b.sort_order), [skills]);

    const openNew = () => {
        setForm({ ...emptySkill, sort_order: rows.length });
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (entry: Skill) => {
        setForm({
            name: entry.name,
            category: entry.category,
            proficiency: entry.proficiency,
            sort_order: entry.sort_order,
            is_visible: entry.is_visible,
        });
        setEditingId(entry.id);
        setShowModal(true);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        if (editingId) {
            await updateSkill(editingId, form);
        } else {
            await addSkill(form);
        }
        setSubmitting(false);
        setShowModal(false);
    };

    return (
        <>
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Habilidades</h1>
                    <p className="admin-header__subtitle">Categorias, dominio y orden de competencias que alimentan el modulo Dominio.</p>
                </div>
                <div className="admin-header__actions">
                    <button className="btn btn--primary" onClick={openNew}>+ Nueva habilidad</button>
                </div>
            </div>
            <div className="admin-content">
                <AdminStatus />
                <div className="table-shell">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Orden</th>
                                <th>Habilidad</th>
                                <th>Categoria</th>
                                <th>Nivel</th>
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
                                                <button className="btn btn--ghost btn--sm" onClick={() => void moveSkill(entry.id, 'up')} disabled={index === 0}>Subir</button>
                                                <button className="btn btn--ghost btn--sm" onClick={() => void moveSkill(entry.id, 'down')} disabled={index === rows.length - 1}>Bajar</button>
                                            </div>
                                        </div>
                                    </td>
                                    <td><strong>{entry.name}</strong></td>
                                    <td><span className="badge badge--muted">{entry.category}</span></td>
                                    <td>
                                        <div className="table-skill">
                                            <div className="skill-item__bar"><div className="skill-item__fill" style={{ width: `${entry.proficiency}%` }} /></div>
                                            <span>{entry.proficiency}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button className={`toggle ${entry.is_visible ? 'toggle--active' : ''}`} onClick={() => void updateSkill(entry.id, { is_visible: !entry.is_visible })}>
                                            <span className="toggle__dot" />
                                        </button>
                                    </td>
                                    <td>
                                        <div className="data-table__actions">
                                            <button className="btn btn--ghost btn--sm" onClick={() => openEdit(entry)}>Editar</button>
                                            {confirmDelete === entry.id ? (
                                                <>
                                                    <button className="btn btn--danger btn--sm" onClick={() => void deleteSkill(entry.id).then(() => setConfirmDelete(null))}>Confirmar</button>
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
                            <h2 className="modal__title">{editingId ? 'Editar habilidad' : 'Nueva habilidad'}</h2>
                            <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>x</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal__body">
                                <div className="form-group">
                                    <label className="form-label form-label--required">Nombre</label>
                                    <input className="form-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label form-label--required">Categoria</label>
                                    <select className="form-input form-select" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                                        {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nivel de dominio: {form.proficiency}%</label>
                                    <input type="range" min="0" max="100" value={form.proficiency} onChange={(event) => setForm({ ...form, proficiency: Number(event.target.value) })} className="form-range" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Orden</label>
                                        <input type="number" className="form-input" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) || 0 })} />
                                    </div>
                                    <div className="form-group form-group--inline">
                                        <label className="check-row"><input type="checkbox" checked={form.is_visible} onChange={(event) => setForm({ ...form, is_visible: event.target.checked })} /> Visible</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal__footer">
                                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear habilidad'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
