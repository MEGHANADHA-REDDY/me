import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [formState, setFormState] = useState({
        name: '',
        mail: '',
        message: ''
    });
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsTransmitting(true);
        setError('');

        // EmailJS Configuration
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        console.log('Attempting transmission with:', {
            serviceId: serviceId ? 'Present' : 'Missing',
            templateId: templateId ? 'Present' : 'Missing',
            publicKey: publicKey ? 'Present' : 'Missing'
        });

        if (!serviceId || !templateId || !publicKey) {
            console.warn('EmailJS keys are missing. Simulating transmission.');
            // Fallback simulation if keys are missing
            setTimeout(() => {
                setIsTransmitting(false);
                setIsSent(true);
                setFormState({ name: '', mail: '', message: '' });
                setTimeout(() => setIsSent(false), 5000);
            }, 2000);
            return;
        }

        if (formRef.current) {
            emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)
                .then((result) => {
                    console.log('Transmission successful:', result.text);
                    setIsTransmitting(false);
                    setIsSent(true);
                    setFormState({ name: '', mail: '', message: '' });
                    setTimeout(() => setIsSent(false), 8000);
                }, (error) => {
                    console.error('Transmission failed:', error);
                    setIsTransmitting(false);
                    setError('TRANSMISSION FAILED. RETRY.');
                });
        }
    };

    // Orb animation variants based on typing activity
    const isTyping = formState.name.length > 0 || formState.mail.length > 0 || formState.message.length > 0;

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center py-20 overflow-hidden">
            {/* Cosmic Grid Background (Optional overlay if needed, otherwise transparent) */}
            <div className="absolute inset-0 pointer-events-none bg-[url('/grid.svg')] opacity-10 bg-center [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">

                {/* Left Side: Animated Orb & Status */}
                <div className="flex flex-col items-center justify-center gap-8 w-full md:w-1/3">
                    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                        {/* Core Orb */}
                        <motion.div
                            animate={{
                                scale: isTyping ? [1, 1.1, 1] : [1, 1.05, 1],
                                opacity: isTyping ? 1 : 0.8
                            }}
                            transition={{
                                duration: isTyping ? 0.5 : 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute w-32 h-32 rounded-full bg-[#FF93D1] blur-2xl opacity-40"
                        />
                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: isTyping ? 1.1 : 1
                            }}
                            transition={{
                                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                scale: { duration: 0.2 }
                            }}
                            className="absolute w-40 h-40 border border-[#FF93D1]/30 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute w-52 h-52 border border-[#EDE7FF]/20 rounded-full border-dashed"
                        />

                        {/* Center Status Text */}
                        <div className="absolute text-[#EDE7FF] font-mono text-xs tracking-widest text-center">
                            <div className="opacity-50">SYSTEM STATUS</div>
                            <div className={`font-bold ${isTyping ? 'text-[#FF93D1] animate-pulse' : 'text-[#EDE7FF]'}`}>
                                {isTyping ? 'RECEIVING INPUT' : 'STANDBY'}
                            </div>
                        </div>
                    </div>

                    {/* Social Channels */}
                    <div className="text-center space-y-4">
                        <h3 className="text-[#EDE7FF]/60 text-sm tracking-[0.2em] uppercase">Alternate Channels</h3>
                        <div className="flex gap-6 justify-center">
                            <a
                                href="https://github.com/MEGHANADHA-REDDY"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full border border-[#FF93D1]/30 flex items-center justify-center text-[#FF93D1] hover:bg-[#FF93D1]/10 hover:shadow-[0_0_15px_#FF93D166] transition-all duration-300"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/meghanadha-reddy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full border border-[#FF93D1]/30 flex items-center justify-center text-[#FF93D1] hover:bg-[#FF93D1]/10 hover:shadow-[0_0_15px_#FF93D166] transition-all duration-300"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href="mailto:meghanadreddy005@gmail.com"
                                className="w-12 h-12 rounded-full border border-[#FF93D1]/30 flex items-center justify-center text-[#FF93D1] hover:bg-[#FF93D1]/10 hover:shadow-[0_0_15px_#FF93D166] transition-all duration-300"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Side: Holographic Console */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-1/2 max-w-lg relative"
                >
                    {/* Glass Panel */}
                    <div className="absolute inset-0 bg-[#EDE7FF]/[0.03] backdrop-blur-xl rounded-2xl border border-[#FF93D1]/20 shadow-[0_0_50px_-10px_rgba(255,147,209,0.15)]"></div>

                    {/* Corner Accents */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#FF93D1]"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#FF93D1]"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#FF93D1]"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#FF93D1]"></div>

                    <div className="relative p-8 md:p-10 space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EDE7FF] to-[#FF93D1]">
                                Send Transmission
                            </h2>
                            <p className="text-[#EDE7FF]/60 font-light">
                                Reach out, collaborate, or just say hi.
                            </p>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs text-[#FF93D1]/80 uppercase tracking-wider ml-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter identifier"
                                    className="w-full bg-[#0B0010]/50 border border-[#EDE7FF]/10 rounded-lg px-4 py-3 text-[#EDE7FF] placeholder-[#EDE7FF]/20 focus:outline-none focus:border-[#FF93D1]/50 focus:shadow-[0_0_20px_rgba(255,147,209,0.2)] transition-all duration-300"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-[#FF93D1]/80 uppercase tracking-wider ml-1">Mail</label>
                                <input
                                    type="email"
                                    name="mail"
                                    value={formState.mail}
                                    onChange={handleInputChange}
                                    placeholder="Receiver address"
                                    className="w-full bg-[#0B0010]/50 border border-[#EDE7FF]/10 rounded-lg px-4 py-3 text-[#EDE7FF] placeholder-[#EDE7FF]/20 focus:outline-none focus:border-[#FF93D1]/50 focus:shadow-[0_0_20px_rgba(255,147,209,0.2)] transition-all duration-300"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-[#FF93D1]/80 uppercase tracking-wider ml-1">Message</label>
                                <textarea
                                    name="message"
                                    value={formState.message}
                                    onChange={handleInputChange}
                                    placeholder="Compose message..."
                                    rows={4}
                                    className="w-full bg-[#0B0010]/50 border border-[#EDE7FF]/10 rounded-lg px-4 py-3 text-[#EDE7FF] placeholder-[#EDE7FF]/20 focus:outline-none focus:border-[#FF93D1]/50 focus:shadow-[0_0_20px_rgba(255,147,209,0.2)] transition-all duration-300 resize-none"
                                />
                            </div>

                            {/* Transmission Strength Bar (Decorative) */}
                            <div className="space-y-1 pt-2">
                                <div className="flex justify-between text-[10px] text-[#FF93D1]/60 uppercase tracking-widest">
                                    <span>Signal Strength</span>
                                    <span>{Math.min(100, (formState.message.length / 10) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-1 bg-[#EDE7FF]/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#FF93D1] to-[#EDE7FF]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, Math.max(5, (formState.message.length / 50) * 100))}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isTransmitting || isSent}
                                className="group relative w-full py-4 rounded-lg overflow-hidden font-bold tracking-widest uppercase text-sm transition-all duration-300"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-[#FF93D1] to-[#b866f2] opacity-80 group-hover:opacity-100 transition-opacity duration-300 ${isTransmitting ? 'animate-pulse' : ''}`}></div>
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>

                                <span className="relative z-10 text-white flex items-center justify-center gap-2">
                                    {isTransmitting ? 'TRANSMITTING...' : error ? 'ERROR' : isSent ? 'TRANSMISSION RECEIVED. WILL CONTACT SOON' : 'TRANSMIT SIGNAL →'}
                                </span>

                                {/* Ripple Effect on Click */}
                                {isTransmitting && (
                                    <motion.div
                                        className="absolute inset-0 bg-white/30"
                                        initial={{ scale: 0, opacity: 1 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                    />
                                )}
                            </button>
                            {error && <p className="text-red-400 text-xs text-center tracking-widest">{error}</p>}
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
