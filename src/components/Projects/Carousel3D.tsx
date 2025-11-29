import { useEffect, useRef, useState } from 'react';
import { Carousel3D } from '../../carousel-3d';
import { CAROUSEL_CONFIG } from '../../config-carousel';
import sampleProjects from '../../assets/sample-projects.json';
import CaseTheatre from './CaseTheatre'; // Reuse existing modal
import '../../carousel-3d.css';
import './projects-carousel.css';

export default function Carousel3DWrapper() {
    const containerRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<Carousel3D | null>(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (containerRef.current && !carouselRef.current) {
            const instance = new Carousel3D(containerRef.current, sampleProjects, CAROUSEL_CONFIG);

            instance.onFaceClick = (index) => {
                console.log('Face clicked:', index, sampleProjects[index]);
                setSelectedProject(sampleProjects[index]);
                setIsModalOpen(true);
            };

            carouselRef.current = instance;
        }

        return () => {
            if (carouselRef.current) {
                carouselRef.current.dispose();
                carouselRef.current = null;
            }
        };
    }, []);

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
            <h2 className="absolute top-10 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-300 z-10">
                Selected Projects
            </h2>

            <div ref={containerRef} className="w-full h-[600px] relative z-0" />

            <CaseTheatre
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
