/* src/components/FinalHero/config.ts
   Default tuning values for the Final Hero overlay.
   Devs can change these values quickly to retune behavior.
*/
export default {
    // Placement of hero text (left-centered)
    heroPlacement: {
        left: '6vw',        // CSS offset from left
        top: '48vh',        // vertical position center-ish
        maxWidth: 640       // px, max width of hero text container
    },

    // Typography & color palette (CSS variables will be set from these)
    palette: {
        moonSilver: '#EDE7FF',   // Primary headline color
        neonOrchid: '#FF93D1',   // Accent words
        subLav: '#D5C8FF',       // Subhead color
        ctaWhite: '#FFFFFF',     // CTA fill color
        secondaryBorder: 'rgba(255,255,255,0.12)',
        vignetteDark: 'rgba(6,3,10,0.55)'
    },

    // Vignette behind text
    vignette: {
        width: 780,
        height: 420,
        blur: 28,
        opacity: 0.55,      // base opacity in the center; edge alpha handled in gradient
        centerOffsetX: 0,   // px offset to nudge vignette center horizontally (optional)
        centerOffsetY: -20  // px offset vertically
    },

    // Parallax ranges (px of translation at max movement)
    parallaxRanges: {
        foreground: 12,
        mid: 6,
        back: 3,
        moon: 1,
        heroText: 4,
        orb: 6,
        holoParticles: 8
    },

    // Right-side elements defaults
    rightElements: {
        showOrb: true,
        orbSize: 56,              // px
        orbBobbing: 8,            // px bob amplitude
        orbBobbingDuration: 4000, // ms loop
        showHologramLine: true,
        holoLineWidth: 2,         // px (1 or 2)
        holoParticleCount: 8,
        holoPulseIntensity: 0.12, // float: opacity amplitude
        showQuote: true,
        quoteText: 'Building clarity from complexity.',
        quoteRotation: -90        // degrees
    },

    // Animation timings (ms)
    timing: {
        overlayFadeIn: 250,
        overlaySlide: 550,
        ctaStagger: 70,
        rightElementsDelay: 900
    },

    // Scroll transform breakpoints (px)
    scroll: {
        reduceParallaxStart: 200,
        reduceParallaxEnd: 600,
        pauseEffectsAt: 600,
        collapseHeroAt: 900
    },

    // Performance & LOD
    perf: {
        dprClamp: 1.5,
        mobileParallaxFactor: 0.25,
        mobileHideRightElementsBelow: 760, // px
        safeModeDefaults: {
            vignetteOpacityMultiplier: 1.1, // stronger vignette in safe mode
            disableParticles: true,
            reduceOrbitAnimations: true
        }
    }
};
