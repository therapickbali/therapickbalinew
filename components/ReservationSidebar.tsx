
import React from 'react';
import { Trash2, X, ChevronRight, Star, Calendar, Clock, MapPin, Sparkles, Plus, Minus, Users } from 'lucide-react';
import { formatPrice, SERVICES } from '../constants';
import LocationAutocomplete from './LocationAutocomplete';
import { motion } from 'framer-motion';

interface CartItem {
  id: string; 
  serviceId: string;
  name: string;
  duration: string;
  priceStr: string;
  numericPrice: number;
  guests: number;
}

interface Props {
    cart: CartItem[]; 
    bookingDetails: any; 
    setBookingDetails: any;
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, delta: number) => void;
    total: number;
    onCheckout: () => void;
    onClose?: () => void;
    className?: string;
}

const ReservationSidebar: React.FC<Props> = ({ cart, bookingDetails, setBookingDetails, onRemove, onUpdateQuantity, total, onCheckout, onClose, className = "" }) => {
    
    // Helper to get image for cart item
    const getServiceImage = (serviceId: string) => {
        const service = SERVICES.find(s => s.id === serviceId);
        return service ? service.image : '';
    };

    return (
        <div className={`bg-[#FAFAF9] h-full flex flex-col relative shadow-2xl ${className}`}>
            
            {/* Header with Organic Shape */}
            <div className="px-8 pt-8 pb-6 shrink-0 flex justify-between items-end bg-[#FAFAF9] z-10 relative">
                <div>
                    <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.4em] text-stone-400 block mb-3">My Sanctuary</span>
                    <h2 className="font-serif text-5xl font-light text-secondary italic tracking-[-0.02em] leading-[0.9]">Your Ritual</h2>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-3 hover:bg-stone-200/50 rounded-full text-stone-400 hover:text-secondary transition-colors">
                        <X size={24} strokeWidth={1} />
                    </button>
                )}
                {/* Decorative Element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-2">
                
                {/* Cart Items Section */}
                <section className="mb-8">
                    {cart.length === 0 ? (
                        <div className="py-24 flex flex-col items-center justify-center text-center opacity-60">
                            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-6 text-stone-300">
                                <Sparkles size={24} strokeWidth={1} />
                            </div>
                            <p className="font-serif text-3xl font-light text-secondary">Your ritual is empty</p>
                            <p className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400 mt-4">Select a treatment to begin</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item, idx) => (
                                <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-3 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-stone-100 flex gap-4 group hover:border-primary/20 transition-all duration-300"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-20 h-24 shrink-0 rounded-xl overflow-hidden relative">
                                        <img 
                                            src={getServiceImage(item.serviceId)} 
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between relative py-0.5">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-serif text-2xl font-light text-secondary leading-none pr-6">{item.name}</h4>
                                                <button 
                                                    onClick={() => onRemove(item.id)}
                                                    className="absolute -top-1 -right-1 text-stone-300 hover:text-red-400 transition-colors p-1.5"
                                                >
                                                    <Trash2 size={16} strokeWidth={1.5} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3 text-stone-500 text-[9px] font-sans font-semibold uppercase tracking-[0.2em] mb-4">
                                                <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
                                                    <Clock size={10} /> {item.duration.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price and Quantity Row */}
                                        <div className="flex justify-between items-end">
                                            <span className="font-serif text-xl font-light text-primary mb-1">
                                                {item.priceStr.replace('IDR', '').trim()}
                                            </span>
                                            
                                            {/* Quantity Control */}
                                            <div className="flex items-center gap-1 bg-stone-50 rounded-lg p-0.5 border border-stone-100">
                                                <button 
                                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                                    disabled={item.guests <= 1}
                                                    className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-secondary hover:bg-stone-100 active:scale-90 transition-all disabled:opacity-40 disabled:active:scale-100"
                                                >
                                                    <Minus size={10} />
                                                </button>
                                                <span className="font-sans font-semibold text-[10px] w-5 text-center text-secondary">{item.guests}</span>
                                                <button 
                                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                                    className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-secondary hover:bg-stone-100 active:scale-90 transition-all"
                                                >
                                                    <Plus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                    
                    {/* Add Another Treatment Button */}
                    {onClose && (
                        <button 
                            onClick={onClose}
                            className="w-full mt-6 py-4 border border-dashed border-stone-300 rounded-full text-stone-400 text-[9px] font-sans font-semibold uppercase tracking-[0.3em] hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={14} /> Add Another Treatment
                        </button>
                    )}
                </section>

                {/* Details Form - Modern Minimal */}
                <section className="space-y-6 pb-12">
                    <div className="flex items-center gap-4">
                         <div className="h-px bg-stone-200 flex-1"></div>
                         <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400">Guest Details</span>
                         <div className="h-px bg-stone-200 flex-1"></div>
                    </div>
                    
                    <div className="space-y-6">
                        
                        {/* Name */}
                        <div className="group">
                            <label className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400 mb-2 block ml-1 group-focus-within:text-primary transition-colors">Full Name</label>
                            <input 
                                type="text"
                                value={bookingDetails.name}
                                onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})}
                                placeholder="e.g. Sarah Jenkins"
                                className="w-full bg-white px-5 py-4 rounded-xl border border-stone-100 text-secondary placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20 transition-all shadow-sm font-sans font-light"
                            />
                        </div>

                        {/* Date/Time Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400 mb-2 block ml-1 group-focus-within:text-primary transition-colors">Date</label>
                                <div className="relative">
                                    <input 
                                        type="date"
                                        value={bookingDetails.date}
                                        onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                                        className="w-full bg-white pl-4 pr-2 py-4 rounded-xl border border-stone-100 text-secondary focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20 transition-all shadow-sm font-sans font-light text-sm uppercase tracking-wide"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none w-4 h-4" />
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400 mb-2 block ml-1 group-focus-within:text-primary transition-colors">Time</label>
                                <div className="relative">
                                    <input 
                                        type="time"
                                        value={bookingDetails.time}
                                        onChange={(e) => setBookingDetails({...bookingDetails, time: e.target.value})}
                                        className="w-full bg-white pl-4 pr-2 py-4 rounded-xl border border-stone-100 text-secondary focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20 transition-all shadow-sm font-sans font-light text-sm uppercase tracking-wide"
                                    />
                                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="group">
                            <label className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400 mb-2 block ml-1 group-focus-within:text-primary transition-colors">Location</label>
                            <LocationAutocomplete 
                                value={bookingDetails.location}
                                onChange={(val) => setBookingDetails({...bookingDetails, location: val})}
                                placeholder="Villa Name or Area"
                                className="w-full bg-white px-5 py-4 rounded-xl border border-stone-100 text-secondary placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20 transition-all shadow-sm font-light"
                            />
                        </div>

                        {/* Room Number */}
                        <div className="group">
                            <label className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400 mb-2 block ml-1 group-focus-within:text-primary transition-colors">Room Number (Optional)</label>
                            <input 
                                type="text"
                                value={bookingDetails.roomNumber || ''}
                                onChange={(e) => setBookingDetails({...bookingDetails, roomNumber: e.target.value})}
                                placeholder="e.g. 101 or Villa 5"
                                className="w-full bg-white px-5 py-4 rounded-xl border border-stone-100 text-secondary placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20 transition-all shadow-sm font-sans font-light"
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* Sticky Organic Footer */}
            <div className="p-6 bg-white/80 backdrop-blur-md border-t border-stone-100 shrink-0 z-20 pb-8">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400 block mb-2">Estimated Total</span>
                        <div className="flex items-baseline gap-2">
                             <div className="font-serif text-4xl font-light text-secondary">{formatPrice(total)}</div>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onCheckout}
                    disabled={cart.length === 0}
                    className="w-full bg-secondary text-white h-16 rounded-full font-sans font-semibold uppercase tracking-[0.3em] text-[10px] hover:bg-primary transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-8 shadow-xl hover:shadow-primary/20 group relative overflow-hidden"
                >
                    <span className="relative z-10">Reserve Appointment</span>
                    <span className="relative z-10 bg-white/10 p-2 rounded-full group-hover:bg-white group-hover:text-primary transition-colors">
                        <ChevronRight size={16} />
                    </span>
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
            </div>
        </div>
    );
};

export default ReservationSidebar;
