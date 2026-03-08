
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
  
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
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
    <div className="min-h-screen bg-[#FAFAF9] pt-20">

        {/* --- MODAL --- */}
        <ServiceDetailModal 
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onAdd={addToCart}
        />
        
        {/* Page Container */}
        <div className="flex flex-col min-h-screen">
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto">
                
                {/* Header Section */}
                <div className="px-6 md:px-12 py-4 md:py-12 text-center lg:text-left">
                    {/* Hidden H1 for SEO */}
                    <h1 className="sr-only">Elexoir Spa & Massage Treatments | Home Massage Service Ubud</h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <span className="text-primary font-sans font-semibold uppercase tracking-[0.4em] text-[9px] mb-4 block">The Menu</span>
                        <h2 className="font-serif text-6xl md:text-[80px] font-light text-secondary mb-6 leading-[0.9] tracking-[-0.02em]">
                            Select Your <br/><span className="italic text-stone-400">Sanctuary</span>
                        </h2>
                        <p className="text-stone-500 font-light text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
                            Our curated collection of treatments designed to restore balance. 
                            Select your duration and customize your in-villa experience.
                        </p>
                    </motion.div>
                </div>

                {/* Sticky Filter Bar */}
                <div className="sticky top-[70px] z-30 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-stone-200/50 py-2 md:py-3 px-6 md:px-12 mb-2 md:mb-6">
                     <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar items-center">
                        <Filter size={16} className="text-stone-400 mr-2 shrink-0" />
                        {categories.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-full text-[9px] font-sans font-semibold uppercase tracking-[0.3em] whitespace-nowrap transition-all duration-500 ${
                                    activeCategory === cat 
                                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20 transform scale-105' 
                                    : 'bg-white text-stone-500 border border-stone-200/50 hover:border-secondary hover:text-secondary'
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
                            <div className="md:hidden flex flex-col items-center mb-2">
                                <motion.div 
                                    animate={{ x: [-20, 20, -20] }}
                                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                    className="flex items-center gap-2 text-primary/40"
                                >
                                    <div className="w-8 h-[1px] bg-current"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                    <div className="w-8 h-[1px] bg-current"></div>
                                </motion.div>
                                <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400 mt-2">Swipe to explore</span>
                            </div>

                            {/* Carousel Header with Controls */}
                            <div className="hidden md:flex px-6 md:px-12 mb-6 justify-between items-end">
                                <div className="hidden md:block">
                                    <p className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400">Swipe to explore</p>
                                </div>
                                <div className="hidden md:flex gap-3">
                                    <button 
                                        onClick={() => scrollCarousel('left')}
                                        className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-secondary hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95"
                                        aria-label="Previous"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button 
                                        onClick={() => scrollCarousel('right')}
                                        className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-secondary hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95"
                                        aria-label="Next"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            <div 
                                ref={carouselRef}
                                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 px-6 md:px-12 pb-10"
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
                                    <div className="w-full py-20 text-center text-stone-400 font-light">
                                        No treatments found in this category.
                                    </div>
                                )}
                            </div>
                            
                            {/* View More Button */}
                            {filteredServices.length > 0 && (
                                <div className="flex justify-center mt-2 pb-16">
                                    <motion.button 
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsGridView(true)}
                                        className="group flex items-center gap-3 px-8 py-3.5 bg-secondary text-white rounded-full hover:bg-primary transition-all duration-300 shadow-lg shadow-secondary/10 hover:shadow-primary/20"
                                    >
                                        <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em]">
                                            View All Treatments
                                        </span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Grid View (Current Design) */
                        <div className="px-6 md:px-12 pb-24">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
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
                                    <div className="col-span-full py-20 text-center text-stone-400 font-light">
                                        No treatments found in this category.
                                    </div>
                                )}
                            </div>
                            
                            {/* Back to Carousel button */}
                            <div className="flex justify-center mt-12">
                                <button 
                                    onClick={() => setIsGridView(false)}
                                    className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400 hover:text-primary transition-colors flex items-center gap-2 group"
                                >
                                    <div className="w-4 h-[1px] bg-stone-300 group-hover:w-8 group-hover:bg-primary transition-all"></div>
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
                        className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-[70] shadow-2xl flex flex-col"
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

        {/* --- FLOATING CART PILL (When closed) --- */}
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
                        className="bg-[#222222] text-white pl-2 pr-2 py-2 rounded-full shadow-2xl flex items-center gap-3 sm:gap-4 border border-white/10 backdrop-blur-md bg-opacity-95 transition-transform pointer-events-auto cursor-pointer max-w-full"
                    >
                        <div className="bg-[#9c6f53] text-white w-[42px] h-[52px] rounded-[20px] flex items-center justify-center font-serif text-xl font-light shadow-glow shrink-0">
                            {cart.length}
                        </div>
                        <div className="flex flex-col items-start justify-center leading-none shrink-0 pl-1">
                            <span className="font-sans font-semibold text-[8px] uppercase tracking-[0.3em] text-white/50 mb-1.5">IDR</span>
                            <span className="font-serif font-light text-3xl tracking-[-0.02em]">{formatPrice(calculateTotal()).replace(/IDR/i, '').trim()}</span>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10 shrink-0 mx-1 sm:mx-2"></div>
                        <div className="flex flex-col text-[8px] font-sans font-semibold uppercase tracking-[0.4em] leading-[1.4] text-left shrink-0">
                            <span>View</span>
                            <span>Ritual</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsCartPillDismissed(true);
                            }}
                            className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors ml-1 shrink-0"
                            aria-label="Close"
                        >
                            <X size={18} strokeWidth={1} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

    </div>
  );
};

export default PriceList;
