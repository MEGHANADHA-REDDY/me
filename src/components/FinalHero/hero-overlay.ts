import config from './config';
import { createRightElements } from './ui/rightElements';
import { getClampedDPR, shouldReduceMotion, isMobile } from './utils/perf';

export const initHero = (container: HTMLElement, options: any = {}) => {
    const mergedConfig = { ...config, ...options };

    // 1. Setup Container
    container.innerHTML = ''; // Clear previous
    container.style.perspective = '1000px';

    // 2. Create Hero Text
    const heroText = document.createElement('div');
    heroText.className = 'hero-text';
    heroText.innerHTML = `
    <h1 class="hero-title">
      Full Stack Developer — <span class="accent">Crafting Modern Web Experiences</span>
    </h1>
    <p class="hero-subtitle">
      I build clean, fast, scalable apps using React, Node.js, and modern cloud tools.
    </p>
    <div class="hero-actions">
      <a href="#contact" class="hero-btn hero-btn-primary">Work with me</a>
      <a href="#projects" class="hero-btn hero-btn-secondary">View Projects</a>
    </div>
  `;
    container.appendChild(heroText);


    // 3. Create Right Elements (if not mobile or forced hidden)
    let rightElements: HTMLElement | null = null;
    if (!isMobile()) {
        rightElements = createRightElements(container);
    }

    // 4. State
    let animationId: number;
    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let isPaused = false;
    let safeMode = false;

    // 5. Animation Loop
    const loop = () => {
        if (isPaused || safeMode) return;

        // Parallax Smoothing
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;

        // Apply Parallax
        if (!shouldReduceMotion()) {
            const x = (mouseX - window.innerWidth / 2) / window.innerWidth;
            const y = (mouseY - window.innerHeight / 2) / window.innerHeight;

            heroText.style.transform = `translate3d(${x * mergedConfig.parallaxRanges.heroText}px, calc(-50% + ${y * mergedConfig.parallaxRanges.heroText}px), 0)`;

            if (rightElements) {
                rightElements.style.transform = `translate3d(${x * -mergedConfig.parallaxRanges.orb}px, calc(-50% + ${y * -mergedConfig.parallaxRanges.orb}px), 0)`;
            }
        }

        animationId = requestAnimationFrame(loop);
    };

    // 6. Event Listeners
    const handleScroll = () => {
        scrollY = window.scrollY;

        // Scroll Transforms
        if (scrollY > mergedConfig.scroll.collapseHeroAt) {
            container.style.opacity = '0';
            container.style.pointerEvents = 'none';
        } else {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';

            // Fade out on scroll
            const opacity = 1 - Math.min(scrollY / mergedConfig.scroll.reduceParallaxEnd, 1);
            heroText.style.opacity = opacity.toString();
            if (rightElements) rightElements.style.opacity = opacity.toString();
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    // Start Loop
    loop();

    // Entrance Animation
    const playEntrance = () => {
        setTimeout(() => {
            heroText.classList.add('visible');
            if (rightElements) rightElements.classList.add('visible');
        }, mergedConfig.timing.overlayFadeIn);
    };

    if (options.autoPlay !== false) {
        playEntrance();
    }

    // API
    const api = {
        pause: () => { isPaused = true; cancelAnimationFrame(animationId); },
        resume: () => { isPaused = false; loop(); },
        playEntrance,
        toggleSafeMode: () => {
            safeMode = !safeMode;
            if (safeMode) {
                container.classList.add('safe-mode');
                api.pause();
            } else {
                container.classList.remove('safe-mode');
                api.resume();
            }
        },
        dispose: () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
            container.innerHTML = '';
        }
    };

    // Expose Global API
    (window as any).FinalHero = api;

    return api;
};

export const disposeHero = () => {
    if ((window as any).FinalHero) {
        (window as any).FinalHero.dispose();
    }
};
