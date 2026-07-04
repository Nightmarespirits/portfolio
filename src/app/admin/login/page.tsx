'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandMark from '@/components/shared/BrandMark';
import { useAdmin } from '@/lib/admin-context';

export default function LoginPage() {
    const { hasSupabase, isAuthenticated, authLoading, feedback, login } = useAdmin();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/admin');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const result = await login(email, password);

        if (result.ok) {
            router.push('/admin');
        }
    };

    return (
        <div className="login">
            <div className="login__card login__card--premium">
                <div className="login__ambient" aria-hidden="true" />

                <div className="login__brand">
                    <BrandMark size="md" />
                </div>

                <div>
                    <h1 className="login__title">Panel administrativo</h1>
                    <p className="login__subtitle">
                        Gestiona contenido real del sitio publicado en GitHub Pages desde Supabase.
                    </p>
                </div>

                {!hasSupabase && (
                    <div className="login__error">
                        Falta configurar las variables publicas de Supabase antes de poder iniciar sesion.
                    </div>
                )}

                {feedback.message && (
                    <div className={`login__notice login__notice--${feedback.tone}`}>
                        {feedback.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login__form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label form-label--required">
                            Correo electronico
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="tu@email.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label form-label--required">
                            Contrasena
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="********"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn btn--primary btn--full" disabled={!hasSupabase || authLoading}>
                        {authLoading ? 'Ingresando...' : 'Ingresar al CMS'}
                    </button>
                </form>
            </div>
        </div>
    );
}
