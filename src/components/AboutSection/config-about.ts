/* src/components/AboutSection/config-about.ts
   Default tuning values for the About Me section.
*/
export default {
    placement: { paddingTop: '6vh', centerGap: '4vw' },
    palette: {
        moonSilver: '#EDE7FF',
        neonOrchid: '#FF93D1',
        subLav: '#D5C8FF',
        vignette: 'rgba(6,3,10,0.55)'
    },
    orb: {
        enabled: true,
        size: 120,
        bobAmplitude: 8,
        bobDuration: 4000,
        sheenDuration: 6500
    },
    animation: {
        enterDuration: 450,
        headingDelay: 120,
        paragraphDelay: 240
    },
    responsive: {
        mobileBreakpoint: 760,
        mobileOrbSize: 80
    },
    accessibility: {
        prefersReducedMotion: true
    }
};
