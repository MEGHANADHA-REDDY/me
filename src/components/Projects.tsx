import { motion } from "framer-motion";

const ProjectCard = ({ title, description, tags, gradient }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-xl border border-[#2A0E61] bg-[#0300145e] backdrop-blur-sm shadow-lg hover:shadow-[#2A0E61]/50 transition-shadow duration-300 w-full md:w-[350px] group"
        >
            {/* Holographic Image Placeholder */}
            <div className={`h-[200px] w-full ${gradient} relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#030014] to-transparent" />
            </div>

            <div className="p-6 relative z-10">
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{description}</p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full border border-[#7042f88b] text-gray-300 bg-[#2A0E61]/20">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    const projects = [
        {
            title: "Cosmic Dashboard",
            description: "A high-performance analytics dashboard with 3D data visualization using Three.js and D3.",
            tags: ["React", "Three.js", "D3", "Tailwind"],
            gradient: "bg-gradient-to-br from-purple-600 to-blue-600",
        },
        {
            title: "Nebula Chat",
            description: "Real-time encrypted messaging application with a futuristic UI and end-to-end security.",
            tags: ["Next.js", "Socket.io", "Redis", "Prisma"],
            gradient: "bg-gradient-to-br from-cyan-500 to-green-500",
        },
        {
            title: "Gravity E-Commerce",
            description: "Headless e-commerce platform built for speed and scalability with advanced filtering.",
            tags: ["Next.js", "Stripe", "Sanity", "Framer Motion"],
            gradient: "bg-gradient-to-br from-orange-500 to-red-500",
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center py-20 relative z-[20]" id="projects">
            <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10">
                My Projects
            </h1>
            <div className="flex flex-wrap justify-center gap-10 px-10 max-w-[1200px]">
                {projects.map((project, index) => (
                    <ProjectCard key={index} {...project} />
                ))}
            </div>
        </div>
    );
};

export default Projects;
