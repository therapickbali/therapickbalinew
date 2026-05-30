'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusCircle, Settings, LogOut, UploadCloud, CheckCircle, Store, Sparkles, Plus, Trash2, Megaphone } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'treatment' | 'campaign'>('treatment');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Dynamic fields for Treatment
    const [pricingOptions, setPricingOptions] = useState([{ duration: '', price: '' }]);
    const [benefits, setBenefits] = useState(['']);

    const handleAddPricing = () => setPricingOptions([...pricingOptions, { duration: '', price: '' }]);
    const handleRemovePricing = (index: number) => {
        if (pricingOptions.length > 1) {
            setPricingOptions(pricingOptions.filter((_, i) => i !== index));
        }
    };
    const handlePricingChange = (index: number, field: 'duration' | 'price', value: string) => {
        const newOptions = [...pricingOptions];
        newOptions[index][field] = value;
        setPricingOptions(newOptions);
    };

    const handleAddBenefit = () => setBenefits([...benefits, '']);
    const handleRemoveBenefit = (index: number) => {
        if (benefits.length > 1) {
            setBenefits(benefits.filter((_, i) => i !== index));
        }
    };
    const handleBenefitChange = (index: number, value: string) => {
        const newBenefits = [...benefits];
        newBenefits[index] = value;
        setBenefits(newBenefits);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Mock a network request
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex overflow-hidden font-sans text-text">
            
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-border/50 shadow-soft z-20">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                        <Store size={20} strokeWidth={2.5} />
                        <span className="text-[13px] font-bold tracking-widest uppercase mt-1">Elexoir Admin</span>
                    </Link>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button 
                        onClick={() => setActiveTab('treatment')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'treatment' ? 'bg-surface/80 text-primary' : 'text-text-muted hover:bg-surface/50 hover:text-primary'}`}
                    >
                        <PlusCircle size={18} />
                        Create Treatment
                    </button>
                    <button 
                        onClick={() => setActiveTab('campaign')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'campaign' ? 'bg-surface/80 text-primary' : 'text-text-muted hover:bg-surface/50 hover:text-primary'}`}
                    >
                        <Megaphone size={18} />
                        Create Campaign
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-surface/50 hover:text-primary rounded-xl text-sm font-semibold transition-colors">
                        <LayoutDashboard size={18} />
                        Overview
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-surface/50 hover:text-primary rounded-xl text-sm font-semibold transition-colors">
                        <Settings size={18} />
                        Settings
                    </button>
                </nav>

                <div className="p-4">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto">
                {/* Background Details */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-highlight/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10 pt-12 md:pt-12">
                    
                    {/* Mobile Header (Hidden on Desktop) */}
                    <div className="md:hidden flex items-center justify-between mb-8">
                        <Link href="/" className="flex items-center gap-2 text-primary">
                            <Store size={20} strokeWidth={2.5} />
                            <span className="text-[13px] font-bold tracking-widest uppercase mt-1">Elexoir</span>
                        </Link>
                        <div className="flex gap-2">
                            <button onClick={() => setActiveTab('treatment')} className={`px-3 py-1.5 rounded-full text-xs font-bold ${activeTab === 'treatment' ? 'bg-primary text-white' : 'bg-surface text-primary'}`}>Treatments</button>
                            <button onClick={() => setActiveTab('campaign')} className={`px-3 py-1.5 rounded-full text-xs font-bold ${activeTab === 'campaign' ? 'bg-primary text-white' : 'bg-surface text-primary'}`}>Campaigns</button>
                        </div>
                    </div>

                    <header className="mb-10">
                        <h1 className="font-serif text-3xl md:text-4xl text-primary font-medium mb-2">
                            {activeTab === 'treatment' ? 'Create New Treatment' : 'Create Campaign Card'}
                        </h1>
                        <p className="text-text-muted text-sm">
                            {activeTab === 'treatment' ? 'Add a new massage or ritual to your spa menu.' : 'Design a stunning new promotional banner for the homepage.'}
                        </p>
                    </header>

                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-6 md:p-10"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                
                                {activeTab === 'treatment' && (
                                    <>
                                        {/* Title & Category */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Treatment Title</label>
                                                <input 
                                                    type="text" required placeholder="e.g. Deep Tissue Flow" 
                                                    className="w-full bg-white/50 border border-border/50 rounded-2xl px-5 py-4 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Category</label>
                                                <select className="w-full bg-white/50 border border-border/50 rounded-2xl px-5 py-4 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm appearance-none">
                                                    <option value="massage">Massage</option>
                                                    <option value="facial">Facial</option>
                                                    <option value="package">Package</option>
                                                    <option value="ritual">Ritual</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Dynamic Duration & Pricing */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Duration & Pricing</label>
                                                <button type="button" onClick={handleAddPricing} className="text-xs font-bold text-primary flex items-center gap-1 hover:opacity-70 transition-opacity">
                                                    <Plus size={14} /> Add Option
                                                </button>
                                            </div>
                                            {pricingOptions.map((option, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className="flex-1 relative">
                                                        <input 
                                                            type="number" required placeholder="60" value={option.duration} onChange={(e) => handlePricingChange(idx, 'duration', e.target.value)}
                                                            className="w-full bg-white/50 border border-border/50 rounded-2xl px-5 py-4 pr-16 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm"
                                                        />
                                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted">MINS</span>
                                                    </div>
                                                    <div className="flex-[2] relative">
                                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">Rp</span>
                                                        <input 
                                                            type="text" required placeholder="450,000" value={option.price} onChange={(e) => handlePricingChange(idx, 'price', e.target.value)}
                                                            className="w-full bg-white/50 border border-border/50 rounded-2xl px-12 py-4 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm"
                                                        />
                                                    </div>
                                                    {pricingOptions.length > 1 && (
                                                        <button type="button" onClick={() => handleRemovePricing(idx)} className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-100 transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Description</label>
                                            <textarea 
                                                required rows={3} placeholder="Write a captivating description about the treatment..." 
                                                className="w-full bg-white/50 border border-border/50 rounded-2xl px-5 py-4 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm resize-none"
                                            />
                                        </div>

                                        {/* Dynamic Benefits */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Key Benefits</label>
                                                <button type="button" onClick={handleAddBenefit} className="text-xs font-bold text-primary flex items-center gap-1 hover:opacity-70 transition-opacity">
                                                    <Plus size={14} /> Add Benefit
                                                </button>
                                            </div>
                                            {benefits.map((benefit, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <input 
                                                        type="text" required placeholder="e.g. Relieves deep muscle tension" value={benefit} onChange={(e) => handleBenefitChange(idx, e.target.value)}
                                                        className="w-full bg-white/50 border border-border/50 rounded-2xl px-5 py-4 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm"
                                                    />
                                                    {benefits.length > 1 && (
                                                        <button type="button" onClick={() => handleRemoveBenefit(idx)} className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-100 transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {activeTab === 'campaign' && (
                                    <>
                                        {/* Campaign Title & Label */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Campaign Title</label>
                                                <input 
                                                    type="text" required placeholder="e.g. Summer Retreat" 
                                                    className="w-full bg-white/50 border border-border/50 rounded-2xl px-5 py-4 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Offer Label</label>
                                                <input 
                                                    type="text" required placeholder="e.g. Limited Offer" 
                                                    className="w-full bg-white/50 border border-border/50 rounded-2xl px-5 py-4 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Image Upload Area for Campaign */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Cinematic Background Image</label>
                                            <div className="w-full border-2 border-dashed border-border/50 rounded-[24px] bg-white/30 hover:bg-white/50 transition-colors flex flex-col items-center justify-center py-12 cursor-pointer group">
                                                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                                    <UploadCloud size={24} />
                                                </div>
                                                <p className="text-sm font-medium text-primary mb-1">Click to upload landscape image</p>
                                                <p className="text-xs text-text-muted">High resolution JPG or PNG (1200x800 recommended)</p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Subtext / Description</label>
                                            <textarea 
                                                required rows={3} placeholder="Enjoy up to 20% off all signature treatments this month..." 
                                                className="w-full bg-white/50 border border-border/50 rounded-2xl px-5 py-4 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm resize-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Submit Area */}
                                <div className="pt-6 border-t border-border/30 flex items-center justify-end gap-4">
                                    {success && (
                                        <motion.span 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider"
                                        >
                                            <CheckCircle size={16} /> {activeTab === 'treatment' ? 'Treatment Created' : 'Campaign Published'}
                                        </motion.span>
                                    )}
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="bg-primary text-white px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Saving...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Sparkles size={16} /> {activeTab === 'treatment' ? 'Publish Treatment' : 'Launch Campaign'}
                                            </span>
                                        )}
                                    </button>
                                </div>

                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
