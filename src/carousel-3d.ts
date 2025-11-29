import { CAROUSEL_CONFIG } from './config-carousel';

export class Carousel3D {
    private container: HTMLElement;
    private projects: any[];
    private config: typeof CAROUSEL_CONFIG;
    private faces: HTMLElement[] = [];
    private carouselEl: HTMLElement | null = null;

    private rotation = 0;
    private targetRotation = 0;
    private isDragging = false;
    private startX = 0;
    private startRotation = 0;
    private rafId: number | null = null;
    private isPaused = false;
    private radius = 0;

    // API Callbacks
    public onFaceClick: ((index: number) => void) | null = null;

    constructor(container: HTMLElement, projects: any[], config = CAROUSEL_CONFIG) {
        this.container = container;
        this.projects = projects;
        this.config = { ...CAROUSEL_CONFIG, ...config };

        this.init();
    }

    private init() {
        this.container.innerHTML = '';
        this.container.style.perspective = '1000px';
        this.container.style.overflow = 'hidden';

        // Create Carousel Wrapper
        this.carouselEl = document.createElement('div');
        this.carouselEl.className = 'c3d-wrapper';
        this.carouselEl.style.transformStyle = 'preserve-3d';
        this.carouselEl.style.width = '100%';
        this.carouselEl.style.height = '100%';
        this.carouselEl.style.position = 'absolute';
        this.carouselEl.style.top = '0';
        this.carouselEl.style.left = '0';
        this.container.appendChild(this.carouselEl);

        // Calculate Radius
        const count = this.projects.length;
        const width = this.config.faceWidth + this.config.facePadding;
        // r = w / (2 * tan(PI / n))
        this.radius = Math.round(width / (2 * Math.tan(Math.PI / count)));

        // Create Faces
        this.projects.forEach((project, i) => {
            const face = document.createElement('div');
            face.className = 'c3d-face';
            face.dataset.index = i.toString();

            // Connected Edge Math
            const angle = (i / count) * 2 * Math.PI;

            face.style.width = `${this.config.faceWidth}px`;
            face.style.height = `${this.config.faceHeight}px`;
            face.style.position = 'absolute';
            face.style.left = '50%';
            face.style.top = '50%';
            face.style.marginLeft = `-${this.config.faceWidth / 2}px`;
            face.style.marginTop = `-${this.config.faceHeight / 2}px`;
            face.style.transform = `rotateY(${angle}rad) translateZ(${this.radius}px)`;

            // Content
            face.innerHTML = `
                <div class="c3d-face-inner">
                    <div class="c3d-label">${project.title}</div>
                    <img src="${project.images[0]}" alt="${project.title}" loading="lazy" />
                    <div class="c3d-overlay"></div>
                </div>
            `;

            face.addEventListener('click', () => this.handleClick(i));

            this.carouselEl!.appendChild(face);
            this.faces.push(face);
        });

        // Events
        this.container.addEventListener('mousedown', this.handleDragStart.bind(this));
        this.container.addEventListener('touchstart', this.handleDragStart.bind(this), { passive: false });

        window.addEventListener('mousemove', this.handleDragMove.bind(this));
        window.addEventListener('touchmove', this.handleDragMove.bind(this), { passive: false });

        window.addEventListener('mouseup', this.handleDragEnd.bind(this));
        window.addEventListener('touchend', this.handleDragEnd.bind(this));

        // Start Loop
        this.animate();
    }

    private handleDragStart(e: MouseEvent | TouchEvent) {
        this.isDragging = true;
        this.isPaused = true;
        this.startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        this.startRotation = this.targetRotation;
    }

    private handleDragMove(e: MouseEvent | TouchEvent) {
        if (!this.isDragging) return;
        e.preventDefault();

        const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const delta = x - this.startX;

        // Sensitivity
        this.targetRotation = this.startRotation - (delta * 0.005);
    }

    private handleDragEnd() {
        this.isDragging = false;
        // Resume autoplay after delay? For now just leave paused if user interacted
        setTimeout(() => {
            if (!this.isDragging) this.isPaused = false;
        }, 3000);
    }

    private handleClick(index: number) {
        // If we were dragging, ignore click
        // if (Math.abs(this.rotation - this.targetRotation) > 0.1) return;

        // Rotate to face
        const count = this.projects.length;
        const anglePerFace = (2 * Math.PI) / count;

        // Find shortest path
        // const currentAngle = this.rotation % (2 * Math.PI);
        const targetAngle = index * anglePerFace;

        // Calculate delta to rotate this face to FRONT (0 rad)
        // Actually front is usually 0, so we want to rotate the carousel such that face angle + carousel rotation = 0 (or 2PI)
        // So carousel rotation = -face angle

        let targetRot = -targetAngle;

        // Normalize to nearest rotation to avoid spinning wildly
        // TODO: Implement smart shortest path logic

        this.targetRotation = targetRot;
        this.isPaused = true;

        if (this.onFaceClick) this.onFaceClick(index);
    }

    private animate() {
        if (!this.carouselEl) return;

        // Autoplay
        if (!this.isPaused && this.config.autoplay) {
            this.targetRotation -= this.config.autoplaySpeed;
        }

        // Smooth Ease
        this.rotation += (this.targetRotation - this.rotation) * this.config.rotateEase;

        // Apply
        this.carouselEl.style.transform = `translateZ(-${this.radius}px) rotateY(${this.rotation}rad)`;

        // Update Faces (Billboarding labels or culling could go here)

        this.rafId = requestAnimationFrame(this.animate.bind(this));
    }

    public dispose() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.container.innerHTML = '';
        // Remove listeners...
    }
}
