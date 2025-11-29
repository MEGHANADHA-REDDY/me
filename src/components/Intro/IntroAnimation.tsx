import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedText } from '../ui/animated-text';

interface IntroAnimationProps {
    onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Total duration = delay + (letters * duration) + extra wait
        // "MEGHANADHA" = 10 letters
        // delay = 0.1, duration = 0.1 (fast stagger)
        // Animation time approx 1.5s
        // Wait another 1.5s for reading
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800); // Wait for exit animation
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030014]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    <AnimatedText
                        text="MEGHANAD"
                        textClassName="text-5xl md:text-7xl font-bold text-white tracking-wider"
                        underlineGradient="from-[#EDE7FF] via-[#FF93D1] to-[#EDE7FF]"
                        underlineHeight="h-1"
                        duration={0.1}
                        delay={0.1}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
