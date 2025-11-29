export const PROJECTS_CONFIG = {
    categories: [
        { id: 'all', label: 'All' },
        { id: 'web', label: 'Web' },
        { id: 'frontend', label: 'Frontend' },
        { id: 'backend', label: 'Backend' },
        { id: 'ai', label: 'AI/ML' },
        { id: 'tools', label: 'Tools' }
    ],
    skills: [
        { id: 'react', label: 'React', level: 'Expert' },
        { id: 'next', label: 'Next.js', level: 'Expert' },
        { id: 'three', label: 'Three.js', level: 'Proficient' },
        { id: 'node', label: 'Node.js', level: 'Expert' },
        { id: 'ts', label: 'TypeScript', level: 'Expert' },
        { id: 'python', label: 'Python', level: 'Proficient' },
        { id: 'aws', label: 'AWS', level: 'Intermediate' }
    ],
    projects: [
        {
            id: 'cosmic-portfolio',
            title: 'Cosmic Portfolio',
            lede: 'Interactive 3D portfolio with WebGL experiments',
            desc: 'A 3D interactive portfolio featuring a retro-cosmic aesthetic, smooth scroll choreography, and WebGL experiments. Built to showcase advanced frontend techniques and immersive design.',
            tags: ['React', 'Three.js', 'TypeScript'],
            category: ['web', 'frontend'],
            heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1614730341194-75c607400070?q=80&w=800&auto=format&fit=crop'
            ],
            highlights: ['3D WebGL interactions', 'Smooth scroll choreography', 'Performance optimized'],
            links: {
                demo: '#',
                github: '#'
            },
            year: 2025,
            role: 'Solo Developer',
            priority: 1
        },
        {
            id: 'nebula-chat',
            title: 'Nebula AI Chat',
            lede: 'Real-time AI chat with streaming responses',
            desc: 'A next-generation chat interface powered by LLMs. Features real-time streaming, markdown rendering, and context-aware conversations in a beautiful glassmorphism UI.',
            tags: ['Next.js', 'OpenAI', 'Tailwind'],
            category: ['web', 'ai', 'fullstack'],
            heroImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1676299081847-824916de030a?q=80&w=800&auto=format&fit=crop'
            ],
            highlights: ['Real-time token streaming', 'Context awareness', 'Glassmorphism UI'],
            links: {
                demo: '#',
                github: '#'
            },
            year: 2024,
            role: 'Full Stack Dev',
            priority: 2
        },
        {
            id: 'task-flow',
            title: 'TaskFlow Automation',
            lede: 'Visual node-based workflow builder',
            desc: 'A powerful visual programming tool for automating repetitive tasks. Users can drag and drop nodes to create complex logic flows without writing code.',
            tags: ['React', 'Redux', 'Node.js'],
            category: ['web', 'tools', 'backend'],
            heroImage: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1200&auto=format&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1558494949-efc02570fbc9?q=80&w=800&auto=format&fit=crop'
            ],
            highlights: ['Visual Node Editor', 'Real-time execution', 'Custom plugin system'],
            links: {
                demo: '#',
                github: '#'
            },
            year: 2024,
            role: 'Lead Engineer',
            priority: 3
        },
        {
            id: 'crypto-dash',
            title: 'Crypto Dashboard',
            lede: 'Live market tracking and portfolio management',
            desc: 'A high-performance dashboard for tracking cryptocurrency markets. Features live websocket updates, interactive D3.js charts, and portfolio analytics.',
            tags: ['Vue', 'D3.js', 'Firebase'],
            category: ['web', 'frontend'],
            heroImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1642104704074-907c0698b98d?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=800&auto=format&fit=crop'
            ],
            highlights: ['Websocket Integration', 'Interactive D3 Charts', 'Real-time Analytics'],
            links: {
                demo: '#',
                github: '#'
            },
            year: 2023,
            role: 'Frontend Dev',
            priority: 4
        }
    ]
};
