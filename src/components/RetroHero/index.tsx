import { useEffect, useRef } from "react";
import { heroLogic } from "./HeroLogic";
import "./styles.css";

interface RetroHeroProps {
    renderer: any; // The Renderer instance
}

const RetroHero = ({ renderer }: RetroHeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && renderer) {
            heroLogic.init(containerRef.current, renderer);
        }
        return () => {
            heroLogic.dispose();
        };
    }, [renderer]);

    return (
        <div ref={containerRef} className="hero-text">
            <h1 className="hero-title">
                Full Stack Developer — Crafting Modern Web Experiences
            </h1>
            <p className="hero-subtitle">
                I build clean, fast, scalable apps using React, Node.js, and modern cloud tools.
            </p>

            <div className="hero-actions">
                <a href="#contact" className="hero-btn hero-btn-primary">
                    Work with me
                </a>
                <a href="#projects" className="hero-btn hero-btn-secondary">
                    View Projects
                </a>
            </div>

            <div className="hero-scroll-hint">
                <span>Scroll ↓</span>
            </div>
        </div>
    );
};

export default RetroHero;
