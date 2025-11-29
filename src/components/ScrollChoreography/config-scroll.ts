export const scrollConfig = {
    // Core Scrolling
    smoothDuration: 520, // ms for inertia scroll
    wheelMultiplier: 0.8, // Sensitivity for wheel events

    // Snapping
    snapEnabled: true,
    snapThreshold: 0.18, // Fraction of section height to trigger snap
    softSnapDuration: 600,

    // Pinning & Parallax
    maxPinDistance: 0.22, // Fraction of viewport height to pin Hero
    parallaxStrength: 0.1, // Strength of parallax effect

    // Safety & Mobile
    mobileBreakpoint: 760, // px
    prefersReducedMotion: typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false,

    // Easing Functions
    easing: {
        easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
        easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    }
};

export default scrollConfig;
