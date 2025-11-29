export const CONFIG = {
    colors: {
        primary: "#7B2BFF", // Neon Purple
        accent: "#00E5FF",  // Cyan
        fill: "#FF66C4",    // Hot Pink
    },
    particles: {
        count: 50000,
        size: 0.05,
    },
    bloom: {
        intensity: 1.5,
        threshold: 0.1,
    },
    lensing: {
        intensity: 0.3,
    },
    camera: {
        fov: 45,
        position: [0, 3, 14],
    },
};

// Global API
(window as any).NeonAccretion = {
    config: CONFIG,
    setPalette: (name: string) => {
        console.log("Setting palette:", name);
        // Implementation would go here to update state
    },
};
