'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, X, Plus, Minus, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSpa, Product } from '@/context/SpaContext';

export default function StorePage() {
    const { products } = useSpa();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal & Checkout States
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [quantity, setQuantity] = useState(1);

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
        setTimeout(() => {
            setIsCheckout(false);
            setIsSuccess(false);
            setQuantity(1);
            setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
        }, 300); // Wait for exit animation
    };

    const handleQuantityChange = (type: 'inc' | 'dec') => {
        if (type === 'inc') {
            setQuantity(prev => prev + 1);
        } else if (type === 'dec' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const getTotalPrice = (priceStr: string, qty: number) => {
        const numericPrice = parseInt(priceStr.replace(/,/g, ''), 10);
        return (numericPrice * qty).toLocaleString('en-US');
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
                                className={`px-5 py-2 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
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

                {/* Shopify Spa Aesthetic Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-10 md:gap-y-16">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                key={product.id} 
                                >
                                <div 
                                    onClick={() => product.stock > 0 && setSelectedProduct(product)}
                                    className={`group relative transition-all duration-500 flex flex-col ${product.stock > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
                                >
                                    {/* Product Image Shopify Style */}
                                    <div className="aspect-[4/5] relative overflow-hidden bg-surface/50 rounded-lg md:rounded-xl mb-4">
                                        <img 
                                            src={product.image} 
                                            alt={product.title} 
                                            className={`w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${product.stock > 0 ? 'group-hover:scale-105' : 'grayscale'}`}
                                        />

                                        {/* Sold Out Overlay */}
                                        {product.stock === 0 && (
                                            <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[2px]">
                                                <span className="bg-primary text-white px-5 py-2 rounded-none text-[10px] md:text-xs font-bold tracking-widest uppercase">Sold Out</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Shopify Minimalist Typography Below Image */}
                                    <div className="px-1 flex flex-col items-center text-center">
                                        <p className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">{product.category}</p>
                                        <h4 className="font-serif text-base md:text-lg text-primary mb-2 line-clamp-2 leading-snug group-hover:text-primary/70 transition-colors">{product.title}</h4>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-sm font-light text-primary tracking-wide">Rp {product.price}</span>
                                            <span className={`text-[9px] uppercase tracking-widest font-medium ${product.stock > 0 ? 'text-text-muted/60' : 'text-primary'}`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div></motion.div>
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        
                        {/* Modal Content - Full screen on mobile, rounded large modal on desktop */}
                        <motion.div 
                            initial={{ opacity: 0, y: '100%' }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: '100%' }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className={`relative w-full h-full md:h-auto md:max-h-[90vh] bg-white md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 transition-all duration-500 mx-auto
                                ${(!isCheckout && !isSuccess) ? 'md:max-w-5xl' : 'md:max-w-2xl'}
                            `}
                        >
                            <button 
                                onClick={closeModal}
                                className="absolute top-4 right-4 md:top-6 md:right-6 z-30 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm hover:scale-105 transition-transform"
                            >
                                <X size={20} />
                            </button>

                            {/* Left Side: Image (Hero on Mobile) */}
                            {(!isCheckout && !isSuccess) && (
                                <div className="w-full md:w-1/2 h-[40vh] md:h-full relative shrink-0">
                                    <img 
                                        src={selectedProduct.image} 
                                        alt={selectedProduct.title} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 md:bg-none pointer-events-none"></div>
                                    <div className="absolute top-6 left-6 z-20">
                                        <span className="bg-white/90 backdrop-blur-md text-primary px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                            {selectedProduct.category}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Right Side: Content */}
                            <div className={`w-full md:h-auto overflow-y-auto bg-white relative z-20 flex flex-col transition-all duration-500
                                ${(!isCheckout && !isSuccess) 
                                    ? 'md:w-1/2 h-[60vh] rounded-t-[32px] md:rounded-none -mt-8 md:mt-0 p-6 md:p-12' 
                                    : 'h-full mt-0 rounded-none p-6 pt-16 md:p-12'
                                }
                            `}>
                                <AnimatePresence mode="wait">
                                    
                                    {/* STATE: SUCCESS */}
                                    {isSuccess ? (
                                        <motion.div 
                                            key="success"
                                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                            className="h-full flex flex-col items-center justify-center text-center py-12"
                                        >
                                            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-6 border-8 border-green-500/10">
                                                <CheckCircle2 size={48} />
                                            </div>
                                            <h3 className="font-serif text-3xl md:text-4xl text-primary font-medium mb-4">Order Received</h3>
                                            <p className="text-sm md:text-base text-text-muted leading-relaxed mb-8 max-w-sm">
                                                Thank you, {formData.name}. Our spa concierge will contact you shortly via {formData.phone || formData.email} to arrange delivery and payment for your {selectedProduct.title}.
                                            </p>
                                            <button 
                                                onClick={closeModal}
                                                className="w-full max-w-xs bg-primary text-white px-8 py-4 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
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
                                            className="flex flex-col h-full relative"
                                        >
                                            <button 
                                                onClick={() => setIsCheckout(false)} 
                                                className="absolute -top-2 left-0 md:-top-4 md:-left-4 w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-primary transition-colors bg-transparent"
                                            >
                                                <ArrowLeft size={20} strokeWidth={1.5} />
                                            </button>
                                            <div className="mb-6 md:mb-8 text-center flex flex-col items-center mt-10 md:mt-2">
                                                <h3 className="font-serif text-3xl md:text-4xl text-primary font-medium mb-2">Delivery Details</h3>
                                                <p className="text-xs md:text-sm text-text-muted">Enter your information below to coordinate delivery.</p>
                                            </div>

                                            <form onSubmit={handleCheckoutSubmit} className="space-y-4 flex-1 flex flex-col">
                                                <div className="flex items-center justify-between py-4 border-b border-border/50 mb-4 gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Quantity</p>
                                                        <p className="font-serif text-lg md:text-xl text-primary truncate pr-2" title={selectedProduct.title}>{selectedProduct.title}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 shrink-0">
                                                        <button type="button" onClick={() => handleQuantityChange('dec')} className="w-8 h-8 flex items-center justify-center text-primary hover:opacity-70 transition-opacity disabled:opacity-30" disabled={quantity <= 1}>
                                                            <Minus size={16} strokeWidth={1.5} />
                                                        </button>
                                                        <span className="font-sans text-base w-4 text-center">{quantity}</span>
                                                        <button type="button" onClick={() => handleQuantityChange('inc')} className="w-8 h-8 flex items-center justify-center text-primary hover:opacity-70 transition-opacity">
                                                            <Plus size={16} strokeWidth={1.5} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Full Name *</label>
                                                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-b border-border/50 rounded-none px-0 py-2 text-sm md:text-base focus:outline-none focus:border-primary transition-colors" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Phone Number *</label>
                                                        <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border-b border-border/50 rounded-none px-0 py-2 text-sm md:text-base focus:outline-none focus:border-primary transition-colors" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 mt-4">
                                                    <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Email Address</label>
                                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-b border-border/50 rounded-none px-0 py-2 text-sm md:text-base focus:outline-none focus:border-primary transition-colors" />
                                                </div>
                                                <div className="space-y-2 mt-4">
                                                    <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Villa / Hotel / Address *</label>
                                                    <textarea required rows={1} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-transparent border-b border-border/50 rounded-none px-0 py-2 text-sm md:text-base focus:outline-none focus:border-primary transition-colors resize-none" />
                                                </div>
                                                <div className="space-y-2 mt-4">
                                                    <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Special Instructions</label>
                                                    <textarea rows={1} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-transparent border-b border-border/50 rounded-none px-0 py-2 text-sm md:text-base focus:outline-none focus:border-primary transition-colors resize-none" />
                                                </div>
                                                
                                                <div className="mt-auto pt-8 pb-4 md:pb-0">
                                                    <button type="submit" className="w-full bg-primary text-white px-6 py-4 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-between">
                                                        <span>Submit Order</span>
                                                        <span className="font-serif text-sm">Rp {getTotalPrice(selectedProduct.price, quantity)}</span>
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
                                            <h2 className="font-serif text-4xl md:text-5xl text-primary font-medium mb-2 pr-8">{selectedProduct.title}</h2>
                                            <span className="font-sans text-lg md:text-xl text-primary/80 mb-8 block">Rp {selectedProduct.price}</span>
                                            
                                            <div className="text-sm md:text-base text-text-muted leading-loose font-light mb-8 flex-1">
                                                <p className="mb-6">{selectedProduct.description}</p>
                                                <p className="mb-8">
                                                    Experience the true essence of Bali with this signature product. Crafted from organic ingredients and designed to bring tranquility directly to your sanctuary.
                                                </p>
                                                <ul className="space-y-3 border-t border-border/30 pt-6">
                                                    <li className="flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-primary mt-2.5 shrink-0"></div><span>100% Organic & Locally Sourced</span></li>
                                                    <li className="flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-primary mt-2.5 shrink-0"></div><span>Premium Spa Quality</span></li>
                                                    <li className="flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-primary mt-2.5 shrink-0"></div><span>Same-day Villa Delivery Available</span></li>
                                                </ul>
                                            </div>

                                            <div className="sticky -bottom-6 md:-bottom-12 left-0 right-0 bg-white pt-2 pb-6 md:pb-12 z-20 mt-4">
                                                <button 
                                                    onClick={() => setIsCheckout(true)}
                                                    className="w-full bg-[#1A1A1A] text-white px-6 py-4 rounded-none text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2"
                                                >
                                                    Purchase Now
                                                </button>
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
