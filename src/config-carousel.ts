export const CAROUSEL_CONFIG = {
    containerSelector: '#projects-carousel',
    // projectsSource: '/assets/sample-projects.json', // We'll import directly in React
    faceWidth: 420,           // px at desktop scale
    faceHeight: 260,          // px
    facePadding: 0,           // zero => connected faces
    radius: null,             // auto-calc if null based on faceWidth and faceCount
    faceCount: 6,            // default, derived from projects array if different
    autoplay: true,
    autoplaySpeed: 0.005,     // radians per frame-ish (tweakable for smoothness)
    rotateEase: 0.08,         // easing when user drags / arrow pressed
    hoverTranslateZ: 36,      // px forward on hover (reduced-motion off)
    clickZoomScale: 1.06,
    shimmerDuration: 7000,
    reducedMotion: false,
    responsive: {
        breakpoints: { mobile: 760, tablet: 1120 },
        faceWidthMobile: 260,
        faceHeightMobile: 160
    }
};
