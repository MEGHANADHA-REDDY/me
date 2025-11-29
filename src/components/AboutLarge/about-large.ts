import config from './config-about-large';

export const initAboutLarge = (container: HTMLElement, options: any = {}) => {
  const mergedConfig = { ...config, ...options };

  // 1. Setup Container
  container.innerHTML = '';

  // Apply Palette
  if (mergedConfig.palette) {
    const p = mergedConfig.palette;
    container.style.setProperty('--al-moon-silver', p.moonSilver);
    container.style.setProperty('--al-neon-orchid', p.neonOrchid);
    container.style.setProperty('--al-sub-lav', p.subLav);
    container.style.setProperty('--al-bg-deep', p.bgDeep);
    container.style.setProperty('--al-maroon-top', p.maroonTop);
    container.style.setProperty('--al-maroon-mid', p.maroonMid);
    container.style.setProperty('--al-vignette-dk', p.vignetteDk);
    container.style.setProperty('--al-line-soft', p.lineSoft);
  }

  // 2. Create Markup
  const wrapper = document.createElement('div');
  wrapper.className = 'about-large-wrapper';

  wrapper.innerHTML = `
    <div class="al-container">
      <div class="al-title-block">
        <h2 class="al-heading ss-stagger-item">About Me</h2>
        <p class="al-subtitle ss-stagger-item">Who I am, what I love, and the problems I solve.</p>
      </div>
      
      <div class="al-content-grid">
        <div class="al-text-col">
          <p class="ss-stagger-item">I’m Megha — a Full Stack Developer obsessed with turning ideas into real products. I love solving problems, designing smooth user experiences, and writing clean code that scales.</p>
          <p class="ss-stagger-item">Over the years, I’ve worked on everything from student platforms to automation tools to mini-games, and each project pushed me to improve both as a builder and as a thinker.</p>
          <p class="ss-stagger-item">Today, I focus on React, Node.js, and cloud engineering, bringing clarity, speed, and purpose into everything I build.</p>
        </div>
        
        <div class="al-visual-col ss-stagger-item">
          <div class="al-orb-particles"></div>
          <div class="al-orb-large"></div>
          <div class="al-orb-small"></div>
        </div>
      </div>
    </div>
  `;

  container.appendChild(wrapper);

  // 3. Particle System (Removed - using GlobalBackground)
  // const particlesContainer = wrapper.querySelector('.al-particles-container') as HTMLElement;

  // 3.5 Orb Micro Particles
  const orbParticlesContainer = wrapper.querySelector('.al-orb-particles') as HTMLElement;
  if (orbParticlesContainer) {
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.className = 'al-particle';
      const size = Math.random() * 2 + 1;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDuration = `${Math.random() * 10 + 15}s`;
      p.style.opacity = '0.4';
      orbParticlesContainer.appendChild(p);
    }
  }

  // 4. Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        wrapper.classList.add('visible');
        observer.unobserve(container);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(container);

  // 5. Parallax (Optional)
  const orbLarge = wrapper.querySelector('.al-orb-large') as HTMLElement;
  const orbSmall = wrapper.querySelector('.al-orb-small') as HTMLElement;

  const handleMouseMove = (e: MouseEvent) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;

    if (orbLarge) orbLarge.style.transform = `translate(${mouseX * 15}px, ${mouseY * 15}px)`;
    if (orbSmall) orbSmall.style.transform = `translate(${mouseX * -10}px, ${mouseY * -10}px)`;
  };

  window.addEventListener('mousemove', handleMouseMove);

  // API
  const api = {
    dispose: () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      container.innerHTML = '';
    },
    toggleSafeMode: () => wrapper.classList.toggle('safe-mode'),
    setPalette: (p: any) => {
      if (p.moonSilver) container.style.setProperty('--al-moon-silver', p.moonSilver);
      if (p.neonOrchid) container.style.setProperty('--al-neon-orchid', p.neonOrchid);
      if (p.subLav) container.style.setProperty('--al-sub-lav', p.subLav);
      if (p.bgDeep) container.style.setProperty('--al-bg-deep', p.bgDeep);
    }
  };

  (window as any).AboutLarge = api;
  return api;
};
