import React, { useEffect, useRef } from 'react';
import './global-bg.css';

export default function GlobalBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Generate Particles
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'gb-particle';
            const size = Math.random() * 2 + 1;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100}%`;
            p.style.animationDuration = `${Math.random() * 20 + 10}s`;
            p.style.animationDelay = `${Math.random() * 10}s`;
            container.appendChild(p);
        }

        return () => {
            container.innerHTML = '';
        };
    }, []);

    return (
        <div className="gb-wrapper">
            <div className="gb-nebula-fog"></div>
            <div className="gb-grid-lines"></div>
            <div className="gb-horizon-glow"></div>
            <div ref={containerRef} className="gb-particles-container"></div>
        </div>
    );
}
