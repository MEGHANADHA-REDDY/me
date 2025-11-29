import { PROJECTS_CONFIG } from './config-projects';

export const initProjectsSection = (container: HTMLElement) => {
    const { projects, categories, skills } = PROJECTS_CONFIG;
    // let activeCategory = 'all';

    // 1. Setup Structure
    container.innerHTML = `
        <div class="projects-wrapper">
            <div class="projects-container">
                <!-- Header -->
                <div class="proj-header ss-stagger-item">
                    <span class="proj-label">— Work</span>
                    <h2 class="proj-title">Selected Projects</h2>
                </div>

                <!-- Skill Cloud -->
                <div class="proj-skill-cloud ss-stagger-item">
                    ${skills.map(skill => `
                        <span class="proj-skill-pill ${skill.level.toLowerCase()}" data-id="${skill.id}">
                            ${skill.label}
                        </span>
                    `).join('')}
                </div>

                <!-- Filters -->
                <div class="proj-filters ss-stagger-item">
                    ${categories.map(cat => `
                        <button class="proj-filter-chip ${cat.id === 'all' ? 'active' : ''}" data-cat="${cat.id}">
                            ${cat.label}
                        </button>
                    `).join('')}
                </div>

                <!-- Grid -->
                <div class="proj-grid">
                    ${projects.map(project => `
                        <article class="proj-card ss-stagger-item" data-id="${project.id}" data-cats="${project.category.join(',')}" tabindex="0">
                            <div class="proj-card-media">
                                <img src="${project.image}" alt="${project.title}" class="proj-card-img" loading="lazy" />
                            </div>
                            <div class="proj-card-content">
                                <h3 class="proj-card-title">${project.title}</h3>
                                <div class="proj-tags">
                                    ${project.tags.slice(0, 3).map(tag => `<span class="proj-tag">${tag}</span>`).join('')}
                                </div>
                                <p class="proj-card-desc">${project.desc}</p>
                                <div class="proj-actions">
                                    <a href="${project.links.demo}" class="proj-btn proj-btn-primary" target="_blank">View Case</a>
                                    <a href="${project.links.github}" class="proj-btn proj-btn-secondary" target="_blank">GitHub</a>
                                </div>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </div>

            <!-- Lightbox (Hidden by default) -->
            <div class="proj-lightbox" id="proj-lightbox">
                <div class="proj-lightbox-content">
                    <button class="proj-lightbox-close">&times;</button>
                    <div id="proj-lightbox-body"></div>
                </div>
            </div>
        </div>
    `;

    const filterChips = container.querySelectorAll('.proj-filter-chip');
    const cards = container.querySelectorAll('.proj-card');
    const lightbox = container.querySelector('#proj-lightbox') as HTMLElement;
    // const lightboxBody = container.querySelector('#proj-lightbox-body') as HTMLElement;
    const closeBtn = container.querySelector('.proj-lightbox-close') as HTMLElement;

    // 2. Filter Logic
    const filterProjects = (cat: string) => {
        // activeCategory = cat;

        // Update Chips
        filterChips.forEach(chip => {
            if (chip.getAttribute('data-cat') === cat) chip.classList.add('active');
            else chip.classList.remove('active');
        });

        // Filter Cards
        cards.forEach(card => {
            const el = card as HTMLElement;
            const cats = el.dataset.cats?.split(',') || [];

            if (cat === 'all' || cats.includes(cat)) {
                el.style.display = 'flex';
                // Trigger reflow for animation
                setTimeout(() => el.classList.add('visible'), 50);
            } else {
                el.style.display = 'none';
                el.classList.remove('visible');
            }
        });
    };

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => filterProjects(chip.getAttribute('data-cat') || 'all'));
    });

    /*
    // 3. Lightbox Logic (Optional - currently using direct links)
    const openLightbox = (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        lightboxBody.innerHTML = `
            <h2 class="proj-title" style="font-size: 32px; margin-bottom: 20px;">${project.title}</h2>
            <img src="${project.image}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;" />
            <p style="color: #ccc; line-height: 1.6;">${project.desc}</p>
            <div class="proj-tags" style="margin-top: 20px;">
                ${project.tags.map(tag => `<span class="proj-tag">${tag}</span>`).join('')}
            </div>
            <div class="proj-actions" style="margin-top: 30px;">
                <a href="${project.links.demo}" class="proj-btn proj-btn-primary" target="_blank">Live Demo</a>
                <a href="${project.links.github}" class="proj-btn proj-btn-secondary" target="_blank">Source Code</a>
            </div>
        `;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };
    */

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Card Click -> Lightbox (optional, currently buttons handle links)
    // If user wants card click to open lightbox, uncomment below:
    /*
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking buttons
            if ((e.target as HTMLElement).tagName === 'A') return;
            openLightbox(card.getAttribute('data-id') || '');
        });
    });
    */

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // 4. Skill Cloud Click -> Filter
    const skillPills = container.querySelectorAll('.proj-skill-pill');
    skillPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Simple logic: just filter to 'all' for now, or implement tag-based filtering
            // For MVP, let's just highlight it
            skillPills.forEach(p => (p as HTMLElement).style.borderColor = 'transparent');
            (pill as HTMLElement).style.borderColor = 'var(--al-neon-orchid)';
        });
    });

    return {
        dispose: () => {
            container.innerHTML = '';
        }
    };
};
