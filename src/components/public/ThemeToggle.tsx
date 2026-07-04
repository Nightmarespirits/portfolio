'use client';

import { Sun, Moon } from '@phosphor-icons/react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
    const { themeMode, toggleThemeMode, mounted } = useTheme();

    if (!mounted) {
        return (
            <button className="theme-toggle" aria-label="Cambiar tema" disabled>
                <span className="theme-toggle__indicator" />
            </button>
        );
    }

    return (
        <button
            className="theme-toggle"
            onClick={toggleThemeMode}
            aria-label={themeMode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-pressed={themeMode === 'light'}
            title={themeMode === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
            <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
                <Moon size={16} weight="fill" />
            </span>
            <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
                <Sun size={16} weight="fill" />
            </span>
            <span className="theme-toggle__indicator" />
        </button>
    );
}
