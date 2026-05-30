'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Heart, Cloud, Sparkles, Droplet, User, Flame, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Dummy data for redesign structure
const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'massage', label: 'Massage' },
    { id: 'facial', label: 'Facial' },
    { id: 'treatment', label: 'Treatment' },
    { id: 'package', label: 'Package' },
];


export default function Home() {
    const [activeCategory, setActiveCategory] = useState('all');

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans text-text pb-24 md:pb-12">
            
            {/* Top Gradient Background */}
            <div className="absolute top-0 left-0 right-0 h-[60vh] md:h-[40vh] bg-gradient-to-b from-secondary via-secondary/60 to-background z-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 md:pt-36">
                
                {/* Slogan */}
                <div className="md:hidden mt-4 mb-6 px-2">
                    <h1 className="font-serif text-3xl text-primary font-medium tracking-tight">
                        The Art of <br/>
                        <span className="italic opacity-80">Wellbeing</span>
                    </h1>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden relative mb-8">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-text-muted" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search your favourite treatment..." 
                        className="w-full bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl py-4 pl-12 pr-12 text-sm text-primary shadow-soft focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-text-muted"
                    />
                    <button className="absolute inset-y-2 right-2 w-10 bg-secondary/30 rounded-xl flex items-center justify-center text-primary hover:bg-secondary/50 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>
                </div>

                {/* Cinematic Campaign Card (Below Search) */}
                <Link href="/rituals" className="block outline-none">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full h-[240px] md:h-[420px] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-[0_20px_40px_rgb(0,0,0,0.12)] mb-8 group cursor-pointer bg-primary"
                    >
                        {/* Background Image */}
                        <img 
                            src="https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&crop=center" 
                            alt="Summer Retreat" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        />
                        
                        {/* Cinematic Vignette & Gradients (Apple-like depth) */}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-1000"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent"></div>
                        
                        {/* Content Overlay */}
                        <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between z-10">
                            
                            {/* Top Label */}
                            <div className="flex justify-start">
                                <motion.span 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/90 backdrop-blur-xl text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase border border-secondary text-primary shadow-[0_4px_12px_rgb(0,0,0,0.1)]"
                                >
                                    Limited Offer
                                </motion.span>
                            </div>

                            <div className="flex items-end justify-between">
                                <div className="flex flex-col text-white">
                                    
                                    <h2 className="font-serif text-4xl md:text-6xl font-medium leading-tight tracking-tight mb-2 opacity-95 drop-shadow-sm mt-auto">
                                        Summer Retreat
                                    </h2>
                                    <p className="text-white/70 text-[13px] md:text-base hidden md:block max-w-md leading-relaxed font-light">
                                        Rejuvenate your mind and body with our exclusive summer packages. Enjoy up to 20% off all signature treatments.
                                    </p>
                                </div>

                                {/* Minimal Apple-style Frosted Button */}
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white flex items-center justify-center shrink-0 shadow-[0_8px_32px_rgb(0,0,0,0.12)] group-hover:bg-white/20 group-hover:scale-105 group-active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                    <ArrowRight size={20} strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Categories */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">Popular Category</h3>
                    <div className="flex overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 gap-3 no-scrollbar">
                        {CATEGORIES.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center justify-center px-6 py-3.5 rounded-2xl whitespace-nowrap transition-all shadow-soft border border-white/50 ${
                                        isActive 
                                            ? 'bg-primary text-white shadow-soft-lg' 
                                            : 'bg-white/60 backdrop-blur-sm text-primary hover:bg-white/90'
                                    }`}
                                >
                                    <span className="text-sm font-medium">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                
            </div>
        </div>
    );
}
