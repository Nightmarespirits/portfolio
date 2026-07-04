'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import AdminStatus from '@/components/admin/AdminStatus';
import BrandMark from '@/components/shared/BrandMark';
import { useTheme } from '@/hooks/useTheme';
import { useAdmin } from '@/lib/admin-context';
import { normalizeSiteThemeSettings, THEME_PRESETS } from '@/lib/theme';
import type { ThemeMode } from '@/lib/types';

const modeOptions: Array<{ id: ThemeMode; label: string; caption: string }> = [
    { id: 'dark', label: 'Oscuro', caption: 'Mas cinematografico y profundo.' },
    { id: 'light', label: 'Claro', caption: 'Mas limpio, editorial y aireado.' },
];

export default function AppearancePage() {
    const { siteTheme, updateSiteTheme, hasSupabase } = useAdmin();
    const { themeSettings, applyThemeSettings } = useTheme();
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    const handleApply = async (partial: Partial<typeof siteTheme>, actionKey: string) => {
        if (!hasSupabase || pendingAction) {
            return;
        }

        const previousTheme = themeSettings;
        const nextTheme = normalizeSiteThemeSettings({
            ...themeSettings,
            ...siteTheme,
            ...partial,
            id: siteTheme.id,
            updated_at: new Date().toISOString(),
        });

        applyThemeSettings(nextTheme, false);
        setPendingAction(actionKey);

        const result = await updateSiteTheme(partial);

        if (!result.ok) {
            applyThemeSettings(previousTheme, false);
        }

        setPendingAction(null);
    };

    return (
        <>
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Apariencia</h1>
                    <p className="admin-header__subtitle">Controla el modo global, la paleta de marca y la respuesta visual del logo compartido.</p>
                </div>
            </div>
            <div className="admin-content">
                <AdminStatus />

                <section className="admin-card appearance-preview">
                    <div className="appearance-preview__header">
                        <div>
                            <div className="module__label">Vista viva</div>
                            <h2 className="appearance-preview__title">Tema {themeSettings.theme_preset}</h2>
                            <p className="appearance-preview__copy">La previsualizacion usa el mismo sistema de tokens que el header publico y el sidebar del CMS.</p>
                        </div>
                        <BrandMark size="lg" />
                    </div>
                    <div className="appearance-preview__grid">
                        <div className="appearance-preview__surface appearance-preview__surface--hero">
                            <span className="badge badge--accent">Preset activo</span>
                            <strong>{themeSettings.theme_preset}</strong>
                            <span>{themeSettings.theme_mode === 'dark' ? 'Modo oscuro global' : 'Modo claro global'}</span>
                        </div>
                        <div className="appearance-preview__surface">
                            <span className="appearance-preview__eyebrow">Acento</span>
                            <div className="appearance-preview__chips">
                                <span className="dashboard-hero__metric">Glow sutil</span>
                                <span className="dashboard-hero__metric">Brand tint</span>
                                <span className="dashboard-hero__metric">Surfaces balanceadas</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="admin-card">
                    <div className="module__label">Modo</div>
                    <div className="appearance-mode-grid">
                        {modeOptions.map((modeOption) => {
                            const active = themeSettings.theme_mode === modeOption.id;
                            return (
                                <button
                                    key={modeOption.id}
                                    type="button"
                                    className={`appearance-mode-card ${active ? 'appearance-mode-card--active' : ''}`}
                                    onClick={() => void handleApply({ theme_mode: modeOption.id }, `mode-${modeOption.id}`)}
                                    disabled={!hasSupabase || Boolean(pendingAction)}
                                    aria-pressed={active}
                                >
                                    <span className="appearance-mode-card__label">{modeOption.label}</span>
                                    <span className="appearance-mode-card__caption">{modeOption.caption}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="admin-card">
                    <div className="module__label">Paletas curadas</div>
                    <div className="appearance-preset-grid">
                        {THEME_PRESETS.map((preset) => {
                            const active = themeSettings.theme_preset === preset.id;
                            return (
                                <button
                                    key={preset.id}
                                    type="button"
                                    className={`appearance-preset-card ${active ? 'appearance-preset-card--active' : ''}`}
                                    onClick={() => void handleApply({ theme_preset: preset.id }, `preset-${preset.id}`)}
                                    disabled={!hasSupabase || Boolean(pendingAction)}
                                    aria-pressed={active}
                                >
                                    <div className="appearance-preset-card__swatches">
                                        {preset.swatches.map((swatch) => (
                                            <span key={swatch} className="appearance-preset-card__swatch" style={{ '--swatch-color': swatch } as CSSProperties} />
                                        ))}
                                    </div>
                                    <div className="appearance-preset-card__content">
                                        <span className="appearance-preset-card__title">{preset.label}</span>
                                        <span className="appearance-preset-card__desc">{preset.description}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </>
    );
}
