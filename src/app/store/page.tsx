'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Filter, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useSpa } from '@/context/SpaContext';

export default function StorePage() {
    const { products } = useSpa();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-background pt-24 pb-32">
            {/* Cinematic Header */}
            <div className="relative overflow-hidden mb-16">
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pt-16 md:pt-24 pb-12">
                    <div className="max-w-2xl">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/50 mb-4 block">Elexoir Boutique</span>
                        <h1 className="font-serif text-5xl md:text-7xl text-primary font-medium mb-6 leading-tight">
                            Bring the <br className="hidden md:block" />
                            <span className="italic text-primary/80">sanctuary home.</span>
                        </h1>
                        <p className="text-text-muted leading-relaxed font-light text-lg">
                            Curated luxury wellness products, organic oils, and signature blends used in our exclusive in-villa treatments.
                        </p>
                    </div>
                </div>
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-highlight/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Toolbar: Search and Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide w-full md:w-auto mask-fade-edges">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                                    activeCategory === cat 
                                        ? 'bg-primary text-white shadow-md scale-105' 
                                        : 'bg-white/60 border border-border/50 text-text-muted hover:bg-white hover:text-primary'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72 shrink-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search boutique..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/60 border border-border/50 rounded-full pl-12 pr-6 py-3 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                key={product.id} 
                                className="group bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:bg-white/80 transition-all duration-500 flex flex-col h-[460px] relative"
                            >
                                {/* Product Image */}
                                <div className="h-[240px] relative overflow-hidden bg-surface/50 p-6 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10 pointer-events-none"></div>
                                    <img 
                                        src={product.image} 
                                        alt={product.title} 
                                        className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-0 shadow-sm"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-white/90 backdrop-blur-md text-primary px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm border border-white">
                                            {product.category}
                                        </span>
                                    </div>
                                    
                                    {/* Hover Overlay Action */}
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 z-10 flex items-center justify-center">
                                        <button className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white text-primary rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
                                            Quick View <ArrowUpRight size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Product Info */}
                                <div className="p-6 flex flex-col flex-1 relative z-20">
                                    <h4 className="font-serif text-2xl font-medium text-primary mb-2 line-clamp-1 group-hover:text-primary/80 transition-colors">{product.title}</h4>
                                    <p className="text-sm text-text-muted leading-relaxed font-light line-clamp-2 mb-6 flex-1">
                                        {product.description}
                                    </p>
                                    
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/30">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-widest text-text-muted/60 font-bold mb-0.5">Price</span>
                                            <span className="font-serif text-xl text-primary font-medium">Rp {product.price}</span>
                                        </div>
                                        <button className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300">
                                            <ShoppingBag size={18} strokeWidth={2} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="py-32 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-text-muted/50 mb-6">
                            <Search size={32} />
                        </div>
                        <h3 className="font-serif text-2xl text-primary mb-2">No products found</h3>
                        <p className="text-text-muted max-w-sm">We couldn't find any products matching your search. Try adjusting your filters.</p>
                        <button 
                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                            className="mt-6 text-xs font-bold uppercase tracking-widest text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
