
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Sparkles, Clock, ShieldCheck, ArrowRight, Wind, Activity, Zap, Moon, Droplets, Heart, Flower2, Waves, Feather, Send, ChevronDown } from 'lucide-react';
import { ServiceItem } from '../types';
import { parseServiceOptions, SERVICES } from '../constants';

interface Props {
    service: ServiceItem | null;
    onClose: () => void;
    onAdd: (service: ServiceItem, duration: string, price: string, numericPrice: number) => void;
}

const ServiceDetailModal: React.FC<Props> = ({ service, onClose, onAdd }) => {
    const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);

    // Lock Body Scroll when modal is open
    useEffect(() => {
        if (service) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [service]);

    if (!service) return null;

    const parts = service.description.split(/Benefits:/i);
    const mainDescription = parts[0].trim();
    const benefitsList = parts[1] 
        ? parts[1].split(/,|;/).map(b => {
            let text = b.trim().replace(/\.$/, '');
            if (text.toLowerCase().startsWith('and ')) {
                text = text.substring(4).trim();
            }
            return text.charAt(0).toUpperCase() + text.slice(1);
        }).filter(b => b.length > 0)
        : [];

    const options = parseServiceOptions(service);
    const currentOption = options[selectedOptionIdx] || options[0];

    const handleAdd = () => {
        onAdd(service, currentOption.duration, currentOption.price, currentOption.numericValue);
        onClose();
    };

    // Helper to map text to diverse modern icons
    const getBenefitIcon = (text: string) => {
        const t = text.toLowerCase();
        // Smaller size for modern compact look
        const iconProps = { size: 20, strokeWidth: 1.5 }; 
        
        // Sleep / Deep Relaxation / Night
        if (t.includes('sleep') || t.includes('insomnia') || t.includes('dream') || t.includes('night') || t.includes('rest')) {
            return <Moon {...iconProps} />;
        }

        // Energy / Power / Revitalize
        if (t.includes('energy') || t.includes('boost') || t.includes('revitalize') || t.includes('awaken') || t.includes('fatigue')) {
            return <Zap {...iconProps} />;
        }

        // Detox / Circulation / Water / Lymphatic
        if (t.includes('detox') || t.includes('lymph') || t.includes('drainage') || t.includes('circulation') || t.includes('blood') || t.includes('toxin') || t.includes('flush')) {
            return <Droplets {...iconProps} />;
        }

        // Muscle / Pain / Tension / Sport
        if (t.includes('muscle') || t.includes('pain') || t.includes('tension') || t.includes('stiff') || t.includes('sport') || t.includes('tissue') || t.includes('knot') || t.includes('relief')) {
            return <Activity {...iconProps} />;
        }

        // Emotion / Heart / Anxiety / Stress / Love
        if (t.includes('emotion') || t.includes('anxiety') || t.includes('stress') || t.includes('love') || t.includes('connection') || t.includes('calm') || t.includes('mood') || t.includes('nervous')) {
            return <Heart {...iconProps} />;
        }

        // Beauty / Skin / Face / Glow
        if (t.includes('skin') || t.includes('face') || t.includes('beauty') || t.includes('glow') || t.includes('anti-aging') || t.includes('youth') || t.includes('rejuvenat')) {
            return <Flower2 {...iconProps} />;
        }

        // Flexibility / Movement / Flow
        if (t.includes('flexibility') || t.includes('mobility') || t.includes('flow') || t.includes('stretch') || t.includes('yoga') || t.includes('posture')) {
            return <Waves {...iconProps} />;
        }
        
        // Gentle / Soothing / Light
        if (t.includes('gentle') || t.includes('soothing') || t.includes('soft') || t.includes('light') || t.includes('sensitive')) {
            return <Feather {...iconProps} />;
        }

        // Mental / Clarity / Balance / Spirit
        if (t.includes('balance') || t.includes('spirit') || t.includes('clarity') || t.includes('mind') || t.includes('focus') || t.includes('headache')) {
            return <Wind {...iconProps} />;
        }

        // Fallback
        return <Sparkles {...iconProps} />;
    };

    return (
        <AnimatePresence>
            {service && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal Container - Property Style */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-[100] bg-white overflow-y-auto custom-scrollbar"
                    >
                        {/* Close Button */}
                        <button 
                            onClick={onClose} 
                            className="fixed top-6 right-6 z-[110] p-3 bg-white/90 backdrop-blur-md rounded-full text-stone-600 hover:text-secondary hover:bg-stone-100 transition-all shadow-sm border border-stone-200"
                        >
                            <X size={20} strokeWidth={1.5} />
                        </button>

                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-12 lg:py-12">
                            {/* Header */}
                            <div className="mb-8 pt-4 lg:pt-0">
                                <h2 className="font-serif text-5xl lg:text-7xl font-light text-secondary mb-6 tracking-[-0.02em] leading-[0.9]">{service.name}</h2>
                                <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm font-light text-stone-600">
                                    <div className="flex items-center gap-1.5">
                                        <Star size={14} className="text-secondary" fill="currentColor" />
                                        <span className="font-sans font-semibold text-secondary">5.0</span>
                                    </div>
                                    <span className="hidden sm:inline text-stone-300">|</span>
                                    <span className="uppercase tracking-[0.3em] font-sans font-semibold text-[9px] text-stone-500 bg-stone-50 border border-stone-200/50 px-3 py-1.5 rounded-full">{service.category}</span>
                                </div>
                            </div>

                            {/* Image Gallery */}
                            <div className="w-full h-[40vh] lg:h-[60vh] rounded-2xl overflow-hidden mb-12 relative group">
                                <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                            </div>

                            {/* Content & Booking Split */}
                            <div className="flex flex-col lg:flex-row gap-12 relative">
                                {/* Left Content */}
                                <div className="w-full lg:w-2/3">
                                    <div className="pb-8 border-b border-stone-200">
                                        <p className="font-sans text-stone-600 text-base leading-relaxed font-light whitespace-pre-line">
                                            {mainDescription}
                                        </p>
                                    </div>

                                    {/* Highlights */}
                                    <div className="py-12">
                                        <h3 className="font-serif text-3xl font-light text-secondary mb-8">What this ritual offers</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                                            {benefitsList.map((benefit, i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <div className="text-stone-400 shrink-0">
                                                        {getBenefitIcon(benefit)}
                                                    </div>
                                                    <span className="font-sans text-stone-600 font-light text-[15px]">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Booking Card (Sticky Desktop) */}
                                <div className="hidden lg:block w-full lg:w-1/3 pb-12 lg:pb-0">
                                    <div className="sticky top-8 bg-white border border-stone-200 rounded-2xl p-6 shadow-xl shadow-stone-200/50">
                                        
                                        <div className="mb-8">
                                            <label className="block text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400 mb-4">Select Duration</label>
                                            <div className="flex flex-wrap gap-2">
                                                {options.map((opt, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelectedOptionIdx(i)}
                                                        className={`px-5 py-3 rounded-full text-[9px] font-sans font-semibold uppercase tracking-[0.2em] transition-all duration-500 border ${
                                                            selectedOptionIdx === i 
                                                            ? 'bg-secondary text-white border-secondary shadow-md' 
                                                            : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                                                        }`}
                                                    >
                                                        {opt.duration}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-end gap-2 mb-8 pt-6 border-t border-stone-100">
                                            <span className="font-serif text-4xl font-light text-secondary">{currentOption.price.replace(/IDR/i, '').trim()}</span>
                                            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-stone-400 pb-1.5">IDR</span>
                                        </div>

                                        <button 
                                            onClick={handleAdd}
                                            className="w-full py-4 bg-secondary text-white rounded-full font-sans font-semibold text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-md active:scale-95"
                                        >
                                            Reserve Now
                                        </button>
                                        <p className="text-center text-[10px] uppercase tracking-widest text-stone-400 mt-6 font-light">You won't be charged yet</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Fixed Bottom Bar */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-200 p-4 pb-6 lg:hidden z-[120] shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
                            <div className="max-w-md mx-auto">
                                <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-1">
                                    {options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedOptionIdx(i)}
                                            className={`whitespace-nowrap flex-1 py-3 px-5 rounded-full text-[9px] font-sans font-semibold uppercase tracking-[0.2em] transition-all duration-500 border ${
                                                selectedOptionIdx === i 
                                                ? 'bg-secondary text-white border-secondary shadow-md' 
                                                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                                            }`}
                                        >
                                            {opt.duration}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="font-serif text-3xl font-light text-secondary">{currentOption.price.replace(/IDR/i, '').trim()}</span>
                                        <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.2em] text-stone-400">IDR</span>
                                    </div>
                                    <button 
                                        onClick={handleAdd}
                                        className="flex-1 max-w-[160px] py-4 bg-secondary text-white rounded-full font-sans font-semibold text-[9px] uppercase tracking-[0.3em] hover:bg-primary transition-colors flex items-center justify-center shadow-md active:scale-95"
                                    >
                                        Reserve Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ServiceDetailModal;
