import config from '../config';

export const createRightElements = (container: HTMLElement) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'right-elements';

    // 1. Hologram Line
    if (config.rightElements.showHologramLine) {
        const holoLine = document.createElement('div');
        holoLine.className = 'holo-line';
        // SVG Line
        holoLine.innerHTML = `
      <svg width="2" height="400" viewBox="0 0 2 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1" y1="0" x2="1" y2="400" stroke="url(#holoGradient)" stroke-width="${config.rightElements.holoLineWidth}" stroke-dasharray="4 4" />
        <defs>
          <linearGradient id="holoGradient" x1="1" y1="0" x2="1" y2="400" gradientUnits="userSpaceOnUse">
            <stop stop-color="${config.palette.neonOrchid}" stop-opacity="0" />
            <stop offset="0.5" stop-color="${config.palette.neonOrchid}" stop-opacity="0.8" />
            <stop offset="1" stop-color="${config.palette.neonOrchid}" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    `;

        // Particles
        for (let i = 0; i < config.rightElements.holoParticleCount; i++) {
            const p = document.createElement('div');
            p.className = 'holo-particle';
            p.style.animationDelay = `${Math.random() * 2}s`;
            p.style.left = `${Math.random() * 4 - 2}px`; // Slight jitter
            holoLine.appendChild(p);
        }

        wrapper.appendChild(holoLine);
    }

    // 2. Orb
    if (config.rightElements.showOrb) {
        const orb = document.createElement('div');
        orb.className = 'orb';
        orb.style.width = `${config.rightElements.orbSize}px`;
        orb.style.height = `${config.rightElements.orbSize}px`;
        wrapper.appendChild(orb);
    }

    // 3. Quote
    if (config.rightElements.showQuote) {
        const quote = document.createElement('div');
        quote.className = 'quote';
        quote.textContent = config.rightElements.quoteText;
        quote.setAttribute('aria-hidden', 'true'); // Accessible copy is in React component
        wrapper.appendChild(quote);
    }

    container.appendChild(wrapper);
    return wrapper;
};
