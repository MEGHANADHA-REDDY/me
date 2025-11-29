import React, { useEffect, useRef } from 'react';
import { initScrollSmooth } from './scroll-smooth';
import './styles.css';

interface ScrollSmoothManagerProps {
    children: React.ReactNode;
    renderer?: any;
}

export default function ScrollSmoothManager({ children, renderer }: ScrollSmoothManagerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let engine: any = null;

        if (containerRef.current && contentRef.current) {
            // Small timeout to ensure DOM is ready/layout is settled
            setTimeout(() => {
                if (containerRef.current && contentRef.current) {
                    engine = initScrollSmooth(containerRef.current, contentRef.current, renderer);
                }
            }, 100);
        }

        return () => {
            if (engine) engine.dispose();
        };
    }, [renderer]);

    return (
        <div ref={containerRef} className="ss-container">
            <div ref={contentRef} className="ss-content">
                {children}
            </div>

            {/* Seam Hiding Masks */}
            <div className="ss-mask-top" />
            <div className="ss-mask-bottom" />
        </div>
    );
}
