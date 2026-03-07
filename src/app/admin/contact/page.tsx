'use client';

import { useState, FormEvent } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { ContactLink } from '@/lib/types';

const emptyLink: Omit<ContactLink, 'id'> = {
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
    const { contactLinks, addContactLink, updateContactLink, deleteContactLink } = useAdmin();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyLink);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const openNew = () => {
        setForm(emptyLink);
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (link: ContactLink) => {
        setForm(link);
        setEditingId(link.id);
        setShowModal(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateContactLink(editingId, form);
        } else {
            addContactLink(form);
        }
        setShowModal(false);
    };

    return (
        <>
            <div className="admin-header">
                <h1 className="admin-header__title">Contacto</h1>
                <div className="admin-header__actions">
                    <button className="btn btn--primary" onClick={openNew}>
                        + Nuevo enlace
                    </button>
                </div>
            </div>
            <div className="admin-content">
                {contactLinks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">◆</div>
                        <div className="empty-state__title">Sin enlaces</div>
                        <div className="empty-state__desc">Agrega tus enlaces de contacto y redes sociales.</div>
                        <button className="btn btn--primary" onClick={openNew}>Agregar enlace</button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Etiqueta</th>
                                <th>URL</th>
                                <th>Tipo</th>
                                <th>Visible</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactLinks.map((link) => (
                                <tr key={link.id}>
                                    <td style={{ fontWeight: 500 }}>{link.label}</td>
                                    <td>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                                            {link.url}
                                        </span>
                                    </td>
                                    <td><span className="badge badge--muted">{link.icon}</span></td>
                                    <td>
                                        <button
                                            className={`toggle ${link.is_visible ? 'toggle--active' : ''}`}
                                            onClick={() => updateContactLink(link.id, { is_visible: !link.is_visible })}
                                        >
                                            <span className="toggle__dot" />
                                        </button>
                                    </td>
                                    <td>
                                        <div className="data-table__actions">
                                            <button className="btn btn--ghost btn--sm" onClick={() => openEdit(link)}>Editar</button>
                                            {confirmDelete === link.id ? (
                                                <>
                                                    <button className="btn btn--danger btn--sm" onClick={() => { deleteContactLink(link.id); setConfirmDelete(null); }}>Confirmar</button>
                                                    <button className="btn btn--ghost btn--sm" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                                                </>
                                            ) : (
                                                <button className="btn btn--danger btn--sm" onClick={() => setConfirmDelete(link.id)}>Eliminar</button>
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
                            <h2 className="modal__title">{editingId ? 'Editar enlace' : 'Nuevo enlace'}</h2>
                            <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal__body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Etiqueta</label>
                                        <input
                                            className="form-input"
                                            value={form.label}
                                            onChange={(e) => setForm({ ...form, label: e.target.value })}
                                            required
                                            placeholder="GitHub, LinkedIn..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label form-label--required">Tipo</label>
                                        <select
                                            className="form-input form-select"
                                            value={form.icon}
                                            onChange={(e) => setForm({ ...form, icon: e.target.value })}
                                        >
                                            {iconOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label form-label--required">URL</label>
                                    <input
                                        className="form-input"
                                        value={form.url}
                                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                                        required
                                        placeholder="https://..."
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
