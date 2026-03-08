'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/admin-context';

export default function LoginPage() {
    const { login } = useAdmin();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                router.push('/admin');
            } else {
                setError('Credenciales incorrectas. Intenta de nuevo.');
            }
        } catch {
            setError('Error al iniciar sesión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login__card">
                <div className="login__brand">
                    <span className="login__brand-dot" />
                    <span className="login__brand-name">Portfolio</span>
                </div>

                <div>
                    <h1 className="login__title">Panel de Control</h1>
                    <p className="login__subtitle">Ingresa tus credenciales para acceder</p>
                </div>

                {error && <div className="login__error">{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label form-label--required">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label form-label--required">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn--primary btn--full"
                        disabled={loading}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

            </div>
        </div>
    );
}
