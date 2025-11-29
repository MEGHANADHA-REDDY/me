import React, { useEffect, useRef, useState } from 'react';
import './mobile-carousel.css';
import sampleProjects from '../../assets/sample-projects.json';

interface MobileProjectsCarouselProps {
    onSelect: (project: any) => void;
}

const MobileProjectsCarousel: React.FC<MobileProjectsCarouselProps> = ({ onSelect }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const ulRef = useRef<HTMLUListElement>(null);
    const rotate = -360 / sampleProjects.length;

    useEffect(() => {
        if (ulRef.current) {
            ulRef.current.style.setProperty("--rotateDegrees", rotate.toString());
            adjustDay(0);
        }
    }, []);

    const adjustDay = (nr: number) => {
        let newIndex = activeIndex + nr;
        // Handle wrap around logic manually if needed, but the CSS calc handles rotation.
        // However, we need a bounded index for the active class logic.
        
        // Update state for next render
        setActiveIndex(prev => {
            const nextIndex = prev + nr;
            if (ulRef.current) {
                ulRef.current.style.setProperty("--currentDay", nextIndex.toString());
            }
            return nextIndex;
        });
    };

    // Calculate the effective index for highlighting (modulo)
    const getEffectiveIndex = (idx: number) => {
        const len = sampleProjects.length;
        return ((idx % len) + len) % len;
    };

    const effectiveActiveIndex = getEffectiveIndex(activeIndex);

    return (
        <div className="mpc-wrapper">
            <div className="mpc-container">
                <ul ref={ulRef} className="mpc-list">
                    {sampleProjects.map((project, idx) => {
                        const isActive = idx === effectiveActiveIndex;
                        return (
                            <li 
                                key={project.id} 
                                className={`mpc-item ${isActive ? 'active' : ''}`}
                                style={{ "--day_idx": idx } as React.CSSProperties}
                                onClick={() => onSelect(project)}
                            >
                                <div className="mpc-card-content">
                                    <span className="mpc-number">0{idx + 1}</span>
                                    <span className="mpc-title">{project.title}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <div className="mpc-controls">
                    <button onClick={() => adjustDay(-1)}>▲</button>
                    <button onClick={() => adjustDay(1)}>▼</button>
                </div>
                <div className="mpc-border"></div>
            </div>
        </div>
    );
};

export default MobileProjectsCarousel;
