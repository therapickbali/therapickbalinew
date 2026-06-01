'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ReviewPage() {
    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Mobile Header */}
            <div className="pt-14 pb-4 px-6 bg-surface/90 backdrop-blur-md sticky top-0 z-30 border-b border-border/60">
                <h1 className="font-serif text-3xl text-primary">Review</h1>
            </div>

            {/* Location & Map Section */}
            <div className="px-6 py-12 mt-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-2 block text-center md:text-left">Our Location</span>
                    <h3 className="font-serif text-3xl text-primary font-medium mb-8 text-center md:text-left">Find Us in Bali</h3>
                    
                    <div className="rounded-3xl overflow-hidden shadow-lg border border-border/80 bg-surface mb-8">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.1156829799825!2d115.26456367556685!3d-8.488131785886754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23d00e0ee4769%3A0x2353065278116e6a!2sElexoir%20Spa%20%26%20Massage%20%7C%20Home%20Massage%20Service!5e0!3m2!1sen!2sid!4v1780226749607!5m2!1sen!2sid" 
                            width="100%" 
                            height="450" 
                            style={{ border: 0 }} 
                            allowFullScreen={true} 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    <div className="flex justify-center md:justify-start">
                        <a 
                            href="https://www.google.com/maps?cid=2545391307204947562" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            View Our Reviews <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
