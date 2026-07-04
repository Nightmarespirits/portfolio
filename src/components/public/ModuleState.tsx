'use client';

interface ModuleStateProps {
    title: string;
    message: string;
    tone?: 'info' | 'error';
}

export default function ModuleState({ title, message, tone = 'info' }: ModuleStateProps) {
    return (
        <div className={`module-state module-state--${tone}`}>
            <div className="module-state__title">{title}</div>
            <p className="module-state__message">{message}</p>
        </div>
    );
}
