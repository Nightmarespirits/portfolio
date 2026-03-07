import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/design-system.css";
import "../styles/animations.css";
import "../styles/spatial-nav.css";
import "../styles/modules.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio — Ingeniero de Software & Diseñador de Sistemas",
  description:
    "Portafolio profesional. Ingeniero de Software especializado en arquitectura de sistemas, diseño de producto y experiencias digitales de alto nivel.",
  keywords: ["portafolio", "ingeniero de software", "desarrollador", "arquitectura de sistemas", "diseño de producto"],
  authors: [{ name: "Portfolio" }],
  openGraph: {
    type: "website",
    title: "Portfolio — Ingeniero de Software",
    description: "Portafolio profesional de ingeniería de software y diseño de sistemas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('portfolio-theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
