import React from 'react';
import { Award, Leaf, Home, Clock, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    { icon: <Award className="w-5 h-5" />, title: "Certified Therapists", desc: "Highly trained professionals with years of luxury wellness experience." },
    { icon: <Leaf className="w-5 h-5" />, title: "Premium Massage Oils", desc: "100% organic, locally sourced essential oils for deep nourishment." },
    { icon: <Home className="w-5 h-5" />, title: "Villa & Hotel Service", desc: "We bring the complete spa setup directly to your private accommodation." },
    { icon: <Clock className="w-5 h-5" />, title: "Same-Day Booking", desc: "Flexible scheduling to fit your perfect Bali holiday itinerary." },
    { icon: <Sparkles className="w-5 h-5" />, title: "Professional Wellness", desc: "Curated therapies focusing on holistic healing and deep relaxation." },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Hygiene Standards", desc: "Impeccable cleanliness and sanitized equipment for every session." }
  ];

  return (
    <section className="mb-24 relative">
      <div className="absolute inset-0 bg-primary/[0.02] rounded-[40px] -z-10"></div>
      <div className="py-16 px-6 md:px-12 rounded-[40px] border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-3 block">Elexoir Standard</span>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight">Why Choose Our Mobile Spa</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => (
            <div key={idx} className="flex gap-5 group">
              <div className="w-12 h-12 rounded-full bg-white border border-border/50 flex items-center justify-center text-primary shrink-0 shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm text-primary mb-2 uppercase tracking-wider">{item.title}</h3>
                <p className="text-xs md:text-sm text-text-muted leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
