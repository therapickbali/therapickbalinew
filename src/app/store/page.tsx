'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, X, Plus, Minus, CheckCircle2, ArrowLeft, Heart } from 'lucide-react';
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
        <div className="min-h-screen bg-white pt-24 pb-32">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-sm text-text-muted font-medium">Welcome back,</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-primary">Olivia</h1>
                    </div>
                    <button className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-primary hover:bg-surface transition-colors">
                        <Search size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Hero Banner (First Product) */}
                {products.length > 0 && (
                    <div className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-br from-[#77CD41] to-[#4A991E] p-6 md:p-10 mb-10 flex flex-row items-center cursor-pointer hover:shadow-xl transition-all shadow-lg" onClick={() => setSelectedProduct(products[0])}>
                        <div className="w-3/5 z-10 pr-4">
                            <span className="text-white/90 font-medium text-xs md:text-sm mb-2 block">{products[0].category}</span>
                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3 leading-tight line-clamp-2 md:line-clamp-3">{products[0].title}</h2>
                            <p className="text-white/80 text-[10px] md:text-xs mb-6 line-clamp-2 md:line-clamp-3 max-w-[80%]">{products[0].description}</p>
                            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40 px-4 md:px-6 py-2.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all">
                                20% OFF | BUY NOW
                            </button>
                        </div>
                        <div className="w-2/5 relative h-full min-h-[150px] md:min-h-[250px]">
                            <img src={products[0].image} alt="Featured" className="absolute right-[-20%] md:right-[-10%] top-1/2 -translate-y-1/2 w-[140%] md:w-[120%] object-cover drop-shadow-2xl mix-blend-multiply" />
                        </div>
                    </div>
                )}

                {/* Categories Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-medium text-primary">Categories</h3>
                        <button className="text-text-muted/60 hover:text-primary text-sm font-medium transition-colors">See all</button>
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide w-full mask-fade-edges">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-300 border ${
                                    activeCategory === cat 
                                        ? 'bg-primary text-white border-primary shadow-sm' 
                                        : 'bg-transparent border-border/50 text-text-muted hover:border-primary/30 hover:text-primary'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* New Arrivals (Product Grid) */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-medium text-primary">New arrivals</h3>
                        <button className="text-text-muted/60 hover:text-primary text-sm font-medium transition-colors">See all</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    key={product.id} 
                                    >
                                    <div 
                                        onClick={() => product.stock > 0 && setSelectedProduct(product)}
                                        className={`group relative transition-all duration-500 flex flex-col bg-white border border-border/30 rounded-[24px] overflow-hidden h-full ${product.stock > 0 ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-80'}`}
                                    >
                                        <div className="aspect-square relative p-4 md:p-6 pb-2">
                                            {/* Tag */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="bg-black text-white px-3 py-1 rounded-full text-[7px] md:text-[8px] font-bold tracking-widest uppercase">
                                                    LIMITED EDITION
                                                </span>
                                            </div>
                                            
                                            {/* Heart Icon */}
                                            <button className="absolute top-3 right-3 md:top-4 md:right-4 z-10 w-8 h-8 flex items-center justify-center text-text-muted hover:text-red-500 transition-colors">
                                                <Heart size={18} strokeWidth={2} />
                                            </button>

                                            <img 
                                                src={product.image} 
                                                alt={product.title} 
                                                className={`w-full h-full object-contain p-2 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${product.stock > 0 ? 'group-hover:scale-105' : 'grayscale'}`}
                                            />
                                        </div>
                                        
                                        <div className="p-4 pt-0 flex flex-col flex-1">
                                            <p className="text-[10px] md:text-xs font-medium text-text-muted/60 mb-0.5 truncate">{product.category}</p>
                                            <h4 className="font-sans font-medium text-sm md:text-base text-primary mb-2 line-clamp-1">{product.title}</h4>
                                            
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-sm md:text-base font-semibold text-text-muted/80">${product.price.replace(/,/g, '')} USD</span>
                                                {product.stock > 0 && (
                                                    <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shrink-0">
                                                        <Plus size={16} strokeWidth={2.5} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
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
                                                className="w-full max-w-xs bg-surface text-primary px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-border/50 transition-colors"
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
                                                className="absolute -top-2 left-0 md:-top-4 md:-left-4 w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-surface transition-colors shadow-sm border border-border/50 bg-white"
                                            >
                                                <ArrowLeft size={18} strokeWidth={2.5} />
                                            </button>
                                            <div className="mb-6 md:mb-8 text-center flex flex-col items-center mt-10 md:mt-2">
                                                <h3 className="font-serif text-3xl md:text-4xl text-primary font-medium mb-2">Delivery Details</h3>
                                                <p className="text-xs md:text-sm text-text-muted">Enter your information below to coordinate delivery.</p>
                                            </div>

                                            <form onSubmit={handleCheckoutSubmit} className="space-y-4 flex-1 flex flex-col">
                                                {/* Quantity Selector inside Checkout */}
                                                <div className="flex items-center justify-between p-3 md:p-4 bg-surface rounded-2xl mb-2 gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-muted mb-0.5">Quantity</p>
                                                        <p className="font-serif text-base md:text-lg text-primary truncate pr-2" title={selectedProduct.title}>{selectedProduct.title}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 md:gap-3 bg-white px-1.5 py-1 rounded-full border border-border/50 shadow-sm shrink-0">
                                                        <button type="button" onClick={() => handleQuantityChange('dec')} className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-primary hover:bg-surface transition-colors disabled:opacity-30" disabled={quantity <= 1}>
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="font-bold text-xs md:text-sm w-4 text-center">{quantity}</span>
                                                        <button type="button" onClick={() => handleQuantityChange('inc')} className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-primary hover:bg-surface transition-colors">
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                </div>

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
                                                
                                                <div className="mt-auto pt-8 pb-4 md:pb-0">
                                                    <button type="submit" className="w-full bg-primary text-white px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-xl flex items-center justify-between">
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
                                            <h2 className="font-serif text-3xl md:text-5xl text-primary font-medium mb-3 md:mb-4 pr-10">{selectedProduct.title}</h2>
                                            <span className="font-serif text-xl md:text-3xl text-accent mb-6 block">Rp {selectedProduct.price}</span>
                                            
                                            <div className="prose prose-sm text-text-muted leading-relaxed font-light mb-8 flex-1">
                                                <p>{selectedProduct.description}</p>
                                                <p className="mt-4">
                                                    Experience the true essence of Bali with this signature product. Crafted from organic ingredients and designed to bring tranquility directly to your sanctuary.
                                                </p>
                                                <ul className="mt-6 space-y-2 border-t border-border/50 pt-6">
                                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div>100% Organic & Locally Sourced</li>
                                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div>Premium Spa Quality</li>
                                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div>Same-day Villa Delivery Available</li>
                                                </ul>
                                            </div>

                                            <div className="sticky -bottom-6 md:-bottom-12 left-0 right-0 bg-white pt-3 pb-6 md:pb-12 z-20 mt-4">
                                                <button 
                                                    onClick={() => setIsCheckout(true)}
                                                    className="w-full bg-[#1A1A1A] text-white px-6 py-4 rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <ShoppingBag size={16} /> Purchase Now
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
