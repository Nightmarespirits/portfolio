'use client';

import { useState, FormEvent } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { Project } from '@/lib/types';

const emptyProject: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
    title: '',
    slug: '',
    description: '',
    long_description: '',
    tech_stack: [],
    image_url: '',
    live_url: '',
    repo_url: '',
    sort_order: 0,
    is_visible: true,
    is_featured: false,
};

export default function ProjectsPage() {
    const { projects, addProject, updateProject, deleteProject } = useAdmin();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyProject);
    const [techInput, setTechInput] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const openNew = () => {
        setForm(emptyProject);
        setTechInput('');
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (project: Project) => {
        setForm(project);
        setTechInput(project.tech_stack.join(', '));
        setEditingId(project.id);
        setShowModal(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const data = {
            ...form,
            slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            tech_stack: techInput.split(',').map((t) => t.trim()).filter(Boolean),
        };

        if (editingId) {
            updateProject(editingId, data);
        } else {
            addProject(data);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        deleteProject(id);
        setConfirmDelete(null);
    };

    return (
        <>
            <div className="admin-header">
                <h1 className="admin-header__title">Proyectos</h1>
                <div className="admin-header__actions">
                    <button className="btn btn--primary" onClick={openNew}>
                        + Nuevo proyecto
                    </button>
                </div>
            </div>
            <div className="admin-content">
                {projects.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">◈</div>
                        <div className="empty-state__title">Sin proyectos</div>
                        <div className="empty-state__desc">Agrega tu primer proyecto para mostrarlo en el portafolio.</div>
                        <button className="btn btn--primary" onClick={openNew}>Crear proyecto</button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Stack</th>
                                <th>Visible</th>
                                <th>Destacado</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 500 }}>{p.title}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {p.tech_stack.slice(0, 3).map((t) => (
                                                <span key={t} className="badge badge--muted">{t}</span>
                                            ))}
                                            {p.tech_stack.length > 3 && (
                                                <span className="badge badge--muted">+{p.tech_stack.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className={`toggle ${p.is_visible ? 'toggle--active' : ''}`}
                                            onClick={() => updateProject(p.id, { is_visible: !p.is_visible })}
                                            aria-label={p.is_visible ? 'Ocultar' : 'Mostrar'}
                                        >
                                            <span className="toggle__dot" />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className={`toggle ${p.is_featured ? 'toggle--active' : ''}`}
                                            onClick={() => updateProject(p.id, { is_featured: !p.is_featured })}
                                            aria-label={p.is_featured ? 'Quitar destacado' : 'Destacar'}
                                        >
                                            <span className="toggle__dot" />
                                        </button>
                                    </td>
                                    <td>
                                        <div className="data-table__actions">
                                            <button className="btn btn--ghost btn--sm" onClick={() => openEdit(p)}>Editar</button>
                                            {confirmDelete === p.id ? (
                                                <>
                                                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(p.id)}>Confirmar</button>
                                                    <button className="btn btn--ghost btn--sm" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                                                </>
                                            ) : (
                                                <button className="btn btn--danger btn--sm" onClick={() => setConfirmDelete(p.id)}>Eliminar</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ─── Modal ─── */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__header">
                            <h2 className="modal__title">{editingId ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
                            <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal__body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Título</label>
                                        <input
                                            className="form-input"
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Slug</label>
                                        <input
                                            className="form-input"
                                            value={form.slug}
                                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                            placeholder="auto-generado"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Descripción corta</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={2}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Descripción extendida</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        value={form.long_description}
                                        onChange={(e) => setForm({ ...form, long_description: e.target.value })}
                                        rows={4}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tecnologías (separadas por coma)</label>
                                    <input
                                        className="form-input"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        placeholder="React, TypeScript, Node.js"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">URL del proyecto</label>
                                        <input
                                            className="form-input"
                                            value={form.live_url}
                                            onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Repositorio</label>
                                        <input
                                            className="form-input"
                                            value={form.repo_url}
                                            onChange={(e) => setForm({ ...form, repo_url: e.target.value })}
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">URL de imagen</label>
                                    <input
                                        className="form-input"
                                        value={form.image_url}
                                        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="modal__footer">
                                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn--primary">
                                    {editingId ? 'Guardar cambios' : 'Crear proyecto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
