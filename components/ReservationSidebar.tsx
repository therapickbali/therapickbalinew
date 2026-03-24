
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
        <div className={`bg-stone-50 h-full flex flex-col relative border-l border-border ${className}`}>

            {/* Header */}
            <div className="px-8 pt-10 pb-6 shrink-0 flex justify-between items-end bg-white border-b border-border z-10 relative">
                <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted mb-3 block">My Sanctuary</span>
                    <h2 className="font-serif font-light text-4xl text-secondary leading-tight">Your Ritual</h2>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 bg-transparent border border-border text-text-muted hover:text-primary hover:border-primary transition-colors">
                        <X size={24} strokeWidth={1} />
                    </button>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 bg-stone-50 border-b border-border">

                {/* Cart Items Section */}
                <section className="mb-12">
                    {cart.length === 0 ? (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 border border-border flex items-center justify-center mb-6 text-text-muted">
                                <Sparkles size={24} strokeWidth={1} />
                            </div>
                            <p className="font-serif font-light text-2xl text-secondary mb-2">Empty Ritual</p>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">Select a treatment to begin</p>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {cart.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white py-6 border-b border-border flex gap-5 group relative"
                                >
                                    {/* Thumbnail Portrait */}
                                    <div className="w-20 aspect-[4/5] shrink-0 overflow-hidden relative bg-stone-100">
                                        <img
                                            src={getServiceImage(item.serviceId)}
                                            alt={item.name}
                                            className="w-full h-full object-cover filter brightness-95"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-center relative">
                                        <div className="mb-2">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-sans font-medium text-sm text-secondary leading-tight pr-6 tracking-wide">{item.name}</h4>
                                                <button
                                                    onClick={() => onRemove(item.id)}
                                                    className="absolute -top-1 -right-1 bg-transparent text-stone-300 hover:text-red-400 transition-colors p-1"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={14} strokeWidth={1} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 text-text-muted text-[10px] font-sans tracking-wide">
                                                {item.duration}
                                            </div>
                                        </div>

                                        {/* Price and Quantity Row */}
                                        <div className="flex justify-between items-end mt-auto">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                                                    {item.priceStr.replace('IDR', '').trim()} IDR
                                                </span>
                                            </div>

                                            {/* Minimal Quantity Control */}
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                                    disabled={item.guests <= 1}
                                                    className="text-text-muted hover:text-secondary transition-colors disabled:opacity-30"
                                                >
                                                    <Minus size={14} strokeWidth={1} />
                                                </button>
                                                <span className="font-sans font-medium text-xs text-secondary">{item.guests}</span>
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                                    className="text-text-muted hover:text-secondary transition-colors"
                                                >
                                                    <Plus size={14} strokeWidth={1} />
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
                            className="w-full mt-6 py-4 bg-transparent border-none text-secondary font-sans text-xs uppercase tracking-[0.2em] hover:text-text-muted transition-colors flex items-center justify-center gap-3"
                        >
                            <Plus size={14} strokeWidth={1} /> Add Treatment
                        </button>
                    )}
                </section>

                {/* Details Form */}
                <section className="space-y-6 pb-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] bg-border flex-1"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Guest Details</span>
                        <div className="h-[1px] bg-border flex-1"></div>
                    </div>

                    <div className="space-y-6">

                        {/* Name */}
                        <div className="group">
                            <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary mb-2 block">Full Name</label>
                            <input
                                type="text"
                                value={bookingDetails.name}
                                onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                                placeholder="What should we call you?"
                                className="w-full bg-transparent border-b border-border py-3 text-base font-light text-secondary outline-none focus:border-primary transition-colors placeholder-stone-300"
                            />
                        </div>

                        {/* Date/Time Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="group">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary mb-2 block">Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={bookingDetails.date}
                                        onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                                        className="w-full bg-transparent border-b border-border py-3 text-base font-light text-secondary outline-none focus:border-primary transition-colors pr-1"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary mb-2 block">Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={bookingDetails.time}
                                        onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
                                        className="w-full bg-transparent border-b border-border py-3 text-base font-light text-secondary outline-none focus:border-primary transition-colors pr-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="group">
                            <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary mb-2 block">Location</label>
                            <LocationAutocomplete
                                value={bookingDetails.location}
                                onChange={(val) => setBookingDetails({ ...bookingDetails, location: val })}
                                placeholder="Villa Name or Area"
                                className="w-full bg-transparent border-b border-border py-3 text-base font-light text-secondary outline-none focus:border-primary transition-colors placeholder-stone-300"
                            />
                        </div>

                        {/* Room Number */}
                        <div className="group">
                            <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary mb-2 block">Room Number (OPTIONAL)</label>
                            <input
                                type="text"
                                value={bookingDetails.roomNumber || ''}
                                onChange={(e) => setBookingDetails({ ...bookingDetails, roomNumber: e.target.value })}
                                placeholder="e.g. 101 or Villa 5"
                                className="w-full bg-transparent border-b border-border py-3 text-base font-light text-secondary outline-none focus:border-primary transition-colors placeholder-stone-300"
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* Sticky Footer */}
            <div className="p-6 lg:p-8 bg-white shrink-0 z-20 border-t border-border">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted block mb-1">Estimated Total</span>
                        <div className="flex items-baseline gap-2">
                            <div className="font-serif text-3xl text-primary">{formatPrice(total).replace('IDR', '').trim()}</div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">IDR</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onCheckout}
                    disabled={cart.length === 0}
                    className="w-full bg-primary text-white border border-primary h-16 uppercase tracking-[0.2em] text-[11px] font-medium hover:bg-transparent hover:text-primary transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
                >
                    <span>Confirm Reservation</span>
                    <ChevronRight size={16} strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default ReservationSidebar;
