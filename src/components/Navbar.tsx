import { useState, useEffect } from "react";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-md py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <a href="#" className="text-2xl font-bold tracking-tighter text-white">
                    AG.
                </a>
                <div className="hidden md:flex gap-8">
                    <a href="#projects" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                        Projects
                    </a>
                    <a href="#about" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                        About
                    </a>
                    <a href="#contact" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                        Contact
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
