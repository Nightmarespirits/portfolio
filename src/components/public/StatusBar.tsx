'use client';

export default function StatusBar() {
    const year = new Date().getFullYear();

    return (
        <footer className="status-bar" role="contentinfo">
            <div className="status-bar__left">
                <span className="status-bar__indicator" aria-hidden="true" />
                <span>Sistema activo</span>
            </div>
            <div className="status-bar__right">
                <span>© {year}</span>
                <span>·</span>
                <span>Diseñado con criterio</span>
            </div>
        </footer>
    );
}
