import { useEffect, useRef } from 'react';
import { initAboutLarge } from './about-large';
import config from './config-about-large';
import './styles.css';

interface AboutLargeProps {
    options?: any;
}

export default function AboutLarge({ options = {} }: AboutLargeProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const merged = { ...config, ...options };
        let api: any = null;

        if (ref.current) {
            api = initAboutLarge(ref.current, merged);
        }

        return () => {
            if (api && api.dispose) api.dispose();
        };
    }, [options]);

    return (
        <div className="relative w-full">
            <div ref={ref} style={{ position: 'relative', width: '100%', zIndex: 5 }}></div>
        </div>
    );
}
