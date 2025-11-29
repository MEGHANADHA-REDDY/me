export const PROJECTS_CONFIG = {
    camera: {
        fov: 45, // Wider FOV to see more
        near: 0.1,
        far: 2000,
        startPos: { x: 0, y: 100, z: 900 } // Further back to see all
    },
    platforms: {
        count: 4,
        spacingX: 380, // Tighter spacing
        spacingZ: 150, // More depth separation
        width: 320,
        height: 200,
        depth: 20
    },
    animation: {
        cameraDuration: 1000,
        hoverLift: 10,
        selectScale: 1.06,
        easing: [0.22, 0.9, 0.31, 1]
    },
    colors: {
        moonSilver: 0xEDE7FF,
        neonOrchid: 0xFF93D1,
        platformDark: 0x2A0520, // Lighter maroon for better visibility
        platformEdge: 0xFF93D1,
        bgDeep: 0x0B0010
    },
    perf: {
        dprClamp: 1.5,
        mobileFallbackWidth: 768
    }
};
