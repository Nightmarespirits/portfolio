'use client';

import { FormEvent, useMemo, useState } from 'react';
import AdminStatus from '@/components/admin/AdminStatus';
import { useAdmin } from '@/lib/admin-context';
import { ContactLink } from '@/lib/types';

const emptyLink: Omit<ContactLink, 'id' | 'created_at'> = {
    label: '',
    url: '',
    icon: 'github',
    sort_order: 0,
    is_visible: true,
};

const iconOptions = [
    { value: 'github', label: 'GitHub' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'email', label: 'Email' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'website', label: 'Website' },
    { value: 'other', label: 'Otro' },
];

export default function ContactPage() {
    const { contactLinks, addContactLink, updateContactLink, deleteContactLink, moveContactLink } = useAdmin();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyLink);
    const [submitting, setSubmitting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const rows = useMemo(() => [...contactLinks].sort((a, b) => a.sort_order - b.sort_order), [contactLinks]);

    const openNew = () => {
        setForm({ ...emptyLink, sort_order: rows.length });
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (entry: ContactLink) => {
        setForm({
            label: entry.label,
            url: entry.url,
            icon: entry.icon,
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
            await updateContactLink(editingId, form);
        } else {
            await addContactLink(form);
        }
        setSubmitting(false);
        setShowModal(false);
    };

    return (
        <>
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Contacto</h1>
                    <p className="admin-header__subtitle">Enlaces visibles del modulo Contacto y su orden final en la interfaz publica.</p>
                </div>
                <div className="admin-header__actions">
                    <button className="btn btn--primary" onClick={openNew}>+ Nuevo enlace</button>
                </div>
            </div>
            <div className="admin-content">
                <AdminStatus />
                <div className="table-shell">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Orden</th>
                                <th>Etiqueta</th>
                                <th>URL</th>
                                <th>Tipo</th>
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
                                                <button className="btn btn--ghost btn--sm" onClick={() => void moveContactLink(entry.id, 'up')} disabled={index === 0}>Subir</button>
                                                <button className="btn btn--ghost btn--sm" onClick={() => void moveContactLink(entry.id, 'down')} disabled={index === rows.length - 1}>Bajar</button>
                                            </div>
                                        </div>
                                    </td>
                                    <td><strong>{entry.label}</strong></td>
                                    <td><span className="table-url">{entry.url}</span></td>
                                    <td><span className="badge badge--muted">{entry.icon}</span></td>
                                    <td>
                                        <button className={`toggle ${entry.is_visible ? 'toggle--active' : ''}`} onClick={() => void updateContactLink(entry.id, { is_visible: !entry.is_visible })}>
                                            <span className="toggle__dot" />
                                        </button>
                                    </td>
                                    <td>
                                        <div className="data-table__actions">
                                            <button className="btn btn--ghost btn--sm" onClick={() => openEdit(entry)}>Editar</button>
                                            {confirmDelete === entry.id ? (
                                                <>
                                                    <button className="btn btn--danger btn--sm" onClick={() => void deleteContactLink(entry.id).then(() => setConfirmDelete(null))}>Confirmar</button>
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
                            <h2 className="modal__title">{editingId ? 'Editar enlace' : 'Nuevo enlace'}</h2>
                            <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>x</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal__body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Etiqueta</label>
                                        <input className="form-input" value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Tipo</label>
                                        <select className="form-input form-select" value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })}>
                                            {iconOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label form-label--required">URL</label>
                                    <input className="form-input" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder="https://..." required />
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
                                <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear enlace'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
