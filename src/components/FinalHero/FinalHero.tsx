import { useEffect, useRef } from 'react';
import config from './config';
import { initHero, disposeHero } from './hero-overlay';
import './styles.css';

interface FinalHeroProps {
    options?: any;
    renderer?: any;
    startAnimation?: boolean;
}

export default function FinalHero({ options = {}, startAnimation = true }: FinalHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<any>(null);

    useEffect(() => {
        const merged = { ...config, ...options, autoPlay: false }; // Disable autoPlay

        if (containerRef.current) {
            apiRef.current = initHero(containerRef.current, merged);
        }

        return () => {
            if (apiRef.current && typeof apiRef.current.dispose === 'function') {
                apiRef.current.dispose();
            } else {
                disposeHero();
            }
        };
    }, [options]);

    // Trigger animation when startAnimation becomes true
    useEffect(() => {
        if (startAnimation && apiRef.current) {
            apiRef.current.playEntrance();
        }
    }, [startAnimation]);

    return (
        <>
            <div id="final-hero-root" ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
                {/* hero-overlay.js must populate this container with DOM and canvas elements */}
            </div>
            {/* Accessible offscreen copy of the quote */}
            <span style={{ position: 'absolute', left: -9999, top: 'auto' }} aria-hidden="false">
                {config.rightElements.quoteText}
            </span>
        </>
    );
}
