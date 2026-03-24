
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
                            className="fixed top-6 right-6 z-[110] p-3 bg-white/90 backdrop-blur-md rounded-none text-stone-600 hover:text-black hover:bg-stone-100 transition-all shadow-none border border-border"
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
                                    <span className="uppercase tracking-[0.3em] font-sans font-semibold text-[9px] text-stone-500 bg-stone-50 border border-stone-200/50 px-3 py-1.5 rounded-none">{service.category}</span>
                                </div>
                            </div>

                            {/* Image Gallery */}
                            <div className="w-full h-[40vh] lg:h-[60vh] rounded-none overflow-hidden mb-12 relative group">
                                <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                            </div>

                            {/* Content & Booking Split */}
                            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative">
                                {/* Left Content */}
                                <div className="w-full lg:w-[60%]">
                                    <div className="pb-10 border-b border-stone-100">
                                        <p className="font-sans text-stone-500 text-[17px] leading-[1.8] font-light whitespace-pre-line first-letter:text-5xl first-letter:font-serif first-letter:text-secondary first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                                            {mainDescription}
                                        </p>
                                    </div>

                                    {/* Highlights */}
                                    <div className="py-12">
                                        <div className="flex items-center gap-4 mb-10">
                                            <h3 className="font-serif text-3xl font-light text-secondary">The Experience</h3>
                                            <div className="h-[1px] bg-stone-200 flex-1"></div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
                                            {benefitsList.map((benefit, i) => (
                                                <div key={i} className="flex items-start gap-5 group">
                                                    <div className="text-stone-300 group-hover:text-[#c4a180] transition-colors shrink-0 mt-0.5">
                                                        {getBenefitIcon(benefit)}
                                                    </div>
                                                    <span className="font-sans text-stone-600 font-light text-[15px] leading-relaxed block">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Booking Card (Sticky Desktop) */}
                                <div className="hidden lg:block w-full lg:w-[40%] pb-12 lg:pb-0">
                                    <div className="sticky top-12 bg-white border border-border rounded-none p-8 lg:p-10 shadow-none relative overflow-hidden">

                                        {/* Decorative Element */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c4a180]/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                                        <div className="mb-10 relative z-10">
                                            <label className="block text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-stone-400 mb-6 flex items-center gap-3">
                                                <Clock size={12} className="text-[#c4a180]" />
                                                Select Duration
                                            </label>
                                            <div className="flex flex-col gap-3">
                                                {options.map((opt, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelectedOptionIdx(i)}
                                                        className={`w-full flex justify-between items-center px-6 py-4 rounded-2xl text-[11px] font-sans font-semibold uppercase tracking-[0.2em] transition-all duration-500 border group ${selectedOptionIdx === i
                                                                ? 'bg-white text-secondary border-stone-300 shadow-md ring-1 ring-stone-900/5'
                                                                : 'bg-white/50 text-stone-400 border-stone-100 hover:border-stone-200 hover:bg-white'
                                                            }`}
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <div className={`w-3 h-3 rounded-none transition-colors border ${selectedOptionIdx === i ? 'bg-white border-white' : 'bg-transparent border-stone-300 group-hover:border-black'}`}></div>
                                                            {opt.duration}
                                                        </span>
                                                        <span className={`font-serif font-light text-base normal-case tracking-normal ${selectedOptionIdx === i ? 'text-secondary' : 'text-stone-400'}`}>
                                                            {opt.price.replace(/IDR/i, '').trim()}k
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center gap-1 mb-8 pt-8 border-t border-stone-200/60 relative z-10">
                                            <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.4em] text-stone-400">Total Investment</span>
                                            <div className="flex items-baseline gap-2 mt-2">
                                                <span className="font-serif text-5xl font-light text-secondary tracking-[-0.02em]">{currentOption.price.replace(/IDR/i, '').trim()}</span>
                                                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#c4a180]">IDR</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleAdd}
                                            className="w-full h-16 bg-primary text-white rounded-none border border-primary font-sans font-medium text-[11px] uppercase tracking-[0.2em] hover:bg-transparent hover:text-primary transition-colors duration-500 flex items-center justify-center gap-3 shadow-none relative z-10 overflow-hidden group"
                                        >
                                            <span className="relative z-10">Add to Ritual</span>
                                            <ArrowRight size={16} strokeWidth={1.5} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                            {/* Button hover effect */}
                                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </button>

                                        <p className="text-center text-[10px] uppercase tracking-widest text-stone-400 mt-6 font-light relative z-10">Professional In-Villa Service</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Fixed Bottom Bar */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 pb-6 lg:hidden z-[120] shadow-none">
                            <div className="max-w-md mx-auto">
                                <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-1">
                                    {options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedOptionIdx(i)}
                                            className={`whitespace-nowrap flex-1 py-3 px-5 rounded-full text-[9px] font-sans font-semibold uppercase tracking-[0.2em] transition-all duration-500 border ${selectedOptionIdx === i
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
                                        className="flex-1 max-w-[160px] py-4 bg-primary text-white border border-primary rounded-none font-sans font-medium text-[11px] uppercase tracking-[0.2em] hover:bg-transparent hover:text-primary transition-colors flex items-center justify-center shadow-none active:scale-95"
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
