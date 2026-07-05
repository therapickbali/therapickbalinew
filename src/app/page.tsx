'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Heart, Cloud, Sparkles, Droplet, User, Flame, Clock, ArrowRight, X, ShoppingBag, Plus, Minus, MessageCircle, ChevronLeft, Bitcoin , BadgeCheck} from 'lucide-react';
import Link from 'next/link';
import { useSpa } from '@/context/SpaContext';
import SeoExpandedContent from '@/components/SeoExpandedContent';
import WhyChooseUs from '@/components/WhyChooseUs';
import ServiceAreas from '@/components/ServiceAreas';
import FaqSection from '@/components/FaqSection';
import FloatingCalendar from '@/components/FloatingCalendar';

// Dummy data for redesign structure
const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'massage', label: 'Massage' },
    { id: 'package', label: 'Package' },
    { id: 'facial', label: 'Facial' },
    { id: 'treatment', label: 'Treatment' },
];


export default function Home() {
    const { treatments, campaign, products, isLoading } = useSpa();

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPrice, setMaxPrice] = useState(1500000); // default max price
    const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const [showStory, setShowStory] = useState(false);
    
    // Show only if there is at least one pinned treatment in the database
    const showPinnedTreatments = treatments.some(t => t.is_pinned);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
        }
    };
    
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
    };
    
    // Booking Form State for Campaign
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isSelectingMore, setIsSelectingMore] = useState(false);
    const [expandedTreatmentId, setExpandedTreatmentId] = useState<string | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Initialize date and time
    const getInitialDateTime = () => {
        const now = new Date();
        const date = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].substring(0, 5);
        return { date, time };
    };
    
    const [formData, setFormData] = useState({ name: '', location: '', room: '', ...getInitialDateTime() });
    const [popupState, setPopupState] = useState<{isOpen: boolean, type: 'group' | 'time' | null, therapistId: string | null, availableAt: string, availableDate?: string}>({isOpen: false, type: null, therapistId: null, availableAt: ''});
    
    // Multi-step booking states
    const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedTherapists, setSelectedTherapists] = useState<string[]>([]);
    const todayStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    const totalGuests = cartItems.reduce((acc, item) => acc + item.guests, 0);
    const [viewingTherapist, setViewingTherapist] = useState<any>(null);

    const [selectedRegion, setSelectedRegion] = useState('Bali');
    const [selectedAreaFilter, setSelectedAreaFilter] = useState('All');

    const MOCK_THERAPISTS = [
        { id: 't1', name: 'Sarah J.', location: 'Seminyak', region: 'Bali', rating: 5, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', desc: 'Expert in deep tissue and sports massage.', reviews: [{ author: 'Emily R.', text: 'Sarah was incredible. Best deep tissue massage I have ever had.' }], availability: { today: ['10:00', '13:00', '16:30'], days: ['Mon', 'Tue', 'Thu', 'Fri'] }, status: 'Online' },
        { id: 't2', name: 'Dewi K.', location: 'Ubud', region: 'Bali', rating: 5, avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98a?w=150&h=150&fit=crop', desc: 'Specializes in traditional Balinese healing rituals.', reviews: [{ author: 'Michael B.', text: 'Dewi brings such a calming, authentic Balinese energy.' }], availability: { today: ['11:30', '14:00', '18:00'], days: ['Wed', 'Thu', 'Sat', 'Sun'] }, status: 'Busy', availableAt: '13:00' },
        { id: 't3', name: 'Wayan M.', location: 'Canggu', region: 'Bali', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', desc: 'Aromatherapy and relaxation massage specialist.', reviews: [{ author: 'Sophie T.', text: 'Wayan knew exactly what I needed. Highly recommend.' }], availability: { today: ['09:00', '15:00'], days: ['Mon', 'Wed', 'Fri', 'Sat'] }, status: 'Off' },
        { id: 't4', name: 'Ketut A.', location: 'Ubud', region: 'Bali', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', desc: 'Holistic massage therapist with 10 years experience.', reviews: [{ author: 'David W.', text: 'Amazing technique and completely dissolved my tension.' }], availability: { today: ['12:00', '17:00'], days: ['Tue', 'Wed', 'Thu', 'Sun'] }, status: 'Online' },
        { id: 't5', name: 'Made B.', location: 'Uluwatu', region: 'Bali', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop', desc: 'Known for incredibly relaxing Hawaiian Lomi-Lomi.', reviews: [{ author: 'Anna K.', text: 'The Lomi-Lomi was life-changing. Made is a master.' }], availability: { today: ['10:30', '14:30', '19:00'], days: ['Mon', 'Tue', 'Fri', 'Sun'] }, status: 'Busy', availableAt: '13:00' },
        { id: 't6', name: 'Aisha F.', location: 'Downtown', region: 'Dubai', rating: 5, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop', desc: 'Specialist in Swedish and deep tissue.', reviews: [{ author: 'Sarah L.', text: 'Aisha is phenomenal! Perfect pressure.' }], availability: { today: ['09:00', '13:00', '16:00'], days: ['Mon', 'Tue', 'Wed', 'Thu'] }, status: 'Online' },
        { id: 't7', name: 'Fatima R.', location: 'Marina', region: 'Dubai', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&h=150&fit=crop', desc: 'Holistic healing and relaxation.', reviews: [{ author: 'Chloe M.', text: 'So soothing and relaxing, Fatima is the best.' }], availability: { today: ['11:00', '15:00', '18:30'], days: ['Thu', 'Fri', 'Sat', 'Sun'] }, status: 'Off' },
    ];
    
    const REGION_AREAS = {
        'Bali': ['All', 'Ubud', 'Canggu', 'Seminyak', 'Uluwatu', 'Nusa Dua'],
        'Dubai': ['All', 'Downtown', 'Marina', 'Palm Jumeirah']
    };

    const LOCATIONS = ['Ubud', 'Canggu', 'Seminyak', 'Uluwatu', 'Nusa Dua'];

    const filteredAndSortedTreatments = React.useMemo(() => {
        let result = treatments.filter(t => {
            const matchesCategory = activeCategory === 'all' || t.category.toLowerCase() === activeCategory.toLowerCase();
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
            
            const getLowestPrice = (options: any[]) => {
                if (!options || options.length === 0) return 0;
                return Math.min(...options.map(o => parseInt(o.price.replace(/,/g, '') || '0')));
            };
            
            const matchesPrice = getLowestPrice(t.options) <= maxPrice;
            
            return matchesCategory && matchesSearch && matchesPrice;
        });

        // Always sort from lowest to highest naturally
        result.sort((a, b) => {
            const getLowestPrice = (options: any[]) => {
                if (!options || options.length === 0) return 0;
                return Math.min(...options.map(o => parseInt(o.price.replace(/,/g, '') || '0')));
            };
            return getLowestPrice(a.options) - getLowestPrice(b.options);
        });

        return result;
    }, [treatments, activeCategory, searchQuery, maxPrice]);

    const handleCampaignBooking = async (e: React.FormEvent, ) => {
        e.preventDefault();
        
        if (!formData.name || !formData.date || !formData.time || !formData.location) {
            alert('Please fill in all required fields (Name, Date, Time, Location).');
            return;
        }

        // Open window synchronously to bypass popup blockers
        const newWindow = window.open('', '_blank');

        setIsProcessing(true);
        
        try {
            const totalPrice = cartItems.reduce((acc, item) => {
                const isCouple = ['couple', 'honeymoon', 'rejuvenation'].some(k => item.title.toLowerCase().includes(k));
                const multiplier = isCouple ? (item.guests / 2) : item.guests;
                return acc + (item.price * multiplier);
            }, 0);

            const treatmentsListStr = cartItems.map(item => `${item.title} (${item.duration} MINS)`).join(', ');

            const waNumber = '6285174119423';
            
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

                if (item.isCampaign) {
                    const originalPriceNum = item.price / (1 - (item.discountPercentage / 100));
                    const isCouple = ['couple', 'honeymoon', 'rejuvenation'].some(k => item.title.toLowerCase().includes(k));
                    const multiplier = isCouple ? (item.guests / 2) : item.guests;
                    const originalPrice = (originalPriceNum * multiplier).toLocaleString('en-US');
                    return `*${item.campaignTitle.trim().toUpperCase()}*\n*${item.title.toUpperCase()}*\nDURATION ${item.duration} MINS\n${item.guests} PERSON [${item.discountPercentage}% OFF]\nIDR ${price} ~IDR ${originalPrice}~${whatsIncludedText}`;
                }
                return `*${item.title.toUpperCase()}*\nDURATION ${item.duration} MINS\n${item.guests} PERSON IDR ${price}${whatsIncludedText}`;
            }).join('\n\n------------------------\n\n');
            
            const websiteSource = typeof window !== 'undefined' ? window.location.hostname : 'Unknown';
            const therapistMsg = selectedTherapists.length > 0
                ? `\n*Therapist Request:* ${selectedTherapists.map(id => MOCK_THERAPISTS.find(t => t.id === id)?.name).join(', ')}`
                : `\n*Therapist Request:* Assign Automatically`;

            const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`*NEW RESERVATION*
            
*Guest Details*
Name: ${formData.name}
Date: ${formData.date}
Time: ${formData.time}
Location Area: ${selectedArea}
Address: ${formData.location}
Room: ${formData.room || 'Not specified'}${therapistMsg}

*Treatments Selected*
${treatmentsList}

*TOTAL IDR ${totalPrice.toLocaleString('en-US')}*`)}`;

            setTimeout(() => {
                if (newWindow) {
                    newWindow.location.href = whatsappUrl;
                } else {
                    window.location.href = whatsappUrl;
                }
            }, 300);

            setIsBookingModalOpen(false);
            setBookingStep(1);
            setCartItems([]);
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

    return (
        <div className="min-h-screen bg-black relative overflow-hidden font-sans text-white/90">
            
            {/* Top Gradient Background */}
            <div className="absolute top-0 left-0 right-0 h-[400px] md:h-[500px] bg-gradient-to-b from-transparent to-transparent z-0 pointer-events-none"></div>

            {/* Luxurious Ambient Background */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] md:w-[800px] h-[600px] bg-transparent blur-[120px] rounded-full z-0 pointer-events-none opacity-60 mix-blend-multiply" />
            <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-transparent blur-[100px] rounded-full z-0 pointer-events-none opacity-50" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 md:pt-36">
                
                {/* Location Filter for Therapists */}
                <div className="md:hidden mt-4 mb-4 relative z-30 -mx-6 px-2">
                    <div className="bg-[#111]/80 backdrop-blur-xl border border-white/80 rounded-full p-1.5 flex items-center shadow-inner overflow-x-auto no-scrollbar gap-1">
                        
                        {/* Region Toggle Button */}
                        <button 
                            onClick={() => {
                                setSelectedRegion(selectedRegion === 'Bali' ? 'Dubai' : 'Bali');
                                setSelectedAreaFilter('All');
                            }}
                            className={`flex items-center gap-1 shrink-0 px-4 h-10 rounded-full transition-all duration-300 font-serif font-bold tracking-wide ${selectedAreaFilter === 'All' ? 'bg-white/20 shadow-md text-white' : 'text-white/90-muted hover:bg-white/50'}`}
                        >
                            <span>{selectedRegion}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><path d="m6 9 6 6 6-6"/></svg>
                        </button>

                        <div className="w-px h-6 bg-border/40 shrink-0 mx-1"></div>

                        {REGION_AREAS[selectedRegion as keyof typeof REGION_AREAS].filter(a => a !== 'All').map(area => (
                            <button
                                key={area}
                                onClick={() => setSelectedAreaFilter(area)}
                                className={`px-5 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-300 ${selectedAreaFilter === area ? 'bg-white/20 shadow-md text-white' : 'text-white/90-muted hover:text-white'}`}
                            >
                                {area}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Therapist Stories */}
                <div className="md:hidden mt-2 mb-6 relative z-20 -mx-6">
                    <div className="flex overflow-x-auto gap-4 no-scrollbar px-6 pb-2 snap-x snap-mandatory">
                        {MOCK_THERAPISTS.filter(t => t.region === selectedRegion && (selectedAreaFilter === 'All' || t.location === selectedAreaFilter)).map(t => (
                            <div key={t.id} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 snap-center outline-none" onClick={() => setViewingTherapist(t)}>
                                <div className={`w-[72px] h-[72px] rounded-full p-[3px] transition-all duration-300 shadow-soft ${selectedTherapists.includes(t.id) ? 'bg-gradient-to-tr from-primary via-highlight to-primary shadow-[0_8px_20px_rgb(0,0,0,0.15)] scale-110' : 'bg-gradient-to-tr from-gray-200 to-gray-100 hover:scale-105'}`}>
                                    <div className="w-full h-full rounded-full border-[3px] border-[#FDFBF7] overflow-hidden bg-white">
                                        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <span className={`text-[11px] text-center max-w-[72px] truncate transition-all ${selectedTherapists.includes(t.id) ? 'text-white font-bold' : 'text-white/90-muted font-medium'}`}>
                                    {t.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cinematic Campaign Card (Below Search) */}
                {campaign && (
                <div onClick={() => setIsCampaignModalOpen(true)} className="block outline-none">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full h-[260px] md:h-[420px] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] mb-8 group cursor-pointer bg-white transform-gpu transition-transform hover:-translate-y-2"
                    >
                        {/* 3D Glassmorphism border */}
                        <div className="absolute inset-0 rounded-[32px] md:rounded-[40px] border border-white/20 z-20 pointer-events-none"></div>
                        {/* Background Image */}
                        <img 
                            src={campaign.image || "https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&crop=center"} 
                            alt={campaign.title} 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        />
                        
                        {/* Cinematic Vignette & Gradients (Apple-like depth) */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-1000"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        
                        {/* Content Overlay */}
                        <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between z-10">
                            
                            {/* Top Label */}
                            <div className="flex justify-start">
                                <motion.span 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-[8px] md:text-[9px] font-bold tracking-[0.2em] uppercase border border-white/30 text-white shadow-sm"
                                >
                                    {campaign.label}
                                </motion.span>
                            </div>

                            <div className="flex items-end justify-between">
                                <div className="flex flex-col text-white pr-4">
                                    <h2 className="font-serif text-4xl md:text-6xl font-medium leading-tight tracking-tight mb-2 opacity-95 drop-shadow-lg max-w-[220px] md:max-w-[500px]">
                                        {campaign.title}
                                    </h2>
                                    <p className="text-white/80 text-[13px] md:text-base hidden md:block max-w-md leading-relaxed font-light drop-shadow-md">
                                        {campaign.description}
                                    </p>
                                </div>

                                {/* Minimal Apple-style Frosted Button */}
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-white flex items-center justify-center shrink-0 shadow-[0_8px_32px_rgb(0,0,0,0.15)] group-hover:bg-white/30 group-hover:scale-105 group-active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                    <ArrowRight size={20} strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                )}

                {/* Pinned / Most Booked Treatments (Mobile Only, Hidden until DB connected) */}
                {showPinnedTreatments && (
                    <div className="md:hidden mb-8 w-full relative z-20">
                        <h3 className="text-xs font-semibold text-white/90-muted mb-3 uppercase tracking-wider">Most Booked</h3>
                        <div className="flex overflow-x-auto gap-4 no-scrollbar -mx-6 px-6 pb-4 snap-x snap-mandatory">
                            {treatments.filter(t => t.is_pinned).map(treatment => (
                                <a href={`/rituals/${treatment.id}`} key={treatment.id} className="w-[65vw] sm:w-[220px] shrink-0 snap-center outline-none">
                                    <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[24px] p-2 flex flex-col h-full hover:shadow-none transition-all duration-300 relative group">
                                        <div className="aspect-[4/3] relative bg-[#111] overflow-hidden rounded-[16px]">
                                            {treatment.pinned_image ? (
                                                <img src={treatment.pinned_image} alt={treatment.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${treatment.bgPattern} opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-grow px-2 pt-3 pb-2">
                                            <p className="text-white/50 text-[10px] font-bold mb-1 line-clamp-1 uppercase tracking-widest">{treatment.category}</p>
                                            <h4 className="font-bold text-white text-[13px] line-clamp-1 mb-3">{treatment.title}</h4>
                                            <div className="flex items-center justify-between bg-white/10 rounded-full p-1 pl-3 mt-auto border border-white/10">
                                                <span className="font-semibold text-white text-[12px]">
                                                    IDR {parseInt((treatment.options[0]?.price || '0').replace(/,/g, '')).toLocaleString('en-US')}
                                                </span>
                                                <div className="w-7 h-7 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0 shadow-sm">
                                                    <Plus size={14} strokeWidth={2.5} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search & Categories Row */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-start gap-6 md:gap-4 relative z-20">
                    <div className="max-w-full overflow-hidden">
                        <h3 className="text-xs font-semibold text-white/90-muted mb-3 uppercase tracking-wider">Popular Category</h3>
                        <div className="flex overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 gap-3 no-scrollbar">
                            {CATEGORIES.map((cat) => {
                                const isActive = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex items-center justify-center px-6 py-3 rounded-full whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                            isActive 
                                                ? 'bg-white text-black shadow-[0_8px_20px_rgb(0,0,0,0.12)] scale-[1.02] border border-primary' 
                                                : 'bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-white border border-white/60 hover:bg-white/80 hover:scale-[1.02]'
                                        }`}
                                    >
                                        <span className="text-sm font-semibold tracking-wide">{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>


                </div>

                {/* Popular Treatments Scroll */}
                <div className="mb-24 relative group">
                    {/* Navigation Buttons (Desktop only) */}
                    <button 
                        onClick={scrollLeft}
                        className="hidden md:flex absolute left-[-20px] lg:left-[-40px] top-[40%] -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-full shadow-lg items-center justify-center z-20 text-white hover:scale-105 transition-transform"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button 
                        onClick={scrollRight}
                        className="hidden md:flex absolute right-[-20px] lg:right-[-40px] top-[40%] -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-full shadow-lg items-center justify-center z-20 text-white hover:scale-105 transition-transform"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>

                    {isLoading ? (
                        <div className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 gap-6 no-scrollbar">
                            {[1,2,3].map((skeleton) => (
                                <div key={skeleton} className="w-72 md:w-80 h-96 shrink-0 rounded-[32px] md:rounded-[40px] bg-border/40 animate-pulse"></div>
                            ))}
                        </div>
                    ) : treatments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center relative overflow-hidden rounded-[40px] bg-[#111] mx-6 md:mx-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-[#86868B] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm mb-4">Coming Soon</span>
                                <h3 className="text-2xl md:text-3xl font-medium text-[#1D1D1F] tracking-tight mb-2">Signature Treatments</h3>
                                <p className="text-[#86868B] max-w-sm mx-auto text-sm font-medium px-4">We are preparing our exclusive spa experiences.</p>
                            </div>
                        </div>
                    ) : (
                    <div ref={scrollContainerRef} className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 gap-6 no-scrollbar scroll-smooth">
                        {filteredAndSortedTreatments.map((item, idx) => (
                            <Link href={`/rituals/${item.id}`} key={item.id} className="w-72 md:w-80 shrink-0 block group outline-none">
                                <div className={`rounded-[32px] md:rounded-[40px] bg-gradient-to-br ${item.bgPattern} border border-white/20/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-700 flex flex-col h-full relative overflow-hidden group-hover:-translate-y-2 p-6 md:p-8`}>
                                    
                                    {/* Subtle glowing orb for spa ambiance */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/60 blur-[30px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>

                                    <div className="mb-8 flex items-start justify-between relative z-10">
                                        <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] border border-primary/10 text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex-grow flex flex-col">
                                        <h4 className="font-serif text-xl font-medium text-white mb-3 leading-tight">{item.title}</h4>
                                        <p className="text-xs text-white/90-muted leading-relaxed font-light mb-6 flex-grow line-clamp-4">{item.desc.charAt(0).toUpperCase() + item.desc.slice(1).toLowerCase()}</p>
                                        
                                        <div className="mt-auto pt-5 border-t border-white/20/50">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/90-muted mb-3 uppercase tracking-widest">
                                                <Clock className="w-3.5 h-3.5" /> {item.options[0]?.duration} MINS
                                            </div>
                                            <div className="flex items-center justify-between bg-white/10/80 backdrop-blur-sm rounded-full p-1 pl-4 border border-white/10">
                                                <span className="font-semibold text-white text-[14px]">IDR {parseInt(item.options[0]?.price.replace(/,/g, '') || '0').toLocaleString('en-US')}</span>
                                                <button className="w-10 h-10 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0 shadow-sm">
                                                    <Plus size={20} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    )}
                </div>

                {/* The Elexoir Boutique Section */}
                {products.length > 0 && (
                <div className="mb-32">
                    <div className="flex items-center justify-between mb-8 px-6 md:px-0">
                        <div>
                            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1 block">Take the Spa Home</span>
                            <h3 className="font-serif text-2xl md:text-3xl text-white font-medium leading-tight">Spa Boutique</h3>
                        </div>
                        <a href="/store" className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-xs font-medium hover:bg-white/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap shrink-0">
                            Shop Now
                        </a>
                    </div>
                    
                    {/* Swipeable Products */}
                    <div className="flex overflow-x-auto pb-10 -mx-6 px-6 md:mx-0 md:px-0 gap-6 no-scrollbar">
                        {products.map((product) => (
                            <a href="/store" key={product.id} className="w-48 md:w-52 shrink-0 block outline-none">
                                <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[24px] flex flex-col h-full hover:shadow-none transition-all duration-300 relative group p-2">
                                    
                                    {/* Image */}
                                    <div className="aspect-[4/5] relative bg-[#111] overflow-hidden rounded-[16px]">
                                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    
                                    {/* Text Info */}
                                    <div className="flex flex-col flex-grow px-2 md:px-3 pt-3 pb-2">
                                        <p className="text-white/50 text-[11px] font-medium mb-1 line-clamp-1">{product.category || 'Elexoir'}</p>
                                        <h4 className="font-bold text-white text-sm line-clamp-1 mb-4">{product.title}</h4>
                                        
                                        {/* Price and Add Button */}
                                        <div className="flex items-center justify-between bg-white/10 rounded-full p-1 pl-3 mt-auto border border-white/10">
                                            <span className="font-semibold text-white text-[13px]">Rp {parseInt(product.price.replace(/,/g, '')).toLocaleString('id-ID')}</span>
                                            <div className="w-8 h-8 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0 shadow-sm">
                                                <Plus size={16} strokeWidth={2.5} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                )}
            </div>
            
            <div className="hidden md:block pb-12">
                {/* Therapists Section */}
                <div className="mb-24 flex flex-col items-center max-w-7xl mx-auto px-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4 block text-center">Meet Our Therapists</span>
                    <h3 className="font-serif text-3xl md:text-5xl text-white font-medium mb-12 text-center leading-tight">
                        Expert <span className="italic">Healers</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                        {MOCK_THERAPISTS.slice(0, 4).map(t => (
                            <div key={t.id} className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[32px] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-none transition-all duration-300 group">
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-5 border-4 border-surface shadow-sm group-hover:scale-105 transition-transform duration-500">
                                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="font-bold text-lg text-white mb-1">{t.name}</h4>
                                <div className="text-xs font-bold uppercase tracking-widest text-white/90-muted mb-3">{t.location}</div>
                                <div className="flex items-center gap-1 mb-4 text-amber-500">
                                    {Array(5).fill(0).map((_, i) => (
                                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(t.rating) ? 'fill-current' : 'fill-transparent stroke-current'}`} viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-sm text-white/90-muted leading-relaxed">{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* About Us */}
                <div className="mb-24 flex flex-col md:flex-row gap-12 md:gap-24 items-center max-w-7xl mx-auto px-6">
                    <div className="flex-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4 block">Our Philosophy</span>
                        <h3 className="font-serif text-4xl md:text-5xl text-white font-medium mb-6 leading-tight domain-ubud-only">
                            Sanctuary for the Soul
                        </h3>
                        <h3 className="font-serif text-4xl md:text-5xl text-white font-medium mb-6 leading-tight domain-bali-only">
                            The Best Mobile Spa in <span className="italic">Bali</span>
                        </h3>
                        <p className="text-white/90-muted leading-relaxed mb-8 font-light">
                            Born from the ancient healing traditions of Bali, Elexoir Home Spa was created with a singular vision: to bring unparalleled luxury and profound relaxation directly to your sanctuary. We believe that true wellness requires an environment where you feel completely at ease—your own home or villa.
                        </p>
                        <AnimatePresence>
                            {showStory && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mt-6 mb-8"
                                >
                                    <h4 className="font-serif text-2xl text-white mb-4 leading-tight">
                                        The Ultimate <span className="italic">Luxury Home Spa</span> in Bali
                                    </h4>
                                    <p className="text-white/90-muted leading-relaxed font-light mb-6">
                                        Elevate your wellness journey with Elexoir Home Spa, Bali's premier mobile spa and in-villa massage service. Whether you are staying in the lush jungles of Ubud, the vibrant coasts of Canggu and Seminyak, or the breathtaking cliffs of Uluwatu, our certified professional therapists bring the ultimate 5-star spa experience directly to your doorstep.
                                    </p>
                                    <p className="text-white/90-muted leading-relaxed font-light mb-6">
                                        We specialize in traditional Balinese Massage, Deep Tissue therapies, and exclusive Couples Massage packages designed for absolute relaxation. Using only premium, organic massage oils and authentic holistic healing techniques, our bespoke spa treatments in Bali transform your private villa or hotel room into a tranquil sanctuary of rejuvenation.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!showStory && (
                            <button 
                                onClick={() => setShowStory(true)}
                                className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"
                            >
                                Discover Our Story <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                    <div className="flex-1 w-full relative">
                        <div className="aspect-[4/3] rounded-[40px] overflow-hidden bg-transparent border border-white shadow-soft relative flex items-center justify-center p-8 text-center">
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent_100%)] pointer-events-none"></div>
                             <div className="relative z-10">
                                 <h4 className="font-serif text-3xl text-white mb-3 italic">"A journey to pure tranquility."</h4>
                                 <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Vogue Wellness</p>
                             </div>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-transparent rounded-full blur-2xl"></div>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <WhyChooseUs />
                    <ServiceAreas />
                    <FaqSection />
                </div>
            </div>

            {/* Campaign Modal */}
            {isCampaignModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="bg-black w-full h-[90dvh] md:h-auto md:max-h-[85vh] md:max-w-3xl md:rounded-[40px] rounded-t-[40px] shadow-2xl relative overflow-hidden flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/20/50 bg-white shrink-0">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-[9px] font-bold tracking-widest uppercase text-white mb-2">
                                    {campaign?.title}
                                </div>
                                <h2 className="font-serif text-2xl text-white">{campaign?.label}</h2>
                            </div>
                            <button 
                                onClick={() => setIsCampaignModalOpen(false)}
                                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-white hover:bg-border transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Modal Content (Campaign Treatments) */}
                        <div className="p-6 md:p-8 overflow-y-auto bg-black">
                            <p className="text-sm text-white/90-muted mb-6">{campaign?.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {campaign?.selectedTreatments.flatMap(ct => {
                                    const treatment = treatments.find(t => t.id === ct.treatmentId);
                                    if (!treatment) return [];
                                    
                                    return ct.durations.map(duration => {
                                        const option = treatment.options.find(o => o.duration === duration);
                                        if (!option) return null;
                                        
                                        const originalPriceNum = parseInt(option.price.replace(/,/g, ''));
                                        const discountedPriceNum = originalPriceNum * (1 - (campaign.discountPercentage / 100));
                                        
                                        return (
                                            <div key={`${treatment.id}-${duration}`} className="block group outline-none cursor-pointer" onClick={() => {
                                                setCartItems([{
                                                    id: Date.now().toString(),
                                                    treatmentId: treatment.id,
                                                    campaignTitle: campaign.title,
                                                    title: treatment.title,
                                                    duration: duration,
                                                    price: discountedPriceNum,
                                                    guests: 1,
                                                    isCampaign: true,
                                                    discountPercentage: campaign.discountPercentage
                                                }]);
                                                setIsBookingModalOpen(true);
                                            }}>
                                                <div className="rounded-[32px] p-6 bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] shadow-sm hover:shadow-md transition-all duration-500 flex flex-col h-full relative overflow-hidden group-hover:-translate-y-1">
                                                    <div className="mb-4 flex items-start justify-between">
                                                        <div className="bg-white/5 border border-primary/10 text-white px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm">
                                                            {treatment.category}
                                                        </div>
                                                        <div className="bg-white text-black px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest shadow-sm">
                                                            -{campaign.discountPercentage}%
                                                        </div>
                                                    </div>
                                                    <h4 className="font-serif text-xl font-medium text-white mb-2 leading-tight">{treatment.title}</h4>
                                                    <p className="text-xs text-white/90-muted leading-relaxed font-light mb-6 flex-grow">{treatment.desc}</p>
                                                    
                                                    <div className="mt-auto pt-4 border-t border-white/20/50">
                                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/90-muted mb-2.5 uppercase tracking-widest"><Clock className="w-3.5 h-3.5" /> {duration} MINS</div>
                                                        <div className="flex items-end justify-between">
                                                            <div>
                                                                <span className="text-[10px] text-white/90-muted line-through mr-2">Rp {option.price}</span>
                                                                <span className="font-serif text-lg text-white">Rp {discountedPriceNum.toLocaleString('en-US')}</span>
                                                            </div>
                                                            <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                                <ArrowRight size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Complete Booking Modal */}
            <AnimatePresence>
                {isBookingModalOpen && (
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
                            className="bg-[#111111] border border-white/10 rounded-none md:rounded-[32px] p-6 md:p-8 w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-y-auto no-scrollbar"
                        >
                            <button 
                                onClick={() => setIsBookingModalOpen(false)}
                                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface flex items-center justify-center text-white/90-muted hover:bg-border transition-colors z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            
                            {isSelectingMore ? (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <button onClick={() => setIsSelectingMore(false)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors shrink-0">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <h2 className="font-serif text-2xl text-white">Select Treatment</h2>
                                    </div>
                                    
                                    <div className="space-y-3 max-h-[calc(100dvh-110px)] md:max-h-[70vh] overflow-y-auto pr-2 pb-16 no-scrollbar">
                                        {treatments.map(t => (
                                            <div 
                                                key={t.id} 
                                                className={`bg-surface border ${expandedTreatmentId === t.id ? 'border-primary' : 'border-white/20/50'} rounded-2xl overflow-hidden shadow-sm transition-all`}
                                            >
                                                <div 
                                                    onClick={() => setExpandedTreatmentId(expandedTreatmentId === t.id ? null : t.id)}
                                                    className="p-3 flex gap-4 hover:bg-black/[0.02] cursor-pointer group"
                                                >
                                                    <div className="flex-1 py-1 pl-2">
                                                        <div className="text-[9px] font-bold tracking-widest text-white/50 uppercase mb-1">{t.category}</div>
                                                        <h4 className="font-bold text-sm text-white mb-1 line-clamp-1">{t.title}</h4>
                                                        <div className="text-[10px] text-white/90-muted"><Clock className="w-3 h-3 inline mr-1" />{t.options.length} Options</div>
                                                    </div>
                                                    <div className="flex items-center pr-2">
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
                                                            className="border-t border-white/20/50 bg-black"
                                                        >
                                                            <div className="p-4 space-y-4">
                                                                <p className="text-xs text-white/90-muted leading-relaxed">{t.desc}</p>
                                                                <div className="space-y-2">
                                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-2">Select Duration</div>
                                                                    {t.options.map((opt, idx) => (
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
                                                                                    guests: 1,
                                                                                    isCampaign: false
                                                                                }]);
                                                                                setExpandedTreatmentId(null);
                                                                                setIsSelectingMore(false);
                                                                            }}
                                                                            className="w-full flex items-center justify-between p-3 rounded-xl border border-white/20 hover:border-primary/50 hover:bg-white/5 transition-all group"
                                                                        >
                                                                            <span className="text-sm font-bold text-white group-hover:text-white transition-colors">{opt.duration} Mins</span>
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
                                        <div className="text-center pt-2 pb-8">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/90-muted/50 flex items-center justify-center gap-2">
                                                Scroll for more treatments <ArrowRight className="w-3 h-3 rotate-90" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : bookingStep === 1 ? (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                    <h2 className="font-serif text-2xl text-white mb-1 pr-8">Complete Booking</h2>
                                    <p className="text-xs text-white/90-muted mb-4">Review your selected treatments before proceeding.</p>
                                    <div className="w-full h-[1px] bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 mb-6"></div>
                                    <p className="text-xs text-white/90-muted mb-6">Your request will be sent securely via WhatsApp.</p>

                                    {/* Cart Items List */}
                                    <div className="space-y-3 mb-4 max-h-[40vh] overflow-y-auto pr-1 no-scrollbar">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-2xl p-4 relative">
                                                {cartItems.length > 1 && (
                                                    <button 
                                                        onClick={() => setCartItems(cartItems.filter(i => i.id !== item.id))}
                                                        className="absolute top-3 right-3 text-white/90-muted hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                <div className="flex items-start justify-between mb-4 pr-6">
                                                    <div>
                                                        {item.isCampaign && (
                                                            <div className="bg-white text-black px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest inline-flex items-center gap-1 whitespace-nowrap mb-1.5 shadow-sm">
                                                                <span>{item.campaignTitle}</span>
                                                                <span className="opacity-90">(-{item.discountPercentage}%)</span>
                                                            </div>
                                                        )}
                                                        <h3 className="font-bold text-sm text-white leading-tight">{item.title}</h3>
                                                        <p className="text-xs text-white/90-muted flex items-center gap-1 mt-1">
                                                            <Clock className="w-3 h-3" /> {item.duration} Mins
                                                        </p>
                                                    </div>
                                                    <span className="font-serif text-white font-medium text-right flex flex-col shrink-0">
                                                        IDR {item.price.toLocaleString('en-US')}
                                                        <span className="text-[10px] font-sans text-white/90-muted font-normal uppercase tracking-wider">
                                                            {['couple', 'honeymoon', 'rejuvenation'].some(k => item.title.toLowerCase().includes(k)) ? 'For 2 Persons' : 'Per Person'}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pt-3 border-t border-white/20/50">
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
                                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-border transition-colors shadow-sm"
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
                                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-border transition-colors shadow-sm"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        type="button"
                                        onClick={() => setIsSelectingMore(true)}
                                        className="w-full bg-transparent text-white border border-white/20/50 px-6 py-3 rounded-xl text-xs font-bold hover:bg-surface transition-colors mb-6 tracking-widest"
                                    >
                                        + ADD ANOTHER TREATMENT
                                    </button>

                                    <div className="mt-8 pt-6 border-t border-white/20/50">
                                        <div className="flex items-end justify-between mb-6">
                                            <span className="text-xs font-bold text-white/90-muted uppercase tracking-widest">Total Price</span>
                                            <span className="text-2xl font-serif text-white">IDR {cartItems.reduce((acc, item) => acc + (item.price * item.guests), 0).toLocaleString('en-US')}</span>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setBookingStep(2)}
                                            disabled={cartItems.length === 0}
                                            className="w-full bg-white text-black px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_24px_rgb(0,0,0,0.15)] uppercase tracking-widest disabled:opacity-70"
                                        >
                                            CONTINUE TO DATE & TIME <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : bookingStep === 2 ? (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                                    <div className="flex items-center gap-4 mb-6 shrink-0">
                                        <button onClick={() => setBookingStep(1)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors shrink-0">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <h2 className="font-serif text-2xl text-white">Select Date & Time</h2>
                                    </div>
                                    <p className="text-xs text-white/90-muted mb-4 shrink-0">Select the date and time for your booking.</p>
                                    <div className="w-full h-[1px] bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 mb-6 shrink-0"></div>
                                    
                                    <div className="flex flex-col space-y-5 flex-1">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Select Date</label>
                                            <FloatingCalendar 
                                                value={formData.date}
                                                onChange={(date) => setFormData({...formData, date})}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Time</label>
                                            <input 
                                                type="time" required 
                                                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                                                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[24px] px-4 py-4 text-sm text-white text-center placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/20/50">
                                        <button 
                                            type="button"
                                            onClick={() => setBookingStep(3)}
                                            disabled={!formData.date || !formData.time}
                                            className="w-full bg-white text-black px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_24px_rgb(0,0,0,0.15)] uppercase tracking-widest disabled:opacity-70"
                                        >
                                            CONTINUE TO AREA <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : bookingStep === 3 ? (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                                    <div className="flex items-center gap-4 mb-6 shrink-0">
                                        <button onClick={() => setBookingStep(2)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors shrink-0">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <h2 className="font-serif text-2xl text-white">Where are you staying?</h2>
                                    </div>
                                    <p className="text-xs text-white/90-muted mb-4 shrink-0">Select your area in Bali so we can match you with nearby therapists.</p>
                                    <div className="w-full h-[1px] bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 mb-6 shrink-0"></div>
                                    <div className="space-y-3 overflow-y-auto pb-8">
                                        {LOCATIONS.map(loc => (
                                            <button
                                                key={loc}
                                                onClick={() => { 
                                                    setSelectedArea(loc); 
                                                    if (selectedTherapists.length > 0) setBookingStep(5);
                                                    else setBookingStep(4); 
                                                }}
                                                className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${selectedArea === loc ? 'border-primary bg-white/5' : 'border-white/20/50 hover:border-primary/30'}`}
                                            >
                                                <span className="font-bold text-white">{loc}</span>
                                                <ArrowRight className="w-4 h-4 text-white/90-muted" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : bookingStep === 4 ? (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                                    <div className="flex items-center gap-4 mb-6 shrink-0">
                                        <button onClick={() => setBookingStep(3)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors shrink-0">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <h2 className="font-serif text-2xl text-white">Choose Therapist</h2>
                                    </div>
                                    <p className="text-xs text-white/90-muted mb-4 shrink-0">Therapists available in {selectedArea}.</p>
                                    <div className="w-full h-[1px] bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 mb-6 shrink-0"></div>
                                    <div className="space-y-3 overflow-y-auto pb-8 px-2 -mx-2 no-scrollbar">
                                        <button
                                            onClick={() => { setSelectedTherapists([]); setBookingStep(5); }}
                                            className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${selectedTherapists.length === 0 ? 'border-primary bg-white/5 shadow-sm' : 'border-white/20/50 hover:border-primary/30 bg-surface'}`}
                                        >
                                            <span className="font-bold text-white text-sm tracking-wide">Assign Automatically</span>
                                            <ArrowRight className="w-4 h-4 text-white/90-muted" />
                                        </button>
                                        <div className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] p-4 rounded-2xl flex items-center justify-between my-2">
                                            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Therapists Needed</span>
                                            <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full">{selectedTherapists.length} / {totalGuests}</span>
                                        </div>
                                        {MOCK_THERAPISTS.filter(t => t.location === selectedArea).map(rawT => {
                                            const isFuture = formData.date && formData.date !== todayStr;
                                            const t = { ...rawT } as any;
                                            if (isFuture && (!t.availableDate || t.availableDate !== formData.date)) {
                                                t.status = 'Online';
                                            } else if (t.status === 'Busy' && t.availableAt) {
                                                if (formData.time && formData.time >= t.availableAt) {
                                                    t.status = 'Online';
                                                } else {
                                                    const now = new Date();
                                                    const currentTimeStr = now.toTimeString().split(' ')[0].substring(0, 5);
                                                    if ((!formData.date || formData.date === todayStr) && currentTimeStr >= t.availableAt) {
                                                        t.status = 'Online';
                                                    }
                                                }
                                            }
                                            return (
<button
                                                key={t.id}
                                                onClick={() => { 
                                                    if (selectedTherapists.includes(t.id)) {
                                                        setSelectedTherapists(selectedTherapists.filter(id => id !== t.id));
                                                    } else if (selectedTherapists.length < totalGuests) {
                                                        if (t.status === 'Busy') {
                                                            if (totalGuests > 1) {
                                                                alert("For group bookings, please select therapists who are currently 'READY TO ACCEPT JOBS'.");
                                                                return;
                                                            }
                                                            if (t.availableAt) {
                                                                if (confirm(`This therapist will be ready at ${t.availableAt}. Your booking time will be automatically updated to ${t.availableAt}. Do you want to proceed?`)) {
                                                                    setFormData({...formData, time: t.availableAt});
                                                                    setSelectedTherapists([...selectedTherapists, t.id]);
                                                                }
                                                            } else {
                                                                setSelectedTherapists([...selectedTherapists, t.id]);
                                                            }
                                                        } else {
                                                            setSelectedTherapists([...selectedTherapists, t.id]);
                                                        }
                                                    }
                                                }}
                                                className={`w-full p-4 sm:p-5 rounded-3xl text-left flex gap-5 transition-all duration-300 relative overflow-hidden ${
                                                    selectedTherapists.includes(t.id) 
                                                    ? "bg-[#292831] border-[#292831] text-white shadow-xl scale-[1.02]" 
                                                    : (selectedTherapists.length >= totalGuests && !selectedTherapists.includes(t.id) 
                                                        ? "bg-white/5 border-white/10 opacity-40 cursor-not-allowed" 
                                                        : "bg-white/10 backdrop-blur-[40px] border border-white/40 hover:bg-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] hover:-translate-y-1")
                                                }`}
                                            >
                                                <div onClick={(e) => { e.stopPropagation(); setViewingTherapist(t); }} className="relative group/avatar cursor-pointer rounded-full overflow-hidden shrink-0 border-2 border-white/50 shadow-sm w-16 h-16">
                                                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm">
                                                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">View</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <div className="mb-1">
                                                        {t.status === "Off" ? (
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-red-400">Offline</span>
                                                        ) : t.status === "Busy" ? (
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500">Handling Customer</span>
                                                        ) : (
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-green-500">Online</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className={`font-serif text-lg leading-none ${selectedTherapists.includes(t.id) ? "text-white" : "text-white"}`}>{t.name}</h4>
                                                            
                                                        </div>
                                                        <div className="flex items-center text-[#2563eb]">
                                                            <BadgeCheck className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                    <p className={`text-[11px] leading-relaxed line-clamp-1 mb-2.5 ${selectedTherapists.includes(t.id) ? "text-white/80" : "text-white/60"}`}>{t.desc}</p>
                                                    <div className="flex items-center gap-2">
                                                        {t.status === "Off" ? (
                                                            <span className="text-[10px] font-semibold text-red-400 flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>Offline</span>
                                                        ) : t.status === "Busy" ? (
                                                            <span className="text-[10px] font-semibold text-amber-500 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>READY AT {t.availableAt || "13:00"}</span>
                                                        ) : (
                                                            <span className="text-[10px] font-semibold text-green-500 flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>READY TO ACCEPT JOBS</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );})}
                                        {MOCK_THERAPISTS.filter(t => t.location === selectedArea).length === 0 && (
                                            <div className="p-6 text-center text-sm text-white/90-muted border border-dashed border-white/20/50 rounded-xl bg-surface/50">
                                                No specific therapists found for {selectedArea}. We will assign the best available therapist for you.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center gap-4 mb-6">
                                        <button onClick={() => {
                                            if (selectedTherapists.length > 0) {
                                                setBookingStep(3);
                                            } else {
                                                setBookingStep(4);
                                            }
                                        }} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors shrink-0">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <h2 className="font-serif text-2xl text-white">Final Details</h2>
                                    </div>

                                    {/* SUMMARY CARD */}
                                    {cartItems.length > 0 && (
                                    <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-xl p-4 mb-6 shadow-sm">
                                        <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-3">Booking Summary</h4>
                                        <div className="space-y-3 mb-4">
                                            {cartItems.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{item.title}</p>
                                                        <p className="text-xs text-white/90-muted">{item.duration} Mins • {item.guests} Guest(s)</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedTherapists.length > 0 && (
                                            <div className="border-t border-white/20/50 pt-4">
                                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-3">Selected Therapist{selectedTherapists.length > 1 ? 's' : ''}</p>
                                                <div className="space-y-3">
                                                    {selectedTherapists.map((tid, i) => {
                                                        const t = MOCK_THERAPISTS.find(th => th.id === tid);
                                                        if (!t) return null;
                                                        return (
                                                            <div key={i} className="flex gap-3 items-center">
                                                                <img 
                                                                    src={t.avatar} 
                                                                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                                                                    alt={t.name}
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-bold text-white flex items-center gap-2">
                                                                        {t.name}
                                                                        <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">★ {t.rating}</span>
                                                                    </p>
                                                                    <p className="text-[10px] text-white/90-muted">{t.desc.substring(0, 40)}...</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    )}

                                    <form className="space-y-5 pb-8 md:pb-0">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Guest Name</label>
                                            <input 
                                                type="text" required placeholder="John Doe"
                                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>
                                        
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Villa / Hotel Address</label>
                                            <input 
                                                type="text" required placeholder="e.g. Four Seasons Sayan, Ubud"
                                                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                                                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Room Number (Optional)</label>
                                            <input 
                                                type="text" placeholder="e.g. Villa 12"
                                                value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})}
                                                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/90-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/20/50">
                                            <div className="flex flex-col gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => handleCampaignBooking(e)}
                                                    disabled={isProcessing}
                                                    className="w-full bg-white text-black px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_24px_rgb(0,0,0,0.15)] uppercase tracking-widest disabled:opacity-70"
                                                >
                                                    {isProcessing ? 'PROCESSING...' : 'CONFIRM ON WHATSAPP'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Therapist Details Modal */}
            <AnimatePresence>
                {viewingTherapist && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm"
                        onClick={() => setViewingTherapist(null)}
                    >
                        <motion.div 
                            initial={{ y: '100%' }} 
                            animate={{ y: 0 }} 
                            exit={{ y: '100%' }} 
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="w-full sm:max-w-md bg-black rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header Image */}
                            <div className="relative h-64 shrink-0">
                                <img src={viewingTherapist.avatar} alt={viewingTherapist.name} className="w-full h-full object-cover object-top" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <button onClick={() => setViewingTherapist(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-full flex items-center justify-center text-white">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                                    <div>
                                        <h2 className="text-3xl font-serif text-white font-medium">{viewingTherapist.name}</h2>
                                        <p className="text-white/80 text-sm tracking-wide mt-1">{viewingTherapist.location}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-white px-2.5 py-1 rounded-full border border-white/20">
                                        ★ {viewingTherapist.rating}
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto no-scrollbar flex-1 pb-24">
                                
                                {/* Bio & Reviews */}
                                <div className="px-6 py-6 border-b border-white/20/40">
                                    <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-3">About</h4>
                                    <p className="text-sm text-white/90-muted leading-relaxed mb-6">{viewingTherapist.desc}</p>
                                    
                                    {viewingTherapist.reviews && viewingTherapist.reviews.length > 0 && (
                                        <div className="bg-white/5 rounded-2xl p-5 relative">
                                            <div className="text-white/20 absolute top-4 left-4 font-serif text-4xl leading-none">"</div>
                                            <p className="text-white/90 text-sm font-medium italic relative z-10 pl-6 leading-relaxed">
                                                {viewingTherapist.reviews[0].text}
                                            </p>
                                            <p className="text-xs text-white/60 font-bold tracking-wide mt-3 pl-6">— {viewingTherapist.reviews[0].author}</p>
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Sticky Bottom Action removed as requested */}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
            </div>
        
            {/* Custom Therapist Popup Modal */}
            <AnimatePresence>
                {popupState.isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setPopupState({ ...popupState, isOpen: false })}
                        ></div>
                        
                        {/* Modal Content */}
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]-12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,1)] rounded-3xl p-6 sm:p-8 overflow-hidden text-center"
                        >
                            {popupState.type === 'group' ? (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    <h3 className="font-serif text-xl text-white mb-2">Group Booking Alert</h3>
                                    <p className="text-sm text-white/90-muted mb-8 leading-relaxed">
                                        For group bookings, please select therapists who are currently <strong className="text-white font-bold">'READY TO ACCEPT JOBS'</strong> to ensure synchronized scheduling.
                                    </p>
                                    <button 
                                        onClick={() => setPopupState({ ...popupState, isOpen: false })}
                                        className="w-full bg-[#292831] text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-md hover:bg-[#292831]/90 active:scale-95 transition-all"
                                    >
                                        Understood
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h3 className="font-serif text-xl text-white mb-2">Adjust Booking Time?</h3>
                                    <p className="text-sm text-white/90-muted mb-8 leading-relaxed">
                                        This therapist will be ready at <strong className="text-white font-bold">{popupState.availableAt}</strong>. Your booking time will be automatically updated to match their availability.
                                    </p>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setPopupState({ ...popupState, isOpen: false })}
                                            className="flex-1 bg-white/20 border border-white/40 text-white px-4 py-3.5 rounded-2xl text-sm font-bold shadow-sm hover:bg-white/40 active:scale-95 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setFormData({ ...formData, time: popupState.availableAt, date: popupState.availableDate || formData.date });
                                                setSelectedTherapists([...selectedTherapists, popupState.therapistId as string]);
                                                setPopupState({ ...popupState, isOpen: false });
                                            }}
                                            className="flex-1 bg-[#292831] text-white px-4 py-3.5 rounded-2xl text-sm font-bold shadow-md hover:bg-[#292831]/90 active:scale-95 transition-all"
                                        >
                                            Proceed
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

</div>
    );
}
