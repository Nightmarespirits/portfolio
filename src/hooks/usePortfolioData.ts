'use client';

import { useEffect, useState } from 'react';
import { sampleContactLinks, sampleExperience, sampleProfile, sampleProjects, sampleSiteTheme, sampleSkills } from '@/lib/data';
import { fetchPortfolioContent } from '@/lib/portfolio-client';
import { syncRemoteThemeSettings } from '@/lib/theme';
import { PortfolioContent } from '@/lib/types';

const emptyContent: PortfolioContent = {
    profile: sampleProfile,
    projects: sampleProjects,
    experience: sampleExperience,
    skills: sampleSkills,
    contactLinks: sampleContactLinks,
    siteTheme: sampleSiteTheme,
    stats: {
        yearsOfExperience: 0,
        projectCount: sampleProjects.length,
        techCount: sampleSkills.length,
        companyCount: new Set(sampleExperience.map((item) => item.company)).size,
    },
};

export function usePortfolioData() {
    const [content, setContent] = useState<PortfolioContent>(emptyContent);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadContent() {
            try {
                const nextContent = await fetchPortfolioContent();

                if (!cancelled) {
                    setContent(nextContent);
                    syncRemoteThemeSettings(nextContent.siteTheme, { animate: false });
                    setError(null);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'No se pudo cargar el contenido del portfolio.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    setMounted(true);
                }
            }
        }

        void loadContent();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        ...content,
        projects: content.projects.filter((project) => project.is_visible),
        experience: content.experience.filter((item) => item.is_visible),
        skills: content.skills.filter((skill) => skill.is_visible),
        contactLinks: content.contactLinks.filter((link) => link.is_visible),
        loading,
        error,
        mounted,
        isEmpty:
            !content.profile &&
            content.projects.length === 0 &&
            content.experience.length === 0 &&
            content.skills.length === 0 &&
            content.contactLinks.length === 0,
    };
}
