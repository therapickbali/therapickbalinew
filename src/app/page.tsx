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

const TREATMENTS = [
    {
        id: '1',
        title: 'Deep Tissue Flow',
        duration: '60 Min',
        price: 'IDR 450,000',
        location: 'Ubud, Bali',
        favorite: false,
    },
    {
        id: '2',
        title: 'Balinese Radiance',
        duration: '90 Min',
        price: 'IDR 550,000',
        location: 'Ubud, Bali',
        favorite: true,
    }
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

                <p className="text-xs text-text-muted mb-4">{TREATMENTS.length} result found</p>

                {/* Treatment Grid/List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {TREATMENTS.map((treatment, idx) => (
                        <motion.div 
                            key={treatment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link href="/rituals" className="block relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group overflow-hidden">
                                
                                {/* Decorative subtle glow */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/40 rounded-full blur-[40px] pointer-events-none group-hover:bg-white/60 transition-colors duration-500" />

                                <div className="flex justify-between items-start mb-12 relative z-10">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-white/50 text-[10px] font-bold tracking-widest uppercase text-primary/70 w-max shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                                            <Clock size={10} strokeWidth={3} />
                                            {treatment.duration}
                                        </span>
                                    </div>
                                    <button className="w-10 h-10 rounded-full bg-white/60 border border-white/50 flex items-center justify-center text-primary shadow-sm hover:scale-110 hover:bg-white transition-all z-10 shrink-0">
                                        <Heart className={`w-5 h-5 ${treatment.favorite ? 'fill-primary text-primary' : ''}`} />
                                    </button>
                                </div>
                                
                                <div className="relative z-10">
                                    <h3 className="font-serif text-2xl md:text-3xl text-primary font-medium mb-4 group-hover:text-primary/70 transition-colors">
                                        {treatment.title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-0.5">Price</span>
                                            <p className="text-base md:text-lg font-bold text-primary tracking-wide">
                                                {treatment.price}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-500">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
                
            </div>
        </div>
    );
}
