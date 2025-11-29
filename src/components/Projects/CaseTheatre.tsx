import { useEffect } from 'react';

interface CaseTheatreProps {
    project: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function CaseTheatre({ project, isOpen, onClose }: CaseTheatreProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!project) return null;
    console.log('CaseTheatre rendering project:', project);

    return (
        <div className={`pc-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="pc-modal-content" onClick={e => e.stopPropagation()}>
                <button className="pc-modal-close" onClick={onClose} aria-label="Close Case">
                    ✕
                </button>

                <img src={project.heroImage} alt={project.title} className="pc-modal-hero" />

                <div className="pc-modal-body">
                    <h2 className="pc-modal-title">{project.title}</h2>

                    <div className="pc-modal-meta">
                        <span>{project.year}</span>
                        <span>{project.role}</span>
                        <span>{project.category.join(', ')}</span>
                    </div>

                    <div className="pc-modal-actions">
                        <a href={project.links.demo} target="_blank" rel="noreferrer" className="pc-btn pc-btn-primary">
                            View Live
                        </a>
                        <a href={project.links.github} target="_blank" rel="noreferrer" className="pc-btn pc-btn-secondary">
                            GitHub
                        </a>
                    </div>

                    <p className="pc-modal-desc">{project.description}</p>
                </div>
            </div>
        </div>
    );
}
