
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-secondary overflow-hidden pt-32 pb-32">

            {/* Editorial Header */}
            <section className="px-6 md:px-12 max-w-[1600px] mx-auto mb-32 relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-[1px] bg-border"></div>
                        <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.4em] text-text-muted">Our Philosophy</span>
                    </div>
                    <h1 className="font-serif text-6xl md:text-[140px] font-light text-secondary mb-12 leading-[0.85] tracking-[-0.03em] max-w-5xl">
                        The <span className="text-text-muted italic">Collective</span>
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                        <div className="md:col-span-5 md:col-start-8">
                            <p className="text-stone-500 text-lg md:text-2xl font-light leading-[1.6]">
                                We are not just a service; we are a curated collective of Bali's finest wellness professionals, dedicated to bringing the sanctuary to you.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Visual Asymmetrical Section */}
            <section className="max-w-[1600px] mx-auto px-6 md:px-12 mb-40 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">

                    {/* Left large image */}
                    <div className="lg:col-span-7 relative">
                        <div className="w-full h-[60vh] lg:h-[80vh] rounded-none overflow-hidden relative border border-border">
                            <img
                                src="https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                alt="Therapist"
                                className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-[2s] ease-out brightness-95"
                            />
                        </div>
                        {/* Floating quote card */}
                        <div className="absolute -bottom-10 right-0 lg:-right-12 bg-white/95 backdrop-blur-xl p-8 lg:p-12 shadow-none max-w-sm rounded-none border border-border">
                            <p className="font-serif font-light text-2xl lg:text-3xl mb-8 leading-tight text-secondary">"True luxury is comfort without effort."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-[1px] bg-border"></div>
                                <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-text-muted">Our Promise</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-5 space-y-16 pt-16 lg:pt-0">
                        <div>
                            <h3 className="text-text-muted text-[9px] font-sans font-semibold uppercase tracking-[0.4em] mb-6 block">Our Standard</h3>
                            <h2 className="font-serif text-5xl md:text-6xl font-light text-secondary mb-8 leading-[0.9] tracking-[-0.02em]">Excellence in Motion</h2>
                            <p className="text-stone-500 leading-[1.8] text-lg font-light">
                                Every therapist in our collective has served in 5-star resorts. We bring this level of expertise, discretion, and skill to your private villa. We understand that your time in Bali is precious.
                            </p>
                        </div>

                        <div className="flex flex-col gap-12 border-t border-border pt-12">
                            <div className="flex gap-8 group">
                                <span className="text-border group-hover:text-primary transition-colors font-serif text-4xl font-light italic shrink-0">01.</span>
                                <div>
                                    <h4 className="font-sans font-semibold text-[10px] uppercase tracking-[0.3em] text-secondary mb-3">Vetted Professionals</h4>
                                    <p className="text-[15px] font-light text-stone-500 leading-relaxed">Strict background checks and skill assessments for every therapist.</p>
                                </div>
                            </div>
                            <div className="flex gap-8 group">
                                <span className="text-border group-hover:text-primary transition-colors font-serif text-4xl font-light italic shrink-0">02.</span>
                                <div>
                                    <h4 className="font-sans font-semibold text-[10px] uppercase tracking-[0.3em] text-secondary mb-3">Hygiene Protocols</h4>
                                    <p className="text-[15px] font-light text-stone-500 leading-relaxed">Hospital-grade sterilization and meticulous sanitation for every session.</p>
                                </div>
                            </div>
                            <div className="flex gap-8 group">
                                <span className="text-border group-hover:text-primary transition-colors font-serif text-4xl font-light italic shrink-0">03.</span>
                                <div>
                                    <h4 className="font-sans font-semibold text-[10px] uppercase tracking-[0.3em] text-secondary mb-3">Complete Setup</h4>
                                    <p className="text-[15px] font-light text-stone-500 leading-relaxed">We bring the entire spa: fresh linens, ambient music, oils, and tables.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default About;
