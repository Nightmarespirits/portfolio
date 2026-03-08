'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
    Profile,
    ContactLink,
    Project,
    Experience,
    Skill,
} from '@/lib/types';
import {
    sampleProfile,
    sampleContactLinks,
    sampleProjects,
    sampleExperience,
    sampleSkills,
} from '@/lib/data';
import { supabase } from '@/lib/supabase';

// ─── Auth State ────────────────────────────────────────────────

interface AdminContextType {
    // Auth
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;

    // Profile
    profile: Profile;
    updateProfile: (data: Partial<Profile>) => void;

    // Projects
    projects: Project[];
    addProject: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void;
    updateProject: (id: string, data: Partial<Project>) => void;
    deleteProject: (id: string) => void;

    // Experience
    experience: Experience[];
    addExperience: (data: Omit<Experience, 'id' | 'created_at'>) => void;
    updateExperience: (id: string, data: Partial<Experience>) => void;
    deleteExperience: (id: string) => void;

    // Skills
    skills: Skill[];
    addSkill: (data: Omit<Skill, 'id' | 'created_at'>) => void;
    updateSkill: (id: string, data: Partial<Skill>) => void;
    deleteSkill: (id: string) => void;

    // Contact Links
    contactLinks: ContactLink[];
    addContactLink: (data: Omit<ContactLink, 'id'>) => void;
    updateContactLink: (id: string, data: Partial<ContactLink>) => void;
    deleteContactLink: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
    return ctx;
}

// ─── Local Storage Helpers ─────────────────────────────────────

function loadState<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const stored = localStorage.getItem(`admin_${key}`);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
}

function saveState(key: string, value: unknown) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`admin_${key}`, JSON.stringify(value));
}

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ─── Provider ──────────────────────────────────────────────────

export function AdminProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profile, setProfile] = useState<Profile>(sampleProfile);
    const [projects, setProjects] = useState<Project[]>(sampleProjects);
    const [experience, setExperience] = useState<Experience[]>(sampleExperience);
    const [skills, setSkills] = useState<Skill[]>(sampleSkills);
    const [contactLinks, setContactLinks] = useState<ContactLink[]>(sampleContactLinks);

    // Load persisted state
    useEffect(() => {
        setIsAuthenticated(loadState('auth', false));
        setProfile(loadState('profile', sampleProfile));
        setProjects(loadState('projects', sampleProjects));
        setExperience(loadState('experience', sampleExperience));
        setSkills(loadState('skills', sampleSkills));
        setContactLinks(loadState('contactLinks', sampleContactLinks));
    }, []);

    // Auth
    const login = useCallback(async (email: string, password: string) => {
        if (!supabase) {
            console.error('Supabase client is not initialized');
            return false;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error || !data.user) {
                console.error('Login error:', error?.message);
                return false;
            }

            setIsAuthenticated(true);
            saveState('auth', true);
            return true;
        } catch (err) {
            console.error('Unexpected login error:', err);
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        if (supabase) {
            void supabase.auth.signOut();
        }
        setIsAuthenticated(false);
        saveState('auth', false);
    }, []);

    // Profile
    const updateProfile = useCallback((data: Partial<Profile>) => {
        setProfile((prev) => {
            const updated = { ...prev, ...data, updated_at: new Date().toISOString() };
            saveState('profile', updated);
            return updated;
        });
    }, []);

    // Projects
    const addProject = useCallback((data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
        setProjects((prev) => {
            const now = new Date().toISOString();
            const newProject: Project = { ...data, id: generateId(), created_at: now, updated_at: now };
            const updated = [...prev, newProject];
            saveState('projects', updated);
            return updated;
        });
    }, []);

    const updateProject = useCallback((id: string, data: Partial<Project>) => {
        setProjects((prev) => {
            const updated = prev.map((p) =>
                p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
            );
            saveState('projects', updated);
            return updated;
        });
    }, []);

    const deleteProject = useCallback((id: string) => {
        setProjects((prev) => {
            const updated = prev.filter((p) => p.id !== id);
            saveState('projects', updated);
            return updated;
        });
    }, []);

    // Experience
    const addExperience = useCallback((data: Omit<Experience, 'id' | 'created_at'>) => {
        setExperience((prev) => {
            const newExp: Experience = { ...data, id: generateId() } as Experience;
            const updated = [...prev, newExp];
            saveState('experience', updated);
            return updated;
        });
    }, []);

    const updateExperience = useCallback((id: string, data: Partial<Experience>) => {
        setExperience((prev) => {
            const updated = prev.map((e) => (e.id === id ? { ...e, ...data } : e));
            saveState('experience', updated);
            return updated;
        });
    }, []);

    const deleteExperience = useCallback((id: string) => {
        setExperience((prev) => {
            const updated = prev.filter((e) => e.id !== id);
            saveState('experience', updated);
            return updated;
        });
    }, []);

    // Skills
    const addSkill = useCallback((data: Omit<Skill, 'id' | 'created_at'>) => {
        setSkills((prev) => {
            const newSkill: Skill = { ...data, id: generateId() } as Skill;
            const updated = [...prev, newSkill];
            saveState('skills', updated);
            return updated;
        });
    }, []);

    const updateSkill = useCallback((id: string, data: Partial<Skill>) => {
        setSkills((prev) => {
            const updated = prev.map((s) => (s.id === id ? { ...s, ...data } : s));
            saveState('skills', updated);
            return updated;
        });
    }, []);

    const deleteSkill = useCallback((id: string) => {
        setSkills((prev) => {
            const updated = prev.filter((s) => s.id !== id);
            saveState('skills', updated);
            return updated;
        });
    }, []);

    // Contact Links
    const addContactLink = useCallback((data: Omit<ContactLink, 'id'>) => {
        setContactLinks((prev) => {
            const newLink: ContactLink = { ...data, id: generateId() };
            const updated = [...prev, newLink];
            saveState('contactLinks', updated);
            return updated;
        });
    }, []);

    const updateContactLink = useCallback((id: string, data: Partial<ContactLink>) => {
        setContactLinks((prev) => {
            const updated = prev.map((l) => (l.id === id ? { ...l, ...data } : l));
            saveState('contactLinks', updated);
            return updated;
        });
    }, []);

    const deleteContactLink = useCallback((id: string) => {
        setContactLinks((prev) => {
            const updated = prev.filter((l) => l.id !== id);
            saveState('contactLinks', updated);
            return updated;
        });
    }, []);

    return (
        <AdminContext.Provider
            value={{
                isAuthenticated,
                login,
                logout,
                profile,
                updateProfile,
                projects,
                addProject,
                updateProject,
                deleteProject,
                experience,
                addExperience,
                updateExperience,
                deleteExperience,
                skills,
                addSkill,
                updateSkill,
                deleteSkill,
                contactLinks,
                addContactLink,
                updateContactLink,
                deleteContactLink,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}
