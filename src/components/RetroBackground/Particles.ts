import { CONFIG } from "./Config";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedY: number;
    opacity: number;
}

export class Particles {
    private particles: Particle[] = [];
    private width: number = 0;
    private height: number = 0;

    constructor() {
        // Initialize pool
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: 0,
                y: 0,
                size: 0,
                speedY: 0,
                opacity: 0,
            });
        }
    }

    resize(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.particles.forEach(p => this.reset(p));
    }

    private reset(p: Particle) {
        p.x = Math.random() * this.width;
        p.y = Math.random() * this.height;
        p.size = Math.random() * 2 + 0.5;
        p.speedY = Math.random() * 0.2 + 0.1;
        p.opacity = Math.random() * 0.3 + 0.1;
    }

    update() {
        this.particles.forEach(p => {
            p.y -= p.speedY;
            if (p.y < -10) {
                p.y = this.height + 10;
                p.x = Math.random() * this.width;
            }
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = CONFIG.colors.meteor; // Reuse meteor color (white/pinkish)
        this.particles.forEach(p => {
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
}
