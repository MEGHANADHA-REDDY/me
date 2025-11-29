import config from './config-skills';

export const initSkillsConstellation = (container: HTMLElement) => {
    const { skills, connections, categories } = config;
    let activeCategory = 'all';
    let activeNodeId: string | null = null;

    // 1. Setup Structure
    container.innerHTML = `
    <div class="sc-wrapper">
      <div class="sc-bg-layer">
        <div class="sc-grid"></div>
      </div>
      
      <div class="sc-header">
        <h2 class="sc-title">Skills & Tools</h2>
        <p class="sc-subtitle">The technologies I use to build fast, scalable, modern web apps.</p>
        
        <div class="sc-filters">
          ${categories.map(cat => `
            <button class="sc-filter-chip ${cat.id === 'all' ? 'active' : ''}" data-cat="${cat.id}">
              ${cat.label}
            </button>
          `).join('')}
        </div>
      </div>
      
      <div class="sc-canvas-container">
        <svg class="sc-svg-layer"></svg>
        <div class="sc-nodes-layer"></div>
      </div>
      
      <div class="sc-fallback-grid">
        ${skills.map(skill => `
          <div class="sc-fallback-card">
            <div class="sc-fallback-info">
              <span class="sc-fallback-name">${skill.label}</span>
              <span class="sc-fallback-desc">${skill.shortDesc}</span>
            </div>
            <span class="sc-fallback-prof">${skill.proficiency}%</span>
          </div>
        `).join('')}
      </div>
      
      <!-- Detail Panel -->
      <div class="sc-panel-overlay">
        <div class="sc-panel" role="dialog" aria-modal="true">
          <button class="sc-panel-close" aria-label="Close panel">&times;</button>
          <div class="sc-panel-content">
            <!-- Content injected here -->
          </div>
        </div>
      </div>
    </div>
  `;

    const svgLayer = container.querySelector('.sc-svg-layer') as SVGSVGElement;
    const nodesLayer = container.querySelector('.sc-nodes-layer') as HTMLElement;
    const filterChips = container.querySelectorAll('.sc-filter-chip');
    const panelOverlay = container.querySelector('.sc-panel-overlay') as HTMLElement;
    const panelClose = container.querySelector('.sc-panel-close') as HTMLElement;
    const panelContent = container.querySelector('.sc-panel-content') as HTMLElement;

    // 2. Render Connections (SVG)
    const renderConnections = () => {
        svgLayer.innerHTML = '';
        connections.forEach(([sourceId, targetId]) => {
            const source = skills.find(s => s.id === sourceId);
            const target = skills.find(s => s.id === targetId);

            if (source && target) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', `${source.x}%`);
                line.setAttribute('y1', `${source.y}%`);
                line.setAttribute('x2', `${target.x}%`);
                line.setAttribute('y2', `${target.y}%`);
                line.setAttribute('class', 'sc-line');
                line.dataset.source = sourceId;
                line.dataset.target = targetId;
                svgLayer.appendChild(line);
            }
        });
    };

    // 3. Render Nodes
    const renderNodes = () => {
        nodesLayer.innerHTML = '';
        skills.forEach(skill => {
            const node = document.createElement('div');
            node.className = 'sc-node';
            node.style.left = `${skill.x}%`;
            node.style.top = `${skill.y}%`;
            node.setAttribute('tabindex', '0');
            node.setAttribute('role', 'button');
            node.setAttribute('aria-label', `${skill.label}, ${skill.proficiency}% proficiency`);
            node.dataset.id = skill.id;
            node.dataset.cat = skill.category;

            // Proficiency Ring Calculation
            const radius = 24;
            const circumference = 2 * Math.PI * radius; // ~150
            const offset = circumference - (skill.proficiency / 100) * circumference;

            node.innerHTML = `
        <div class="sc-node-ring">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle class="sc-node-progress" cx="26" cy="26" r="${radius}" 
              stroke-dasharray="${circumference}" 
              stroke-dashoffset="${offset}">
            </circle>
          </svg>
        </div>
        <div class="sc-node-core"></div>
        <div class="sc-node-label">${skill.label}</div>
      `;

            // Float Animation
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                const delay = Math.random() * 2;
                node.style.animation = `scFloat 4s ease-in-out ${delay}s infinite alternate`;
            }

            // Events
            node.addEventListener('click', () => openPanel(skill));
            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPanel(skill);
                }
            });
            node.addEventListener('mouseenter', () => highlightNode(skill.id));
            node.addEventListener('mouseleave', resetHighlights);

            nodesLayer.appendChild(node);
        });
    };

    // 4. Interactions
    const highlightNode = (id: string) => {
        // Dim others
        const nodes = nodesLayer.querySelectorAll('.sc-node');
        nodes.forEach(n => {
            const el = n as HTMLElement;
            if (el.dataset.id !== id) el.style.opacity = '0.3';
            else el.style.opacity = '1';
        });

        // Highlight lines
        const lines = svgLayer.querySelectorAll('.sc-line');
        lines.forEach(l => {
            const line = l as SVGElement;
            if (line.dataset.source === id || line.dataset.target === id) {
                line.classList.add('active');
                line.style.opacity = '1';
            } else {
                line.style.opacity = '0.1';
            }
        });
    };

    const resetHighlights = () => {
        if (activeCategory !== 'all') {
            filterNodes(activeCategory);
            return;
        }
        const nodes = nodesLayer.querySelectorAll('.sc-node');
        nodes.forEach(n => (n as HTMLElement).style.opacity = '1');
        const lines = svgLayer.querySelectorAll('.sc-line');
        lines.forEach(l => {
            l.classList.remove('active');
            (l as SVGElement).style.opacity = '';
        });
    };

    const filterNodes = (cat: string) => {
        activeCategory = cat;

        // Update chips
        filterChips.forEach(chip => {
            if (chip.getAttribute('data-cat') === cat) chip.classList.add('active');
            else chip.classList.remove('active');
        });

        // Filter nodes
        const nodes = nodesLayer.querySelectorAll('.sc-node');
        nodes.forEach(n => {
            const el = n as HTMLElement;
            if (cat === 'all' || el.dataset.cat === cat) {
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
            } else {
                el.style.opacity = '0.1';
                el.style.pointerEvents = 'none';
            }
        });

        // Filter lines (only show if both ends are visible)
        const lines = svgLayer.querySelectorAll('.sc-line');
        lines.forEach(l => {
            const line = l as SVGElement;
            const source = skills.find(s => s.id === line.dataset.source);
            const target = skills.find(s => s.id === line.dataset.target);

            if (cat === 'all' || (source?.category === cat && target?.category === cat)) {
                line.style.opacity = '0.4';
            } else {
                line.style.opacity = '0.05';
            }
        });
    };

    // 5. Detail Panel
    const openPanel = (skill: any) => {
        activeNodeId = skill.id;
        panelContent.innerHTML = `
      <span class="sc-panel-category">${skill.category}</span>
      <h3 class="sc-panel-title">${skill.label}</h3>
      <div class="sc-panel-prof-bar">
        <div class="sc-panel-prof-fill" style="width: ${skill.proficiency}%"></div>
      </div>
      <p class="sc-panel-desc">${skill.shortDesc}</p>
      
      <div class="sc-panel-examples">
        <h4>Examples</h4>
        <ul>
          ${skill.examples.map((ex: string) => `<li>${ex}</li>`).join('')}
        </ul>
      </div>
    `;
        panelOverlay.classList.add('open');
        panelClose.focus();
    };

    const closePanel = () => {
        panelOverlay.classList.remove('open');
        if (activeNodeId) {
            const node = nodesLayer.querySelector(`[data-id="${activeNodeId}"]`) as HTMLElement;
            node?.focus();
        }
        activeNodeId = null;
    };

    // Event Listeners
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => filterNodes(chip.getAttribute('data-cat') || 'all'));
    });

    panelClose.addEventListener('click', closePanel);
    panelOverlay.addEventListener('click', (e) => {
        if (e.target === panelOverlay) closePanel();
    });

    // Escape key to close panel
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panelOverlay.classList.contains('open')) closePanel();
    });

    // Initial Render
    renderConnections();
    renderNodes();

    // Add float keyframes if not exists
    if (!document.getElementById('sc-keyframes')) {
        const style = document.createElement('style');
        style.id = 'sc-keyframes';
        style.innerHTML = `
      @keyframes scFloat {
        0% { transform: translate(-50%, -50%) translateY(0); }
        100% { transform: translate(-50%, -50%) translateY(-10px); }
      }
    `;
        document.head.appendChild(style);
    }

    return {
        dispose: () => {
            container.innerHTML = '';
        }
    };
};
