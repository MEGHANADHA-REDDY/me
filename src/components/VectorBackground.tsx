import { motion } from "framer-motion";
import { useMemo } from "react";

const VectorBackground = () => {
    // Generate random ships
    const ships = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => {
            const isLeft = i % 2 === 0;
            const startX = isLeft ? -100 : 2020;
            const startY = Math.random() * 300 - 100; // Top area
            const delay = Math.random() * 20; // Sporadic waves (0-20s delay)
            const duration = 1.5 + Math.random() * 1.5; // Fast speed

            // Calculate angle to center (960, 540)
            const dx = 960 - startX;
            const dy = 540 - startY;
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

            return {
                id: i,
                startX,
                startY,
                angle,
                delay,
                duration,
            };
        });
    }, []);

    return (
        <div className="fixed inset-0 z-0 w-full h-full bg-[#0C0218] overflow-hidden">
            <svg
                className="w-full h-full"
                viewBox="0 0 1920 1080"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Original Purple/Maroon Sky Gradient */}
                    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0C0218" />
                        <stop offset="50%" stopColor="#520026" />
                        <stop offset="100%" stopColor="#8D0041" />
                    </linearGradient>

                    {/* Moon Gradient (Restored) */}
                    <linearGradient id="moonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#CFAAC3" />
                    </linearGradient>

                    {/* Ship Trail Gradient */}
                    <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    </linearGradient>
                </defs>

                {/* Sky Background */}
                <rect width="1920" height="1080" fill="url(#skyGradient)" />

                {/* Moon */}
                <circle cx="960" cy="540" r="400" fill="url(#moonGradient)" />

                {/* Mountain Back Layer (Restored Maroon #5A0027) */}
                <path
                    d="M0,750 L150,720 L300,780 L450,680 L600,760 L800,700 L1000,780 L1200,690 L1400,770 L1600,710 L1800,760 L1920,730 V1080 H0 Z"
                    fill="#5A0027"
                />

                {/* Mountain Mid Layer (Restored Maroon #300014) */}
                <path
                    d="M0,900 L200,850 L350,920 L500,840 L700,910 L900,860 L1100,930 L1300,850 L1500,920 L1700,870 L1920,910 V1080 H0 Z"
                    fill="#300014"
                />

                {/* Mountain Front Layer (Restored Maroon #120008) */}
                <path
                    d="M0,1080 L0,980 L180,920 L360,1000 L540,930 L720,1020 L900,940 L1080,1010 L1260,950 L1440,1030 L1620,960 L1800,1020 L1920,990 V1080 Z"
                    fill="#120008"
                />

                {/* Attack Swarm */}
                {ships.map((ship) => (
                    <motion.g
                        key={ship.id}
                        initial={{ x: ship.startX, y: ship.startY, opacity: 0 }}
                        animate={{ x: 960, y: 540, opacity: [0, 1, 1, 0] }} // Fade out at impact
                        transition={{
                            duration: ship.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: ship.delay,
                        }}
                    >
                        <g transform={`rotate(${ship.angle})`}>
                            {/* Ship Body (Pointing Right) */}
                            <polygon points="10,0 -10,-5 -10,5" fill="#FFFFFF" />
                            {/* Trail (Behind) */}
                            <rect x="-70" y="-1" width="60" height="2" fill="url(#trailGradient)" />
                        </g>
                    </motion.g>
                ))}

            </svg>
        </div>
    );
};

export default VectorBackground;
