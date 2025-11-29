/* src/components/AboutLarge/config-about-large.ts
   Default tuning values for the Cinematic About Large section (V2).
*/
export default {
    placement: {
        titleBlockHeight: 'auto',
        gutter: '6vw',
        columns: [58, 38] // percentages
    },
    palette: {
        moonSilver: '#EDE7FF',
        neonOrchid: '#FF93D1',
        subLav: '#D5C8FF',
        bgDeep: '#0B0010',
        maroonTop: '#1b0720',
        maroonMid: '#56002e',
        vignetteDk: 'rgba(6,3,10,0.55)',
        lineSoft: 'rgba(255,147,209,0.12)'
    },
    particles: {
        count: 30,
        opacity: 0.04,
        speed: 0.2
    },
    orbs: {
        large: { size: 180, bobAmp: 10, bobDur: 6000 },
        small: { size: 80, bobAmp: 8, bobDur: 4500, orbitDur: 12000 },
        sheenInterval: 7000
    },
    passion: {
        items: [
            { title: 'Building clarity from complexity', text: 'I break down ambiguous ideas into clean, buildable systems.' },
            { title: 'Performance with purpose', text: 'Fast apps feel better — I optimize everything that matters.' },
            { title: 'Design + Engineering', text: 'Beautiful interfaces backed by solid, scalable code.' },
            { title: 'Shipping fast', text: 'I love rapid prototyping and delivering value quickly.' }
        ]
    },
    trust: {
        items: [
            '20+ Projects',
            '3+ Years Experience',
            'React • Node • Cloud'
        ]
    },
    animation: {
        titleDur: 800,
        stagger: 100,
        contentDelay: 300
    },
    responsive: {
        mobileBreakpoint: 768,
        reduceAnimationsBelow: 768
    }
};
