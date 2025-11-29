import config from './config-scroll';

export class ScrollChoreographer {
    private container: HTMLElement;
    private content: HTMLElement;
    private sections: HTMLElement[] = [];
    private renderer: any = null;

    private currentY = 0;
    private targetY = 0;
    private maxScroll = 0;
    private isEnabled = false;
    private rafId: number | null = null;

    constructor(container: HTMLElement, content: HTMLElement, renderer?: any) {
        this.container = container;
        this.content = content;
        this.renderer = renderer;

        // Auto-detect sections
        this.sections = Array.from(content.querySelectorAll('[data-section]'));

        this.init();
    }

    public init() {
        if (config.prefersReducedMotion || window.innerWidth <= config.mobileBreakpoint) {
            console.log('Scroll Choreography disabled (Mobile/Reduced Motion)');
            return;
        }

        this.isEnabled = true;
        document.body.classList.add('sc-active');

        this.onResize();
        window.addEventListener('resize', this.onResize);
        window.addEventListener('wheel', this.onWheel, { passive: false });

        this.loop();
    }

    public dispose() {
        this.isEnabled = false;
        document.body.classList.remove('sc-active');

        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('wheel', this.onWheel);

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

        const delta = e.deltaY * config.wheelMultiplier;
        this.targetY += delta;
        this.targetY = Math.min(Math.max(this.targetY, 0), this.maxScroll);
    };

    private loop = () => {
        if (!this.isEnabled) return;

        const diff = this.targetY - this.currentY;

        if (Math.abs(diff) > 0.1) {
            this.currentY += diff * 0.08;
            this.content.style.transform = `translate3d(0, -${this.currentY}px, 0)`;

            // Drive Renderer (Background)
            if (this.renderer && typeof this.renderer.setScrollFactor === 'function') {
                this.renderer.setScrollFactor(this.currentY);
            }

            this.choreograph();
        }

        this.rafId = requestAnimationFrame(this.loop);
    };

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

                // Only dim if it's NOT the last section
                if (index < this.sections.length - 1) {
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
                const items = section.querySelectorAll('.sc-stagger-item');
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

export const initScrollChoreography = (container: HTMLElement, content: HTMLElement, renderer?: any) => {
    return new ScrollChoreographer(container, content, renderer);
};
