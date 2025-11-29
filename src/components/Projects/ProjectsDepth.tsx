import { useEffect, useRef, useState } from 'react';
import { ProjectsDepthStage } from '../../projects-depth';
import './projects-depth.css';
import sampleProjects from '../../assets/sample-projects.json';
import MobileProjectsCarousel from './MobileProjectsCarousel';

export default function ProjectsDepth() {
    const trackRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<ProjectsDepthStage | null>(null);
    const [activeProject, setActiveProject] = useState<any>(null);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize 3D Stage
        const stage = new ProjectsDepthStage(
            containerRef.current,
            sampleProjects,
            (project) => {
                setActiveProject(project);
                setIsOverlayOpen(true);
            }
        );
        stageRef.current = stage;

        return () => {
            stage.dispose();
        };
    }, []);

    useEffect(() => {
        let rafId: number;

        const update = () => {
            if (!trackRef.current || !stickyRef.current || !stageRef.current) {
                rafId = requestAnimationFrame(update);
                return;
            }

            // Disable manual pinning on mobile to prevent shaking and allow natural flow
            if (window.innerWidth <= 768) {
                rafId = requestAnimationFrame(update);
                return;
            }

            const rect = trackRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionHeight = rect.height;

            // 1. Calculate Progress
            // We want progress 0 when top of section hits top of viewport
            // And progress 1 when bottom of section hits bottom of viewport
            const scrollableDistance = sectionHeight - viewportHeight;
            const scrolled = -rect.top;

            let progress = 0;
            if (scrollableDistance > 0) {
                progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
            }

            stageRef.current.setScrollProgress(progress);

            // 2. Manual Pinning
            // Since standard position: sticky doesn't work with the smooth scroll transform,
            // we manually translate the content to keep it in view.

            if (rect.top <= 0 && rect.bottom >= viewportHeight) {
                // We are inside the section: Pin it to top
                // We use transform to counteract the scroll
                stickyRef.current.style.transform = `translate3d(0, ${Math.abs(rect.top)}px, 0)`;
            } else if (rect.top > 0) {
                // We are above the section: Reset
                stickyRef.current.style.transform = 'translate3d(0, 0, 0)';
            } else {
                // We are below the section: Pin to bottom of track
                // (This ensures it scrolls away naturally when we pass the end)
                stickyRef.current.style.transform = `translate3d(0, ${sectionHeight - viewportHeight}px, 0)`;
            }

            rafId = requestAnimationFrame(update);
        };

        rafId = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, []);

    const handleCloseOverlay = () => {
        setIsOverlayOpen(false);
        // Delay clearing project to allow exit animation
        setTimeout(() => setActiveProject(null), 500);

        // Reset camera in 3D scene
        if (stageRef.current) {
            stageRef.current.resetCamera();
        }
    };

    return (
        // Tall track container for scroll distance
        // Tall track container for scroll distance
        <div ref={trackRef} className="pd-track" style={{ height: '300vh', position: 'relative' }}>

            {/* Sticky Container */}
            <div
                ref={stickyRef}
                className="pd-sticky-wrapper"
                style={{
                    position: 'relative', // We manipulate this manually
                    height: '100vh',
                    width: '100%',
                    overflow: 'hidden',
                    willChange: 'transform'
                }}
            >

                <div className="pd-container">
                    {/* Section Header */}
                    <div className="pd-header">
                        <h2 className="pd-title">Projects</h2>
                        <p className="pd-subtitle">Cinematic Depth Stage</p>
                    </div>

                    {/* 3D Scene Container */}
                    <div ref={containerRef} className="pd-canvas-wrapper" />

                    {/* Mobile Fallback (Visible only on small screens via CSS) */}
                    <div className="pd-mobile-fallback">
                        <MobileProjectsCarousel onSelect={(project) => {
                            setActiveProject(project);
                            setIsOverlayOpen(true);
                        }} />
                    </div>

                    {/* Case Theatre Overlay */}
                    <div className={`pd-overlay ${isOverlayOpen ? 'active' : ''}`}>
                        <div className="pd-overlay-backdrop" onClick={handleCloseOverlay} />

                        <div className="pd-case-panel">
                            <button className="pd-close-btn" onClick={handleCloseOverlay}>✕</button>

                            {activeProject && (
                                <>
                                    <div className="pd-case-header">
                                        <img src={activeProject.heroImage} alt={activeProject.title} className="pd-case-hero-img" />
                                    </div>

                                    <div className="pd-case-body">
                                        <h2 className="pd-case-title">{activeProject.title}</h2>
                                        <p className="pd-case-tagline">{activeProject.subtitle}</p>

                                        <div className="pd-tech-stack">
                                            {activeProject.tags.map((tag: string) => (
                                                <span key={tag} className="pd-tech-badge">{tag}</span>
                                            ))}
                                        </div>

                                        <p className="pd-case-desc">{activeProject.description}</p>

                                        <div className="pd-case-actions">
                                            <a href={activeProject.links.demo} target="_blank" rel="noreferrer" className="pd-action-btn pd-btn-primary">
                                                View Live
                                            </a>
                                            <a href={activeProject.links.github} target="_blank" rel="noreferrer" className="pd-action-btn pd-btn-secondary">
                                                GitHub
                                            </a>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
