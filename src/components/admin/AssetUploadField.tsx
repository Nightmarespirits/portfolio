'use client';

import { ChangeEvent, useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { UploadKind } from '@/lib/types';

interface AssetUploadFieldProps {
    kind: UploadKind;
    label: string;
    accept: string;
    currentUrl: string | null;
    helper: string;
    onUploaded: (payload: { url: string; path: string }) => void;
}

export default function AssetUploadField({ kind, label, accept, currentUrl, helper, onUploaded }: AssetUploadFieldProps) {
    const { uploadAsset } = useAdmin();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setUploading(true);
        setUploadError(null);

        const result = await uploadAsset(file, kind);

        if (result.ok && result.data) {
            onUploaded(result.data);
        } else {
            setUploadError(result.error || 'No se pudo subir el archivo.');
        }

        setUploading(false);
        event.target.value = '';
    };

    return (
        <div className="asset-field">
            <label className="form-label">{label}</label>
            <div className="asset-field__row">
                <label className="btn btn--secondary btn--file">
                    <input type="file" accept={accept} onChange={handleChange} disabled={uploading} className="asset-field__input" />
                    {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
                </label>
                <span className="asset-field__helper">{helper}</span>
            </div>
            {uploadError && <div className="field-help field-help--error">{uploadError}</div>}
            {currentUrl && (
                <a href={currentUrl} target="_blank" rel="noreferrer" className="asset-field__link">
                    Ver archivo actual
                </a>
            )}
        </div>
    );
}
