'use client';

import { useState, useEffect } from 'react';
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

// Reads admin-persisted data from localStorage, falling back to sample data (used for admin session or offline support if needed)
function loadLocalData<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const stored = localStorage.getItem(`admin_${key}`);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
}

export function usePortfolioData() {
    // Initial state set to Fallback/Local storage data
    const [profile, setProfile] = useState<Profile>(sampleProfile);
    const [projects, setProjects] = useState<Project[]>(sampleProjects);
    const [experience, setExperience] = useState<Experience[]>(sampleExperience);
    const [skills, setSkills] = useState<Skill[]>(sampleSkills);
    const [contactLinks, setContactLinks] = useState<ContactLink[]>(sampleContactLinks);

    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Asynchronous function to fetch data from Supabase, or fallback to local
        async function fetchPortfolioData() {
            try {
                // If Supabase is not configured yet, fallback immediately
                if (!supabase) {
                    console.log('Supabase no está configurado. Usando datos de fallback.');
                    throw new Error('Supabase Client not initialized');
                }

                // Try fetching all data in parallel
                const [
                    profileRes,
                    projectsRes,
                    expRes,
                    skillsRes,
                    linksRes
                ] = await Promise.all([
                    supabase.from('profiles').select('*').limit(1).single(),
                    supabase.from('projects').select('*').order('sort_order', { ascending: true }),
                    supabase.from('experience').select('*').order('sort_order', { ascending: true }),
                    supabase.from('skills').select('*').order('sort_order', { ascending: true }),
                    supabase.from('contact_links').select('*').order('sort_order', { ascending: true })
                ]);

                // Check for generic connection errors
                if (profileRes.error?.code === 'PGRST116' && profileRes.data === null) {
                    // PGRST116 is "No rows returned", meaning table exists but no data yet. Normal condition if DB is fresh.
                } else if (profileRes.error || projectsRes.error || expRes.error || skillsRes.error || linksRes.error) {
                    // Other errors indicating DB might be paused or inaccessible
                    throw new Error('Error al conectar con Supabase o proyecto inactivo.');
                }

                // Set Data from Supabase if it exists, otherwise use Fallback from local
                if (profileRes.data) {
                    setProfile(profileRes.data as Profile);
                } else {
                    setProfile(loadLocalData('profile', sampleProfile));
                }

                if (projectsRes.data && projectsRes.data.length > 0) {
                    setProjects(projectsRes.data as Project[]);
                } else {
                    setProjects(loadLocalData('projects', sampleProjects));
                }

                if (expRes.data && expRes.data.length > 0) {
                    setExperience(expRes.data as Experience[]);
                } else {
                    setExperience(loadLocalData('experience', sampleExperience));
                }

                if (skillsRes.data && skillsRes.data.length > 0) {
                    setSkills(skillsRes.data as Skill[]);
                } else {
                    setSkills(loadLocalData('skills', sampleSkills));
                }

                if (linksRes.data && linksRes.data.length > 0) {
                    setContactLinks(linksRes.data as ContactLink[]);
                } else {
                    setContactLinks(loadLocalData('contactLinks', sampleContactLinks));
                }

            } catch (err) {
                // FALLBACK: When Supabase fails or is inactive, load local/sample data
                console.log('Haciendo fallback a datos locales/estáticos:', err);
                setProfile(loadLocalData('profile', sampleProfile));
                setProjects(loadLocalData('projects', sampleProjects));
                setExperience(loadLocalData('experience', sampleExperience));
                setSkills(loadLocalData('skills', sampleSkills));
                setContactLinks(loadLocalData('contactLinks', sampleContactLinks));
            } finally {
                setLoading(false);
                setMounted(true);
            }
        }

        fetchPortfolioData();
    }, []);

    return {
        profile,
        projects: projects.filter((p) => p.is_visible),
        experience: experience.filter((e) => e.is_visible),
        skills: skills.filter((s) => s.is_visible),
        contactLinks: contactLinks.filter((l) => l.is_visible),
        mounted,
        loading
    };
}
