import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, ChevronLeft, ChevronRight, X, Clock, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { SERVICES, WHATSAPP_NUMBER, formatPrice } from '../constants';
import { ServiceItem } from '../types';
import ModernServiceCard from '../components/ModernServiceCard';
import ReservationSidebar from '../components/ReservationSidebar';
import ServiceDetailModal from '../components/ServiceDetailModal';

interface CartItem {
    id: string;
    serviceId: string;
    name: string;
    duration: string;
    priceStr: string;
    numericPrice: number;
    guests: number;
}

const Home: React.FC = () => {
    // Cart State
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCartPillDismissed, setIsCartPillDismissed] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null); // Modal State
    const [activeCategory, setActiveCategory] = useState('All');
    const [isGridView, setIsGridView] = useState(false);

    const [bookingDetails, setBookingDetails] = useState({
        name: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        location: '',
        roomNumber: ''
    });

    const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const carouselRef = useRef<HTMLDivElement>(null);
    const categories = ['All', 'Massage', 'Packages', 'Body', 'Beauty'];

    // Cart Functions
    const addToCart = (service: ServiceItem, duration: string, priceStr: string, numericPrice: number) => {
        setCart(prev => [...prev, {
            id: Date.now().toString(),
            serviceId: service.id,
            name: service.name,
            duration,
            priceStr,
            numericPrice,
            guests: 1 // Default to 1 guest per item
        }]);
        setIsCartOpen(true); // Auto open drawer on add
        setIsCartPillDismissed(false); // Reset dismissed state
    };

    const removeFromCart = (itemId: string) => setCart(prev => prev.filter(item => item.id !== itemId));

    const updateCartItemQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newGuests = Math.max(1, item.guests + delta);
                return { ...item, guests: newGuests };
            }
            return item;
        }));
    };

    const calculateTotal = () => cart.reduce((sum, item) => sum + (item.numericPrice * item.guests), 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        const itemsList = cart.map(item => `• *${item.name}* (${item.duration}) x ${item.guests} Guest(s)`).join('\n');
        const totalTreatments = cart.reduce((acc, item) => acc + item.guests, 0);
        const total = calculateTotal();

        const roomInfo = bookingDetails.roomNumber ? `\n🚪 Room/Villa No: ${bookingDetails.roomNumber}` : '';

        const message = `*ELEXOIR BALI • RESERVATION REQUEST*
──────────────────────
Hello Elexoir Concierge,
I would like to book a professional home spa session.

*THE RITUALS*
${itemsList}

*APPOINTMENT DETAILS*
👤 Primary Guest: ${bookingDetails.name}
👥 Total Treatments: ${totalTreatments}
🗓 Date: ${bookingDetails.date}
⏰ Time: ${bookingDetails.time}
📍 Location: ${bookingDetails.location}${roomInfo}

*ESTIMATED TOTAL:* ${formatPrice(total)}
──────────────────────
_Looking forward to your confirmation._`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -carouselRef.current.offsetWidth : carouselRef.current.offsetWidth;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Filter Logic
    const filteredServices = SERVICES.filter(s => {
        if (activeCategory === 'All') return true;
        return s.category.toLowerCase() === activeCategory.toLowerCase();
    });

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans text-text">

            {/* --- MODAL --- */}
            <ServiceDetailModal
                service={selectedService}
                onClose={() => setSelectedService(null)}
                onAdd={addToCart}
            />

            {/* --- LUMINOUS HERO SECTION --- */}
            <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
                {/* Background Image with Warm Matte Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                        alt="Luxury In-Villa Spa Background" 
                        className="w-full h-full object-cover object-center filter brightness-45 scale-103"
                    />
                    {/* Sage Matte Shade Overlay */}
                    <div className="absolute inset-0 bg-primary/20 backdrop-brightness-[0.85] mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-primary/10"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-[1200px] px-6 text-center flex flex-col items-center mt-12 md:mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-background/85 bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 rounded-full inline-block mb-6">
                            Luxury In-Villa Wellness
                        </span>
                        <h2 className="font-serif font-normal text-4xl sm:text-6xl md:text-[88px] text-background leading-[1.05] tracking-tight max-w-5xl mx-auto">
                            Relax, Indulge, <br />
                            <span className="italic font-light opacity-95">Enjoy & Love Yourself.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row gap-4 mt-6"
                    >
                        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" 
                           className="inline-flex h-14 px-10 bg-white hover:bg-background text-primary items-center justify-center hover:shadow-soft transition-all duration-300 rounded-xl">
                           <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Book Appointment</span>
                        </a>
                        <button onClick={() => {
                            const target = itemRefs.current['menu-start'];
                            if (target) target.scrollIntoView({ behavior: 'smooth' });
                        }}
                           className="inline-flex h-14 px-10 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white items-center justify-center transition-all duration-300 rounded-xl">
                           <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Explore Rituals</span>
                        </button>
                    </motion.div>
                </div>

                {/* Hero Footer Info */}
                <div className="absolute bottom-0 left-0 right-0 z-10 hidden md:block border-t border-white/15 bg-background/5 backdrop-blur-md">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-7 grid grid-cols-3 gap-8 text-center text-white/90">
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 mb-3">Concierge</span>
                            <span className="text-xs font-semibold mb-0.5">T: +62 851 7411 9423</span>
                            <span className="text-[11px] font-light text-white/60">info@elexoirhomespa.com</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 mb-3">Availability</span>
                            <span className="text-xs font-semibold mb-0.5">Mon to Sun: 9:00 am — 10:00 pm</span>
                            <span className="text-[11px] font-light text-white/60">Delivered directly to your villa</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 mb-3">Sanctuary</span>
                            <span className="text-xs font-semibold mb-0.5">Ubud, Bali</span>
                            <span className="text-[11px] font-light text-white/60">Indonesian Wellness</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- NUDE FEATURES BANNER (Quiet Luxury Aesthetic) --- */}
            <section className="w-full bg-surface border-y border-border/80 py-20 px-6 relative z-10">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
                    {[
                        { title: 'Villa Service', desc: 'Pair our in-villa setup with your choice of music, aroma, and pressure. We bring the luxury to you.', icon: <MapPin className="w-8 h-8 stroke-1 text-accent" /> },
                        { title: 'Eco Friendly', desc: 'Our oils and linens are sustainably sourced and organic, focusing on all-natural skin care.', icon: <Heart className="w-8 h-8 stroke-1 text-accent" /> },
                        { title: 'For All Needs', desc: 'Whether sports recovery, deep relaxation, or glowing skin—our therapists tailor every motion.', icon: <Sparkles className="w-8 h-8 stroke-1 text-accent" /> }
                    ].map((feat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.08 }}
                            className="flex flex-col items-center bg-background/50 border border-border/40 p-8 rounded-2xl shadow-soft"
                        >
                            <div className="mb-5 p-3 rounded-full bg-background border border-border/60">{feat.icon}</div>
                            <h4 className="font-serif font-normal text-xl text-primary tracking-wide mb-3">{feat.title}</h4>
                            <p className="font-light text-xs text-text-muted leading-relaxed max-w-[280px]">
                                {feat.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- FULL MENU SECTION --- */}
            <div ref={(el) => { itemRefs.current['menu-start'] = el; }} className="relative bg-background z-20">
                <div className="min-h-screen pb-24">

                    {/* Main Content */}
                    <div className="w-full max-w-[1600px] mx-auto pt-24">

                        {/* Section Header */}
                        <div className="px-6 md:px-12 mb-14 flex flex-col items-center text-center gap-4">
                            <div>
                                <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 inline-block">
                                    The Collection
                                </span>
                                <h2 className="font-serif text-5xl md:text-[68px] font-normal text-primary leading-tight tracking-tight relative">
                                    Curated <span className="italic font-light opacity-95">Rituals</span>
                                </h2>
                                <div className="w-16 h-[1.5px] bg-accent/60 mx-auto mt-6"></div>
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="sticky top-[72px] lg:top-[88px] z-30 bg-background/80 backdrop-blur-md border-y border-border/60 py-3.5 px-6 md:px-12 mb-10 shadow-none">
                            <div className="flex gap-3.5 overflow-x-auto no-scrollbar items-center justify-center pb-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 rounded-full border ${activeCategory === cat
                                            ? 'bg-primary text-white border-primary shadow-soft'
                                            : 'bg-transparent text-text-muted hover:text-primary hover:bg-surface border-border/80'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Services View Toggle */}
                        <div className="flex-1">
                            {!isGridView ? (
                                /* Carousel View */
                                <div className="relative group/carousel">
                                    {/* Mobile Swipe Hint */}
                                    <div className="md:hidden flex flex-col items-center mb-6">
                                        <motion.div
                                            animate={{ x: [-15, 15, -15] }}
                                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                            className="flex items-center gap-1.5 text-accent"
                                        >
                                            <div className="w-6 h-[1.5px] bg-accent/40"></div>
                                            <div className="w-6 h-[1.5px] bg-accent/60"></div>
                                            <div className="w-6 h-[1.5px] bg-accent"></div>
                                        </motion.div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-accent mt-2">Swipe to explore</span>
                                    </div>

                                    {/* Carousel Header with Controls */}
                                    <div className="hidden md:flex px-6 md:px-12 mb-6 justify-end items-center">
                                        <div className="hidden md:flex gap-3">
                                            <button
                                                onClick={() => scrollCarousel('left')}
                                                className="w-11 h-11 border border-border/80 flex items-center justify-center text-primary bg-background hover:bg-surface rounded-full transition-colors"
                                                aria-label="Previous"
                                            >
                                                <ChevronLeft size={20} strokeWidth={1.5} />
                                            </button>
                                            <button
                                                onClick={() => scrollCarousel('right')}
                                                className="w-11 h-11 border border-border/80 flex items-center justify-center text-primary bg-background hover:bg-surface rounded-full transition-colors"
                                                aria-label="Next"
                                            >
                                                <ChevronRight size={20} strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        ref={carouselRef}
                                        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-8 px-6 md:px-12 pb-10 pt-2"
                                    >
                                        {filteredServices.map((service) => (
                                            <div key={service.id} className="snap-center shrink-0 w-[82vw] md:w-[420px] bg-surface/20 border border-border/40 p-4 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-500">
                                                <ModernServiceCard
                                                    service={service}
                                                    onView={(s) => setSelectedService(s)}
                                                />
                                            </div>
                                        ))}
                                        {filteredServices.length === 0 && (
                                            <div className="w-full py-20 text-center font-bold text-xl uppercase tracking-widest text-text-muted border-2 border-dashed border-border/80 rounded-2xl mx-6">
                                                No treatments found
                                            </div>
                                        )}
                                    </div>

                                    {/* View More Button */}
                                    {filteredServices.length > 0 && (
                                        <div className="flex justify-center mt-10 pb-12">
                                            <motion.button
                                                onClick={() => setIsGridView(true)}
                                                className="group flex items-center gap-2.5 px-8 py-4.5 bg-primary border border-primary text-white hover:bg-transparent hover:text-primary rounded-xl transition-all duration-300"
                                            >
                                                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
                                                    View All Treatments
                                                </span>
                                                <ArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Grid View */
                                <div className="px-6 md:px-12 pb-24 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                                        <AnimatePresence mode='popLayout'>
                                            {filteredServices.map((service) => (
                                                <div key={service.id} className="bg-surface/20 border border-border/40 p-4 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-500">
                                                    <ModernServiceCard
                                                        service={service}
                                                        onView={(s) => setSelectedService(s)}
                                                    />
                                                </div>
                                            ))}
                                        </AnimatePresence>
                                        {filteredServices.length === 0 && (
                                            <div className="col-span-full py-20 text-center font-bold text-xl uppercase tracking-widest text-text-muted border-2 border-dashed border-border/80 rounded-2xl mx-6">
                                                No treatments found
                                            </div>
                                        )}
                                    </div>

                                    {/* Back to Carousel button */}
                                    <div className="flex justify-center mt-14">
                                        <button
                                            onClick={() => setIsGridView(false)}
                                            className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary bg-background border border-border/80 px-8 py-4.5 rounded-xl hover:border-primary/50 hover:bg-surface transition-all duration-300 flex items-center gap-2 group"
                                        >
                                            <ChevronLeft size={14} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" />
                                            Back to Carousel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CART DRAWER (Global) --- */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[60]"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[460px] bg-background z-[70] shadow-2xl flex flex-col"
                        >
                            <ReservationSidebar
                                cart={cart}
                                bookingDetails={bookingDetails}
                                setBookingDetails={setBookingDetails}
                                onRemove={removeFromCart}
                                onUpdateQuantity={updateCartItemQuantity}
                                total={calculateTotal()}
                                onCheckout={handleCheckout}
                                onClose={() => setIsCartOpen(false)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- FLOATING CART PILL --- */}
            <AnimatePresence>
                {cart.length > 0 && !isCartOpen && !isCartPillDismissed && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
                    >
                        <div
                            onClick={() => setIsCartOpen(true)}
                            className="bg-background/90 backdrop-blur-md border border-border/80 px-6 py-4.5 flex items-center gap-4.5 transition-all duration-300 pointer-events-auto cursor-pointer hover:border-accent hover:shadow-soft rounded-2xl"
                        >
                            <div className="text-primary bg-surface w-9 h-9 flex items-center justify-center font-bold text-sm border border-border rounded-full shrink-0">
                                {cart.length}
                            </div>
                            <div className="flex flex-col items-start justify-center leading-none shrink-0">
                                <span className="font-bold text-[9px] uppercase tracking-[0.25em] text-accent mb-1.5">IDR</span>
                                <span className="font-serif text-xl font-normal text-primary">{formatPrice(calculateTotal()).replace(/IDR/i, '').trim()}</span>
                            </div>
                            <div className="h-8 w-[1px] bg-border shrink-0 mx-1.5"></div>
                            <div className="flex flex-col text-[9px] font-bold uppercase tracking-[0.2em] leading-tight text-left shrink-0 text-accent">
                                <span>View</span>
                                <span>Ritual</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCartPillDismissed(true);
                                }}
                                className="p-1.5 ml-1.5 hover:bg-surface text-text-muted hover:text-primary transition-colors shrink-0 rounded-full"
                                aria-label="Close"
                            >
                                <X size={14} strokeWidth={2} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- EXPERIENCE SECTION --- */}
            <section className="py-24 bg-surface relative z-20 border-t border-border/60">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-16 relative">
                        <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-5 inline-block">
                            Why Choose Us
                        </span>
                        <h2 className="font-serif text-5xl md:text-[68px] font-normal text-primary leading-tight tracking-tight">
                            The Elexoir <span className="italic font-light opacity-95">Difference</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Star size={24} strokeWidth={1.5} className="text-accent" />, title: "5 Star Experience", desc: "Consistently rated exceptional by travelers seeking luxury relaxation.", color: "bg-background" },
                            { icon: <Sparkles size={24} strokeWidth={1.5} className="text-accent" />, title: "Pro Therapists", desc: "Expertly trained artisans selected from Bali's finest luxury resorts.", color: "bg-background" },
                            { icon: <MapPin size={24} strokeWidth={1.5} className="text-accent" />, title: "Villa Service", desc: "We bring the complete spa atmosphere directly to your living space.", color: "bg-background" },
                            { icon: <Clock size={24} strokeWidth={1.5} className="text-accent" />, title: "Fast Booking", desc: "Seamless and prompt concierge service available via WhatsApp.", color: "bg-background" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                                className={`flex flex-col items-center text-center p-8 border border-border/50 rounded-2xl shadow-soft hover:shadow-soft-lg hover:bg-stone-50/50 transition-all duration-300 ${item.color}`}
                            >
                                <div className="w-12 h-12 border border-border/80 flex items-center justify-center mb-6 rounded-full bg-background shrink-0">
                                    {item.icon}
                                </div>
                                <h4 className="font-serif text-2xl font-normal text-primary mb-3 tracking-wide">{item.title}</h4>
                                <p className="text-text-muted font-light leading-relaxed text-[13px] w-full">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CALL TO ACTION --- */}
            <section className="py-24 bg-background relative overflow-hidden flex flex-col items-center text-center px-6 border-t border-border/60">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-4xl mx-auto relative z-10 bg-surface/30 backdrop-blur-md p-12 md:p-20 rounded-3xl border border-border/60"
                >
                    <h2 className="font-serif text-5xl md:text-[64px] font-normal text-primary leading-tight tracking-tight mb-6">
                        Relax in Your <br />
                        <span className="italic font-light text-accent">Villa Tonight</span>
                    </h2>
                    <p className="text-text-muted font-light text-base mb-10 max-w-lg mx-auto">
                        Secure your preferred time for a holistic healing journey without stepping out the door.
                    </p>
                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-15 px-10 bg-primary hover:bg-secondary text-white items-center justify-center gap-2.5 shadow-soft rounded-xl transition-all duration-300 group"
                    >
                        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Book a Home Spa</span>
                        <ArrowRight size={15} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </section>

            {/* --- GOOGLE REVIEWS SECTION --- */}
            <section className="py-24 px-6 bg-surface relative overflow-hidden flex flex-col items-center border-t border-border/60">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto text-center w-full"
                >
                    <div className="flex flex-col items-center justify-center gap-4 mb-12">
                        <div className="flex gap-1.5 text-accent">
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                        </div>
                        <h2 className="text-primary font-serif font-normal text-3xl sm:text-4xl tracking-tight">
                            Rated 5.0 on Google Maps
                        </h2>
                    </div>

                    <div className="rounded-2xl overflow-hidden shadow-soft border border-border/60 max-w-3xl mx-auto mb-12 relative bg-background">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.115628358793!2d115.2671386!3d-8.488137100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23d00e0ee4769%3A0x2353065278116e6a!2sElexoir%20Spa%20%26%20Massage%20%7C%20Home%20Massage%20Service!5e0!3m2!1sid!2sid!4v1771989137085!5m2!1sid!2sid"
                            width="100%"
                            height="380"
                            style={{ border: 0, display: 'block' }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Elexoir Spa & Massage Reviews"
                        ></iframe>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 max-w-md mx-auto">
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Elexoir+Spa+%26+Massage+Ubud"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-background border border-border text-primary px-8 py-4.5 text-[10px] font-sans font-bold uppercase tracking-[0.2em] hover:bg-stone-50 rounded-xl transition-all duration-300 text-center"
                        >
                            Read All Reviews
                        </a>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-primary hover:bg-secondary text-white px-8 py-4.5 text-[10px] font-sans font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Book via WhatsApp
                        </a>
                    </div>
                </motion.div>
            </section>

        </div>
    );
};

export default Home;
