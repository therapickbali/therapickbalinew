'use client';

import React, { useState } from 'react';
import { ChevronLeft, Share, Clock, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSpa } from '@/context/SpaContext';
import BookingModal from '@/components/BookingModal';

export default function RitualsDetails() {
    const params = useParams();
    const id = params?.id as string;
    const { treatments } = useSpa();
    const treatment = treatments.find(t => t.id === id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);

    const MOCK_THERAPISTS = [
        { id: 't1', name: 'Sarah J.', location: 'Seminyak', region: 'Bali', rating: 5, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', desc: 'Expert in deep tissue and sports massage.', reviews: [], availability: { today: ['10:00', '13:00', '16:30'], days: ['Mon', 'Tue', 'Thu', 'Fri'] }, status: 'Online' },
        { id: 't2', name: 'Dewi K.', location: 'Ubud', region: 'Bali', rating: 5, avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98a?w=150&h=150&fit=crop', desc: 'Specializes in traditional Balinese healing rituals.', reviews: [], availability: { today: ['11:30', '14:00', '18:00'], days: ['Wed', 'Thu', 'Sat', 'Sun'] }, status: 'Busy' },
        { id: 't3', name: 'Wayan M.', location: 'Canggu', region: 'Bali', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', desc: 'Aromatherapy and relaxation massage specialist.', reviews: [], availability: { today: ['09:00', '15:00'], days: ['Mon', 'Wed', 'Fri', 'Sat'] }, status: 'Off' },
        { id: 't4', name: 'Ketut A.', location: 'Ubud', region: 'Bali', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', desc: 'Holistic massage therapist with 10 years experience.', reviews: [], availability: { today: ['12:00', '17:00'], days: ['Tue', 'Wed', 'Thu', 'Sun'] }, status: 'Online' },
        { id: 't5', name: 'Made B.', location: 'Uluwatu', region: 'Bali', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop', desc: 'Known for incredibly relaxing Hawaiian Lomi-Lomi.', reviews: [], availability: { today: ['10:30', '14:30', '19:00'], days: ['Mon', 'Tue', 'Fri', 'Sun'] }, status: 'Busy' }
    ];

    if (!treatment) {
        return <div className="min-h-screen bg-background flex items-center justify-center font-serif text-2xl text-primary">Loading...</div>;
    }

    const isCoupleTreatment = ['couple', 'honeymoon', 'rejuvenation'].some(k => treatment.title.toLowerCase().includes(k));

    const handleShare = async () => {
        const shareData = {
            title: `${treatment.title} - Elexoir Home Spa`,
            text: `Book the ${treatment.title} at Elexoir Home Spa Ubud!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const handleBookOption = (opt: any) => {
        setCartItems([{
            id: Date.now().toString(),
            treatmentId: treatment.id,
            title: treatment.title,
            duration: opt.duration,
            price: parseInt(opt.price.replace(/,/g, '') || '0'),
            guests: isCoupleTreatment ? 2 : 1
        }]);
        setIsModalOpen(true);
    };

    const relatedTreatments = treatments.filter(t => t.id !== treatment.id).slice(0, 3);
    const liquidGlassClasses = 'bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)]';

    return (
        <div className="min-h-screen bg-[#FDFBF7] relative font-sans text-text pb-32">
            
            {/* Fresha-style Clean Hero Image / Top space */}
            <div className="relative w-full h-[40vh] md:h-[50vh] bg-gradient-to-br from-[#D2F34C]/20 to-primary/5 overflow-hidden flex items-end">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_60%)] pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="w-[150vw] h-[150vw] md:w-[60vw] md:h-[60vw] rounded-full bg-primary/20 blur-[100px]"></div>
                </div>
                
                <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
                    <Link href="/">
                        <button className={`w-12 h-12 rounded-full ${liquidGlassClasses} flex items-center justify-center text-primary hover:bg-white hover:scale-105 transition-all`}>
                            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                    </Link>
                    <button 
                        onClick={handleShare}
                        className={`w-12 h-12 rounded-full ${liquidGlassClasses} flex items-center justify-center text-primary hover:bg-white hover:scale-105 transition-all`}
                    >
                        <Share className="w-5 h-5" strokeWidth={2} />
                    </button>
                </header>

                <div className="max-w-4xl mx-auto px-6 w-full pb-10 z-10 relative">
                    <div className={`inline-block px-4 py-1.5 rounded-full ${liquidGlassClasses} text-[10px] font-bold tracking-widest text-primary uppercase mb-4`}>
                        {treatment.category}
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-primary leading-[1.1] tracking-tight">
                        {treatment.title}
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-8 md:mt-12 flex flex-col md:flex-row gap-12 relative">
                
                {/* Main Content (Left) */}
                <div className="flex-1 md:w-2/3">
                    <h2 className="text-xl font-bold text-primary mb-6">Service Menu</h2>
                    
                    {/* Fresha-style Options List with Liquid Glass */}
                    <div className="space-y-4 mb-12">
                        {treatment.options.map((opt: any, idx: number) => (
                            <div key={idx} className={`${liquidGlassClasses} p-5 rounded-3xl flex items-center justify-between hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,1)] transition-all duration-300 group`}>
                                <div>
                                    <h3 className="font-bold text-lg text-primary">{opt.duration} Minutes</h3>
                                    <p className="text-sm text-text-muted mt-1 font-light flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" /> Full Body Treatment
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="block font-serif text-xl text-primary">IDR {parseInt(opt.price.replace(/,/g, '') || '0').toLocaleString('en-US')}</span>
                                        <span className="block text-[10px] text-text-muted uppercase tracking-widest mt-0.5">{isCoupleTreatment ? 'For 2' : 'Per Person'}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleBookOption(opt)}
                                        className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-black transition-colors shadow-lg group-hover:scale-105"
                                    >
                                        <Plus className="w-5 h-5" strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* About Section */}
                    <div className="prose prose-p:font-light prose-p:text-text-muted prose-headings:text-primary max-w-none">
                        <h2 className="text-xl font-bold mb-4">About</h2>
                        <div className="text-sm md:text-base leading-relaxed mb-8 whitespace-pre-wrap">
                            {treatment.desc.replace(/What's Included\s*:?\s*/gi, "WHAT'S_INCLUDED_SPLIT").split("WHAT'S_INCLUDED_SPLIT").map((part, i) => (
                                i === 0 ? <span key={i}>{part}</span> : (
                                    <React.Fragment key={i}>
                                        <span className="font-bold uppercase tracking-widest block mt-8 mb-3 text-xs">WHAT'S INCLUDED</span>
                                        <span>{part.replace(/^[:\s]+/, '')}</span>
                                    </React.Fragment>
                                )
                            ))}
                        </div>
                        
                        {treatment.benefits && treatment.benefits.length > 0 && (
                            <>
                                <h3 className="text-xl font-bold mb-4">Key Benefits</h3>
                                <ul className="space-y-4 mb-12 list-none pl-0">
                                    {treatment.benefits.map((benefit: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="mt-1.5 w-2 h-2 rounded-full bg-highlight shrink-0"></div>
                                            <span className="text-sm md:text-base text-text-muted font-light leading-relaxed">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar (Right) - Desktop Only for Related/Info */}
                <div className="hidden md:block w-1/3">
                    <div className="sticky top-24">
                        <div className={`${liquidGlassClasses} p-8 rounded-3xl`}>
                            <h3 className="font-bold text-primary mb-4">Why choose us?</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm font-light text-text-muted"><div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center shrink-0">✨</div> Premium organic oils</li>
                                <li className="flex gap-3 text-sm font-light text-text-muted"><div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center shrink-0">🏡</div> Mobile service to your villa</li>
                                <li className="flex gap-3 text-sm font-light text-text-muted"><div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center shrink-0">👨‍⚕️</div> Certified professional therapists</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Treatments (Bottom) */}
            {relatedTreatments.length > 0 && (
                <div className="max-w-4xl mx-auto px-6 mt-16 pt-12 border-t border-border/30">
                    <h3 className="text-xl font-bold text-primary mb-6">You might also like</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedTreatments.map((item, idx) => (
                            <Link href={`/rituals/${item.id}`} key={idx} className={`${liquidGlassClasses} p-6 rounded-3xl group hover:-translate-y-1 transition-all duration-300 block`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="inline-block px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">{item.category}</div>
                                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                                <h4 className="font-serif text-xl font-medium text-primary mb-2 line-clamp-1">{item.title}</h4>
                                <p className="text-xs text-text-muted font-light line-clamp-2">{item.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <BookingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cartItems={cartItems}
                setCartItems={setCartItems}
                treatments={treatments}
                MOCK_THERAPISTS={MOCK_THERAPISTS}
            />
        </div>
    );
}
