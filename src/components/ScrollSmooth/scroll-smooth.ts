import { SMOOTH_CONFIG } from './config-smooth';

export class ScrollSmooth {
    // private container: HTMLElement;
    private content: HTMLElement;
    private sections: HTMLElement[] = [];
    private renderer: any = null;

    private currentY = 0;
    private targetY = 0;
    private maxScroll = 0;
    private isEnabled = false;
    private rafId: number | null = null;
    private isSnapping = false;

    constructor(container: HTMLElement, content: HTMLElement, renderer?: any) {
        // this.container = container;
        this.content = content;
        this.renderer = renderer;

        // Auto-detect sections
        this.sections = Array.from(content.querySelectorAll('[data-section]'));

        this.init();
    }

    public init() {
        if (SMOOTH_CONFIG.prefersReducedMotion || window.innerWidth <= SMOOTH_CONFIG.mobileBreakpoint) {
            console.log('ScrollSmooth disabled (Mobile/Reduced Motion)');
            // Fallback: Add native scroll listener to drive renderer
            window.addEventListener('scroll', this.onNativeScroll);
            return;
        }

        this.isEnabled = true;
        document.body.classList.add('ss-active');

        this.onResize();
        window.addEventListener('resize', this.onResize);
        window.addEventListener('wheel', this.onWheel, { passive: false });

        this.loop();
    }

    private onNativeScroll = () => {
        if (this.renderer && typeof this.renderer.setScrollFactor === 'function') {
            this.renderer.setScrollFactor(window.scrollY);
        }
    };

    public dispose() {
        this.isEnabled = false;
        document.body.classList.remove('ss-active');

        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('wheel', this.onWheel);
        window.removeEventListener('scroll', this.onNativeScroll);

        if (this.rafId) cancelAnimationFrame(this.rafId);

        // Reset styles
        this.content.style.transform = '';
        this.sections.forEach(section => {
            section.style.opacity = '';
            section.style.transform = '';
            section.style.filter = '';
        });
    }

    private onResize = () => {
        this.maxScroll = this.content.scrollHeight - window.innerHeight;
        this.targetY = Math.min(Math.max(this.targetY, 0), this.maxScroll);
    };

    private onWheel = (e: WheelEvent) => {
        if (!this.isEnabled) return;
        e.preventDefault();

        // Stop snapping if user interacts
        this.isSnapping = false;

        const delta = e.deltaY * SMOOTH_CONFIG.wheelMultiplier;
        this.targetY += delta;
        this.targetY = Math.min(Math.max(this.targetY, 0), this.maxScroll);
    };

    private loop = () => {
        if (!this.isEnabled) return;

        // 1. Inertia
        const diff = this.targetY - this.currentY;

        if (Math.abs(diff) > 0.1) {
            this.currentY += diff * SMOOTH_CONFIG.inertia;
            this.content.style.transform = `translate3d(0, -${this.currentY}px, 0)`;

            // Drive Renderer (Background)
            if (this.renderer && typeof this.renderer.setScrollFactor === 'function') {
                this.renderer.setScrollFactor(this.currentY);
            }

            this.choreograph();
            this.handleSnapping();
        }

        this.rafId = requestAnimationFrame(this.loop);
    };

    private handleSnapping() {
        if (!SMOOTH_CONFIG.snapEnabled || this.isSnapping) return;

        // Simple soft snap logic: if we are very close to a section start/center and moving slowly, snap to it
        // For now, let's keep it simple: Snap to section tops if velocity is low

        // Calculate velocity (approx)
        const velocity = Math.abs(this.targetY - this.currentY);

        if (velocity < 1.0) {
            // Find closest snap point
            let closestDist = Infinity;
            let snapTarget = -1;

            this.sections.forEach(section => {
                const offsetTop = section.offsetTop;
                const dist = Math.abs(this.currentY - offsetTop);

                if (dist < SMOOTH_CONFIG.snapThreshold && dist < closestDist) {
                    closestDist = dist;
                    snapTarget = offsetTop;
                }
            });

            if (snapTarget !== -1 && closestDist > 1) {
                this.targetY = snapTarget;
                this.isSnapping = true; // Prevent fighting
            }
        }
    }

    private choreograph() {
        const viewportH = window.innerHeight;

        this.sections.forEach((section, index) => {
            const offsetTop = section.offsetTop;
            const height = section.offsetHeight;

            // 1. Lighting Off (Dimming) for Exiting Section
            if (this.currentY > offsetTop) {
                // We are scrolling into or past this section

                // Calculate exit progress (0 to 1) as we scroll through the first 80% of the section
                const exitProgress = Math.max(0, (this.currentY - offsetTop) / (height * 0.8));

                // Only dim if it's NOT the last section AND not opted out
                if (index < this.sections.length - 1 && section.dataset.noExitAnim !== 'true') {
                    if (exitProgress > 0 && exitProgress < 1.2) {
                        const opacity = Math.max(0, 1 - exitProgress * 1.5);
                        const scale = 1 - exitProgress * 0.05;
                        const brightness = Math.max(0.2, 1 - exitProgress);
                        const blur = exitProgress * 5;

                        section.style.opacity = opacity.toString();
                        section.style.transform = `scale(${scale})`;
                        section.style.filter = `brightness(${brightness}) blur(${blur}px)`;
                    } else if (exitProgress >= 1.2) {
                        section.style.opacity = '0';
                    }
                }
            } else {
                // Reset if we scroll back up
                section.style.opacity = '';
                section.style.transform = '';
                section.style.filter = '';
            }

            // 2. Staggered Reveal for Entering Section
            // Trigger when section top is within the bottom 20% of viewport
            const revealTrigger = this.currentY + viewportH * 0.8;

            if (revealTrigger > offsetTop) {
                const items = section.querySelectorAll('.ss-stagger-item'); // Updated class name
                items.forEach((item, i) => {
                    const el = item as HTMLElement;
                    if (!el.classList.contains('visible')) {
                        setTimeout(() => {
                            el.classList.add('visible');
                        }, i * 150);
                    }
                });
            }
        });
    }
}

export const initScrollSmooth = (container: HTMLElement, content: HTMLElement, renderer?: any) => {
    return new ScrollSmooth(container, content, renderer);
};
