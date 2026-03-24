
import React, { useState, useRef, useEffect } from 'react';
import { SERVICES, WHATSAPP_NUMBER, formatPrice } from '../constants';
import { ServiceItem } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, ShoppingBag, ArrowRight, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ModernServiceCard from '../components/ModernServiceCard';
import ReservationSidebar from '../components/ReservationSidebar';
import ServiceDetailModal from '../components/ServiceDetailModal';

// --- Types ---
interface CartItem {
    id: string;
    serviceId: string;
    name: string;
    duration: string;
    priceStr: string;
    numericPrice: number;
    guests: number;
}

const PriceList: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCartPillDismissed, setIsCartPillDismissed] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

    const [isGridView, setIsGridView] = useState(false);

    const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const carouselRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const getCurrentDate = () => new Date().toISOString().split('T')[0];

    const [bookingDetails, setBookingDetails] = useState({
        name: '',
        date: getCurrentDate(),
        time: '10:00',
        location: '',
        roomNumber: ''
    });

    const categories = ['All', 'Massage', 'Packages', 'Body', 'Beauty'];

    // Scroll to Item Logic
    useEffect(() => {
        if (location.state && location.state.scrollToId) {
            setIsGridView(true); // Ensure grid view if we are scrolling to a specific item
            const targetId = location.state.scrollToId;
            const element = itemRefs.current[targetId];
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }
    }, [location]);

    const addToCart = (service: ServiceItem, duration: string, priceStr: string, numericPrice: number) => {
        setCart(prev => [...prev, {
            id: Date.now().toString(),
            serviceId: service.id,
            name: service.name,
            duration,
            priceStr,
            numericPrice,
            guests: 1
        }]);
        setIsCartOpen(true); // Auto open
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
        <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">

            {/* --- MODAL --- */}
            <ServiceDetailModal
                service={selectedService}
                onClose={() => setSelectedService(null)}
                onAdd={addToCart}
            />

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]"></div>

            {/* Page Container */}
            <div className="flex flex-col min-h-screen relative z-10 w-full max-w-[1600px] mx-auto overflow-hidden">

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col w-full bg-white">

                    {/* Header Section */}
                    <div className="px-6 md:px-16 pt-16 md:pt-24 pb-12 text-center lg:text-left bg-surface relative overflow-hidden border-b border-border">
                        <h1 className="sr-only">Elexoir Spa & Massage Treatments | Home Massage Service Ubud</h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-4xl relative z-10"
                        >
                            <div className="inline-block text-text-muted font-sans font-medium uppercase tracking-[0.2em] text-[10px] mb-8">
                                Complete Collection
                            </div>

                            <h2 className="font-serif text-5xl md:text-[80px] font-light text-secondary leading-[1] tracking-[-0.02em] mb-8">
                                Select Your <br />
                                <span className="italic text-text-muted">Ritual</span>
                            </h2>
                            <p className="text-secondary/70 font-light text-sm max-w-sm mx-auto lg:mx-0 leading-relaxed">
                                Professional therapeutic massages delivered straight to your villa. Explore our curated menu of relaxation and healing.
                            </p>
                        </motion.div>
                    </div>

                    {/* Sticky Filter Bar */}
                    <div className="sticky top-[70px] z-30 bg-white/90 backdrop-blur-md border-b border-border py-4 px-6 md:px-16 shadow-none">
                        <div className="flex gap-4 overflow-x-auto no-scrollbar items-center pb-2">
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
                    <div className="flex-1 bg-white">
                        {!isGridView ? (
                            /* Carousel View */
                            <div className="relative group/carousel">
                                {/* Carousel Controls */}
                                <div className="hidden md:flex px-6 md:px-16 pt-12 pb-6 justify-end items-center">
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
                                    className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-8 px-6 md:px-16 pb-12 pt-4"
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
                                        <div className="w-full py-20 text-center font-black text-2xl uppercase tracking-widest text-text-muted border-4 border-dashed border-black mx-6">
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
                            <div className="px-6 md:px-16 pb-24 pt-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                                    <AnimatePresence mode='popLayout'>
                                        {filteredServices.map((service) => (
                                            <ModernServiceCard
                                                key={service.id}
                                                service={service}
                                                onView={(s) => setSelectedService(s)}
                                                domRef={(el) => { itemRefs.current[service.id] = el; }}
                                            />
                                        ))}
                                    </AnimatePresence>
                                    {filteredServices.length === 0 && (
                                        <div className="col-span-full py-20 text-center font-black text-2xl uppercase tracking-widest text-text-muted border-4 border-dashed border-black mx-6">
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
                            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60]"
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
                                className="p-2 ml-2 hover:text-primary transition-colors shrink-0"
                                aria-label="Close"
                            >
                                <X size={16} strokeWidth={1} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default PriceList;
