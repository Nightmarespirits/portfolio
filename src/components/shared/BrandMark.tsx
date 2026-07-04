'use client';

import type { CSSProperties } from 'react';
import { SITE_BASE_PATH } from '@/lib/site-config';

type BrandMarkProps = {
    className?: string;
    label?: string;
    logoClassName?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
};

function joinClassNames(...values: Array<string | false | null | undefined>) {
    return values.filter(Boolean).join(' ');
}

export default function BrandMark({
    className,
    label = '', // Default label is an empty string
    logoClassName,
    showLabel = true,
    size = 'md',
}: BrandMarkProps) {
    const style = {
        '--brandmark-mask-url': `url(${SITE_BASE_PATH}/brandmark-mask.png)`,
    } as CSSProperties;

    return (
        <div className={joinClassNames('brandmark', `brandmark--${size}`, className)} style={style}>
            <span className={joinClassNames('brandmark__glyph', logoClassName)} aria-hidden="true">
                <span className="brandmark__glow" />
                <span className="brandmark__fill" />
                <span className="brandmark__shine" />
            </span>
            {showLabel ? <span className="brandmark__label">{label}</span> : null}
        </div>
    );
}
