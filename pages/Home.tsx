
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Filter, ShoppingBag, ChevronLeft, ChevronRight, X } from 'lucide-react';
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

  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
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

      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 md:pt-40 pb-12 md:pb-24 min-h-[85vh] flex flex-col justify-center items-center text-center px-6 max-w-[1600px] mx-auto z-10">
         {/* Hidden H1 for SEO - Targeting primary keywords */}
         <h1 className="sr-only">Home Massage Ubud | Luxury Villa Spa & Massage Bali</h1>
         
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 flex items-center gap-4"
         >
             <div className="h-[1px] w-12 md:w-24 bg-secondary/20"></div>
             <span className="text-[9px] md:text-[10px] font-sans font-semibold uppercase tracking-[0.4em] text-text-muted">
                 Est. 2024 • Bali, Indonesia
             </span>
             <div className="h-[1px] w-12 md:w-24 bg-secondary/20"></div>
         </motion.div>

         <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-7xl md:text-[140px] font-light text-secondary leading-[0.85] tracking-[-0.02em] mb-12"
         >
             The Art of <br/>
             <span className="italic text-primary">Wellbeing</span>
         </motion.h2>

         <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-text-muted text-lg md:text-2xl font-light leading-relaxed max-w-2xl mx-auto mb-16"
         >
             Experience the luxury of a five-star spa without leaving your sanctuary. 
             We deliver curated, professional wellness rituals directly to your private villa.
         </motion.p>

         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center gap-10 w-full"
         >
             <button onClick={() => itemRefs.current['menu-start']?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto h-14 px-12 bg-secondary text-white rounded-full flex items-center justify-center gap-4 hover:bg-primary transition-all shadow-xl shadow-secondary/10 group">
                 <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em]">Explore Menu</span>
                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>

             <div className="flex flex-col items-center gap-4 text-text-muted">
                <div className="flex items-center gap-3">
                    <Star size={14} className="text-primary" fill="currentColor" />
                    <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] opacity-60">5.0 Star Rated Service</span>
                </div>
                <div className="flex items-center gap-3">
                    <MapPin size={14} className="text-secondary opacity-40" />
                    <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] opacity-60">Serving Canggu, Seminyak & Ubud</span>
                </div>
             </div>
         </motion.div>
      </section>

      {/* --- FULL MENU SECTION --- */}
      <div ref={(el) => { itemRefs.current['menu-start'] = el; }} className="relative bg-white z-20 border-t border-stone-100">
          <div className="min-h-screen">
            
            {/* Main Content */}
            <div className="w-full max-w-[1600px] mx-auto pt-20">
                
                {/* Section Header */}
                <div className="px-6 md:px-12 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <span className="text-primary font-sans font-semibold uppercase tracking-[0.4em] text-[9px] mb-4 block">
                            The Collection
                        </span>
                        <h2 className="font-serif text-6xl md:text-[80px] font-light text-secondary leading-[0.9] tracking-[-0.02em]">
                            Curated <span className="italic text-primary">Rituals</span>
                        </h2>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-xl border-b border-stone-100 py-2 md:py-3 px-6 md:px-12 mb-2 md:mb-8">
                     <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar items-center">
                        <Filter size={16} className="text-stone-400 mr-2 shrink-0" />
                        {categories.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-full text-[9px] font-sans font-semibold uppercase tracking-[0.3em] whitespace-nowrap transition-all duration-500 ${
                                    activeCategory === cat 
                                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20 transform scale-105' 
                                    : 'bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-secondary border border-stone-200/50'
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
                    className="bg-[#222222] text-white pl-2 pr-2 py-2 rounded-[32px] shadow-2xl flex items-center gap-3 sm:gap-4 border border-white/10 backdrop-blur-md bg-opacity-95 transition-transform pointer-events-auto cursor-pointer max-w-full"
                 >
                     <div className="bg-[#9c6f53] text-white w-[42px] h-[52px] rounded-[20px] flex items-center justify-center font-serif text-xl font-light shadow-glow shrink-0">
                         {cart.length}
                     </div>
                     <div className="flex flex-col items-start justify-center leading-none shrink-0 pl-1">
                         <span className="font-serif italic text-sm text-white/80 mb-1.5">IDR</span>
                         <span className="font-serif italic text-2xl tracking-wide">{formatPrice(calculateTotal()).replace(/IDR/i, '').trim()}</span>
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

      {/* --- ETHOS SECTION --- */}
      <section className="py-32 md:py-48 px-6 bg-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="font-serif text-5xl md:text-7xl font-light mb-12 leading-[1.1] tracking-tight">
                  "The body achieves what <br/>the mind <span className="italic text-[#a87a5b]">believes</span>."
              </h2>
              <div className="w-16 h-[1px] bg-[#a87a5b] mx-auto mb-12"></div>
              <p className="text-white/70 text-lg md:text-2xl font-light leading-relaxed mb-16 max-w-3xl mx-auto">
                  Our therapists are not just practitioners; they are artisans of relaxation. 
                  Selected from Bali's finest resorts, they bring an elevated standard of care, hygiene, and intuition to your private residence.
              </p>
              <Link to="/about" className="inline-block border-b border-[#a87a5b] pb-2 text-[10px] font-sans font-semibold uppercase tracking-[0.3em] hover:text-[#a87a5b] transition-colors duration-500">
                  Read Our Story
              </Link>
          </div>
      </section>

      {/* --- GOOGLE REVIEWS SECTION --- */}
      <section className="py-16 px-6 bg-[#f5f1eb] relative overflow-hidden">
          <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center relative z-10"
          >
              <div className="flex flex-col items-center justify-center gap-3 mb-8">
                  <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#F59E0B" className="text-amber-500" />)}
                  </div>
                  <h2 className="text-secondary font-sans font-semibold tracking-[0.3em] uppercase text-[9px]">
                      Rated 5.0 on Google
                  </h2>
              </div>
              
              <div className="rounded-[16px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-8 border border-stone-200/50 bg-white max-w-3xl mx-auto">
                  <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.115628358793!2d115.2671386!3d-8.488137100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23d00e0ee4769%3A0x2353065278116e6a!2sElexoir%20Spa%20%26%20Massage%20%7C%20Home%20Massage%20Service!5e0!3m2!1sid!2sid!4v1771989137085!5m2!1sid!2sid" 
                      width="100%" 
                      height="280" 
                      style={{ border: 0, display: 'block' }} 
                      allowFullScreen={false} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Elexoir Spa & Massage Reviews"
                  ></iframe>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                      href="https://www.google.com/maps/search/?api=1&query=Elexoir+Spa+%26+Massage+Ubud"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full text-[9px] font-sans font-semibold uppercase tracking-[0.3em] hover:bg-stone-800 transition-colors shadow-sm text-center"
                  >
                      Read Google Reviews
                  </a>
                  <a 
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 rounded-full text-[9px] font-sans font-semibold uppercase tracking-[0.3em] hover:bg-[#20bd5a] transition-colors shadow-sm flex items-center justify-center gap-2"
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
