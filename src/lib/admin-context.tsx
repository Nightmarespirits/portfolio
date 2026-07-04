'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { sampleContactLinks, sampleExperience, sampleProfile, sampleProjects, sampleSiteTheme, sampleSkills } from '@/lib/data';
import { fetchPortfolioContent } from '@/lib/portfolio-client';
import { getStoragePublicUrl, storageBucket, supabase } from '@/lib/supabase';
import { normalizeSiteThemeSettings, syncRemoteThemeSettings } from '@/lib/theme';
import { ContactLink, Experience, Profile, Project, SiteThemeSettings, Skill, UploadKind } from '@/lib/types';

type FeedbackTone = 'idle' | 'saving' | 'success' | 'error';

interface AdminFeedback {
    tone: FeedbackTone;
    message: string | null;
    scope: string | null;
}

interface AsyncResult<T = void> {
    ok: boolean;
    data?: T;
    error?: string;
}

interface AdminContextType {
    initialized: boolean;
    hasSupabase: boolean;
    isAuthenticated: boolean;
    authLoading: boolean;
    loadingData: boolean;
    session: Session | null;
    sessionEmail: string | null;
    feedback: AdminFeedback;
    lastSyncedAt: string | null;
    profile: Profile;
    projects: Project[];
    experience: Experience[];
    skills: Skill[];
    contactLinks: ContactLink[];
    siteTheme: SiteThemeSettings;
    login: (email: string, password: string) => Promise<AsyncResult>;
    logout: () => Promise<void>;
    refreshData: () => Promise<void>;
    clearFeedback: () => void;
    updateProfile: (data: Partial<Profile>) => Promise<AsyncResult<Profile>>;
    addProject: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<AsyncResult<Project>>;
    updateProject: (id: string, data: Partial<Project>) => Promise<AsyncResult<Project>>;
    deleteProject: (id: string) => Promise<AsyncResult>;
    moveProject: (id: string, direction: 'up' | 'down') => Promise<AsyncResult>;
    addExperience: (data: Omit<Experience, 'id' | 'created_at'>) => Promise<AsyncResult<Experience>>;
    updateExperience: (id: string, data: Partial<Experience>) => Promise<AsyncResult<Experience>>;
    deleteExperience: (id: string) => Promise<AsyncResult>;
    moveExperience: (id: string, direction: 'up' | 'down') => Promise<AsyncResult>;
    addSkill: (data: Omit<Skill, 'id' | 'created_at'>) => Promise<AsyncResult<Skill>>;
    updateSkill: (id: string, data: Partial<Skill>) => Promise<AsyncResult<Skill>>;
    deleteSkill: (id: string) => Promise<AsyncResult>;
    moveSkill: (id: string, direction: 'up' | 'down') => Promise<AsyncResult>;
    addContactLink: (data: Omit<ContactLink, 'id' | 'created_at'>) => Promise<AsyncResult<ContactLink>>;
    updateContactLink: (id: string, data: Partial<ContactLink>) => Promise<AsyncResult<ContactLink>>;
    deleteContactLink: (id: string) => Promise<AsyncResult>;
    moveContactLink: (id: string, direction: 'up' | 'down') => Promise<AsyncResult>;
    updateSiteTheme: (data: Partial<SiteThemeSettings>) => Promise<AsyncResult<SiteThemeSettings>>;
    uploadAsset: (file: File, kind: UploadKind) => Promise<AsyncResult<{ url: string; path: string }>>;
}

const AdminContext = createContext<AdminContextType | null>(null);

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function ensureClient() {
    if (!supabase) {
        throw new Error('Supabase no esta configurado.');
    }

    return supabase;
}

function moveListItem<T extends { id: string }>(items: T[], id: string, direction: 'up' | 'down') {
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
        return null;
    }

    const nextIndex = direction === 'up' ? index - 1 : index + 1;

    if (nextIndex < 0 || nextIndex >= items.length) {
        return items;
    }

    const next = [...items];
    const [removed] = next.splice(index, 1);
    next.splice(nextIndex, 0, removed);
    return next;
}

function normalizeProject(project: Project): Project {
    return {
        ...project,
        image_url: project.image_url || getStoragePublicUrl(project.image_storage_path) || null,
    };
}

function normalizeProfile(profile: Profile): Profile {
    return {
        ...profile,
        avatar_url: profile.avatar_url || getStoragePublicUrl(profile.avatar_storage_path) || null,
        cv_url: profile.cv_url || getStoragePublicUrl(profile.cv_storage_path) || null,
    };
}

export function useAdmin() {
    const context = useContext(AdminContext);

    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }

    return context;
}

export function AdminProvider({ children }: { children: ReactNode }) {
    const [initialized, setInitialized] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [feedback, setFeedback] = useState<AdminFeedback>({ tone: 'idle', message: null, scope: null });
    const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile>(sampleProfile);
    const [projects, setProjects] = useState<Project[]>(sampleProjects);
    const [experience, setExperience] = useState<Experience[]>(sampleExperience);
    const [skills, setSkills] = useState<Skill[]>(sampleSkills);
    const [contactLinks, setContactLinks] = useState<ContactLink[]>(sampleContactLinks);
    const [siteTheme, setSiteTheme] = useState<SiteThemeSettings>(sampleSiteTheme);

    const hasSupabase = Boolean(supabase);
    const isAuthenticated = Boolean(session?.user);

    const clearFeedback = useCallback(() => {
        setFeedback({ tone: 'idle', message: null, scope: null });
    }, []);

    const refreshData = useCallback(async () => {
        if (!supabase) {
            return;
        }

        setLoadingData(true);

        try {
            const content = await fetchPortfolioContent();
            setProfile(content.profile ? normalizeProfile(content.profile) : sampleProfile);
            setProjects(content.projects.map(normalizeProject));
            setExperience(content.experience);
            setSkills(content.skills);
            setContactLinks(content.contactLinks);
            setSiteTheme(content.siteTheme);
            syncRemoteThemeSettings(content.siteTheme, { animate: false, force: true });
            setLastSyncedAt(new Date().toISOString());
            setFeedback((current) => current.tone === 'saving' ? current : { tone: 'idle', message: null, scope: null });
        } catch (error) {
            setFeedback({
                tone: 'error',
                message: error instanceof Error ? error.message : 'No se pudo sincronizar el panel con Supabase.',
                scope: 'sync',
            });
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => {
        if (!supabase) {
            setInitialized(true);
            return;
        }

        let active = true;

        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            if (!active) {
                return;
            }

            setSession(currentSession);
            setInitialized(true);

            if (currentSession) {
                void refreshData();
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
            setInitialized(true);

            if (nextSession) {
                void refreshData();
            }
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, [refreshData]);

    const runMutation = useCallback(async <T,>(scope: string, work: () => Promise<T>, successMessage: string): Promise<AsyncResult<T>> => {
        setFeedback({ tone: 'saving', message: 'Guardando cambios...', scope });

        try {
            const data = await work();
            setFeedback({ tone: 'success', message: successMessage, scope });
            setLastSyncedAt(new Date().toISOString());
            return { ok: true, data };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo completar la accion.';
            setFeedback({ tone: 'error', message, scope });
            return { ok: false, error: message };
        }
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<AsyncResult> => {
        if (!supabase) {
            const message = 'Supabase no esta configurado para autenticar el panel.';
            setFeedback({ tone: 'error', message, scope: 'auth' });
            return { ok: false, error: message };
        }

        setAuthLoading(true);
        setFeedback({ tone: 'saving', message: 'Validando credenciales...', scope: 'auth' });

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                throw error;
            }

            setFeedback({ tone: 'success', message: 'Sesion iniciada correctamente.', scope: 'auth' });
            return { ok: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo iniciar sesion.';
            setFeedback({ tone: 'error', message, scope: 'auth' });
            return { ok: false, error: message };
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        if (!supabase) {
            return;
        }

        await supabase.auth.signOut();
        setSession(null);
        setFeedback({ tone: 'idle', message: null, scope: null });
    }, []);

    const updateProfile = useCallback(async (data: Partial<Profile>) => {
        return runMutation('profile', async () => {
            const client = ensureClient();
            const payload = {
                name: data.name ?? profile.name,
                title: data.title ?? profile.title,
                bio: data.bio ?? profile.bio,
                location: data.location ?? profile.location,
                email: data.email ?? profile.email,
                avatar_url: data.avatar_url ?? profile.avatar_url,
                avatar_storage_path: data.avatar_storage_path ?? profile.avatar_storage_path,
                cv_url: data.cv_url ?? profile.cv_url,
                cv_storage_path: data.cv_storage_path ?? profile.cv_storage_path,
                seo_title: data.seo_title ?? profile.seo_title,
                seo_description: data.seo_description ?? profile.seo_description,
                seo_keywords: data.seo_keywords ?? profile.seo_keywords,
                updated_at: new Date().toISOString(),
            };

            const response = profile.id && !profile.id.startsWith('seed-')
                ? await client.from('profiles').update(payload).eq('id', profile.id).select('*').single()
                : await client.from('profiles').insert(payload).select('*').single();

            if (response.error || !response.data) {
                throw new Error(response.error?.message || 'No se pudo guardar el perfil.');
            }

            const nextProfile = normalizeProfile(response.data as Profile);
            setProfile(nextProfile);
            return nextProfile;
        }, 'Perfil sincronizado.');
    }, [profile, runMutation]);

    const addProject = useCallback(async (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
        return runMutation('projects', async () => {
            const client = ensureClient();
            const payload = {
                ...data,
                slug: data.slug || slugify(data.title),
                sort_order: data.sort_order,
                updated_at: new Date().toISOString(),
            };
            const response = await client.from('projects').insert(payload).select('*').single();

            if (response.error || !response.data) {
                throw new Error(response.error?.message || 'No se pudo crear el proyecto.');
            }

            const project = normalizeProject(response.data as Project);
            setProjects((current) => [...current, project].sort((a, b) => a.sort_order - b.sort_order));
            return project;
        }, 'Proyecto creado.');
    }, [runMutation]);

    const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
        return runMutation('projects', async () => {
            const client = ensureClient();
            const response = await client
                .from('projects')
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select('*')
                .single();

            if (response.error || !response.data) {
                throw new Error(response.error?.message || 'No se pudo actualizar el proyecto.');
            }

            const project = normalizeProject(response.data as Project);
            setProjects((current) => current.map((item) => (item.id === id ? project : item)).sort((a, b) => a.sort_order - b.sort_order));
            return project;
        }, 'Proyecto actualizado.');
    }, [runMutation]);

    const deleteProject = useCallback(async (id: string) => {
        return runMutation('projects', async () => {
            const client = ensureClient();
            const { error } = await client.from('projects').delete().eq('id', id);
            if (error) {
                throw new Error(error.message || 'No se pudo eliminar el proyecto.');
            }
            setProjects((current) => current.filter((item) => item.id !== id));
        }, 'Proyecto eliminado.');
    }, [runMutation]);

    const moveProject = useCallback(async (id: string, direction: 'up' | 'down') => {
        return runMutation('projects', async () => {
            const client = ensureClient();
            const next = moveListItem(projects, id, direction);
            if (!next) {
                throw new Error('No se encontro el proyecto a reordenar.');
            }
            const ordered = next.map((item, index) => ({ ...item, sort_order: index }));
            const results = await Promise.all(ordered.map((item) => client.from('projects').update({ sort_order: item.sort_order }).eq('id', item.id)));
            const failed = results.find((result) => result.error);
            if (failed?.error) {
                throw new Error(failed.error.message || 'No se pudo guardar el nuevo orden de proyectos.');
            }
            setProjects(ordered);
        }, 'Orden de proyectos actualizado.');
    }, [projects, runMutation]);

    const addExperience = useCallback(async (data: Omit<Experience, 'id' | 'created_at'>) => {
        return runMutation('experience', async () => {
            const client = ensureClient();
            const response = await client.from('experience').insert(data).select('*').single();
            if (response.error || !response.data) {
                throw new Error(response.error?.message || 'No se pudo crear la experiencia.');
            }
            const entry = response.data as Experience;
            setExperience((current) => [...current, entry].sort((a, b) => a.sort_order - b.sort_order));
            return entry;
        }, 'Experiencia creada.');
    }, [runMutation]);

    const updateExperience = useCallback(async (id: string, data: Partial<Experience>) => {
        return runMutation('experience', async () => {
            const client = ensureClient();
            const response = await client.from('experience').update(data).eq('id', id).select('*').single();
            if (response.error || !response.data) {
                throw new Error(response.error?.message || 'No se pudo actualizar la experiencia.');
            }
            const entry = response.data as Experience;
            setExperience((current) => current.map((item) => (item.id === id ? entry : item)).sort((a, b) => a.sort_order - b.sort_order));
            return entry;
        }, 'Experiencia actualizada.');
    }, [runMutation]);

    const deleteExperience = useCallback(async (id: string) => {
        return runMutation('experience', async () => {
            const client = ensureClient();
            const { error } = await client.from('experience').delete().eq('id', id);
            if (error) {
                throw new Error(error.message || 'No se pudo eliminar la experiencia.');
            }
            setExperience((current) => current.filter((item) => item.id !== id));
        }, 'Experiencia eliminada.');
    }, [runMutation]);

    const moveExperience = useCallback(async (id: string, direction: 'up' | 'down') => {
        return runMutation('experience', async () => {
            const client = ensureClient();
            const next = moveListItem(experience, id, direction);
            if (!next) {
                throw new Error('No se encontro la experiencia a reordenar.');
            }
            const ordered = next.map((item, index) => ({ ...item, sort_order: index }));
            const results = await Promise.all(ordered.map((item) => client.from('experience').update({ sort_order: item.sort_order }).eq('id', item.id)));
            const failed = results.find((result) => result.error);
            if (failed?.error) {
                throw new Error(failed.error.message || 'No se pudo guardar el nuevo orden de experiencia.');
            }
            setExperience(ordered);
        }, 'Orden de experiencia actualizado.');
    }, [experience, runMutation]);

    const addSkill = useCallback(async (data: Omit<Skill, 'id' | 'created_at'>) => {
        return runMutation('skills', async () => {
            const client = ensureClient();
            const response = await client.from('skills').insert(data).select('*').single();
            if (response.error || !response.data) {
                throw new Error(response.error?.message || 'No se pudo crear la habilidad.');
            }
            const entry = response.data as Skill;
            setSkills((current) => [...current, entry].sort((a, b) => a.sort_order - b.sort_order));
            return entry;
        }, 'Habilidad creada.');
    }, [runMutation]);

    const updateSkill = useCallback(async (id: string, data: Partial<Skill>) => {
        return runMutation('skills', async () => {
            const client = ensureClient();
            const response = await client.from('skills').update(data).eq('id', id).select('*').single();
            if (response.error || !response.data) {
                throw new Error(response.error?.message || 'No se pudo actualizar la habilidad.');
            }
            const entry = response.data as Skill;
            setSkills((current) => current.map((item) => (item.id === id ? entry : item)).sort((a, b) => a.sort_order - b.sort_order));
            return entry;
        }, 'Habilidad actualizada.');
    }, [runMutation]);

    const deleteSkill = useCallback(async (id: string) => {
        return runMutation('skills', async () => {
            const client = ensureClient();
            const { error } = await client.from('skills').delete().eq('id', id);
            if (error) {
                throw new Error(error.message || 'No se pudo eliminar la habilidad.');
            }
            setSkills((current) => current.filter((item) => item.id !== id));
        }, 'Habilidad eliminada.');
    }, [runMutation]);

    const moveSkill = useCallback(async (id: string, direction: 'up' | 'down') => {
        return runMutation('skills', async () => {
            const client = ensureClient();
            const next = moveListItem(skills, id, direction);
            if (!next) {
                throw new Error('No se encontro la habilidad a reordenar.');
            }
            const ordered = next.map((item, index) => ({ ...item, sort_order: index }));
            const results = await Promise.all(ordered.map((item) => client.from('skills').update({ sort_order: item.sort_order }).eq('id', item.id)));
            const failed = results.find((result) => result.error);
            if (failed?.error) {
                throw new Error(failed.error.message || 'No se pudo guardar el nuevo orden de habilidades.');
            }
            setSkills(ordered);
        }, 'Orden de habilidades actualizado.');
    }, [runMutation, skills]);

    const addContactLink = useCallback(async (data: Omit<ContactLink, 'id' | 'created_at'>) => {
        return runMutation('contact', async () => {
            const client = ensureClient();
            const response = await client.from('contact_links').insert(data).select('*').single();
            if (response.error || !response.data) {
                throw new Error(response.error?.message || 'No se pudo crear el enlace de contacto.');
            }
            const entry = response.data as ContactLink;
            setContactLinks((current) => [...current, entry].sort((a, b) => a.sort_order - b.sort_order));
            return entry;
        }, 'Enlace creado.');
    }, [runMutation]);

    const updateContactLink = useCallback(async (id: string, data: Partial<ContactLink>) => {
        return runMutation('contact', async () => {
            const client = ensureClient();
            const response = await client.from('contact_links').update(data).eq('id', id).select('*').single();
            if (response.error || !response.data) {
                throw new Error(response.error?.message || 'No se pudo actualizar el enlace.');
            }
            const entry = response.data as ContactLink;
            setContactLinks((current) => current.map((item) => (item.id === id ? entry : item)).sort((a, b) => a.sort_order - b.sort_order));
            return entry;
        }, 'Enlace actualizado.');
    }, [runMutation]);

    const deleteContactLink = useCallback(async (id: string) => {
        return runMutation('contact', async () => {
            const client = ensureClient();
            const { error } = await client.from('contact_links').delete().eq('id', id);
            if (error) {
                throw new Error(error.message || 'No se pudo eliminar el enlace.');
            }
            setContactLinks((current) => current.filter((item) => item.id !== id));
        }, 'Enlace eliminado.');
    }, [runMutation]);

    const moveContactLink = useCallback(async (id: string, direction: 'up' | 'down') => {
        return runMutation('contact', async () => {
            const client = ensureClient();
            const next = moveListItem(contactLinks, id, direction);
            if (!next) {
                throw new Error('No se encontro el enlace a reordenar.');
            }
            const ordered = next.map((item, index) => ({ ...item, sort_order: index }));
            const results = await Promise.all(ordered.map((item) => client.from('contact_links').update({ sort_order: item.sort_order }).eq('id', item.id)));
            const failed = results.find((result) => result.error);
            if (failed?.error) {
                throw new Error(failed.error.message || 'No se pudo guardar el nuevo orden de enlaces.');
            }
            setContactLinks(ordered);
        }, 'Orden de enlaces actualizado.');
    }, [contactLinks, runMutation]);

    const updateSiteTheme = useCallback(async (data: Partial<SiteThemeSettings>) => {
        return runMutation('appearance', async () => {
            const client = ensureClient();
            const payload = normalizeSiteThemeSettings({
                ...siteTheme,
                ...data,
                id: siteTheme.id || sampleSiteTheme.id,
                updated_at: new Date().toISOString(),
            });

            const response = await client
                .from('site_settings')
                .upsert({
                    id: payload.id,
                    theme_mode: payload.theme_mode,
                    theme_preset: payload.theme_preset,
                    updated_at: payload.updated_at,
                })
                .select('*')
                .single();

            if (response.error || !response.data) {
                throw new Error(response.error?.message || 'No se pudo guardar la apariencia global.');
            }

            const nextTheme = normalizeSiteThemeSettings(response.data as SiteThemeSettings);
            setSiteTheme(nextTheme);
            syncRemoteThemeSettings(nextTheme, { animate: false, force: true });
            return nextTheme;
        }, 'Apariencia global sincronizada.');
    }, [runMutation, siteTheme]);

    const uploadAsset = useCallback(async (file: File, kind: UploadKind) => {
        return runMutation('upload', async () => {
            const client = ensureClient();
            const extension = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
            const folder = kind === 'avatar' ? 'avatars' : kind === 'cv' ? 'cv' : 'projects';
            const fileName = `${folder}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}.${extension}`;

            const { error } = await client.storage.from(storageBucket).upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
            });

            if (error) {
                throw new Error(error.message || 'No se pudo subir el archivo a Storage.');
            }

            const url = getStoragePublicUrl(fileName);

            if (!url) {
                throw new Error('Supabase no devolvio una URL publica para el archivo.');
            }

            return { url, path: fileName };
        }, 'Archivo cargado correctamente.');
    }, [runMutation]);

    const value = useMemo<AdminContextType>(() => ({
        initialized,
        hasSupabase,
        isAuthenticated,
        authLoading,
        loadingData,
        session,
        sessionEmail: session?.user.email ?? null,
        feedback,
        lastSyncedAt,
        profile,
        projects,
        experience,
        skills,
        contactLinks,
        siteTheme,
        login,
        logout,
        refreshData,
        clearFeedback,
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        moveProject,
        addExperience,
        updateExperience,
        deleteExperience,
        moveExperience,
        addSkill,
        updateSkill,
        deleteSkill,
        moveSkill,
        addContactLink,
        updateContactLink,
        deleteContactLink,
        moveContactLink,
        updateSiteTheme,
        uploadAsset,
    }), [
        addContactLink,
        addExperience,
        addProject,
        addSkill,
        authLoading,
        clearFeedback,
        contactLinks,
        deleteContactLink,
        deleteExperience,
        deleteProject,
        deleteSkill,
        experience,
        feedback,
        hasSupabase,
        initialized,
        isAuthenticated,
        lastSyncedAt,
        loadingData,
        login,
        logout,
        moveContactLink,
        moveExperience,
        moveProject,
        moveSkill,
        profile,
        projects,
        refreshData,
        session,
        siteTheme,
        skills,
        updateContactLink,
        updateExperience,
        updateProfile,
        updateProject,
        updateSiteTheme,
        updateSkill,
        uploadAsset,
    ]);

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
