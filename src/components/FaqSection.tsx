'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is the best home spa in Bali?",
      a: "Elexoir Home Spa is highly rated as one of the best luxury mobile spas in Bali. We specialize in bringing 5-star professional spa treatments, premium organic oils, and certified therapists directly to your private villa or hotel."
    },
    {
      q: "Do you provide massage in villas?",
      a: "Yes, we specialize exclusively in in-villa massages and home spa services. Our therapists arrive fully equipped to transform your living space into a tranquil wellness sanctuary across Ubud, Canggu, Seminyak, Uluwatu, and beyond."
    },
    {
      q: "Do you offer couples massage?",
      a: "Absolutely. Our couples massage packages are our most popular service, perfect for honeymooners and partners wanting to share a deeply relaxing, synchronized wellness experience in the comfort of their accommodation."
    },
    {
      q: "Which massage is best after hiking Mount Batur?",
      a: "We highly recommend our Deep Tissue Massage or our specialized Back & Shoulder Massage. These treatments specifically target muscle tension, lactic acid buildup, and fatigue, ensuring a rapid and relaxing recovery after your trek."
    },
    {
      q: "Can therapists come to hotels?",
      a: "Yes, our certified professional therapists can provide mobile massage services directly to your hotel room. We operate seamlessly within Bali's top resorts to ensure you receive the utmost privacy and luxury."
    },
    {
      q: "How do I book a home spa treatment?",
      a: "Booking is simple and fast. You can browse our treatments, select your duration and group size, and securely confirm your appointment instantly via WhatsApp with our concierge team. We even offer same-day booking depending on availability."
    }
  ];

  return (
    <section className="mb-12 md:mb-24">
      <div className="max-w-3xl mx-auto px-4 md:px-0">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-3 block">FAQ</span>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight">Frequently Asked Questions</h2>
        </div>

        <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`transition-colors duration-300 ${idx !== faqs.length - 1 ? 'border-b border-gray-100/80' : ''}`}
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className={`w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none transition-colors ${openIdx === idx ? 'bg-black/[0.02]' : 'hover:bg-black/[0.02]'}`}
              >
                <h3 className="font-medium text-[15px] text-primary pr-4">{faq.q}</h3>
                <div className="shrink-0 flex items-center justify-center text-gray-400">
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${openIdx === idx ? 'rotate-90 text-primary' : ''}`} />
                </div>
              </button>
              
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-black/[0.01]"
                  >
                    <div className="px-5 md:px-6 pb-5 pt-1">
                      <p className="text-[14px] text-text-muted font-light leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
