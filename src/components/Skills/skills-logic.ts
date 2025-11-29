import config from './config-skills';

export const initSkills = (container: HTMLElement) => {
  // 1. Setup Container
  container.innerHTML = '';

  // 2. Create Markup
  const wrapper = document.createElement('div');
  wrapper.className = 'skills-wrapper';

  wrapper.innerHTML = `
    <div class="sg-bg-layer">
      <div class="sg-grid"></div>
      <div class="sg-nebula"></div>
      <div class="sg-particles"></div>
    </div>
    
    <div class="sg-header">
      <h2 class="sg-title">${config.content.heading}</h2>
      <p class="sg-subtitle">${config.content.subheading}</p>
    </div>
    
    <div class="sg-galaxy-container">
      <svg class="sg-lines-svg"></svg>
      <div class="sg-nodes-container"></div>
    </div>
  `;

  container.appendChild(wrapper);

  const galaxyContainer = wrapper.querySelector('.sg-galaxy-container') as HTMLElement;
  const svgContainer = wrapper.querySelector('.sg-lines-svg') as SVGSVGElement;
  const nodesContainer = wrapper.querySelector('.sg-nodes-container') as HTMLElement;

  // 3. Render Lines (SVG)
  config.connections.forEach(([sourceId, targetId]) => {
    const source = config.nodes.find(n => n.id === sourceId);
    const target = config.nodes.find(n => n.id === targetId);

    if (source && target) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', `${source.x}%`);
      line.setAttribute('y1', `${source.y}%`);
      line.setAttribute('x2', `${target.x}%`);
      line.setAttribute('y2', `${target.y}%`);
      line.setAttribute('class', 'sg-line');
      line.dataset.source = sourceId;
      line.dataset.target = targetId;
      svgContainer.appendChild(line);
    }
  });

  // 4. Render Nodes
  config.nodes.forEach(node => {
    const nodeEl = document.createElement('div');
    nodeEl.className = `sg-node ${node.size}`;
    nodeEl.style.left = `${node.x}%`;
    nodeEl.style.top = `${node.y}%`;
    nodeEl.dataset.id = node.id;

    // Add bobbing animation delay
    const delay = Math.random() * 2;
    nodeEl.style.animation = `sgFloat 6s ease-in-out ${delay}s infinite`;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodeEl.style.animation = 'none';
    }

    nodeEl.innerHTML = `<div class="sg-label">${node.label}</div>`;

    // Hover Interaction
    nodeEl.addEventListener('mouseenter', () => highlightConnections(node.id));
    nodeEl.addEventListener('mouseleave', () => resetConnections());

    nodesContainer.appendChild(nodeEl);
  });

  // 5. Interaction Logic
  const highlightConnections = (nodeId: string) => {
    // Highlight lines connected to this node
    const lines = svgContainer.querySelectorAll('.sg-line');
    lines.forEach(line => {
      const l = line as SVGLineElement;
      if (l.dataset.source === nodeId || l.dataset.target === nodeId) {
        l.classList.add('active');
      } else {
        l.style.opacity = '0.1'; // Dim others
      }
    });

    // Dim other nodes
    const nodes = nodesContainer.querySelectorAll('.sg-node');
    nodes.forEach(n => {
      const el = n as HTMLElement;
      if (el.dataset.id !== nodeId) {
        el.style.opacity = '0.3';
      }
    });
  };

  const resetConnections = () => {
    const lines = svgContainer.querySelectorAll('.sg-line');
    lines.forEach(line => {
      const l = line as SVGLineElement;
      l.classList.remove('active');
      l.style.opacity = '';
    });

    const nodes = nodesContainer.querySelectorAll('.sg-node');
    nodes.forEach(n => {
      const el = n as HTMLElement;
      el.style.opacity = '';
    });
  };

  // 6. Particle System
  const particlesContainer = wrapper.querySelector('.sg-particles') as HTMLElement;
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'sg-particle';
    const size = Math.random() * 2 + 1;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.animationDuration = `${Math.random() * 20 + 20}s`;
    p.style.animationDelay = `${Math.random() * 10}s`;
    particlesContainer.appendChild(p);
  }

  // API
  const api = {
    dispose: () => {
      container.innerHTML = '';
    }
  };

  return api;
};
