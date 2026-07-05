'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, Clock, Plus, Minus, ArrowRight, MapPin, Search } from 'lucide-react';
import FloatingCalendar from '@/components/FloatingCalendar';

interface CartItem {
    id: string;
    treatmentId: string;
    title: string;
    duration: string;
    price: number;
    guests: number;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    setCartItems: (items: CartItem[]) => void;
    treatments: any[];
    MOCK_THERAPISTS: any[];
}

export default function BookingModal({
    isOpen,
    onClose,
    cartItems,
    setCartItems,
    treatments,
    MOCK_THERAPISTS
}: BookingModalProps) {
    const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    const [isSelectingMore, setIsSelectingMore] = useState(false);
    const [expandedTreatmentId, setExpandedTreatmentId] = useState<string | null>(null);
    
    const getInitialDateTime = () => {
        const now = new Date();
        const date = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].substring(0, 5);
        return { date, time };
    };
    
    const [formData, setFormData] = useState({ name: '', location: '', room: '', ...getInitialDateTime() });
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedTherapists, setSelectedTherapists] = useState<string[]>([]);
    const [viewingTherapist, setViewingTherapist] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const LOCATIONS = ['Ubud', 'Canggu', 'Seminyak', 'Uluwatu', 'Nusa Dua'];
    const totalGuests = cartItems.reduce((acc, item) => acc + item.guests, 0);

    const totalPrice = cartItems.reduce((acc, item) => {
        const isCouple = ['couple', 'honeymoon', 'rejuvenation'].some(k => item.title.toLowerCase().includes(k));
        const multiplier = isCouple ? (item.guests / 2) : item.guests;
        return acc + (item.price * multiplier);
    }, 0);
    const formattedTotalPrice = totalPrice.toLocaleString('en-US');

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.date || !formData.time || !formData.location) {
            alert('Please fill in all required fields (Name, Date, Time, Location).');
            return;
        }

        const newWindow = window.open('', '_blank');
        setIsProcessing(true);

        try {
            const treatmentsList = cartItems.map(item => {
                const isCouple = ['couple', 'honeymoon', 'rejuvenation'].some(k => item.title.toLowerCase().includes(k));
                const multiplier = isCouple ? (item.guests / 2) : item.guests;
                const price = (item.price * multiplier).toLocaleString('en-US');
                const itemTreatment = treatments.find(t => t.id === item.treatmentId);
                
                let whatsIncludedText = '';
                if (itemTreatment && itemTreatment.desc) {
                    const parts = itemTreatment.desc.split(/What's Included\s*:?\s*/i);
                    if (parts.length > 1) {
                        const cleanIncluded = parts[1].trim();
                        whatsIncludedText = `\n\n*WHAT'S INCLUDED:*\n${cleanIncluded}`;
                    }
                }
                return `*${item.title.toUpperCase()}*\nDURATION ${item.duration} MINS\n${item.guests} PERSON IDR ${price}${whatsIncludedText}`;
            }).join('\n\n------------------------\n\n');
            
            const websiteSource = typeof window !== 'undefined' ? window.location.hostname : 'Unknown';
            const therapistMsg = selectedTherapists.length > 0
                ? `\n*Therapist Request:* ${selectedTherapists.map(id => MOCK_THERAPISTS.find(t => t.id === id)?.name).join(', ')}`
                : `\n*Therapist Request:* Assign Automatically`;

            const baseMessage = `*NEW SPA BOOKING*\n${websiteSource}\n\n*TREATMENTS:*\n${treatmentsList}\n\n*TOTAL PRICE:* IDR ${formattedTotalPrice}\n\n*CLIENT DETAILS:*\n- Name: ${formData.name}\n- Date: ${formData.date}\n- Time: ${formData.time}\n- Location Area: ${selectedArea}\n- Address: ${formData.location}\n- Room Number: ${formData.room || 'N/A'}${therapistMsg}\n\nHello! I would like to confirm this booking.`;
            
            const waUrl = `https://wa.me/6285174119423?text=${encodeURIComponent(baseMessage)}`;
            if (newWindow) {
                newWindow.location.href = waUrl;
            } else {
                window.location.href = waUrl;
            }
            
            onClose();
            setBookingStep(1);
            setSelectedArea('');
            setSelectedTherapists([]);
        } catch (error) {
            console.error(error);
            if (newWindow) newWindow.close();
            alert('An error occurred while generating the booking message. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const liquidGlassClasses = 'bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)]';

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center px-0 md:px-4 bg-black/40 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-none md:rounded-[32px] w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-md shadow-2xl relative flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border/30 bg-white z-10 shrink-0">
                        {bookingStep > 1 && !isSelectingMore && (
                            <button onClick={() => setBookingStep((prev) => (prev - 1) as any)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors">
                                <ChevronLeft className="w-4 h-4 text-primary" />
                            </button>
                        )}
                        {isSelectingMore && (
                            <button onClick={() => setIsSelectingMore(false)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors">
                                <ChevronLeft className="w-4 h-4 text-primary" />
                            </button>
                        )}
                        <div className="flex-1 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50">
                                {isSelectingMore ? 'Add Treatment' : `Step ${bookingStep} of 5`}
                            </span>
                            <h2 className="font-serif text-xl text-primary mt-1">
                                {isSelectingMore ? 'Menu' : 
                                 bookingStep === 1 ? 'Review Treatments' :
                                 bookingStep === 2 ? 'Date & Time' :
                                 bookingStep === 3 ? 'Location Area' :
                                 bookingStep === 4 ? 'Therapist' : 'Final Details'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-text-muted hover:bg-border transition-colors">
                            <X className="w-4 h-4 text-primary" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-gray-50/30">
                        {isSelectingMore ? (
                            <div className="space-y-4 pb-16">
                                {treatments.map(t => (
                                    <div key={t.id} className={`${liquidGlassClasses} rounded-2xl overflow-hidden transition-all group cursor-pointer`} onClick={() => setExpandedTreatmentId(expandedTreatmentId === t.id ? null : t.id)}>
                                        <div className="p-4 flex gap-4">
                                            <div className="flex-1 py-1 pl-2">
                                                <div className="text-[9px] font-bold tracking-widest text-primary/50 uppercase mb-1">{t.category}</div>
                                                <h4 className="font-bold text-sm text-primary mb-1 line-clamp-1">{t.title}</h4>
                                                <div className="text-[10px] text-text-muted flex items-center gap-1"><Clock className="w-3 h-3" />{t.options.length} Options</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-primary transition-all duration-300 ${expandedTreatmentId === t.id ? 'rotate-45 bg-primary text-white' : 'group-hover:bg-primary group-hover:text-white'}`}>
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                        <AnimatePresence>
                                            {expandedTreatmentId === t.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-white/20 bg-white/40"
                                                >
                                                    <div className="p-4 space-y-4">
                                                        <p className="text-xs text-text-muted leading-relaxed font-light">{t.desc}</p>
                                                        <div className="space-y-2">
                                                            {t.options.map((opt: any, idx: number) => (
                                                                <button
                                                                    key={idx}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setCartItems([...cartItems, {
                                                                            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                                                                            treatmentId: t.id,
                                                                            title: t.title,
                                                                            duration: opt.duration,
                                                                            price: parseInt(opt.price.replace(/,/g, '') || '0'),
                                                                            guests: 1
                                                                        }]);
                                                                        setExpandedTreatmentId(null);
                                                                        setIsSelectingMore(false);
                                                                    }}
                                                                    className="w-full flex items-center justify-between p-3 rounded-xl border border-white/40 hover:bg-white/60 transition-all group/btn"
                                                                >
                                                                    <span className="text-sm font-bold text-primary">{opt.duration} Mins</span>
                                                                    <span className="text-sm font-serif text-primary">IDR {parseInt(opt.price.replace(/,/g, '') || '0').toLocaleString('en-US')}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {bookingStep === 1 && (
                                    <div className="space-y-4 pb-24">
                                        {cartItems.map(item => (
                                            <div key={item.id} className={`${liquidGlassClasses} rounded-2xl p-5 relative`}>
                                                {cartItems.length > 1 && (
                                                    <button onClick={() => setCartItems(cartItems.filter(i => i.id !== item.id))} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-text-muted hover:text-red-500 transition-colors">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-[15px] text-primary">{item.title}</h3>
                                                        <p className="text-xs text-text-muted mt-1">{item.duration} Mins</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-serif text-primary">IDR {item.price.toLocaleString('en-US')}</div>
                                                        <div className="text-[9px] uppercase tracking-wider text-text-muted/70">
                                                            {['couple', 'honeymoon', 'rejuvenation'].some(k => item.title.toLowerCase().includes(k)) ? 'For 2 Persons' : 'Per Person'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Guests</span>
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            type="button"
                                                            onClick={() => setCartItems(cartItems.map(i => {
                                                                if (i.id !== item.id) return i;
                                                                const isCouple = ['couple', 'honeymoon', 'rejuvenation'].some(k => i.title.toLowerCase().includes(k));
                                                                const step = isCouple ? 2 : 1;
                                                                return { ...i, guests: Math.max(step, i.guests - step) };
                                                            }))}
                                                            className="w-8 h-8 rounded-full bg-white/50 border border-white flex items-center justify-center text-primary hover:bg-white transition-colors shadow-sm"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="font-bold text-sm text-primary w-4 text-center">{item.guests}</span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => setCartItems(cartItems.map(i => {
                                                                if (i.id !== item.id) return i;
                                                                const isCouple = ['couple', 'honeymoon', 'rejuvenation'].some(k => i.title.toLowerCase().includes(k));
                                                                const step = isCouple ? 2 : 1;
                                                                return { ...i, guests: i.guests + step };
                                                            }))}
                                                            className="w-8 h-8 rounded-full bg-white/50 border border-white flex items-center justify-center text-primary hover:bg-white transition-colors shadow-sm"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => setIsSelectingMore(true)}
                                            className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-primary/30 rounded-2xl text-xs font-bold text-primary hover:bg-primary/5 transition-colors uppercase tracking-widest"
                                        >
                                            <Plus className="w-4 h-4" /> Add Another Service
                                        </button>
                                    </div>
                                )}

                                {bookingStep === 2 && (
                                    <div className="space-y-6 pb-24">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Select Date</label>
                                            <FloatingCalendar value={formData.date} onChange={(date) => setFormData({...formData, date})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Time</label>
                                            <input 
                                                type="time" required 
                                                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                                                className={`w-full ${liquidGlassClasses} rounded-xl px-4 py-4 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                                            />
                                        </div>
                                    </div>
                                )}

                                {bookingStep === 3 && (
                                    <div className="space-y-4 pb-24">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Select Area</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {LOCATIONS.map((loc) => (
                                                <button
                                                    key={loc}
                                                    onClick={() => setSelectedArea(loc)}
                                                    className={`py-4 px-3 rounded-2xl border text-sm font-bold transition-all duration-300 ${
                                                        selectedArea === loc 
                                                        ? 'bg-primary border-primary text-white shadow-md' 
                                                        : `${liquidGlassClasses} text-primary hover:bg-white/40`
                                                    }`}
                                                >
                                                    {loc}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {bookingStep === 4 && (
                                    <div className="space-y-4 pb-24">
                                        <p className="text-xs text-text-muted mb-4 font-light">Select {totalGuests} therapist{totalGuests > 1 ? 's' : ''} based on your selected area and time, or skip to let us assign automatically.</p>
                                        {MOCK_THERAPISTS.filter(t => !selectedArea || t.location === selectedArea).map(t => (
                                            <div key={t.id} className={`${liquidGlassClasses} rounded-2xl p-4 flex gap-4 transition-all ${selectedTherapists.includes(t.id) ? 'ring-2 ring-primary bg-white/30' : ''}`}>
                                                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-sm text-primary">{t.name}</h4>
                                                            <div className="text-[10px] text-text-muted mt-0.5">{t.location} • {t.rating} ★</div>
                                                        </div>
                                                        <button 
                                                            onClick={() => setSelectedTherapists(prev => 
                                                                prev.includes(t.id) ? prev.filter(id => id !== t.id) : 
                                                                (prev.length < totalGuests ? [...prev, t.id] : prev)
                                                            )}
                                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors ${selectedTherapists.includes(t.id) ? 'bg-primary text-white' : 'bg-white border border-border text-primary'}`}
                                                        >
                                                            {selectedTherapists.includes(t.id) ? '✓' : <Plus className="w-3 h-3" />}
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-text-muted mt-2 line-clamp-2 font-light">{t.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {bookingStep === 5 && (
                                    <div className="space-y-4 pb-24">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Full Name</label>
                                            <input required type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full ${liquidGlassClasses} rounded-xl px-4 py-4 text-sm focus:outline-none`} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Detailed Address</label>
                                            <input required type="text" placeholder="Villa/Hotel Name, Street" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={`w-full ${liquidGlassClasses} rounded-xl px-4 py-4 text-sm focus:outline-none`} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Room/Villa Number (Optional)</label>
                                            <input type="text" placeholder="e.g. 101" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className={`w-full ${liquidGlassClasses} rounded-xl px-4 py-4 text-sm focus:outline-none`} />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer / Action */}
                    {!isSelectingMore && (
                        <div className="bg-white border-t border-border/30 p-6 z-10 shrink-0">
                            <div className="flex items-end justify-between mb-4">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Total Price</span>
                                <span className="text-2xl font-serif text-primary">IDR {formattedTotalPrice}</span>
                            </div>
                            {bookingStep === 1 ? (
                                <button onClick={() => setBookingStep(2)} disabled={cartItems.length === 0} className="w-full bg-primary text-white px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                                    CONTINUE <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : bookingStep === 2 ? (
                                <button onClick={() => setBookingStep(3)} disabled={!formData.date || !formData.time} className="w-full bg-primary text-white px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                                    CONTINUE <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : bookingStep === 3 ? (
                                <button onClick={() => setBookingStep(4)} disabled={!selectedArea} className="w-full bg-primary text-white px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                                    CONTINUE <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : bookingStep === 4 ? (
                                <button onClick={() => setBookingStep(5)} className="w-full bg-primary text-white px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                                    {selectedTherapists.length > 0 ? 'CONTINUE' : 'SKIP & CONTINUE'} <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button onClick={handleBooking} disabled={isProcessing || !formData.name || !formData.location} className="w-full bg-[#25D366] text-white px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_8px_24px_rgba(37,211,102,0.3)]">
                                    {isProcessing ? 'PROCESSING...' : 'CONFIRM VIA WHATSAPP'}
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
