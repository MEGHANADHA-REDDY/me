import { useEffect, useRef } from "react";
import { Renderer } from "./Renderer";

interface Props {
    onInit?: (renderer: Renderer) => void;
    startAnimation?: boolean;
}

const RetroBackground = ({ onInit, startAnimation = true }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<Renderer | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const renderer = new Renderer(canvasRef.current);
        rendererRef.current = renderer;

        if (onInit) onInit(renderer);

        const handleResize = () => {
            if (canvasRef.current) {
                // DPR Clamp
                const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
                const w = window.innerWidth;
                const h = window.innerHeight;

                // Set display size (css pixels)
                canvasRef.current.style.width = `${w}px`;
                canvasRef.current.style.height = `${h}px`;

                // Set actual size in memory (scaled to account for extra pixel density)
                renderer.resize(w * dpr, h * dpr);

                // Normalize coordinate system to use CSS pixels
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) ctx.scale(dpr, dpr);

                // Re-call resize with CSS pixels for logic
                renderer.resize(w, h);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Init
        renderer.start();

        return () => {
            renderer.stop();
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Trigger entrance animation
    useEffect(() => {
        if (startAnimation && rendererRef.current) {
            rendererRef.current.playEntrance();
        }
    }, [startAnimation]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 w-full h-full"
        />
    );
};

export default RetroBackground;
