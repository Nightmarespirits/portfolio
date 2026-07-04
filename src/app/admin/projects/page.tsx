'use client';

import { FormEvent, useMemo, useState } from 'react';
import AssetUploadField from '@/components/admin/AssetUploadField';
import AdminStatus from '@/components/admin/AdminStatus';
import { useAdmin } from '@/lib/admin-context';
import { Project } from '@/lib/types';

const emptyProject: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
    title: '',
    slug: '',
    description: '',
    long_description: '',
    tech_stack: [],
    image_url: null,
    image_storage_path: null,
    live_url: null,
    repo_url: null,
    sort_order: 0,
    is_visible: true,
    is_featured: false,
};

export default function ProjectsPage() {
    const { projects, addProject, updateProject, deleteProject, moveProject } = useAdmin();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyProject);
    const [techInput, setTechInput] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const sortedProjects = useMemo(() => [...projects].sort((a, b) => a.sort_order - b.sort_order), [projects]);

    const openNew = () => {
        setForm({ ...emptyProject, sort_order: sortedProjects.length });
        setTechInput('');
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (project: Project) => {
        setForm({
            title: project.title,
            slug: project.slug,
            description: project.description,
            long_description: project.long_description,
            tech_stack: project.tech_stack,
            image_url: project.image_url,
            image_storage_path: project.image_storage_path,
            live_url: project.live_url,
            repo_url: project.repo_url,
            sort_order: project.sort_order,
            is_visible: project.is_visible,
            is_featured: project.is_featured,
        });
        setTechInput(project.tech_stack.join(', '));
        setEditingId(project.id);
        setShowModal(true);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        const payload = {
            ...form,
            slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            tech_stack: techInput.split(',').map((item) => item.trim()).filter(Boolean),
        };

        if (editingId) {
            await updateProject(editingId, payload);
        } else {
            await addProject(payload);
        }

        setSubmitting(false);
        setShowModal(false);
    };

    return (
        <>
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Proyectos</h1>
                    <p className="admin-header__subtitle">Administra cards, stack, links, orden y asset principal de cada proyecto.</p>
                </div>
                <div className="admin-header__actions">
                    <button className="btn btn--primary" onClick={openNew}>+ Nuevo proyecto</button>
                </div>
            </div>
            <div className="admin-content">
                <AdminStatus />

                {sortedProjects.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">&lt;&gt;</div>
                        <div className="empty-state__title">Sin proyectos</div>
                        <div className="empty-state__desc">Crea el primer proyecto y quedara disponible en el modulo publico.</div>
                        <button className="btn btn--primary" onClick={openNew}>Crear proyecto</button>
                    </div>
                ) : (
                    <div className="table-shell">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Orden</th>
                                    <th>Titulo</th>
                                    <th>Stack</th>
                                    <th>Estado</th>
                                    <th style={{ textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedProjects.map((project, index) => (
                                    <tr key={project.id}>
                                        <td>
                                            <div className="table-order">
                                                <span className="badge badge--muted">#{index + 1}</span>
                                                <div className="table-order__buttons">
                                                    <button className="btn btn--ghost btn--sm" onClick={() => void moveProject(project.id, 'up')} disabled={index === 0}>Subir</button>
                                                    <button className="btn btn--ghost btn--sm" onClick={() => void moveProject(project.id, 'down')} disabled={index === sortedProjects.length - 1}>Bajar</button>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="table-primary">
                                                <strong>{project.title}</strong>
                                                <span>{project.slug}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="tag-list">
                                                {project.tech_stack.slice(0, 4).map((tech) => <span key={tech} className="badge badge--muted">{tech}</span>)}
                                                {project.tech_stack.length > 4 && <span className="badge badge--muted">+{project.tech_stack.length - 4}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="tag-list">
                                                <button className={`toggle ${project.is_visible ? 'toggle--active' : ''}`} onClick={() => void updateProject(project.id, { is_visible: !project.is_visible })} aria-label="Cambiar visibilidad">
                                                    <span className="toggle__dot" />
                                                </button>
                                                {project.is_featured && <span className="badge badge--accent">Destacado</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="data-table__actions">
                                                <button className="btn btn--ghost btn--sm" onClick={() => void updateProject(project.id, { is_featured: !project.is_featured })}>{project.is_featured ? 'Quitar destacado' : 'Destacar'}</button>
                                                <button className="btn btn--ghost btn--sm" onClick={() => openEdit(project)}>Editar</button>
                                                {confirmDelete === project.id ? (
                                                    <>
                                                        <button className="btn btn--danger btn--sm" onClick={() => void deleteProject(project.id).then(() => setConfirmDelete(null))}>Confirmar</button>
                                                        <button className="btn btn--ghost btn--sm" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                                                    </>
                                                ) : (
                                                    <button className="btn btn--danger btn--sm" onClick={() => setConfirmDelete(project.id)}>Eliminar</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal modal--wide" onClick={(event) => event.stopPropagation()}>
                        <div className="modal__header">
                            <h2 className="modal__title">{editingId ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
                            <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>x</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal__body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Titulo</label>
                                        <input className="form-input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Slug</label>
                                        <input className="form-input" value={form.slug || ''} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="auto-generado" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label form-label--required">Descripcion corta</label>
                                    <textarea className="form-input form-textarea" rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Descripcion extendida</label>
                                    <textarea className="form-input form-textarea" rows={5} value={form.long_description || ''} onChange={(event) => setForm({ ...form, long_description: event.target.value || null })} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tecnologias</label>
                                    <input className="form-input" value={techInput} onChange={(event) => setTechInput(event.target.value)} placeholder="React, TypeScript, Spring Boot" />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">URL del proyecto</label>
                                        <input className="form-input" value={form.live_url || ''} onChange={(event) => setForm({ ...form, live_url: event.target.value || null })} placeholder="https://..." />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Repositorio</label>
                                        <input className="form-input" value={form.repo_url || ''} onChange={(event) => setForm({ ...form, repo_url: event.target.value || null })} placeholder="https://github.com/..." />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">URL manual de imagen</label>
                                        <input className="form-input" value={form.image_url || ''} onChange={(event) => setForm({ ...form, image_url: event.target.value || null })} placeholder="https://..." />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Storage path de imagen</label>
                                        <input className="form-input" value={form.image_storage_path || ''} onChange={(event) => setForm({ ...form, image_storage_path: event.target.value || null })} placeholder="projects/archivo.webp" />
                                    </div>
                                </div>

                                <AssetUploadField
                                    kind="project-image"
                                    label="Subir imagen principal"
                                    accept="image/*"
                                    currentUrl={form.image_url}
                                    helper="Usa una portada horizontal ligera para las cards."
                                    onUploaded={({ url, path }) => setForm((current) => ({ ...current, image_url: url, image_storage_path: path }))}
                                />

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Orden</label>
                                        <input type="number" className="form-input" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) || 0 })} />
                                    </div>
                                    <div className="form-group form-group--inline">
                                        <label className="check-row"><input type="checkbox" checked={form.is_visible} onChange={(event) => setForm({ ...form, is_visible: event.target.checked })} /> Visible</label>
                                        <label className="check-row"><input type="checkbox" checked={form.is_featured} onChange={(event) => setForm({ ...form, is_featured: event.target.checked })} /> Destacado</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal__footer">
                                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear proyecto'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
