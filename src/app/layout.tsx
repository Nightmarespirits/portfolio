import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '../styles/design-system.css';
import '../styles/theme-system.css';
import '../styles/animations.css';
import '../styles/spatial-nav.css';
import '../styles/modules.css';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'Portfolio - Ingeniero de Software y Disenador de Sistemas',
    description: 'Portafolio profesional. Ingeniero de Software especializado en arquitectura de sistemas, diseno de producto y experiencias digitales de alto nivel.',
    keywords: ['portafolio', 'ingeniero de software', 'desarrollador', 'arquitectura de sistemas', 'diseno de producto'],
    authors: [{ name: 'Portfolio' }],
    openGraph: {
        type: 'website',
        title: 'Portfolio - Ingeniero de Software',
        description: 'Portafolio profesional de ingenieria de software y diseno de sistemas.',
    },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="es" data-theme="dark" data-theme-preset="cobalt" data-theme-transition="idle" suppressHydrationWarning>
            <head>
                <meta name="color-scheme" content="dark light" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                try {
                  var mode = 'dark';
                  var preset = 'cobalt';
                  var raw = localStorage.getItem('portfolio-site-theme');

                  if (raw) {
                    var parsed = JSON.parse(raw);
                    if (parsed && (parsed.theme_mode === 'light' || parsed.theme_mode === 'dark')) {
                      mode = parsed.theme_mode;
                    }
                    if (parsed && (parsed.theme_preset === 'cobalt' || parsed.theme_preset === 'azure' || parsed.theme_preset === 'teal' || parsed.theme_preset === 'emerald')) {
                      preset = parsed.theme_preset;
                    }
                  } else {
                    var legacyMode = localStorage.getItem('portfolio-theme');
                    if (legacyMode === 'light' || legacyMode === 'dark') {
                      mode = legacyMode;
                    }
                  }

                  document.documentElement.setAttribute('data-theme', mode);
                  document.documentElement.setAttribute('data-theme-preset', preset);
                  document.documentElement.setAttribute('data-theme-transition', 'idle');
                } catch (e) {}
              })();
            `,
                    }}
                />
            </head>
            <body className={inter.variable}>{children}</body>
        </html>
    );
}
