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
        <div className="min-h-screen bg-gradient-to-b from-[#D2F34C] via-[#FDFBF7] to-[#FDFBF7] relative overflow-hidden font-sans text-text pb-24 md:pb-12">
            
            {/* Luxurious Ambient Background */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] md:w-[800px] h-[600px] bg-secondary/30 blur-[120px] rounded-full z-0 pointer-events-none opacity-60 mix-blend-multiply" />
            <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full z-0 pointer-events-none opacity-50" />

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
                                    className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-2xl text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase border border-white/40 text-white shadow-[0_4px_24px_rgb(0,0,0,0.12)]"
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
                                    className={`flex items-center justify-center px-6 py-3 rounded-full whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                        isActive 
                                            ? 'bg-primary text-white shadow-[0_8px_20px_rgb(0,0,0,0.12)] scale-[1.02] border border-primary' 
                                            : 'bg-white/40 backdrop-blur-md text-primary border border-white/60 hover:bg-white/80 hover:scale-[1.02]'
                                    }`}
                                >
                                    <span className="text-sm font-semibold tracking-wide">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Popular Treatments Scroll */}
                <div className="mb-24">
                    <div className="flex overflow-x-auto pb-6 -mx-6 px-6 md:mx-0 md:px-0 gap-4 no-scrollbar">
                        {[
                            { title: 'Deep Tissue Flow', category: 'Massage', price: 'Rp 450,000', time: '90 Min', bg: 'from-secondary/80 to-highlight/40' },
                            { title: 'Radiance Facial', category: 'Facial', price: 'Rp 350,000', time: '60 Min', bg: 'from-accent/60 to-highlight/30' },
                            { title: 'Couples Retreat', category: 'Package', price: 'Rp 1,200,000', time: '120 Min', bg: 'from-highlight/80 to-surface' },
                        ].map((item, idx) => (
                            <Link href="/rituals" key={idx} className="w-56 md:w-64 shrink-0 block group outline-none">
                                <div className={`rounded-[32px] overflow-hidden relative shadow-[0_8px_24px_rgb(0,0,0,0.04)] bg-gradient-to-br ${item.bg} h-80 w-full mb-4`}>
                                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500"></div>
                                    <div className="absolute top-5 left-5 bg-white/40 backdrop-blur-md border border-white/20 text-primary px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                        {item.category}
                                    </div>
                                    <div className="absolute bottom-5 left-5 right-5 text-primary">
                                        <h4 className="font-serif text-2xl font-medium mb-2 leading-tight">{item.title}</h4>
                                        <div className="flex items-center justify-between text-xs font-semibold text-primary/80">
                                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {item.time}</span>
                                            <span>{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* The Elexoir Experience (Next Level Section) */}
                <div className="mb-32">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-serif text-3xl md:text-4xl text-primary font-medium mb-2">The Elexoir Experience</h3>
                            <p className="text-sm text-text-muted">Elevating your wellness journey in Bali.</p>
                        </div>
                        <div className="hidden md:flex">
                            <button className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity">
                                Read Our Story <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {/* Big Cinematic Card */}
                        <div className="md:col-span-2 rounded-[32px] overflow-hidden relative h-64 md:h-96 shadow-soft group bg-gradient-to-br from-[#1C1F1D] via-[#2A2E2C] to-[#1C1F1D]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none"></div>
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-4">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-serif text-3xl font-medium mb-2">Expert Therapists</h4>
                                <p className="text-sm text-white/70 max-w-sm leading-relaxed">Certified Balinese healers bringing centuries of traditional wellness techniques directly to your villa.</p>
                            </div>
                        </div>

                        {/* Two Small Cards */}
                        <div className="flex flex-col gap-4 md:gap-6">
                            <div className="flex-1 bg-surface rounded-[32px] p-6 md:p-8 shadow-sm border border-border/50 relative overflow-hidden flex flex-col justify-end">
                                <div className="w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <Droplet className="w-4 h-4" />
                                </div>
                                <h4 className="font-serif text-xl text-primary font-medium mb-2">100% Organic Oils</h4>
                                <p className="text-xs text-text-muted leading-relaxed">Locally sourced, cold-pressed essential oils.</p>
                            </div>
                            
                            <div className="flex-1 bg-primary rounded-[32px] p-6 md:p-8 shadow-sm relative overflow-hidden text-white flex flex-col justify-end">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-4">
                                        <Flame className="w-4 h-4 text-white" />
                                    </div>
                                    <h4 className="font-serif text-xl font-medium mb-2">Holistic Healing</h4>
                                    <p className="text-xs text-white/70 leading-relaxed">Restoring the vital balance of body and spirit.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Us */}
                <div className="mb-24 flex flex-col md:flex-row gap-12 md:gap-24 items-center">
                    <div className="flex-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/50 mb-4 block">Our Philosophy</span>
                        <h3 className="font-serif text-4xl md:text-5xl text-primary font-medium mb-6 leading-tight">
                            Sanctuary for the Soul
                        </h3>
                        <p className="text-text-muted leading-relaxed mb-8 font-light">
                            Born from the ancient healing traditions of Bali, Elexoir Home Spa was created with a singular vision: to bring unparalleled luxury and profound relaxation directly to your sanctuary. We believe that true wellness requires an environment where you feel completely at ease—your own home or villa.
                        </p>
                        <button className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity">
                            Discover Our Story <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="flex-1 w-full relative">
                        <div className="aspect-[4/3] rounded-[40px] overflow-hidden bg-gradient-to-br from-highlight/60 to-surface border border-white shadow-soft relative flex items-center justify-center p-8 text-center">
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent_100%)] pointer-events-none"></div>
                             <div className="relative z-10">
                                 <h4 className="font-serif text-3xl text-primary mb-3 italic">"A journey to pure tranquility."</h4>
                                 <p className="text-[10px] text-primary/60 uppercase tracking-widest font-bold">Vogue Wellness</p>
                             </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
