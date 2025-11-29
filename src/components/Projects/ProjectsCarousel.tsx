import React, { useState, useRef, useEffect } from 'react';
import { PROJECTS_CONFIG } from './config-projects';
import ProjectPlate from './ProjectPlate';
import CaseTheatre from './CaseTheatre';
import './projects-carousel.css';

export default function ProjectsCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const [dragStart, setDragStart] = useState<number | null>(null);

    // Filter Projects
    const filteredProjects = PROJECTS_CONFIG.projects.filter(p =>
        filter === 'all' || p.category.includes(filter)
    );

    // Ensure active index is valid after filter change
    useEffect(() => {
        setActiveIndex(0);
    }, [filter]);

    // Navigation
    const next = () => setActiveIndex(prev => (prev + 1) % filteredProjects.length);
    const prev = () => setActiveIndex(prev => (prev - 1 + filteredProjects.length) % filteredProjects.length);

    // Keyboard Nav
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (isModalOpen) return;
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isModalOpen, filteredProjects.length]);

    // Gestures
    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        setDragStart(x);
    };

    const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
        if (dragStart === null) return;
        const x = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
        const diff = dragStart - x;

        if (Math.abs(diff) > 50) {
            if (diff > 0) next();
            else prev();
        }
        setDragStart(null);
    };

    // Orbital Layout Calculation
    const getPlateStyle = (index: number) => {
        const diff = index - activeIndex;
        // Handle wrap-around for visual continuity (optional, keeping simple for now)

        // Calculate visual position
        const isActive = diff === 0;
        const xOffset = diff * 65; // 65% width spacing
        const scale = isActive ? 1 : 0.85;
        const opacity = isActive ? 1 : 0.5;
        const zIndex = isActive ? 10 : 10 - Math.abs(diff);
        const blur = isActive ? 0 : 4;

        // Hide items too far away
        if (Math.abs(diff) > 2) return { display: 'none' };

        return {
            transform: `translateX(${xOffset}vw) scale(${scale}) translateZ(${isActive ? 0 : -100}px)`,
            opacity,
            zIndex,
            filter: `blur(${blur}px)`,
        };
    };

    return (
        <div className="pc-container">
            <div className="pc-header">
                <h2 className="pc-title">Selected Projects</h2>
                <p className="pc-subtitle">A curated set of products, experiments, and tools.</p>

                <div className="pc-filters">
                    {PROJECTS_CONFIG.categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`pc-filter-chip ${filter === cat.id ? 'active' : ''}`}
                            onClick={() => setFilter(cat.id)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div
                className="pc-carousel-track"
                ref={trackRef}
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {filteredProjects.map((project, index) => (
                    <ProjectPlate
                        key={project.id}
                        project={project}
                        isActive={index === activeIndex}
                        onClick={() => {
                            if (index === activeIndex) setIsModalOpen(true);
                            else setActiveIndex(index);
                        }}
                        style={getPlateStyle(index)}
                    />
                ))}
            </div>

            {/* Nav Buttons */}
            <button className="pc-nav-btn pc-prev" onClick={prev} aria-label="Previous Project">←</button>
            <button className="pc-nav-btn pc-next" onClick={next} aria-label="Next Project">→</button>

            <CaseTheatre
                project={filteredProjects[activeIndex]}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
