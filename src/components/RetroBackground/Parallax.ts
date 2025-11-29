import { CONFIG } from "./Config";

export class Parallax {
    private targetX: number = 0;
    private targetY: number = 0;
    private currentX: number = 0;
    private currentY: number = 0;

    constructor() {
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("touchmove", this.handleTouchMove);
    }

    private handleMouseMove = (e: MouseEvent) => {
        this.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        this.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    private handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
            this.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.targetY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
        }
    };

    update() {
        // Smooth easing (Lerp)
        this.currentX += (this.targetX - this.currentX) * 0.05;
        this.currentY += (this.targetY - this.currentY) * 0.05;
    }

    getOffsets() {
        return {
            moon: { x: this.currentX * 20 * CONFIG.parallax.moon, y: this.currentY * 20 * CONFIG.parallax.moon },
            back: { x: this.currentX * 50 * CONFIG.parallax.back, y: this.currentY * 50 * CONFIG.parallax.back },
            mid: { x: this.currentX * 80 * CONFIG.parallax.mid, y: this.currentY * 80 * CONFIG.parallax.mid },
            fore: { x: this.currentX * 120 * CONFIG.parallax.fore, y: this.currentY * 120 * CONFIG.parallax.fore },
        };
    }

    dispose() {
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("touchmove", this.handleTouchMove);
    }
}
