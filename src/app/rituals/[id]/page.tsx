'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Share, Heart, MapPin, Clock, Calendar, Sparkles, Plus, Minus, X, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSpa } from '@/context/SpaContext';

export default function RitualsDetails() {
    const params = useParams();
    const id = params?.id as string;
    const { treatments } = useSpa();
    const treatment = treatments.find(t => t.id === id);

    const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [guestCount, setGuestCount] = useState(1);
    const [formData, setFormData] = useState({ name: '', location: '', room: '' });

    if (!treatment) {
        return <div className="min-h-screen bg-background flex items-center justify-center font-serif text-2xl text-primary">Loading...</div>;
    }

    const selectedOption = treatment.options[selectedOptionIdx] || treatment.options[0];

    // Calculate smart price
    const basePrice = parseInt(selectedOption.price.replace(/,/g, '') || '0');
    const totalPrice = basePrice * guestCount;
    const formattedTotalPrice = totalPrice.toLocaleString('en-US');

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        const waNumber = '6285174119423';
        const message = `*New Spa Booking Request*%0A%0A*Treatment:* ${treatment.title}%0A*Duration:* ${selectedOption.duration} Mins%0A*Guests:* ${guestCount}%0A*Total Price:* IDR ${formattedTotalPrice}%0A%0A*Client Details:*%0A- Name: ${formData.name}%0A- Location/Villa: ${formData.location}%0A- Room Number: ${formData.room || 'N/A'}%0A%0AHello! I would like to book this appointment.`;
        window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
        setIsModalOpen(false);
    };

    const relatedTreatments = treatments.filter(t => t.id !== treatment.id).slice(0, 3);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans text-text pb-24 md:pb-12 pt-16 md:pt-24">
            
            <div className="max-w-3xl mx-auto px-6 md:px-8">
                
                {/* Header Actions */}
                <header className="flex items-center justify-between mb-16">
                    <Link href="/">
                        <button className="w-12 h-12 rounded-full bg-white border border-border/50 flex items-center justify-center text-primary shadow-[0_8px_20px_rgb(0,0,0,0.04)] hover:bg-surface hover:scale-105 transition-all">
                            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-sm border border-border/30 flex items-center justify-center text-primary hover:bg-white hover:scale-105 transition-all shadow-[0_8px_20px_rgb(0,0,0,0.02)]">
                            <Share className="w-5 h-5" strokeWidth={2} />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-sm border border-border/30 flex items-center justify-center text-primary hover:bg-white hover:scale-105 transition-all shadow-[0_8px_20px_rgb(0,0,0,0.02)]">
                            <Heart className="w-5 h-5" strokeWidth={2} />
                        </button>
                    </div>
                </header>

                {/* Title & Location */}
                <div className="mb-8">
                    <h1 className="font-serif text-4xl md:text-6xl text-primary leading-[1.1] mb-4 tracking-tight capitalize">
                        {treatment.title.toLowerCase()}
                    </h1>
                    <p className="flex items-center gap-1.5 text-sm md:text-base text-text-muted font-medium">
                        <MapPin className="w-4 h-4" />
                        In-Villa Service, Ubud, Bali
                    </p>
                </div>

                {/* Tags */}
                <div className="flex overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 gap-2 no-scrollbar mb-10">
                    <span className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-white rounded-xl text-xs font-bold tracking-wider text-primary whitespace-nowrap shadow-[0_4px_12px_rgb(0,0,0,0.02)] uppercase">
                        {treatment.category}
                    </span>
                </div>

                {/* Smart Pricing & Duration Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    
                    {/* Selectable Durations */}
                    <div className="bg-highlight/40 border border-highlight rounded-[32px] p-6 flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-6">
                            <span className="text-sm font-bold uppercase tracking-widest text-primary/80">Select Duration</span>
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {treatment.options.map((opt, idx) => {
                                const isActive = selectedOptionIdx === idx;
                                return (
                                    <button 
                                        key={idx}
                                        onClick={() => setSelectedOptionIdx(idx)}
                                        className={`flex-1 py-3 px-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
                                            isActive 
                                            ? 'bg-primary text-white shadow-[0_8px_20px_rgb(0,0,0,0.12)] scale-105' 
                                            : 'bg-white/60 text-primary border border-white hover:bg-white hover:scale-[1.02]'
                                        }`}
                                    >
                                        {opt.duration} <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-primary/50'}`}>MINS</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden shadow-soft-lg min-h-[160px] bg-gradient-to-br from-[#1C1F1D] via-[#2A2E2C] to-[#1C1F1D]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Price per person</span>
                                <AnimatePresence mode="popLayout">
                                    <motion.div 
                                        key={selectedOption.price}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-baseline gap-2 text-white"
                                    >
                                        <span className="text-lg font-medium text-white/70">IDR</span>
                                        <span className="text-4xl md:text-5xl font-serif">{parseInt(selectedOption.price.replace(/,/g, '') || '0').toLocaleString('en-US')}</span>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="w-full bg-white text-primary px-6 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_24px_rgb(255,255,255,0.15)]"
                            >
                                Book an Appointment
                            </button>
                        </div>
                    </div>

                </div>

                {/* Description */}
                <div className="mb-14 bg-white/50 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">About this Treatment</h3>
                    <p className="text-sm md:text-base text-text-muted leading-relaxed font-light">
                        {treatment.desc}
                    </p>
                </div>

                {/* Related (Dynamic from Supabase) */}
                {relatedTreatments.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Related Treatments</h3>
                        <Link href="/" className="text-xs font-bold text-text-muted hover:text-primary transition-colors">VIEW ALL</Link>
                    </div>
                    
                    <div className="flex overflow-x-auto pb-6 -mx-6 px-6 md:mx-0 md:px-0 gap-4 no-scrollbar">
                        {relatedTreatments.map((item, idx) => (
                            <Link href={`/rituals/${item.id}`} key={idx} className="w-40 h-48 shrink-0 rounded-[28px] overflow-hidden relative group shadow-[0_8px_24px_rgb(0,0,0,0.04)] cursor-pointer block outline-none">
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgPattern || 'from-secondary/80 to-highlight/40'} transition-transform duration-500 group-hover:scale-110`}></div>
                                <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500"></div>
                                
                                <div className="absolute top-4 left-4">
                                    <span className="px-2.5 py-1 bg-white/40 backdrop-blur-md rounded-lg text-[9px] font-bold text-primary tracking-widest uppercase shadow-sm">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h4 className="text-sm font-serif font-medium text-primary leading-tight capitalize">{item.title.toLowerCase()}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                )}

            </div>

            {/* WhatsApp Booking Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-none md:rounded-[32px] p-6 md:p-8 w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-md shadow-2xl relative overflow-y-auto no-scrollbar"
                        >
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface flex items-center justify-center text-text-muted hover:bg-border transition-colors z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            
                            <h2 className="font-serif text-2xl text-primary mb-1 pr-8">Complete Booking</h2>
                            <p className="text-xs text-text-muted mb-6">Your request will be sent securely via WhatsApp.</p>

                            {/* Treatment Summary Card */}
                            <div className="bg-surface border border-border/50 rounded-2xl p-4 mb-3 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-sm text-primary capitalize">{treatment.title.toLowerCase()}</h3>
                                        <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3" /> {selectedOption.duration} Mins
                                        </p>
                                    </div>
                                    <span className="font-serif text-primary font-medium text-right flex flex-col">
                                        IDR {parseInt(selectedOption.price.replace(/,/g, '') || '0').toLocaleString('en-US')}
                                        <span className="text-[9px] font-sans text-text-muted font-normal uppercase tracking-wider">Per Person</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Guests</span>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                            className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-primary hover:bg-border transition-colors shadow-sm"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="font-bold text-sm text-primary w-4 text-center">{guestCount}</span>
                                        <button 
                                            type="button"
                                            onClick={() => setGuestCount(guestCount + 1)}
                                            className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-primary hover:bg-border transition-colors shadow-sm"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Add another treatment button */}
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="w-full bg-transparent text-primary border border-border/50 px-6 py-3 rounded-xl text-xs font-bold hover:bg-surface transition-colors mb-6"
                            >
                                + Add another treatment
                            </button>

                            <form onSubmit={handleBooking} className="space-y-5 pb-8 md:pb-0">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Guest Name</label>
                                    <input 
                                        type="text" required placeholder="John Doe"
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Villa / Hotel Name</label>
                                    <input 
                                        type="text" required placeholder="e.g. Four Seasons Sayan"
                                        value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                                        className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Room Number (Optional)</label>
                                    <input 
                                        type="text" placeholder="e.g. Villa 12"
                                        value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})}
                                        className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>

                                <div className="mt-8 pt-6 border-t border-border/50">
                                    <div className="flex items-end justify-between mb-6">
                                        <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Total Price</span>
                                        <span className="text-2xl font-serif text-primary">IDR {formattedTotalPrice}</span>
                                    </div>
                                    <button 
                                        type="submit"
                                        className="w-full bg-[#25D366] text-white px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_24px_rgb(37,211,102,0.25)]"
                                    >
                                        Confirm on WhatsApp <MessageCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
