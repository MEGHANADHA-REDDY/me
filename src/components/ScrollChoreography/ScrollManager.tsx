import { useEffect, useRef } from 'react';
import { initScrollChoreography } from './scroll-choreography';
import './styles.css';

interface ScrollManagerProps {
    children: React.ReactNode;
    renderer?: any;
}

export default function ScrollManager({ children, renderer }: ScrollManagerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let engine: any = null;

        if (containerRef.current && contentRef.current) {
            // Small timeout to ensure DOM is ready/layout is settled
            setTimeout(() => {
                if (containerRef.current && contentRef.current) {
                    engine = initScrollChoreography(containerRef.current, contentRef.current, renderer);
                }
            }, 100);
        }

        return () => {
            if (engine) engine.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="sc-container">
            <div ref={contentRef} className="sc-content">
                {children}
            </div>
        </div>
    );
}
