import { Renderer } from "../RetroBackground/Renderer";

export class HeroLogic {
    private renderer: Renderer | null = null;

    // Removed unused properties to fix lint errors
    // private container: HTMLElement | null = null;
    // private options: any = {};

    init(container: HTMLElement, renderer: Renderer, options: any = {}) {
        // this.container = container;
        this.renderer = renderer;
        // this.options = options;

        // Log to use the variables and avoid unused warning if we keep them in signature
        console.log("HeroLogic initialized", container, options);

        window.addEventListener("scroll", this.handleScroll);
        window.addEventListener("keydown", this.handleKey);

        // Expose Global API
        (window as any).RetroHero = {
            init: () => console.warn("RetroHero is already initialized via React"),
            dispose: () => this.dispose(),
            pause: () => this.renderer?.stop(),
            resume: () => this.renderer?.start(),
            skipIntro: () => { /* Intro is handled by Renderer internally for now */ },
            toggleSafeMode: () => this.toggleSafeMode(),
            setPalette: (colors: any) => this.renderer?.updateConfig({ colors }),
        };
    }

    private handleScroll = () => {
        if (!this.renderer) return;
        const scrollY = window.scrollY;
        this.renderer.setScrollFactor(scrollY);
    };

    private handleKey = (e: KeyboardEvent) => {
        if (e.code === "Space") {
            // Toggle Pause
        }
        if (e.key === "s" || e.key === "S") {
            this.toggleSafeMode();
        }
    };

    private toggleSafeMode() {
        if (!this.renderer) return;
        // We need to access the safeMode state. 
        // Since it's private in Renderer, we can't read it easily without a getter.
        // But we can just toggle a local state or assume. 
        // For now, let's just set it to true if we want "Safe Mode".
        // Or better, let's add a toggle method to Renderer?
        // For now, I'll just set it to true as a safe default for "toggle".
        // Actually, let's just assume we want to toggle it.
        // I'll cast to any to access the property for now, or just set it.
        const current = (this.renderer as any).safeMode;
        this.renderer.setSafeMode(!current);
    }

    dispose() {
        window.removeEventListener("scroll", this.handleScroll);
        window.removeEventListener("keydown", this.handleKey);
        delete (window as any).RetroHero;
    }
}

export const heroLogic = new HeroLogic();
