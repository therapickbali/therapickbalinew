'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, Clock, Plus, Minus, ArrowRight, MapPin, Search, BadgeCheck } from 'lucide-react';
import FloatingCalendar from '@/components/FloatingCalendar';
import { useSpa } from '@/context/SpaContext';

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
    totalPriceNum: number;
}

export default function BookingModal({
    isOpen,
    onClose,
    cartItems,
    setCartItems,
    treatments,
    totalPriceNum
}: BookingModalProps) {
    const { therapists } = useSpa();
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
    const [isProcessing, setIsProcessing] = useState(false);

    const LOCATIONS = ['Ubud', 'Canggu', 'Seminyak', 'Uluwatu', 'Nusa Dua'];
    const totalGuests = cartItems.reduce((acc, item) => acc + item.guests, 0);

    const toggleTherapist = (id: string) => {
        if (selectedTherapists.includes(id)) {
            setSelectedTherapists(prev => prev.filter(item => item !== id));
        } else if (selectedTherapists.length < totalGuests) {
            setSelectedTherapists(prev => [...prev, id]);
        }
    };

    const formattedTotalPrice = totalPriceNum.toLocaleString('en-US');

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
                ? `\n*Therapist Request:* ${selectedTherapists.map(id => therapists.find(t => t.id === id)?.name).join(', ')}`
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

    const liquidGlassClasses = 'bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]';

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
                    className="bg-[#111111] border border-white/10 rounded-none md:rounded-[32px] w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative flex flex-col overflow-hidden"
                >
                    <div className="flex items-center justify-between p-6 border-b border-white/10 bg-transparent z-10 shrink-0">
                        {bookingStep > 1 && !isSelectingMore && (
                            <button onClick={() => setBookingStep((prev) => (prev - 1) as any)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors">
                                <ChevronLeft className="w-4 h-4 text-white" />
                            </button>
                        )}
                        {isSelectingMore && (
                            <button onClick={() => setIsSelectingMore(false)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors">
                                <ChevronLeft className="w-4 h-4 text-white" />
                            </button>
                        )}
                        <div className="flex-1 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                                {isSelectingMore ? 'Add Treatment' : `Step ${bookingStep} of 5`}
                            </span>
                            <h2 className="font-serif text-xl text-white mt-1">
                                {isSelectingMore ? 'Menu' : 
                                 bookingStep === 1 ? 'Review Treatments' :
                                 bookingStep === 2 ? 'Date & Time' :
                                 bookingStep === 3 ? 'Location Area' :
                                 bookingStep === 4 ? 'Therapist' : 'Final Details'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-white/90-muted hover:bg-border transition-colors">
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-transparent">
                        {isSelectingMore ? (
                            <div className="space-y-4 pb-16">
                                {treatments.map(t => (
                                    <div key={t.id} className={`${liquidGlassClasses} rounded-2xl overflow-hidden transition-all group cursor-pointer`} onClick={() => setExpandedTreatmentId(expandedTreatmentId === t.id ? null : t.id)}>
                                        <div className="p-4 flex gap-4">
                                            <div className="flex-1 py-1 pl-2">
                                                <div className="text-[9px] font-bold tracking-widest text-white/50 uppercase mb-1">{t.category}</div>
                                                <h4 className="font-bold text-sm text-white mb-1 line-clamp-1">{t.title}</h4>
                                                <div className="text-[10px] text-white/90-muted flex items-center gap-1"><Clock className="w-3 h-3" />{t.options.length} Options</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center text-white transition-all duration-300 ${expandedTreatmentId === t.id ? 'rotate-45 bg-white text-black' : 'group-hover:bg-white group-hover:text-black'}`}>
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
                                                        <p className="text-xs text-white/90-muted leading-relaxed font-light">{t.desc}</p>
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
                                                                    <span className="text-sm font-bold text-white">{opt.duration} Mins</span>
                                                                    <span className="text-sm font-serif text-white">IDR {parseInt(opt.price.replace(/,/g, '') || '0').toLocaleString('en-US')}</span>
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
                                                    <button onClick={() => setCartItems(cartItems.filter(i => i.id !== item.id))} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/20 shadow-md flex items-center justify-center text-white/90-muted hover:text-red-500 transition-colors">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-[15px] text-white">{item.title}</h3>
                                                        <p className="text-xs text-white/90-muted mt-1">{item.duration} Mins</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-serif text-white">IDR {item.price.toLocaleString('en-US')}</div>
                                                        <div className="text-[9px] uppercase tracking-wider text-white/90-muted/70">
                                                            {['couple', 'honeymoon', 'rejuvenation'].some(k => item.title.toLowerCase().includes(k)) ? 'For 2 Persons' : 'Per Person'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Guests</span>
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            type="button"
                                                            onClick={() => setCartItems(cartItems.map(i => {
                                                                if (i.id !== item.id) return i;
                                                                const isCouple = ['couple', 'honeymoon', 'rejuvenation'].some(k => i.title.toLowerCase().includes(k));
                                                                const step = isCouple ? 2 : 1;
                                                                return { ...i, guests: Math.max(step, i.guests - step) };
                                                            }))}
                                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-white transition-colors shadow-sm"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="font-bold text-sm text-white w-4 text-center">{item.guests}</span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => setCartItems(cartItems.map(i => {
                                                                if (i.id !== item.id) return i;
                                                                const isCouple = ['couple', 'honeymoon', 'rejuvenation'].some(k => i.title.toLowerCase().includes(k));
                                                                const step = isCouple ? 2 : 1;
                                                                return { ...i, guests: i.guests + step };
                                                            }))}
                                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-white transition-colors shadow-sm"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => setIsSelectingMore(true)}
                                            className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-primary/30 rounded-2xl text-xs font-bold text-white hover:bg-white/5 transition-colors uppercase tracking-widest"
                                        >
                                            <Plus className="w-4 h-4" /> Add Another Service
                                        </button>
                                    </div>
                                )}

                                {bookingStep === 2 && (
                                    <div className="space-y-6 pb-24">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Select Date</label>
                                            <FloatingCalendar value={formData.date} onChange={(date) => setFormData({...formData, date})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Time</label>
                                            <input 
                                                type="time" required 
                                                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                                                className={`w-48 mx-auto block ${liquidGlassClasses} rounded-[24px] px-4 py-4 text-sm text-white text-center focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                                            />
                                        </div>
                                    </div>
                                )}

                                {bookingStep === 3 && (
                                    <div className="space-y-4 pb-24">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Select Area</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {LOCATIONS.map((loc) => (
                                                <button
                                                    key={loc}
                                                    onClick={() => setSelectedArea(loc)}
                                                    className={`py-4 px-3 rounded-2xl border text-sm font-bold transition-all duration-300 ${
                                                        selectedArea === loc 
                                                        ? 'bg-white border-primary text-black shadow-md' 
                                                        : `${liquidGlassClasses} text-white hover:bg-white/40`
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
                                        <p className="text-xs text-white/90-muted mb-4 font-light">Select {totalGuests} therapist{totalGuests > 1 ? 's' : ''} based on your selected area and time, or skip to let us assign automatically.</p>
                                        {therapists.filter(t => !selectedArea || t.location === selectedArea).map(t => (
                                            <button 
                                                key={t.id}
                                                type="button"
                                                onClick={() => {
                                                    if (t.online_status === 'Off') {
                                                        return;
                                                    }
                                                    if (selectedTherapists.includes(t.id)) {
                                                        setSelectedTherapists(selectedTherapists.filter(id => id !== t.id));
                                                    } else if (selectedTherapists.length < totalGuests) {
                                                        if (t.online_status === 'Busy') {
                                                            if (totalGuests > 1) {
                                                                alert("For group bookings, please select therapists who are currently 'ONLINE'.");
                                                                return;
                                                            }
                                                            if (window.confirm(`${t.name} is currently handling a customer. They may be available by ${t.available_at || 'later'}. Do you still want to request them?`)) {
                                                                setSelectedTherapists([...selectedTherapists, t.id]);
                                                            }
                                                        } else {
                                                            setSelectedTherapists([...selectedTherapists, t.id]);
                                                        }
                                                    }
                                                }}
                                                className={`w-full p-4 rounded-[24px] border text-left transition-all duration-300 flex items-start gap-4 ${
                                                    selectedTherapists.includes(t.id)
                                                    ? 'bg-white/10 border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                                                    : 'bg-surface/50 border-white/10 hover:border-white/20 hover:bg-surface'
                                                }`}
                                            >
                                                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-white/10 relative bg-white/5 flex items-center justify-center">
                                                    {t.image_url ? (
                                                        <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-white/50 text-xs font-bold uppercase">{t.name.substring(0, 2)}</span>
                                                    )}
                                                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] pointer-events-none rounded-full" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="mb-1">
                                                        {t.online_status === "Off" ? (
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-red-400">Offline</span>
                                                        ) : t.online_status === "Busy" ? (
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500">Busy</span>
                                                        ) : (
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-green-500">Online</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className={`font-serif text-lg leading-none ${selectedTherapists.includes(t.id) ? "text-white" : "text-white"}`}>{t.name}</h4>
                                                        </div>
                                                        <div className="flex items-center text-[#2563eb]">
                                                            <BadgeCheck className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                    {t.online_status === "Busy" && t.available_at && (
                                                        <div className="mb-2 text-[10px] font-bold text-amber-400/90 tracking-wide uppercase">
                                                            Will be ready at {t.available_at}
                                                        </div>
                                                    )}
                                                    <p className={`text-[11px] leading-relaxed line-clamp-1 mb-2.5 ${selectedTherapists.includes(t.id) ? "text-white/80" : "text-white/60"}`}>{t.bio || "Therapist professional"}</p>
                                                    <div className="flex items-center gap-2">
                                                        {t.online_status === "Off" ? (
                                                            <span className="text-[10px] font-semibold text-red-400 flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>Offline</span>
                                                        ) : t.online_status === "Busy" ? null : (
                                                            <span className="text-[10px] font-semibold text-green-500 flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>Ready</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                        {therapists.filter(t => !selectedArea || t.location === selectedArea).length === 0 && (
                                            <div className="p-6 text-center text-sm text-white/90-muted border border-dashed border-white/20/50 rounded-xl bg-surface/50">
                                                No specific therapists found for {selectedArea}. We will assign the best available therapist for you.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {bookingStep === 5 && (
                                    <div className="space-y-4 pb-24">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Full Name</label>
                                            <input required type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full ${liquidGlassClasses} rounded-xl px-4 py-4 text-sm focus:outline-none`} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Detailed Address</label>
                                            <input required type="text" placeholder="Villa/Hotel Name, Street" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={`w-full ${liquidGlassClasses} rounded-xl px-4 py-4 text-sm focus:outline-none`} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Room/Villa Number (Optional)</label>
                                            <input type="text" placeholder="e.g. 101" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className={`w-full ${liquidGlassClasses} rounded-xl px-4 py-4 text-sm focus:outline-none`} />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer / Action */}
                    {!isSelectingMore && (
                        <div className="bg-transparent border-t border-white/10 p-6 z-10 shrink-0">
                            <div className="flex items-end justify-between mb-4">
                                <span className="text-xs font-bold text-white/90-muted uppercase tracking-widest">Total Price</span>
                                <span className="text-2xl font-serif text-white">IDR {formattedTotalPrice}</span>
                            </div>
                            {bookingStep === 1 ? (
                                <button onClick={() => setBookingStep(2)} disabled={cartItems.length === 0} className="w-full bg-white text-black px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all">
                                    CONTINUE <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : bookingStep === 2 ? (
                                <button onClick={() => setBookingStep(3)} disabled={!formData.date || !formData.time} className="w-full bg-white text-black px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all">
                                    CONTINUE <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : bookingStep === 3 ? (
                                <button onClick={() => setBookingStep(4)} disabled={!selectedArea} className="w-full bg-white text-black px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all">
                                    CONTINUE <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : bookingStep === 4 ? (
                                <button onClick={() => setBookingStep(5)} className="w-full bg-white text-black px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all">
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
