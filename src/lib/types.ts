// ─── Core Data Types ───────────────────────────────────────────

export interface Profile {
    id: string;
    name: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    avatar_url: string;
    cv_url: string;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    updated_at: string;
}

export interface ContactLink {
    id: string;
    label: string;
    url: string;
    icon: string;
    sort_order: number;
    is_visible: boolean;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    long_description: string;
    tech_stack: string[];
    image_url: string;
    live_url: string;
    repo_url: string;
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
    start_date: string;
    end_date: string | null;
    location: string;
    tech_used: string[];
    sort_order: number;
    is_visible: boolean;
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    proficiency: number;
    sort_order: number;
    is_visible: boolean;
}

// ─── Navigation Types ──────────────────────────────────────────

export type NodeId = 'about' | 'projects' | 'experience' | 'skills' | 'contact';

export interface NavNode {
    id: NodeId;
    label: string;
    sublabel: string;
    gridArea: string;
}

// ─── Theme ─────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';
