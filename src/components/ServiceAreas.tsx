'use client';
import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map to avoid SSR issues with Leaflet
const ServiceMap = dynamic(() => import('./ServiceMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface/50 rounded-3xl border border-white/20/40 flex items-center justify-center animate-pulse">
      <span className="text-xs font-bold uppercase tracking-widest text-white/40">Loading Map...</span>
    </div>
  )
});

export default function ServiceAreas() {
  const areas = [
    { name: "Ubud", slug: "ubud", desc: "Premium Home Massage & Spa in Ubud." },
    { name: "Canggu", slug: "canggu", desc: "Luxury Mobile Massage for Canggu villas." },
    { name: "Seminyak", slug: "seminyak", desc: "Exclusive In-Villa Spa Treatments in Seminyak." },
    { name: "Uluwatu", slug: "uluwatu", desc: "Relaxing Home Massage experiences in Uluwatu." },
    { name: "Sanur", slug: "sanur", desc: "Tranquil Mobile Spa brought to your Sanur hotel." },
    { name: "Nusa Dua", slug: "nusa-dua", desc: "5-star Spa Delivery to Nusa Dua resorts." },
    { name: "Jimbaran", slug: "jimbaran", desc: "Sunset relaxation with our Jimbaran Home Massage." },
    { name: "Kuta", slug: "kuta", desc: "Professional Mobile Massage delivered to Kuta." },
    { name: "Legian", slug: "legian", desc: "Best Home Spa and Massage Delivery in Legian." },
    { name: "Kerobokan", slug: "kerobokan", desc: "Premium In-Villa Massage in Kerobokan." },
    { name: "Pererenan", slug: "pererenan", desc: "Luxury Home Massage services in Pererenan." },
    { name: "Berawa", slug: "berawa", desc: "Mobile Spa and Wellness delivered to Berawa." },
    { name: "Bingin", slug: "bingin", desc: "Cliff-side Home Massage in Bingin." },
    { name: "Pecatu", slug: "pecatu", desc: "Exclusive Mobile Massage therapies in Pecatu." }
  ];

  return (
    <section className="mb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-3 block">Service Areas</span>
          <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-4">We Come to Your Sanctuary</h2>
          <p className="text-sm text-white/90-muted leading-relaxed font-light">
            Therapick provides luxury mobile massage and wellness services directly to private villas, estates, and hotels across Bali's most prestigious locations.
          </p>
        </div>
      </div>

      {/* Mobile Service Areas Carousel */}
      <div className="md:hidden flex overflow-x-auto gap-4 no-scrollbar -mx-6 px-6 pb-8 snap-x snap-mandatory pt-2">
        {areas.map((area, idx) => (
          <Link href={`/locations/${area.slug}`} key={idx} className="group block outline-none shrink-0 w-[240px] snap-center">
            <div className="bg-[#111111] border border-white/10 rounded-3xl p-5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transform-gpu hover:-translate-y-1 h-full flex flex-col relative overflow-hidden">
              
              
              <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-2xl text-white font-medium">{area.name}</h3>
                    <div className="w-10 h-10 rounded-full bg-white/20 shadow-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-white transition-all duration-300 transform-gpu group-hover:scale-110">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-white/90-muted leading-relaxed font-light flex-1">{area.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop Grid Cards (Hidden on Mobile) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 md:pb-0">
        {areas.map((area, idx) => (
          <Link href={`/locations/${area.slug}`} key={idx} className="group block outline-none shrink-0 w-[260px] md:w-auto snap-center">
            <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:border-primary/20 hover:-translate-y-1 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl text-white font-medium">{area.name}</h3>
                <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-white group-hover:bg-white group-hover:text-white transition-colors duration-300">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-white/90-muted leading-relaxed font-light flex-1">{area.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
