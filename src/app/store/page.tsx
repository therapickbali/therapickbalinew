'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, X, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useSpa, Product } from '@/context/SpaContext';

export default function StorePage() {
    const { products } = useSpa();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal & Checkout States
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
    });

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Handle scroll lock when modal is open
    useEffect(() => {
        if (selectedProduct) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedProduct]);

    const handleCheckoutSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, send data to backend here.
        setIsCheckout(false);
        setIsSuccess(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsCheckout(false);
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-32">
            {/* Cinematic Header */}
            <div className="relative overflow-hidden mb-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pt-10 md:pt-16 pb-8">
                    <div className="max-w-2xl">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/50 mb-3 block">Elexoir Boutique</span>
                        <h1 className="font-serif text-4xl md:text-6xl text-primary font-medium mb-4 leading-tight">
                            Bring the <span className="italic text-primary/80">sanctuary home.</span>
                        </h1>
                        <p className="text-text-muted leading-relaxed font-light text-sm md:text-base max-w-lg">
                            Curated luxury wellness products, organic oils, and signature blends used in our exclusive in-villa treatments.
                        </p>
                    </div>
                </div>
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-highlight/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                {/* Toolbar: Search and Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10 border-b border-border/50 pb-6">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto mask-fade-edges">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                                    activeCategory === cat 
                                        ? 'bg-primary text-white shadow-md' 
                                        : 'bg-transparent border border-border/50 text-text-muted hover:border-primary/30 hover:text-primary'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64 shrink-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/40 border border-border/50 rounded-full pl-10 pr-4 py-2.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Denser Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                key={product.id} 
                                onClick={() => setSelectedProduct(product)}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)] border border-border/40 transition-all duration-500 flex flex-col cursor-pointer"
                            >
                                {/* Product Image */}
                                <div className="aspect-[4/5] relative overflow-hidden bg-surface p-4 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <img 
                                        src={product.image} 
                                        alt={product.title} 
                                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-0 shadow-sm"
                                    />
                                    
                                    {/* Hover Overlay Action */}
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-500 z-10 flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
                                        <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            <ArrowUpRight size={18} />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Product Info Minimal */}
                                <div className="p-4 flex flex-col">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-1 line-clamp-1">{product.category}</span>
                                    <h4 className="font-serif text-base text-primary mb-1 line-clamp-1 group-hover:text-primary/80 transition-colors">{product.title}</h4>
                                    <span className="text-sm font-semibold text-primary">Rp {product.price}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="py-24 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-text-muted/50 mb-4">
                            <Search size={24} />
                        </div>
                        <h3 className="font-serif text-xl text-primary mb-2">No products found</h3>
                        <button 
                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                            className="mt-4 text-[11px] font-bold uppercase tracking-widest text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Product Details / Checkout Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-0">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        
                        {/* Modal Content */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row z-10"
                        >
                            <button 
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-surface transition-colors"
                            >
                                <X size={16} />
                            </button>

                            {/* Left Side: Image */}
                            <div className="w-full md:w-1/2 bg-surface h-64 md:h-auto relative">
                                <img 
                                    src={selectedProduct.image} 
                                    alt={selectedProduct.title} 
                                    className="w-full h-full object-cover"
                                />
                                {!isCheckout && !isSuccess && (
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-white/90 backdrop-blur-md text-primary px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                            {selectedProduct.category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Content */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                                <AnimatePresence mode="wait">
                                    
                                    {/* STATE: SUCCESS */}
                                    {isSuccess ? (
                                        <motion.div 
                                            key="success"
                                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                            className="h-full flex flex-col items-center justify-center text-center py-12"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-6">
                                                <CheckCircle2 size={40} />
                                            </div>
                                            <h3 className="font-serif text-3xl text-primary font-medium mb-3">Request Received</h3>
                                            <p className="text-sm text-text-muted leading-relaxed mb-8">
                                                Thank you, {formData.name}. Our spa concierge will contact you shortly via {formData.phone || formData.email} to arrange delivery and payment for your {selectedProduct.title}.
                                            </p>
                                            <button 
                                                onClick={closeModal}
                                                className="w-full bg-surface text-primary px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-border/50 transition-colors"
                                            >
                                                Continue Shopping
                                            </button>
                                        </motion.div>
                                    ) : 
                                    
                                    /* STATE: CHECKOUT FORM */
                                    isCheckout ? (
                                        <motion.div 
                                            key="checkout"
                                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                            className="flex flex-col h-full"
                                        >
                                            <div className="mb-8">
                                                <button onClick={() => setIsCheckout(false)} className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-primary transition-colors flex items-center gap-1 mb-4">
                                                    &larr; Back to Details
                                                </button>
                                                <h3 className="font-serif text-3xl text-primary font-medium mb-2">Delivery Details</h3>
                                                <p className="text-xs text-text-muted">Enter your information below and we will coordinate delivery.</p>
                                            </div>

                                            <form onSubmit={handleCheckoutSubmit} className="space-y-4 flex-1 flex flex-col">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Full Name *</label>
                                                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Phone Number *</label>
                                                        <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Villa / Hotel / Address *</label>
                                                    <textarea required rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Special Instructions</label>
                                                    <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none" />
                                                </div>
                                                
                                                <div className="mt-auto pt-8">
                                                    <button type="submit" className="w-full bg-primary text-white px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                                                        Submit Order &bull; Rp {selectedProduct.price}
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    ) : 
                                    
                                    /* STATE: PRODUCT DETAILS */
                                    (
                                        <motion.div 
                                            key="details"
                                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                            className="flex flex-col h-full"
                                        >
                                            <h2 className="font-serif text-3xl md:text-4xl text-primary font-medium mb-4">{selectedProduct.title}</h2>
                                            <span className="font-serif text-2xl text-accent mb-6 block">Rp {selectedProduct.price}</span>
                                            
                                            <div className="prose prose-sm text-text-muted leading-relaxed font-light mb-8 flex-1">
                                                <p>{selectedProduct.description}</p>
                                                <p className="mt-4">
                                                    Experience the true essence of Bali with this signature product. Crafted from organic ingredients and designed to bring tranquility to your home.
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-border/50">
                                                <button 
                                                    onClick={() => setIsCheckout(true)}
                                                    className="w-full bg-primary text-white px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                                                >
                                                    <ShoppingBag size={16} /> Purchase Now
                                                </button>
                                                <p className="text-center text-[10px] text-text-muted mt-4 uppercase tracking-widest">
                                                    Delivery arranged via concierge
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
