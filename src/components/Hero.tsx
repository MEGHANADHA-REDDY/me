import { motion } from "framer-motion";
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "../utils/motion";
import { Star } from "lucide-react";

const Hero = () => {
    return (
        <div className="relative flex flex-col h-screen w-full items-center justify-center z-[20]">
            <div className="absolute top-0 left-0 w-full h-full z-[-1] bg-gradient-to-b from-transparent to-black/80" />

            <div className="flex flex-col gap-5 justify-center items-center text-center max-w-[800px] px-5">
                <motion.div
                    variants={slideInFromTop}
                    initial="hidden"
                    animate="visible"
                    className="py-[10px] px-[15px] border border-[#7042f88b] opacity-[0.9] rounded-full bg-[#0300145e] backdrop-blur-md flex items-center gap-2"
                >
                    <Star className="text-[#b49bff] w-4 h-4" />
                    <h1 className="text-[#b49bff] text-[14px]">
                        Fullstack Developer Portfolio
                    </h1>
                </motion.div>

                <motion.div
                    variants={slideInFromLeft(0.5)}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-6 mt-6 text-6xl md:text-7xl font-bold text-white w-auto h-auto leading-tight"
                >
                    <span>
                        Providing
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                            {" "}
                            the best{" "}
                        </span>
                        <br />
                        project experience
                    </span>
                </motion.div>

                <motion.p
                    variants={slideInFromRight(0.8)}
                    initial="hidden"
                    animate="visible"
                    className="text-lg text-gray-400 my-5 max-w-[600px]"
                >
                    I&apos;m a Full Stack Software Engineer with experience in Website,
                    Mobile, and Software development. Check out my projects and skills.
                </motion.p>

                <motion.div
                    variants={slideInFromLeft(1)}
                    initial="hidden"
                    animate="visible"
                    className="flex gap-5"
                >
                    <a
                        href="#projects"
                        className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg bg-gradient-to-r from-[#2A0E61] to-[#7042f88b] hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#2A0E61]/50"
                    >
                        Learn More
                    </a>
                    <a
                        href="#contact"
                        className="py-3 px-8 border border-[#7042f88b] text-center text-white cursor-pointer rounded-lg hover:bg-[#7042f88b]/20 transition-all duration-300"
                    >
                        Contact Me
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
