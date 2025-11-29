import { CONFIG } from "./Config";

interface Meteor {
    x: number;
    y: number;
    speed: number;
    angle: number;
    length: number;
    opacity: number;
    active: boolean;
}

export class Meteors {
    private meteors: Meteor[] = [];
    private width: number = 0;
    private height: number = 0;

    resize(w: number, h: number) {
        this.width = w;
        this.height = h;
    }

    update() {
        // Spawn new meteors randomly
        if (Math.random() < 0.01) { // 1% chance per frame
            this.spawn();
        }

        this.meteors.forEach(m => {
            if (!m.active) return;
            m.x += Math.cos(m.angle) * m.speed;
            m.y += Math.sin(m.angle) * m.speed;
            m.opacity -= 0.005;

            if (m.x < -100 || m.x > this.width + 100 || m.y > this.height + 100 || m.opacity <= 0) {
                m.active = false;
            }
        });

        // Cleanup inactive
        this.meteors = this.meteors.filter(m => m.active);
    }

    private spawn() {
        const isLeft = Math.random() > 0.5;
        const x = isLeft ? Math.random() * (this.width * 0.3) : this.width - Math.random() * (this.width * 0.3);
        const y = -50;
        const angle = isLeft ? Math.PI / 4 + (Math.random() * 0.2) : Math.PI * 0.75 - (Math.random() * 0.2);

        this.meteors.push({
            x,
            y,
            speed: 5 + Math.random() * 5,
            angle,
            length: 50 + Math.random() * 50,
            opacity: 1,
            active: true,
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = CONFIG.colors.meteor;
        ctx.lineCap = "round";

        this.meteors.forEach(m => {
            ctx.globalAlpha = m.opacity;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(m.x - Math.cos(m.angle) * m.length, m.y - Math.sin(m.angle) * m.length);
            ctx.stroke();
        });
        ctx.globalAlpha = 1;
    }
}
