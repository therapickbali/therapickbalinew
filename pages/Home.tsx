
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Filter, ShoppingBag, ChevronLeft, ChevronRight, X, Clock, Sparkles } from 'lucide-react';
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
        <div className="min-h-screen bg-background relative overflow-hidden">

            {/* --- MODAL --- */}
            <ServiceDetailModal
                service={selectedService}
                onClose={() => setSelectedService(null)}
                onAdd={addToCart}
            />

            {/* --- LUMINOUS HERO SECTION --- */}
            <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg" 
                        alt="Luxury Spa Background" 
                        className="w-full h-full object-cover object-center filter brightness-50"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-[1200px] px-6 text-center flex flex-col items-center mt-12 md:mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <h2 className="font-serif font-normal text-5xl sm:text-6xl md:text-[80px] text-white leading-[1.1] tracking-tight max-w-4xl mx-auto">
                            Relax, Indulge, Enjoy and Love Yourself.
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4"
                    >
                        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" 
                           className="inline-flex h-14 px-10 bg-white text-black items-center justify-center hover:bg-white/90 transition-colors duration-500">
                           <span className="text-[11px] font-sans font-bold uppercase tracking-[0.15em]">Book Appointment</span>
                        </a>
                        <Link to="/prices"
                           className="inline-flex h-14 px-10 bg-transparent border border-white text-white items-center justify-center hover:bg-white hover:text-black transition-colors duration-500">
                           <span className="text-[11px] font-sans font-bold uppercase tracking-[0.15em]">View Service Menu</span>
                        </Link>
                    </motion.div>
                </div>

                {/* Hero Footer Info */}
                <div className="absolute bottom-0 left-0 right-0 z-10 hidden md:block border-t border-white/20 bg-black/10 backdrop-blur-sm">
                    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-8 grid grid-cols-3 gap-8 text-center text-white">
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Contact</span>
                            <span className="text-sm font-light mb-1">T: +62 851 7411 9423</span>
                            <span className="text-sm font-light">info@elexoirhomespa.com</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Hours</span>
                            <span className="text-sm font-light mb-1">Mon to Sun: 9:00 am — 10:00 pm</span>
                            <span className="text-sm font-light text-white/50">Available Daily</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Location</span>
                            <span className="text-sm font-light mb-1">Ubud, Bali,</span>
                            <span className="text-sm font-light">Indonesia</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- NUDE FEATURES BANNER (Mimicking Reference) --- */}
            <section className="w-full bg-primary py-20 px-6 relative z-10 border-b border-border">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center text-white">
                    {[
                        { title: 'Villa Service', desc: 'Pair our in-villa setup with your choice of music, aroma, and pressure. We bring the luxury to you.' },
                        { title: 'Eco Friendly', desc: 'Our oils and linens are sustainably sourced and organic, focusing on all-natural skin care.' },
                        { title: 'For All Needs', desc: 'Whether sports recovery, deep relaxation, or glowing skin—our therapists tailor every motion.' }
                    ].map((feat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <Sparkles className="w-10 h-10 stroke-1 mb-6 text-white" />
                            <h4 className="font-sans font-medium text-base tracking-wide mb-4 whitespace-nowrap">{feat.title}</h4>
                            <p className="font-light text-xs text-white/90 leading-relaxed max-w-[280px]">
                                {feat.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- FULL MENU SECTION --- */}
            <div ref={(el) => { itemRefs.current['menu-start'] = el; }} className="relative bg-white z-20 border-b-4 border-black">
                <div className="min-h-screen pb-24">

                    {/* Main Content */}
                    <div className="w-full max-w-[1600px] mx-auto pt-24">

                        {/* Section Header */}
                        <div className="px-6 md:px-12 mb-16 flex flex-col items-center text-center gap-6">
                            <div>
                                <span className="text-primary font-semibold uppercase tracking-[0.2em] text-xs mb-6 inline-block">
                                    The Collection
                                </span>
                                <h2 className="font-serif text-5xl md:text-[70px] font-light text-secondary leading-[1.1] tracking-tight relative">
                                    Curated <span className="italic">Rituals</span>
                                </h2>
                                <div className="w-24 h-[1px] bg-accent mx-auto mt-8"></div>
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="sticky top-[72px] lg:top-[88px] z-30 bg-white/90 backdrop-blur-md border-y border-border py-4 px-6 md:px-12 mb-12 shadow-none">
                            <div className="flex gap-4 overflow-x-auto no-scrollbar items-center justify-center pb-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-8 py-3 text-[11px] font-sans font-medium uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-300 ${activeCategory === cat
                                            ? 'bg-primary text-white'
                                            : 'bg-transparent text-text-muted hover:text-primary hover:bg-surface border border-transparent hover:border-border'
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
                                            animate={{ x: [-20, 20, -20] }}
                                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                            className="flex items-center gap-2 text-black"
                                        >
                                            <div className="w-8 h-[2px] bg-black"></div>
                                            <div className="w-8 h-[2px] bg-black"></div>
                                            <div className="w-8 h-[2px] bg-black"></div>
                                        </motion.div>
                                        <span className="text-xs font-black uppercase tracking-widest text-black mt-2">Swipe to explore</span>
                                    </div>

                                    {/* Carousel Header with Controls */}
                                    <div className="hidden md:flex px-6 md:px-12 mb-8 justify-end items-center">
                                        <div className="hidden md:flex gap-4">
                                            <button
                                                onClick={() => scrollCarousel('left')}
                                                className="w-12 h-12 border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                                                aria-label="Previous"
                                            >
                                                <ChevronLeft size={24} strokeWidth={1} />
                                            </button>
                                            <button
                                                onClick={() => scrollCarousel('right')}
                                                className="w-12 h-12 border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                                                aria-label="Next"
                                            >
                                                <ChevronRight size={24} strokeWidth={1} />
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        ref={carouselRef}
                                        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-8 px-6 md:px-12 pb-12 pt-4"
                                    >
                                        {filteredServices.map((service) => (
                                            <div key={service.id} className="snap-center shrink-0 w-[85vw] md:w-[450px]">
                                                <ModernServiceCard
                                                    service={service}
                                                    onView={(s) => setSelectedService(s)}
                                                />
                                            </div>
                                        ))}
                                        {filteredServices.length === 0 && (
                                            <div className="w-full py-20 text-center font-black text-2xl uppercase tracking-widest text-text-muted border-4 border-dashed border-black rounded-none mx-6">
                                                No treatments found
                                            </div>
                                        )}
                                    </div>

                                    {/* View More Button */}
                                    {filteredServices.length > 0 && (
                                        <div className="flex justify-center mt-12 pb-16">
                                            <motion.button
                                                onClick={() => setIsGridView(true)}
                                                className="group flex items-center gap-3 px-10 py-5 bg-primary border border-primary text-white hover:bg-transparent hover:text-primary transition-colors duration-500"
                                            >
                                                <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em]">
                                                    View All Treatments
                                                </span>
                                                <ArrowRight size={16} strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Grid View */
                                <div className="px-6 md:px-12 pb-24 pt-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-12">
                                        <AnimatePresence mode='popLayout'>
                                            {filteredServices.map((service) => (
                                                <ModernServiceCard
                                                    key={service.id}
                                                    service={service}
                                                    onView={(s) => setSelectedService(s)}
                                                />
                                            ))}
                                        </AnimatePresence>
                                        {filteredServices.length === 0 && (
                                            <div className="col-span-full py-20 text-center font-black text-2xl uppercase tracking-widest text-text-muted border-4 border-dashed border-black rounded-none mx-6">
                                                No treatments found
                                            </div>
                                        )}
                                    </div>

                                    {/* Back to Carousel button */}
                                    <div className="flex justify-center mt-16">
                                        <button
                                            onClick={() => setIsGridView(false)}
                                            className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-primary bg-transparent border border-border px-10 py-5 hover:border-primary transition-colors duration-500 flex items-center gap-3 group"
                                        >
                                            <ChevronLeft size={16} strokeWidth={1} className="group-hover:-translate-x-1 transition-transform" />
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-[70] border-l border-border flex flex-col"
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
                            className="bg-white border border-border px-6 py-4 flex items-center gap-4 transition-colors duration-300 pointer-events-auto cursor-pointer hover:border-primary"
                        >
                            <div className="text-primary w-8 h-8 flex items-center justify-center font-serif text-xl shrink-0">
                                {cart.length}
                            </div>
                            <div className="flex flex-col items-start justify-center leading-none shrink-0 pl-1">
                                <span className="font-semibold text-[10px] uppercase tracking-[0.2em] text-text-muted mb-1">IDR</span>
                                <span className="font-serif text-xl text-primary">{formatPrice(calculateTotal()).replace(/IDR/i, '').trim()}</span>
                            </div>
                            <div className="h-8 w-[1px] bg-border shrink-0 mx-2"></div>
                            <div className="flex flex-col text-[10px] font-medium uppercase tracking-[0.2em] leading-tight text-left shrink-0 text-text-muted">
                                <span>View</span>
                                <span>Ritual</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCartPillDismissed(true);
                                }}
                                className="p-2 ml-2 hover:bg-highlight text-text-muted transition-colors shrink-0"
                                aria-label="Close"
                            >
                                <X size={16} strokeWidth={1.5} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- EXPERIENCE SECTION --- */}
            <section className="py-24 md:py-32 bg-primary relative z-20">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-16 md:mb-24 relative">
                        <span className="text-accent font-semibold uppercase tracking-[0.2em] text-xs mb-8 inline-block">
                            Why Choose Us
                        </span>
                        <h2 className="font-serif text-5xl md:text-[70px] font-light text-white leading-tight tracking-tight">
                            The Elexoir <span className="italic">Difference</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Star size={28} strokeWidth={1.5} className="text-primary" />, title: "5 Star Experience", desc: "Consistently rated exceptional by travelers seeking luxury relaxation.", color: "bg-white" },
                            { icon: <Sparkles size={28} strokeWidth={1.5} className="text-primary" />, title: "Pro Therapists", desc: "Expertly trained artisans selected from Bali's finest luxury resorts.", color: "bg-white" },
                            { icon: <MapPin size={28} strokeWidth={1.5} className="text-primary" />, title: "Villa Service", desc: "We bring the complete spa atmosphere directly to your living space.", color: "bg-white" },
                            { icon: <Clock size={28} strokeWidth={1.5} className="text-primary" />, title: "Fast Booking", desc: "Seamless and prompt concierge service available via WhatsApp.", color: "bg-white" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                                className={`flex flex-col items-center text-center p-10 border border-border shadow-none hover:bg-stone-50 transition-all duration-500 ${item.color}`}
                            >
                                <div className="w-16 h-16 border border-border flex items-center justify-center mb-8 shrink-0">
                                    {item.icon}
                                </div>
                                <h4 className="font-serif text-2xl text-secondary mb-4 tracking-wide">{item.title}</h4>
                                <p className="text-text-muted font-light leading-relaxed text-sm w-full">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CALL TO ACTION --- */}
            <section className="py-32 md:py-40 bg-highlight relative overflow-hidden flex flex-col items-center text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-4xl mx-auto relative z-10 bg-white/80 backdrop-blur-md p-16 md:p-24 rounded-none shadow-none border border-white/50"
                >
                    <h2 className="font-serif text-5xl md:text-7xl font-light text-secondary leading-tight tracking-tight mb-8">
                        Relax in Your <br /><span className="italic text-primary">Villa Tonight</span>
                    </h2>
                    <p className="text-text-muted font-light text-lg mb-12 max-w-lg mx-auto pb-8">
                        Secure your preferred time for a holistic healing journey without stepping out the door.
                    </p>
                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-16 px-12 bg-primary text-white items-center justify-center gap-4 hover:bg-transparent hover:text-primary border border-primary transition-colors duration-500 group"
                    >
                        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em]">Book a Home Spa</span>
                        <ArrowRight size={20} strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </section>

            {/* --- GOOGLE REVIEWS SECTION --- */}
            <section className="py-24 px-6 bg-white relative overflow-hidden flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto text-center w-full"
                >
                    <div className="flex flex-col items-center justify-center gap-6 mb-16">
                        <div className="flex gap-2 text-accent">
                            {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
                        </div>
                        <h2 className="text-secondary font-serif font-light text-4xl tracking-tight">
                            Rated 5.0 on Google
                        </h2>
                    </div>

                    <div className="rounded-none overflow-hidden shadow-none border border-border bg-stone-100 max-w-3xl mx-auto mb-16 relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.115628358793!2d115.2671386!3d-8.488137100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23d00e0ee4769%3A0x2353065278116e6a!2sElexoir%20Spa%20%26%20Massage%20%7C%20Home%20Massage%20Service!5e0!3m2!1sid!2sid!4v1771989137085!5m2!1sid!2sid"
                            width="100%"
                            height="400"
                            style={{ border: 0, display: 'block' }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Elexoir Spa & Massage Reviews"
                        ></iframe>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16">
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Elexoir+Spa+%26+Massage+Ubud"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto bg-transparent border border-border text-primary px-10 py-5 text-[11px] font-sans font-medium uppercase tracking-[0.2em] hover:border-primary transition-colors duration-500 text-center"
                        >
                            Read All Reviews
                        </a>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto bg-primary text-white border border-primary px-10 py-5 text-[11px] font-sans font-medium uppercase tracking-[0.2em] hover:bg-transparent hover:text-primary transition-colors duration-500 flex items-center justify-center gap-3"
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
