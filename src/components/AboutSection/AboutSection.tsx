import { useEffect, useRef } from 'react';
import { initAbout } from './about-section';
import config from './config-about';
import './styles.css';

interface AboutSectionProps {
    options?: any;
}

export default function AboutSection({ options = {} }: AboutSectionProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const merged = { ...config, ...options };
        let api: any = null;

        if (ref.current) {
            api = initAbout(ref.current, merged);
        }

        return () => {
            if (api && api.dispose) api.dispose();
        };
    }, [options]);

    return (
        <div className="relative w-full bg-[#0c0218]"> {/* Dark background to blend with hero bottom if needed, or transparent if hero covers it. User said "Seamless transition... after hero mountains". Usually hero is fixed/absolute. We need a background here. */}
            {/* Divider */}
            <div className="about-divider"></div>

            <div ref={ref} style={{ position: 'relative', width: '100%', zIndex: 5 }}></div>
        </div>
    );
}
