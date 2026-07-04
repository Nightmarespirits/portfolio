import { ContactLink, Experience, PortfolioContent, PortfolioStats, Profile, Project, SiteThemeSettings, Skill } from '@/lib/types';
import { getStoragePublicUrl, supabase } from '@/lib/supabase';
import { DEFAULT_SITE_THEME, normalizeSiteThemeSettings } from '@/lib/theme';

function ensureClient() {
    if (!supabase) {
        throw new Error('Supabase no esta configurado. Revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }

    return supabase;
}

function normalizeProfile(profile: Profile | null): Profile | null {
    if (!profile) {
        return null;
    }

    return {
        ...profile,
        avatar_url: profile.avatar_url || getStoragePublicUrl(profile.avatar_storage_path) || null,
        cv_url: profile.cv_url || getStoragePublicUrl(profile.cv_storage_path) || null,
    };
}

function normalizeProjects(projects: Project[]) {
    return projects.map((project) => ({
        ...project,
        image_url: project.image_url || getStoragePublicUrl(project.image_storage_path) || null,
    }));
}

function normalizeSiteTheme(siteTheme: SiteThemeSettings | null) {
    return normalizeSiteThemeSettings(siteTheme || DEFAULT_SITE_THEME);
}

export function computePortfolioStats(experience: Experience[], projects: Project[], skills: Skill[]): PortfolioStats {
    const visibleProjects = projects.filter((project) => project.is_visible);
    const visibleExperience = experience.filter((item) => item.is_visible);
    const visibleSkills = skills.filter((skill) => skill.is_visible);

    const firstExperienceDate = visibleExperience
        .map((item) => item.start_date)
        .filter((date): date is string => Boolean(date))
        .sort()[0];

    const yearsOfExperience = firstExperienceDate
        ? Math.max(1, new Date().getFullYear() - new Date(firstExperienceDate).getFullYear())
        : 0;

    const techSet = new Set<string>();
    visibleProjects.forEach((project) => project.tech_stack.forEach((tech) => techSet.add(tech)));
    visibleExperience.forEach((item) => item.tech_used.forEach((tech) => techSet.add(tech)));
    visibleSkills.forEach((skill) => techSet.add(skill.name));

    return {
        yearsOfExperience,
        projectCount: visibleProjects.length,
        techCount: techSet.size,
        companyCount: new Set(visibleExperience.map((item) => item.company)).size,
    };
}

export async function fetchPortfolioContent(): Promise<PortfolioContent> {
    const client = ensureClient();

    const [profileRes, projectsRes, experienceRes, skillsRes, contactRes, siteThemeRes] = await Promise.all([
        client.from('profiles').select('*').limit(1).maybeSingle(),
        client.from('projects').select('*').order('sort_order', { ascending: true }),
        client.from('experience').select('*').order('sort_order', { ascending: true }),
        client.from('skills').select('*').order('sort_order', { ascending: true }),
        client.from('contact_links').select('*').order('sort_order', { ascending: true }),
        client.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    ]);

    const responses = [profileRes, projectsRes, experienceRes, skillsRes, contactRes, siteThemeRes];
    const failed = responses.find((response) => response.error && response.error.code !== 'PGRST116');

    if (failed?.error) {
        throw new Error(failed.error.message || 'No se pudo sincronizar el contenido con Supabase.');
    }

    const profile = normalizeProfile((profileRes.data as Profile | null) || null);
    const projects = normalizeProjects((projectsRes.data as Project[] | null) || []);
    const experience = (experienceRes.data as Experience[] | null) || [];
    const skills = (skillsRes.data as Skill[] | null) || [];
    const contactLinks = (contactRes.data as ContactLink[] | null) || [];
    const siteTheme = normalizeSiteTheme((siteThemeRes.data as SiteThemeSettings | null) || null);

    return {
        profile,
        projects,
        experience,
        skills,
        contactLinks,
        siteTheme,
        stats: computePortfolioStats(experience, projects, skills),
    };
}

function upsertNamedMetaTag(name: string, content: string) {
    let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
}

function upsertPropertyMetaTag(property: string, content: string) {
    let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
}

export function applyRuntimeSeo(profile: Profile | null) {
    if (!profile) {
        return;
    }

    if (profile.seo_title) {
        document.title = profile.seo_title;
        upsertPropertyMetaTag('og:title', profile.seo_title);
    }

    if (profile.seo_description) {
        upsertNamedMetaTag('description', profile.seo_description);
        upsertPropertyMetaTag('og:description', profile.seo_description);
    }

    if (profile.seo_keywords) {
        upsertNamedMetaTag('keywords', profile.seo_keywords);
    }
}
