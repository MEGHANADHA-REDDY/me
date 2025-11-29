/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#030014",
                primary: "#2A0E61",
                secondary: "#7042f88b",
                accent: "#00f0ff",
                "glass-border": "rgba(255, 255, 255, 0.1)",
                "glass-bg": "rgba(255, 255, 255, 0.03)",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "hero-glow": "conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)",
            },
        },
    },
    plugins: [],
}
