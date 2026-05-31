'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Heart, Cloud, Sparkles, Droplet, User, Flame, Clock, ArrowRight, X, ShoppingBag, Plus } from 'lucide-react';
import Link from 'next/link';
import { useSpa } from '@/context/SpaContext';

// Dummy data for redesign structure
const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'massage', label: 'Massage' },
    { id: 'facial', label: 'Facial' },
    { id: 'treatment', label: 'Treatment' },
    { id: 'package', label: 'Package' },
];


export default function Home() {
    const { treatments, campaign, products } = useSpa();
    const [activeCategory, setActiveCategory] = useState('all');
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden font-sans text-text pb-24 md:pb-12">
            
            {/* Top Gradient Background */}
            <div className="absolute top-0 left-0 right-0 h-[400px] md:h-[500px] bg-gradient-to-b from-[#D2F34C] to-[#FDFBF7] z-0 pointer-events-none"></div>

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
                {campaign && (
                <div onClick={() => setIsCampaignModalOpen(true)} className="block outline-none">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full h-[240px] md:h-[420px] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-[0_20px_40px_rgb(0,0,0,0.12)] mb-8 group cursor-pointer bg-primary"
                    >
                        {/* Background Image */}
                        <img 
                            src="https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&crop=center" 
                            alt={campaign.title} 
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
                                    {campaign.label}
                                </motion.span>
                            </div>

                            <div className="flex items-end justify-between">
                                <div className="flex flex-col text-white">
                                    
                                    <h2 className="font-serif text-4xl md:text-6xl font-medium leading-tight tracking-tight mb-2 opacity-95 drop-shadow-sm mt-auto">
                                        {campaign.title}
                                    </h2>
                                    <p className="text-white/70 text-[13px] md:text-base hidden md:block max-w-md leading-relaxed font-light">
                                        {campaign.description}
                                    </p>
                                </div>

                                {/* Minimal Apple-style Frosted Button */}
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white flex items-center justify-center shrink-0 shadow-[0_8px_32px_rgb(0,0,0,0.12)] group-hover:bg-white/20 group-hover:scale-105 group-active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                    <ArrowRight size={20} strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                )}

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
                    <div className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 gap-6 no-scrollbar">
                        {treatments.map((item, idx) => (
                            <Link href="/rituals" key={item.id} className="w-72 md:w-80 shrink-0 block group outline-none">
                                <div className={`rounded-[32px] md:rounded-[40px] bg-gradient-to-br ${item.bgPattern} border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-700 flex flex-col h-full relative overflow-hidden group-hover:-translate-y-2 p-6 md:p-8`}>
                                    
                                    {/* Subtle glowing orb for spa ambiance */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/60 blur-[30px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>

                                    <div className="mb-8 flex items-start justify-between relative z-10">
                                        <div className="bg-white/60 backdrop-blur-sm border border-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex-grow flex flex-col">
                                        <h4 className="font-serif text-3xl font-medium text-primary mb-4 leading-tight">{item.title}</h4>
                                        <p className="text-sm text-text-muted leading-relaxed font-light mb-8 flex-grow">{item.desc}</p>
                                        
                                        <div className="mt-auto pt-6 border-t border-border/50">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted mb-3 uppercase tracking-widest">
                                                <Clock className="w-3.5 h-3.5" /> {item.options[0]?.duration}
                                            </div>
                                            <div className="flex items-center justify-between bg-gray-50/80 backdrop-blur-sm rounded-full p-1 pl-4 border border-gray-100">
                                                <span className="font-semibold text-gray-900 text-[15px]">Rp {item.options[0]?.price}</span>
                                                <button className="w-10 h-10 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0 shadow-sm">
                                                    <Plus size={20} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* The Elexoir Boutique Section */}
                <div className="mb-32">
                    <div className="flex items-center justify-between mb-8 px-6 md:px-0">
                        <div>
                            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1 block">Take the Spa Home</span>
                            <h3 className="font-serif text-2xl md:text-3xl text-primary font-medium leading-tight">Spa Boutique</h3>
                        </div>
                        <a href="/store" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap shrink-0">
                            Shop Now
                        </a>
                    </div>
                    
                    {/* Swipeable Products */}
                    <div className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 gap-6 no-scrollbar">
                        {products.map((product) => (
                            <a href="/store" key={product.id} className="w-48 md:w-52 shrink-0 block outline-none">
                                <div className="bg-white border border-[#E5E7EB] rounded-[24px] flex flex-col h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group p-2">
                                    
                                    {/* Image */}
                                    <div className="aspect-[4/5] relative bg-[#F5F5F7] overflow-hidden rounded-[16px]">
                                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    
                                    {/* Text Info */}
                                    <div className="flex flex-col flex-grow px-2 md:px-3 pt-3 pb-2">
                                        <p className="text-gray-400 text-[11px] font-medium mb-1 line-clamp-1">{product.category || 'Elexoir'}</p>
                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-4">{product.title}</h4>
                                        
                                        {/* Price and Add Button */}
                                        <div className="flex items-center justify-between bg-gray-50 rounded-full p-1 pl-3 mt-auto border border-gray-100">
                                            <span className="font-semibold text-gray-900 text-[13px]">Rp {parseInt(product.price.replace(/,/g, '')).toLocaleString('id-ID')}</span>
                                            <div className="w-8 h-8 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0 shadow-sm">
                                                <Plus size={16} strokeWidth={2.5} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
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

            {/* Campaign Modal */}
            {isCampaignModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="bg-[#FDFBF7] w-full h-[90dvh] md:h-auto md:max-h-[85vh] md:max-w-3xl md:rounded-[40px] rounded-t-[40px] shadow-2xl relative overflow-hidden flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="p-6 md:p-8 flex items-center justify-between border-b border-border/50 bg-white shrink-0">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-[9px] font-bold tracking-widest uppercase text-primary mb-2">
                                    {campaign?.title}
                                </div>
                                <h2 className="font-serif text-2xl text-primary">{campaign?.label}</h2>
                            </div>
                            <button 
                                onClick={() => setIsCampaignModalOpen(false)}
                                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:bg-border transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Modal Content (Campaign Treatments) */}
                        <div className="p-6 md:p-8 overflow-y-auto bg-[#FDFBF7]">
                            <p className="text-sm text-text-muted mb-6">{campaign?.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {campaign?.selectedTreatments.flatMap(ct => {
                                    const treatment = treatments.find(t => t.id === ct.treatmentId);
                                    if (!treatment) return [];
                                    
                                    return ct.durations.map(duration => {
                                        const option = treatment.options.find(o => o.duration === duration);
                                        if (!option) return null;
                                        
                                        const originalPriceNum = parseInt(option.price.replace(/,/g, ''));
                                        const discountedPriceNum = originalPriceNum * (1 - (campaign.discountPercentage / 100));
                                        
                                        return (
                                            <Link href="/rituals" key={`${treatment.id}-${duration}`} className="block group outline-none" onClick={() => setIsCampaignModalOpen(false)}>
                                                <div className="rounded-[32px] p-6 bg-white border border-border/40 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col h-full relative overflow-hidden group-hover:-translate-y-1">
                                                    <div className="mb-4 flex items-start justify-between">
                                                        <div className="bg-primary/5 border border-primary/10 text-primary px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm">
                                                            {treatment.category}
                                                        </div>
                                                        <div className="bg-accent/20 text-accent px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest">
                                                            -{campaign.discountPercentage}%
                                                        </div>
                                                    </div>
                                                    <h4 className="font-serif text-xl font-medium text-primary mb-2 leading-tight">{treatment.title}</h4>
                                                    <p className="text-xs text-text-muted leading-relaxed font-light mb-6 flex-grow">{treatment.desc}</p>
                                                    
                                                    <div className="mt-auto pt-4 border-t border-border/50">
                                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-text-muted mb-1.5 uppercase tracking-widest"><Clock className="w-3 h-3" /> {duration}</div>
                                                        <div className="flex items-end justify-between">
                                                            <div>
                                                                <span className="text-[10px] text-text-muted line-through mr-2">Rp {option.price}</span>
                                                                <span className="font-serif text-lg text-primary">Rp {discountedPriceNum.toLocaleString('en-US')}</span>
                                                            </div>
                                                            <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                                <ArrowRight size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    });
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
