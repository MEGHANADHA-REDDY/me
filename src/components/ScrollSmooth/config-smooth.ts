export const SMOOTH_CONFIG = {
    // Core Physics
    inertia: 0.08, // Lower = smoother/heavier (0.05 - 0.1)
    wheelMultiplier: 1.0, // Scroll speed multiplier

    // Snapping
    snapEnabled: true,
    snapThreshold: 50, // Pixel distance to snap point to trigger snap
    snapStrength: 0.05, // How fast it snaps (0.01 - 0.1)

    // Visuals
    maskHeight: 150, // Height of the fade mask between sections (px)

    // Performance
    mobileBreakpoint: 768,
    dprClamp: 1.5, // Max device pixel ratio to render

    // Accessibility
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};
