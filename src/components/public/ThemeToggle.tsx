'use client';

import { useTheme } from '@/hooks/useTheme';

import { Sun, Moon } from '@phosphor-icons/react';

export default function ThemeToggle() {
    const { theme, toggleTheme, mounted } = useTheme();

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
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
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
