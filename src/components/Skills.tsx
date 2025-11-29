import { motion } from "framer-motion";
import { FaReact, FaHtml5, FaCss3Alt, FaNodeJs, FaJava, FaDocker } from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiRedux, SiMongodb, SiPostgresql, SiGraphql, SiFramer } from "react-icons/si";

const SkillIcon = ({ Icon, color, name, index }: { Icon: any, color: string, name: string, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-2 group cursor-pointer"
        >
            <div className="w-20 h-20 rounded-full bg-[#1a1a2e] border border-[#7042f88b] flex items-center justify-center shadow-lg shadow-[#2A0E61]/50 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon className={`w-10 h-10 ${color}`} />
            </div>
            <span className="text-gray-300 text-sm font-medium">{name}</span>
        </motion.div>
    );
};

const Skills = () => {
    const skills = [
        { name: "React", Icon: FaReact, color: "text-cyan-400" },
        { name: "Next.js", Icon: SiNextdotjs, color: "text-white" },
        { name: "TypeScript", Icon: SiTypescript, color: "text-blue-500" },
        { name: "Tailwind", Icon: SiTailwindcss, color: "text-cyan-300" },
        { name: "Redux", Icon: SiRedux, color: "text-purple-500" },
        { name: "Node.js", Icon: FaNodeJs, color: "text-green-500" },
        { name: "MongoDB", Icon: SiMongodb, color: "text-green-400" },
        { name: "PostgreSQL", Icon: SiPostgresql, color: "text-blue-400" },
        { name: "GraphQL", Icon: SiGraphql, color: "text-pink-500" },
        { name: "Framer", Icon: SiFramer, color: "text-white" },
        { name: "HTML5", Icon: FaHtml5, color: "text-orange-500" },
        { name: "CSS3", Icon: FaCss3Alt, color: "text-blue-500" },
        { name: "Docker", Icon: FaDocker, color: "text-blue-400" },
        { name: "Java", Icon: FaJava, color: "text-red-500" },
    ];

    return (
        <section id="skills" className="flex flex-col items-center justify-center gap-10 py-20 relative z-[20]">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                    Tech Stack
                </h1>
                <p className="text-gray-400 text-lg text-center max-w-[600px]">
                    Technologies I use to build scalable applications
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 max-w-[1000px] px-5">
                {skills.map((skill, index) => (
                    <SkillIcon key={index} {...skill} index={index} />
                ))}
            </div>
        </section>
    );
};

export default Skills;
