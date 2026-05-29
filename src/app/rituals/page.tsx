'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Share, Heart, MapPin, MessageSquare, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function RitualsDetails() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans text-text pb-24 md:pb-12 pt-6 md:pt-12">
            
            <div className="max-w-3xl mx-auto px-6">
                
                {/* Header Actions */}
                <header className="flex items-center justify-between mb-8">
                    <Link href="/">
                        <button className="w-12 h-12 rounded-full bg-white border border-border/50 flex items-center justify-center text-primary shadow-soft hover:bg-surface transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-primary hover:bg-white/50 transition-colors">
                            <Share className="w-5 h-5" />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-primary hover:bg-white/50 transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Title & Location */}
                <div className="mb-6">
                    <h1 className="font-serif text-4xl md:text-5xl text-primary leading-[1.1] mb-3">
                        Deep Tissue Flow
                    </h1>
                    <p className="flex items-center gap-1.5 text-sm text-text-muted">
                        <MapPin className="w-4 h-4" />
                        In-Villa Service, Ubud, Bali
                    </p>
                </div>

                {/* Tags */}
                <div className="flex overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 gap-2 no-scrollbar mb-8">
                    {['Deep Tissue', 'Relaxation', 'Oil Massage', '90 Mins'].map((tag, idx) => (
                        <span key={idx} className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-white rounded-xl text-xs font-medium text-primary whitespace-nowrap shadow-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Bento Grid Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    
                    {/* Reviews */}
                    <div className="bg-accent/40 rounded-[28px] p-5 flex flex-col justify-between h-36">
                        <div className="flex items-start justify-between">
                            <span className="text-sm font-medium text-primary/80">Reviews</span>
                            <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-primary">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <span className="text-3xl font-medium text-primary">4.9</span>
                            <span className="text-[10px] text-primary/60 ml-1">(120 Reviews)</span>
                        </div>
                    </div>

                    {/* Duration/Availability */}
                    <div className="bg-highlight/60 rounded-[28px] p-5 flex flex-col justify-between h-36">
                        <div className="flex items-start justify-between">
                            <span className="text-sm font-medium text-primary/80">Duration</span>
                            <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-primary">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <span className="text-3xl font-medium text-primary">90m</span>
                            <span className="text-[10px] text-primary/60 ml-1">Session</span>
                        </div>
                    </div>

                    {/* Price & Action (Spans full width on mobile, 1 col on desktop) */}
                    <div className="col-span-2 md:col-span-1 bg-primary rounded-[32px] p-5 md:p-6 flex flex-col justify-between h-auto md:h-36 relative overflow-hidden shadow-soft-lg">
                        <div className="absolute -top-4 -right-4 text-white/10 w-24 h-24">
                            {/* Abstract decorative element in background */}
                            <Sparkles className="w-full h-full" />
                        </div>
                        <div className="relative z-10 flex md:flex-col justify-between items-end md:items-start h-full gap-4 md:gap-0">
                            <div className="flex flex-col">
                                <span className="text-xs text-white/70 mb-1">Price</span>
                                <span className="text-3xl font-serif text-white">$ 120</span>
                            </div>
                            <button className="w-full md:w-auto bg-white text-primary px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors shadow-soft">
                                Choose Date <Calendar className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Description */}
                <div className="mb-12">
                    <p className="text-sm text-text-muted leading-relaxed">
                        A powerful, focused massage designed to relieve severe tension in the muscle and the connective tissue or fascia. This type of massage focuses on the muscles located below the surface of the top muscles. Highly recommended for individuals who experience consistent pain, are involved in heavy physical activity, or patients who have sustained physical injury.
                    </p>
                </div>

                {/* Related */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-text-muted">Related Treatments</h3>
                        <Link href="/" className="text-xs font-semibold text-primary underline underline-offset-4">View All</Link>
                    </div>
                    
                    <div className="flex overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 gap-4 no-scrollbar">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="w-32 h-44 shrink-0 rounded-2xl overflow-hidden relative group shadow-soft">
                                <img 
                                    src={`https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop&crop=center&random=${item}`} 
                                    alt="Related Treatment" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/30 backdrop-blur-md rounded text-[9px] font-bold text-white">4.8</div>
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h4 className="text-xs font-medium text-white leading-tight">Balinese Radiance</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
