import type { SiteThemeSettings, ThemeMode, ThemePresetId } from '@/lib/types';

export const THEME_STORAGE_KEY = 'portfolio-site-theme';
export const LEGACY_THEME_STORAGE_KEY = 'portfolio-theme';
export const THEME_TRANSITION_MS = 620;

export const DEFAULT_SITE_THEME: SiteThemeSettings = {
    id: 1,
    theme_mode: 'dark',
    theme_preset: 'cobalt',
    updated_at: '1970-01-01T00:00:00.000Z',
};

type ThemeCachePayload = {
    theme_mode: ThemeMode;
    theme_preset: ThemePresetId;
    mode_locked?: boolean;
};

type ThemeStoreOptions = {
    animate?: boolean;
    modeLocked?: boolean;
};

type RemoteSyncOptions = {
    animate?: boolean;
    force?: boolean;
};

type ThemePresetMeta = {
    id: ThemePresetId;
    label: string;
    description: string;
    swatches: [string, string, string];
};

const themePresetIds: ThemePresetId[] = ['cobalt', 'azure', 'teal', 'emerald'];
const themeModes: ThemeMode[] = ['light', 'dark'];

export const THEME_PRESETS: ThemePresetMeta[] = [
    {
        id: 'cobalt',
        label: 'Cobalt',
        description: 'Azul firma con brillo elegante y contraste alto.',
        swatches: ['#8aafff', '#5f82ff', '#2f43c8'],
    },
    {
        id: 'azure',
        label: 'Azure',
        description: 'Azul limpio con lectura mas luminosa y tecnica.',
        swatches: ['#6cc8ff', '#2b8ef0', '#1d5cc8'],
    },
    {
        id: 'teal',
        label: 'Teal',
        description: 'Cian profundo con acento sobrio y contemporaneo.',
        swatches: ['#73e3df', '#25b7c0', '#0b7683'],
    },
    {
        id: 'emerald',
        label: 'Emerald',
        description: 'Verde premium con atmosfera oscura y limpia.',
        swatches: ['#7ce0b3', '#2fb879', '#14744c'],
    },
];

type ThemeListener = () => void;

const listeners = new Set<ThemeListener>();

let currentTheme = DEFAULT_SITE_THEME;
let currentModeLocked = false;
let initialized = false;
let transitionTimer: number | null = null;

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
    return Boolean(value) && themeModes.includes(value as ThemeMode);
}

export function isThemePresetId(value: string | null | undefined): value is ThemePresetId {
    return Boolean(value) && themePresetIds.includes(value as ThemePresetId);
}

export function normalizeSiteThemeSettings(value: Partial<SiteThemeSettings> | null | undefined): SiteThemeSettings {
    return {
        id: typeof value?.id === 'number' ? value.id : DEFAULT_SITE_THEME.id,
        theme_mode: isThemeMode(value?.theme_mode) ? value.theme_mode : DEFAULT_SITE_THEME.theme_mode,
        theme_preset: isThemePresetId(value?.theme_preset) ? value.theme_preset : DEFAULT_SITE_THEME.theme_preset,
        updated_at: value?.updated_at || DEFAULT_SITE_THEME.updated_at,
    };
}

function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function notifyThemeListeners() {
    listeners.forEach((listener) => listener());
}

function readThemeCache(): ThemeCachePayload | null {
    if (!isBrowser()) {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(THEME_STORAGE_KEY);

        if (raw) {
            const parsed = JSON.parse(raw) as ThemeCachePayload;

            if (isThemeMode(parsed?.theme_mode) && isThemePresetId(parsed?.theme_preset)) {
                return {
                    theme_mode: parsed.theme_mode,
                    theme_preset: parsed.theme_preset,
                    mode_locked: Boolean(parsed.mode_locked),
                };
            }
        }

        const legacyMode = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);

        if (isThemeMode(legacyMode)) {
            return {
                theme_mode: legacyMode,
                theme_preset: DEFAULT_SITE_THEME.theme_preset,
                mode_locked: true,
            };
        }
    } catch {
        return null;
    }

    return null;
}

function persistThemeCache(theme: SiteThemeSettings, modeLocked: boolean) {
    if (!isBrowser()) {
        return;
    }

    const payload: ThemeCachePayload = {
        theme_mode: theme.theme_mode,
        theme_preset: theme.theme_preset,
        mode_locked: modeLocked,
    };

    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(payload));
        window.localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
    } catch {
        return;
    }
}

function writeThemeAttributes(theme: SiteThemeSettings, animate: boolean) {
    if (!isBrowser()) {
        return;
    }

    const root = document.documentElement;

    if (animate) {
        root.setAttribute('data-theme-transition', 'active');

        if (transitionTimer) {
            window.clearTimeout(transitionTimer);
        }

        transitionTimer = window.setTimeout(() => {
            root.setAttribute('data-theme-transition', 'idle');
        }, THEME_TRANSITION_MS);
    } else {
        root.setAttribute('data-theme-transition', 'idle');
    }

    root.setAttribute('data-theme', theme.theme_mode);
    root.setAttribute('data-theme-preset', theme.theme_preset);
}

function applyThemeStore(nextTheme: SiteThemeSettings, options: ThemeStoreOptions = {}) {
    const normalized = normalizeSiteThemeSettings(nextTheme);

    currentTheme = normalized;
    currentModeLocked = Boolean(options.modeLocked);

    writeThemeAttributes(normalized, options.animate ?? true);
    persistThemeCache(normalized, currentModeLocked);
    notifyThemeListeners();
}

function ensureThemeStore() {
    if (initialized || !isBrowser()) {
        return;
    }

    const cached = readThemeCache();

    if (cached) {
        currentTheme = normalizeSiteThemeSettings({
            ...DEFAULT_SITE_THEME,
            theme_mode: cached.theme_mode,
            theme_preset: cached.theme_preset,
        });
        currentModeLocked = Boolean(cached.mode_locked);
    } else {
        currentTheme = DEFAULT_SITE_THEME;
        currentModeLocked = false;
    }

    writeThemeAttributes(currentTheme, false);
    initialized = true;
}

export function getCurrentThemeSettings() {
    ensureThemeStore();
    return currentTheme;
}

export function getCurrentThemeModeLock() {
    ensureThemeStore();
    return currentModeLocked;
}

export function setSiteThemeSettings(nextTheme: SiteThemeSettings, options: ThemeStoreOptions = {}) {
    ensureThemeStore();
    applyThemeStore(nextTheme, options);
}

export function setSiteThemeMode(themeMode: ThemeMode, options: ThemeStoreOptions = {}) {
    ensureThemeStore();
    applyThemeStore(
        {
            ...currentTheme,
            theme_mode: themeMode,
        },
        options,
    );
}

export function setSiteThemePreset(themePreset: ThemePresetId, options: ThemeStoreOptions = {}) {
    ensureThemeStore();
    applyThemeStore(
        {
            ...currentTheme,
            theme_preset: themePreset,
        },
        options,
    );
}

export function toggleSiteThemeMode() {
    ensureThemeStore();
    setSiteThemeMode(currentTheme.theme_mode === 'dark' ? 'light' : 'dark', { animate: true, modeLocked: true });
}

export function syncRemoteThemeSettings(remoteTheme: SiteThemeSettings, options: RemoteSyncOptions = {}) {
    ensureThemeStore();

    const normalizedRemote = normalizeSiteThemeSettings(remoteTheme);
    const cached = readThemeCache();
    const shouldRespectLocalMode = !options.force && Boolean(cached?.mode_locked && isThemeMode(cached.theme_mode));

    const mergedTheme = shouldRespectLocalMode
        ? {
            ...normalizedRemote,
            theme_mode: cached!.theme_mode,
        }
        : normalizedRemote;

    applyThemeStore(mergedTheme, {
        animate: options.animate ?? true,
        modeLocked: shouldRespectLocalMode,
    });
}

export function subscribeToTheme(listener: ThemeListener) {
    ensureThemeStore();
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}


