'use client';

import { useState, useEffect, useCallback } from 'react';
import { Theme } from '@/lib/types';

const STORAGE_KEY = 'portfolio-theme';

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
        if (stored === 'light' || stored === 'dark') {
            setThemeState(stored);
            document.documentElement.setAttribute('data-theme', stored);
        } else {
            // Default to dark, check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initial: Theme = prefersDark ? 'dark' : 'light';
            setThemeState(initial);
            document.documentElement.setAttribute('data-theme', initial);
            localStorage.setItem(STORAGE_KEY, initial);
        }
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => {
            const next: Theme = prev === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem(STORAGE_KEY, next);
            return next;
        });
    }, []);

    const setTheme = useCallback((t: Theme) => {
        setThemeState(t);
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem(STORAGE_KEY, t);
    }, []);

    return { theme, toggleTheme, setTheme, mounted };
}
