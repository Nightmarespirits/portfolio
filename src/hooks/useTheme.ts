'use client';

import { useCallback, useSyncExternalStore } from 'react';
import {
    getCurrentThemeSettings,
    setSiteThemeMode,
    setSiteThemePreset,
    setSiteThemeSettings,
    subscribeToTheme,
    syncRemoteThemeSettings,
    toggleSiteThemeMode,
} from '@/lib/theme';
import type { SiteThemeSettings, ThemeMode, ThemePresetId } from '@/lib/types';

export function useTheme() {
    const themeSettings = useSyncExternalStore(
        subscribeToTheme,
        getCurrentThemeSettings,
        getCurrentThemeSettings,
    );
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    );

    const toggleThemeMode = useCallback(() => {
        toggleSiteThemeMode();
    }, []);

    const setThemeMode = useCallback((nextThemeMode: ThemeMode, persistAsOverride = false) => {
        setSiteThemeMode(nextThemeMode, { animate: true, modeLocked: persistAsOverride });
    }, []);

    const setThemePreset = useCallback((nextThemePreset: ThemePresetId, modeLocked = false) => {
        setSiteThemePreset(nextThemePreset, { animate: true, modeLocked });
    }, []);

    const applyThemeSettings = useCallback((nextThemeSettings: SiteThemeSettings, modeLocked = false) => {
        setSiteThemeSettings(nextThemeSettings, { animate: true, modeLocked });
    }, []);

    const syncThemeSettings = useCallback((nextThemeSettings: SiteThemeSettings, force = false) => {
        syncRemoteThemeSettings(nextThemeSettings, { animate: true, force });
    }, []);

    return {
        themeSettings,
        themeMode: themeSettings.theme_mode,
        themePreset: themeSettings.theme_preset,
        toggleThemeMode,
        setThemeMode,
        setThemePreset,
        applyThemeSettings,
        syncThemeSettings,
        mounted,
    };
}
