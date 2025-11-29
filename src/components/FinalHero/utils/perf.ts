import config from '../config';

export const getClampedDPR = () => {
    return Math.min(window.devicePixelRatio || 1, config.perf.dprClamp);
};

export const shouldReduceMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const isMobile = () => {
    return window.innerWidth < config.perf.mobileHideRightElementsBelow;
};
