import React, { useRef, useState } from 'react';

interface ProjectPlateProps {
    project: any;
    isActive: boolean;
    onClick: () => void;
    style?: React.CSSProperties;
}

export default function ProjectPlate({ project, isActive, onClick, style }: ProjectPlateProps) {
    const plateRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!plateRef.current || !isActive) return;

        const rect = plateRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg tilt
        const rotateY = ((x - centerX) / centerX) * 10;

        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <div
            ref={plateRef}
            className={`pc-plate ${isActive ? 'active' : ''}`}
            style={{
                ...style,
                transform: `${style?.transform || ''} perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <img src={project.heroImage} alt={project.title} className="pc-plate-image" />
            <div className="pc-plate-overlay">
                <h3 className="pc-plate-title">{project.title}</h3>
                <p className="pc-plate-lede">{project.subtitle}</p>
                <div className="pc-plate-tags">
                    {project.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="pc-tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
