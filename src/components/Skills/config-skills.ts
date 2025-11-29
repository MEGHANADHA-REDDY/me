// CDN URLs for Tech Logos (Simple Icons)
const icons = {
    js: 'https://cdn.simpleicons.org/javascript',
    ts: 'https://cdn.simpleicons.org/typescript',
    react: 'https://cdn.simpleicons.org/react',
    next: 'https://cdn.simpleicons.org/nextdotjs',
    three: 'https://cdn.simpleicons.org/threedotjs',

    node: 'https://cdn.simpleicons.org/nodedotjs',
    express: 'https://cdn.simpleicons.org/express',

    mongo: 'https://cdn.simpleicons.org/mongodb',
    postgres: 'https://cdn.simpleicons.org/postgresql',
    mysql: 'https://cdn.simpleicons.org/mysql',

    git: 'https://cdn.simpleicons.org/git',
    docker: 'https://cdn.simpleicons.org/docker',
    aws: 'https://cdn.simpleicons.org/amazonaws',
    n8n: 'https://cdn.simpleicons.org/n8n',

    python: 'https://cdn.simpleicons.org/python',
    java: 'https://cdn.simpleicons.org/openjdk',
};

export const orbitData = {
    rings: [
        { id: 'frontend', label: 'Frontend', radius: 140 },
        { id: 'backend', label: 'Backend', radius: 210 },
        { id: 'db', label: 'Database', radius: 280 },
        { id: 'tools', label: 'Tools', radius: 350 },
        { id: 'lang', label: 'Languages', radius: 420 },
    ],
    skills: [
        // Ring 1: Frontend (5 skills)
        { id: 'js', label: 'JavaScript', ringId: 'frontend', angle: 0, desc: 'Core', icon: icons.js },
        { id: 'ts', label: 'TypeScript', ringId: 'frontend', angle: 72, desc: 'Typed JS', icon: icons.ts },
        { id: 'react', label: 'React', ringId: 'frontend', angle: 144, desc: 'UI Library', icon: icons.react },
        { id: 'next', label: 'Next.js', ringId: 'frontend', angle: 216, desc: 'Framework', icon: icons.next },
        { id: 'three', label: 'Three.js', ringId: 'frontend', angle: 288, desc: '3D', icon: icons.three },

        // Ring 2: Backend (2 skills)
        { id: 'node', label: 'Node.js', ringId: 'backend', angle: 45, desc: 'Runtime', icon: icons.node },
        { id: 'express', label: 'Express', ringId: 'backend', angle: 225, desc: 'Framework', icon: icons.express },

        // Ring 3: Database (3 skills)
        { id: 'mongo', label: 'MongoDB', ringId: 'db', angle: 0, desc: 'NoSQL', icon: icons.mongo },
        { id: 'postgres', label: 'PostgreSQL', ringId: 'db', angle: 120, desc: 'Relational', icon: icons.postgres },
        { id: 'mysql', label: 'MySQL', ringId: 'db', angle: 240, desc: 'Relational', icon: icons.mysql },

        // Ring 4: Tools (4 skills)
        { id: 'git', label: 'Git', ringId: 'tools', angle: 30, desc: 'Version Control', icon: icons.git },
        { id: 'docker', label: 'Docker', ringId: 'tools', angle: 120, desc: 'Containers', icon: icons.docker },
        { id: 'aws', label: 'AWS', ringId: 'tools', angle: 210, desc: 'Cloud', icon: icons.aws },
        { id: 'n8n', label: 'n8n', ringId: 'tools', angle: 300, desc: 'Automation', icon: icons.n8n },

        // Ring 5: Languages (2 skills)
        { id: 'python', label: 'Python', ringId: 'lang', angle: 90, desc: 'Scripting', icon: icons.python },
        { id: 'java', label: 'Java', ringId: 'lang', angle: 270, desc: 'OOP', icon: icons.java },
    ],
    categories: [
        { id: 'all', label: 'All' },
        { id: 'frontend', label: 'Frontend' },
        { id: 'backend', label: 'Backend' },
        { id: 'db', label: 'Database' },
        { id: 'tools', label: 'Tools' },
        { id: 'lang', label: 'Languages' },
    ]
};

export default orbitData;
