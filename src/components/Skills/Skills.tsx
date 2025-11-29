import { useEffect, useRef } from 'react';
import { initSkillsOrbit } from './skills-orbit';
import './styles.css';

export default function Skills() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let api: any = null;

        if (ref.current) {
            api = initSkillsOrbit(ref.current);
        }

        return () => {
            if (api && api.dispose) api.dispose();
        };
    }, []);

    return (
        <div className="relative w-full">
            <div ref={ref} style={{ position: 'relative', width: '100%', zIndex: 5 }}></div>
        </div>
    );
}
