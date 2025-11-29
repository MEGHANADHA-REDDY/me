import config from './config-about';


export const initAbout = (container: HTMLElement, options: any = {}) => {
    const mergedConfig = { ...config, ...options };

    // 1. Setup Container
    container.innerHTML = '';

    // Apply Config
    if (mergedConfig.palette) {
        const p = mergedConfig.palette;
        container.style.setProperty('--about-moon-silver', p.moonSilver);
        container.style.setProperty('--about-neon-orchid', p.neonOrchid);
        container.style.setProperty('--about-sub-lav', p.subLav);
        container.style.setProperty('--about-vignette-dark', p.vignette);
    }

    // 2. Create Markup
    const wrapper = document.createElement('div');
    wrapper.className = 'about-wrapper';

    // Left Column (Text)
    const leftCol = document.createElement('div');
    leftCol.className = 'about-left';
    leftCol.innerHTML = `
    <div class="about-label">— INTRO</div>
    <h2 class="about-heading">About Me</h2>
    <p class="about-paragraph">
      I’m a Full Stack Developer who turns product ideas into reliable, beautiful web experiences. I build things with React, Node.js, and scalable cloud systems — clean code, fast performance, and pragmatic design.
    </p>
    <a href="/resume.pdf" class="about-cta" aria-label="Download Resume">
      Download Resume <span>→</span>
    </a>
  `;

    wrapper.appendChild(leftCol);

    // Right Column (Orb) - Only if enabled
    if (mergedConfig.orb && mergedConfig.orb.enabled) {
        const rightCol = document.createElement('div');
        rightCol.className = 'about-orb-container';
        rightCol.innerHTML = `
      <div class="about-orb" role="img" aria-label="Profile Orb"></div>
    `;
        wrapper.appendChild(rightCol);
    }

    container.appendChild(wrapper);

    // 3. Intersection Observer for Entrance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                wrapper.classList.add('visible');
                observer.unobserve(container);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(container);

    // 4. Parallax (Optional / Subtle)
    let mouseX = 0;
    let mouseY = 0;
    const orb = wrapper.querySelector('.about-orb') as HTMLElement;

    const handleMouseMove = (e: MouseEvent) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;

        // Subtle parallax for orb
        if (orb) {
            orb.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`;
        }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // API
    const api = {
        dispose: () => {
            window.removeEventListener('mousemove', handleMouseMove);
            observer.disconnect();
            container.innerHTML = '';
        },
        pause: () => {
            if (orb) orb.style.animationPlayState = 'paused';
        },
        resume: () => {
            if (orb) orb.style.animationPlayState = 'running';
        },
        toggleSafeMode: () => {
            wrapper.classList.toggle('safe-mode');
        },
        setPalette: (colors: any) => {
            if (colors.moonSilver) container.style.setProperty('--about-moon-silver', colors.moonSilver);
            if (colors.neonOrchid) container.style.setProperty('--about-neon-orchid', colors.neonOrchid);
            if (colors.subLav) container.style.setProperty('--about-sub-lav', colors.subLav);
        }
    };

    (window as any).AboutSection = api;
    return api;
};
