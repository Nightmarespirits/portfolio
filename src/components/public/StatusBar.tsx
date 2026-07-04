'use client';

interface StatusBarProps {
    statusLabel: string;
    statusTone?: 'ok' | 'warn';
    trailingLabel: string;
}

export default function StatusBar({ statusLabel, statusTone = 'ok', trailingLabel }: StatusBarProps) {
    const year = new Date().getFullYear();

    return (
        <footer className="status-bar" role="contentinfo">
            <div className="status-bar__left">
                <span className={`status-bar__indicator status-bar__indicator--${statusTone}`} aria-hidden="true" />
                <span>{statusLabel}</span>
            </div>
            <div className="status-bar__right">
                <span>(c) {year}</span>
                <span>.</span>
                <span>{trailingLabel}</span>
            </div>
        </footer>
    );
}
