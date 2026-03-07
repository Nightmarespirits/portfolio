'use client';

import { useState, FormEvent } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { Skill } from '@/lib/types';

const categories = ['Frontend', 'Backend', 'Infraestructura', 'Diseño', 'Otro'];

const emptySkill: Omit<Skill, 'id'> = {
    name: '',
    category: 'Frontend',
    proficiency: 50,
    sort_order: 0,
    is_visible: true,
};

export default function SkillsPage() {
    const { skills, addSkill, updateSkill, deleteSkill } = useAdmin();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptySkill);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const openNew = () => {
        setForm(emptySkill);
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (skill: Skill) => {
        setForm(skill);
        setEditingId(skill.id);
        setShowModal(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateSkill(editingId, form);
        } else {
            addSkill(form);
        }
        setShowModal(false);
    };

    // Group by category for display
    const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    return (
        <>
            <div className="admin-header">
                <h1 className="admin-header__title">Habilidades</h1>
                <div className="admin-header__actions">
                    <button className="btn btn--primary" onClick={openNew}>
                        + Nueva habilidad
                    </button>
                </div>
            </div>
            <div className="admin-content">
                {skills.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">◇</div>
                        <div className="empty-state__title">Sin habilidades</div>
                        <div className="empty-state__desc">Agrega tus habilidades técnicas.</div>
                        <button className="btn btn--primary" onClick={openNew}>Agregar habilidad</button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Nivel</th>
                                <th>Visible</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(grouped).map(([category, categorySkills]) =>
                                categorySkills.map((skill, idx) => (
                                    <tr key={skill.id}>
                                        {idx === 0 && (
                                            <td rowSpan={categorySkills.length} style={{ verticalAlign: 'top', borderRight: '1px solid var(--color-border-subtle)' }}>
                                                <span className="badge badge--accent">{category}</span>
                                            </td>
                                        )}
                                        <td style={{ fontWeight: 500 }}>{skill.name}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
                                                <div className="skill-item__bar" style={{ flex: 1, height: '4px' }}>
                                                    <div className="skill-item__fill" style={{ width: `${skill.proficiency}%` }} />
                                                </div>
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                                    {skill.proficiency}%
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className={`toggle ${skill.is_visible ? 'toggle--active' : ''}`}
                                                onClick={() => updateSkill(skill.id, { is_visible: !skill.is_visible })}
                                            >
                                                <span className="toggle__dot" />
                                            </button>
                                        </td>
                                        <td>
                                            <div className="data-table__actions">
                                                <button className="btn btn--ghost btn--sm" onClick={() => openEdit(skill)}>Editar</button>
                                                {confirmDelete === skill.id ? (
                                                    <>
                                                        <button className="btn btn--danger btn--sm" onClick={() => { deleteSkill(skill.id); setConfirmDelete(null); }}>Confirmar</button>
                                                        <button className="btn btn--ghost btn--sm" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                                                    </>
                                                ) : (
                                                    <button className="btn btn--danger btn--sm" onClick={() => setConfirmDelete(skill.id)}>Eliminar</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__header">
                            <h2 className="modal__title">{editingId ? 'Editar habilidad' : 'Nueva habilidad'}</h2>
                            <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal__body">
                                <div className="form-group">
                                    <label className="form-label form-label--required">Nombre</label>
                                    <input
                                        className="form-input"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                        placeholder="React, Node.js, Docker..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label form-label--required">Categoría</label>
                                    <select
                                        className="form-input form-select"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Nivel de dominio: {form.proficiency}%</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={form.proficiency}
                                        onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) })}
                                        style={{ width: '100%', accentColor: 'var(--color-accent)' }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Orden</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={form.sort_order}
                                        onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
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
