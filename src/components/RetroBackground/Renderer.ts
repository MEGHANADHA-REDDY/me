import { CONFIG } from "./Config";
import { Parallax } from "./Parallax";
import { Meteors } from "./Meteors";
import { Particles } from "./Particles";
import { IntroAnimation } from "./Intro";

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width: number = 0;
    private height: number = 0;
    private animationId: number = 0;

    private parallax: Parallax;
    private meteors: Meteors;
    private particles: Particles;
    private intro: IntroAnimation;

    // Mountain Paths (Reused from SVG)
    private mountainBackPath = new Path2D("M0,750 L150,720 L300,780 L450,680 L600,760 L800,700 L1000,780 L1200,690 L1400,770 L1600,710 L1800,760 L1920,730 V1080 H0 Z");
    private mountainMidPath = new Path2D("M0,900 L200,850 L350,920 L500,840 L700,910 L900,860 L1100,930 L1300,850 L1500,920 L1700,870 L1920,910 V1080 H0 Z");
    private mountainForePath = new Path2D("M0,1080 L0,980 L180,920 L360,1000 L540,930 L720,1020 L900,940 L1080,1010 L1260,950 L1440,1030 L1620,960 L1800,1020 L1920,990 V1080 Z");

    private config = JSON.parse(JSON.stringify(CONFIG)); // Deep copy for runtime overrides
    private scrollFactor: number = 0; // 0 = top, 1 = scrolled down
    private safeMode: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;

        this.parallax = new Parallax();
        this.meteors = new Meteors();
        this.particles = new Particles();
        this.intro = new IntroAnimation();

        this.intro = new IntroAnimation();
        // this.intro.start(); // Manual start via playEntrance
    }

    // --- External Control API ---

    playEntrance() {
        this.intro.start();
    }

    setScrollFactor(y: number) {
        // y is scroll position in pixels. 
        // We map it to a 0-1 factor for effects. 
        // 0-600px maps to 0-1 for moon movement/parallax reduction.
        this.scrollFactor = Math.min(Math.max(y / 600, 0), 1);
    }

    updateConfig(newConfig: any) {
        // Deep merge or specific overrides
        if (newConfig.colors) {
            this.config.colors = { ...this.config.colors, ...newConfig.colors };
        }
        // Add other config updates as needed
    }

    setSafeMode(enabled: boolean) {
        this.safeMode = enabled;
    }

    // ---------------------------

    resize(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.canvas.width = w;
        this.canvas.height = h;

        this.meteors.resize(w, h);
        this.particles.resize(w, h);
    }

    start() {
        this.loop();
    }

    stop() {
        cancelAnimationFrame(this.animationId);
        this.parallax.dispose();
    }

    private loop = () => {
        if (document.hidden) {
            this.animationId = requestAnimationFrame(this.loop);
            return;
        }
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(this.loop);
    };

    private update() {
        if (this.safeMode) return;

        this.parallax.update();
        this.meteors.update();
        this.particles.update();
        this.intro.update(performance.now());
    }

    private draw() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        // Apply scroll factor to parallax strength (reduce as we scroll down)
        // 1.0 at top, 0.4 at scrollFactor=1
        const parallaxStrength = 1.0 - (this.scrollFactor * 0.6);

        const rawOffsets = this.parallax.getOffsets();
        const offsets = {
            moon: { x: rawOffsets.moon.x * parallaxStrength, y: rawOffsets.moon.y * parallaxStrength },
            back: { x: rawOffsets.back.x * parallaxStrength, y: rawOffsets.back.y * parallaxStrength },
            mid: { x: rawOffsets.mid.x * parallaxStrength, y: rawOffsets.mid.y * parallaxStrength },
            fore: { x: rawOffsets.fore.x * parallaxStrength, y: rawOffsets.fore.y * parallaxStrength },
        };

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Global Fade based on Scroll (Reveal GlobalBackground)
        // Fade out completely by scrollFactor 0.8
        const scrollOpacity = Math.max(0, 1 - this.scrollFactor * 1.2);
        ctx.globalAlpha = this.intro.opacity * scrollOpacity;

        // 1. Sky Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, this.config.colors.skyTop);
        skyGrad.addColorStop(0.5, this.config.colors.skyMid);
        skyGrad.addColorStop(1, this.config.colors.skyBottom);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Moon (Parallax + Intro Scale/Move + Scroll Move)
        // Scroll effect: Move up significantly and fade out
        const scrollMoveY = this.scrollFactor * -200; // Move up 200px
        const scrollScale = 1.0 - (this.scrollFactor * 0.2); // Scale down more

        const moonY = (h * 0.5 + offsets.moon.y + (1 - this.intro.moonProgress) * 200) + scrollMoveY;
        const moonX = w * 0.5 + offsets.moon.x;

        // Fade out moon based on scrollFactor
        const moonOpacity = Math.max(0, 1 - this.scrollFactor * 1.5); // Fade out faster (gone by 2/3 scroll)

        if (moonOpacity > 0) {
            ctx.save();
            ctx.globalAlpha = this.intro.opacity * moonOpacity;

            // Moon Bloom (Fade out on scroll)
            ctx.shadowBlur = 50 * moonOpacity;
            ctx.shadowColor = this.config.colors.moonBloom;

            // Moon Circle
            const radius = 250 * scrollScale;
            const moonGrad = ctx.createLinearGradient(moonX, moonY - radius, moonX, moonY + radius);
            moonGrad.addColorStop(0, this.config.colors.moonTop);
            moonGrad.addColorStop(1, this.config.colors.moonBase);

            ctx.fillStyle = moonGrad;
            ctx.beginPath();
            ctx.arc(moonX, moonY, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        ctx.shadowBlur = 0; // Reset shadow

        // Helper to draw layer with offset and scale
        const drawLayer = (path: Path2D, color: string, offsetX: number, offsetY: number, introProgress: number) => {
            ctx.save();
            // Scale to fit width (1920 base)
            const scaleX = w / 1920;
            const scaleY = h / 1080;
            const scale = Math.max(scaleX, scaleY);

            const introY = (1 - introProgress) * 100; // Slide up

            ctx.translate(offsetX, offsetY + introY + (h - 1080 * scale)); // Align bottom
            ctx.scale(scale, scale);
            ctx.fillStyle = color;
            ctx.fill(path);
            ctx.restore();
        };

        // 3. Mountains Back
        drawLayer(this.mountainBackPath, this.config.colors.mountainBack, offsets.back.x, offsets.back.y, this.intro.backProgress);

        // 4. Fog (Between Back and Mid) - Fade/Freeze on scroll
        if (!this.safeMode && this.scrollFactor < 1) {
            const fogY = h * 0.6 + offsets.back.y;
            const fogHeight = h * 0.4;
            const fogGrad = ctx.createLinearGradient(0, fogY, 0, fogY + fogHeight);
            fogGrad.addColorStop(0, "rgba(82, 0, 38, 0)");
            fogGrad.addColorStop(0.4, this.config.colors.fog);
            fogGrad.addColorStop(1, this.config.colors.fog);

            ctx.globalAlpha = this.intro.opacity * (1 - this.scrollFactor * 0.4); // Reduce opacity on scroll
            ctx.fillStyle = fogGrad;
            ctx.fillRect(0, fogY, w, fogHeight);
            ctx.globalAlpha = this.intro.opacity; // Reset
        }

        // 5. Mountains Mid
        drawLayer(this.mountainMidPath, this.config.colors.mountainMid, offsets.mid.x, offsets.mid.y, this.intro.midProgress);

        // 6. Mountains Fore
        drawLayer(this.mountainForePath, this.config.colors.mountainFore, offsets.fore.x, offsets.fore.y, this.intro.foreProgress);

        // 7. Meteors & Particles (Pause/Hide on deep scroll)
        if (!this.safeMode && this.scrollFactor < 0.8) {
            this.meteors.draw(ctx);

            // Fade out particles
            ctx.globalAlpha = this.intro.opacity * (1 - this.scrollFactor);
            this.particles.draw(ctx);
            ctx.globalAlpha = this.intro.opacity;
        }
    }
}
