'use client';

import type { ReactNode } from 'react';
import { ArrowRight, EnvelopeSimple, GithubLogo, Globe, Link as LinkIcon, LinkedinLogo, TwitterLogo } from '@phosphor-icons/react';
import ModuleState from '@/components/public/ModuleState';
import { ContactLink, Profile } from '@/lib/types';

const iconMap: Record<string, ReactNode> = {
    github: <GithubLogo size={24} weight="regular" />,
    linkedin: <LinkedinLogo size={24} weight="regular" />,
    email: <EnvelopeSimple size={24} weight="regular" />,
    twitter: <TwitterLogo size={24} weight="regular" />,
    website: <Globe size={24} weight="regular" />,
    other: <LinkIcon size={24} weight="regular" />,
};

interface ContactModuleProps {
    contactLinks: ContactLink[];
    profile: Profile | null;
    loading: boolean;
    error: string | null;
}

export default function ContactModule({ contactLinks, profile, loading, error }: ContactModuleProps) {
    if (loading) {
        return <ModuleState title="Cargando contacto" message="Preparando conexiones publicas desde Supabase." />;
    }

    if (error) {
        return <ModuleState title="Contacto no disponible" message={error} tone="error" />;
    }

    if (contactLinks.length === 0) {
        return <ModuleState title="Sin conexiones publicadas" message="Agrega enlaces de contacto visibles para activar este modulo." />;
    }

    return (
        <div className="module">
            <div className="contact">
                <div className="contact__message">
                    <h2 className="contact__heading">Construyamos<br />algo juntos.</h2>
                    <p className="contact__subtext">
                        Si tienes un proyecto serio, una idea que requiere criterio tecnico o una oportunidad de colaboracion, aqui esta el canal directo.
                    </p>
                    {profile?.email && <p className="contact__subtext contact__subtext--mono">{profile.email}</p>}
                </div>

                <div className="contact__links stagger-children">
                    {contactLinks.map((link) => (
                        <a key={link.id} href={link.url} className="contact__link" target="_blank" rel="noopener noreferrer">
                            <div className="contact__link-icon" aria-hidden="true">{iconMap[link.icon] || <LinkIcon size={24} weight="regular" />}</div>
                            <div className="contact__link-info">
                                <span className="contact__link-label">{link.label}</span>
                                <span className="contact__link-url">{link.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}</span>
                            </div>
                            <span className="contact__link-arrow" aria-hidden="true"><ArrowRight size={16} /></span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
