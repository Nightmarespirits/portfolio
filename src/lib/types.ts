export interface Profile {
    id: string;
    name: string;
    title: string;
    bio: string;
    location: string | null;
    email: string | null;
    avatar_url: string | null;
    avatar_storage_path: string | null;
    cv_url: string | null;
    cv_storage_path: string | null;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
    created_at: string;
    updated_at: string;
}

export interface ContactLink {
    id: string;
    label: string;
    url: string;
    icon: string;
    sort_order: number;
    is_visible: boolean;
    created_at: string;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    long_description: string | null;
    tech_stack: string[];
    image_url: string | null;
    image_storage_path: string | null;
    live_url: string | null;
    repo_url: string | null;
    sort_order: number;
    is_visible: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    description: string;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    tech_used: string[];
    sort_order: number;
    is_visible: boolean;
    created_at: string;
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    proficiency: number;
    sort_order: number;
    is_visible: boolean;
    created_at: string;
}

export type ThemeMode = 'light' | 'dark';

export type ThemePresetId = 'cobalt' | 'azure' | 'teal' | 'emerald';

export interface SiteThemeSettings {
    id: number;
    theme_mode: ThemeMode;
    theme_preset: ThemePresetId;
    updated_at: string;
}

export interface PortfolioStats {
    yearsOfExperience: number;
    projectCount: number;
    techCount: number;
    companyCount: number;
}

export interface PortfolioContent {
    profile: Profile | null;
    projects: Project[];
    experience: Experience[];
    skills: Skill[];
    contactLinks: ContactLink[];
    siteTheme: SiteThemeSettings;
    stats: PortfolioStats;
}

export type NodeId = 'about' | 'projects' | 'experience' | 'skills' | 'contact';

export interface NavNode {
    id: NodeId;
    label: string;
    sublabel: string;
    gridArea: string;
}

export type UploadKind = 'avatar' | 'cv' | 'project-image';
