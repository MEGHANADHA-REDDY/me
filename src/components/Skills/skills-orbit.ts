import config from './config-skills';

export const initSkillsOrbit = (container: HTMLElement) => {
  const { rings, skills, categories } = config;

  // 1. Setup Structure
  container.innerHTML = `
    <div class="so-wrapper">
      
      <div class="so-header">
        <h2 class="so-title ss-stagger-item">Skills Orbit</h2>
        <p class="so-subtitle ss-stagger-item">A cosmic map of my technical universe.</p>
        
        <div class="so-filters ss-stagger-item">
          ${categories.map(cat => `
            <button class="so-filter-chip ${cat.id === 'all' ? 'active' : ''}" data-cat="${cat.id}">
              ${cat.label}
            </button>
          `).join('')}
        </div>
      </div>
      
      <div class="so-orbit-container ss-stagger-item">
        <div class="so-system">
          <div class="so-central-orb"></div>
          <div class="so-rings-layer"></div>
        </div>
      </div>
    </div>
  `;

  const ringsLayer = container.querySelector('.so-rings-layer') as HTMLElement;
  const filterChips = container.querySelectorAll('.so-filter-chip');

  // 2. Render Rings & Nodes
  rings.forEach((ring, index) => {
    // Create Ring
    const ringEl = document.createElement('div');
    ringEl.className = 'so-ring';
    ringEl.dataset.id = ring.id;
    const size = ring.radius * 2;
    ringEl.style.width = `${size}px`;
    ringEl.style.height = `${size}px`;
    ringsLayer.appendChild(ringEl);

    // Create Track for Nodes (Rotates)
    const track = document.createElement('div');
    track.className = 'so-ring-track';
    track.style.width = `${size}px`;
    track.style.height = `${size}px`;

    // Vary rotation speed/direction based on index
    const duration = 60 + index * 20; // Slower for outer rings
    const direction = index % 2 === 0 ? 'normal' : 'reverse';
    track.style.animationDuration = `${duration}s`;
    track.style.animationDirection = direction;

    ringsLayer.appendChild(track);

    // Render Nodes for this Ring
    const ringSkills = skills.filter(s => s.ringId === ring.id);
    ringSkills.forEach(skill => {
      const node = document.createElement('div');
      node.className = 'so-node';
      node.dataset.id = skill.id;
      node.dataset.ring = ring.id;

      const angle = skill.angle;
      node.style.transform = `rotate(${angle}deg) translate(${ring.radius}px) rotate(-${angle}deg)`;

      // Inner container to counter-rotate against the TRACK rotation
      const inner = document.createElement('div');
      inner.className = 'so-node-inner';
      inner.style.animation = `soCounterRotate ${duration}s linear infinite ${direction === 'reverse' ? 'normal' : 'reverse'}`;

      // Render Icon using Mask Image
      const iconUrl = skill.icon || '';

      inner.innerHTML = `
        <div class="so-node-icon" style="-webkit-mask-image: url('${iconUrl}'); mask-image: url('${iconUrl}');"></div>
        <div class="so-node-info">
          <span class="so-node-name">${skill.label}</span>
          <span class="so-node-desc">${skill.desc}</span>
        </div>
      `;

      node.appendChild(inner);
      track.appendChild(node);

      // Hover Stop
      node.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
        inner.style.animationPlayState = 'paused';
      });
      node.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
        inner.style.animationPlayState = 'running';
      });
    });
  });

  // 3. Add Counter-Rotate Keyframes dynamically
  if (!document.getElementById('so-keyframes')) {
    const style = document.createElement('style');
    style.id = 'so-keyframes';
    style.innerHTML = `
      @keyframes soCounterRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // 4. Filter Logic
  const filterSystem = (cat: string) => {
    // Chips
    filterChips.forEach(chip => {
      if (chip.getAttribute('data-cat') === cat) chip.classList.add('active');
      else chip.classList.remove('active');
    });

    // Rings
    const rings = ringsLayer.querySelectorAll('.so-ring');
    rings.forEach(r => {
      const el = r as HTMLElement;
      if (cat === 'all' || el.dataset.id === cat) {
        el.classList.remove('dimmed');
        if (cat !== 'all') el.classList.add('active');
        else el.classList.remove('active');
      } else {
        el.classList.add('dimmed');
        el.classList.remove('active');
      }
    });

    // Nodes
    const nodes = ringsLayer.querySelectorAll('.so-node');
    nodes.forEach(n => {
      const el = n as HTMLElement;
      if (cat === 'all' || el.dataset.ring === cat) {
        el.classList.remove('dimmed');
      } else {
        el.classList.add('dimmed');
      }
    });
  };

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => filterSystem(chip.getAttribute('data-cat') || 'all'));
  });

  return {
    dispose: () => {
      container.innerHTML = '';
    }
  };
};
