'use client';

import { usePortfolioData } from '@/hooks/usePortfolioData';
import { GithubLogo, LinkedinLogo, EnvelopeSimple, TwitterLogo, Globe, Link as LinkIcon, ArrowRight } from '@phosphor-icons/react';

const iconMap: Record<string, React.ReactNode> = {
    github: <GithubLogo size={24} weight="regular" />,
    linkedin: <LinkedinLogo size={24} weight="regular" />,
    email: <EnvelopeSimple size={24} weight="regular" />,
    twitter: <TwitterLogo size={24} weight="regular" />,
    website: <Globe size={24} weight="regular" />,
    other: <LinkIcon size={24} weight="regular" />,
};

export default function ContactModule() {
    const { contactLinks, profile } = usePortfolioData();

    return (
        <div className="module">
            <div className="contact">
                <div className="contact__message">
                    <h2 className="contact__heading">
                        Construyamos<br />algo juntos.
                    </h2>
                    <p className="contact__subtext">
                        Si tienes un proyecto interesante, una idea que necesita arquitectura,
                        o simplemente quieres conectar — estoy disponible.
                    </p>
                    <p className="contact__subtext" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                        {profile.email}
                    </p>
                </div>

                <div className="contact__links stagger-children">
                    {contactLinks.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            className="contact__link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="contact__link-icon" aria-hidden="true">
                                {iconMap[link.icon] || '◇'}
                            </div>
                            <div className="contact__link-info">
                                <span className="contact__link-label">{link.label}</span>
                                <span className="contact__link-url">{link.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}</span>
                            </div>
                            <span className="contact__link-arrow" aria-hidden="true">→</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
