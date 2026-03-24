
import React from 'react';
import { motion } from 'framer-motion';

const IMAGES = [
    { src: "https://images.pexels.com/photos/4004457/pexels-photo-4004457.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Flower Bath" },
    { src: "https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Massage Detail" },
    { src: "https://images.pexels.com/photos/6663364/pexels-photo-6663364.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Couple Setup" },
    { src: "https://images.pexels.com/photos/6663595/pexels-photo-6663595.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Oils" },
    { src: "https://images.pexels.com/photos/5038166/pexels-photo-5038166.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Facial" },
    { src: "https://images.pexels.com/photos/3997992/pexels-photo-3997992.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Hot Stone" },
    { src: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Relaxation" },
    { src: "https://images.pexels.com/photos/3997997/pexels-photo-3997997.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Reflexology" },
    { src: "https://images.pexels.com/photos/3865676/pexels-photo-3865676.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Thai Massage" },
];

const Gallery: React.FC = () => {
    return (
        <div className="pt-40 pb-32 min-h-screen bg-[#FAFAF9] overflow-hidden">
            {/* Editorial Header */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-12 h-[1px] bg-[#c4a180]"></div>
                        <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.4em] text-[#c4a180]">Our Atmosphere</span>
                        <div className="w-12 h-[1px] bg-[#c4a180]"></div>
                    </div>
                    <h1 className="font-serif text-6xl md:text-[140px] font-light text-secondary mb-8 leading-[0.85] tracking-[-0.03em]">
                        Visual <span className="text-[#c4a180] italic">Journey</span>
                    </h1>
                </motion.div>
            </div>

            {/* Asymmetrical Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 max-w-[1600px] mx-auto px-6 md:px-12 space-y-8">
                {IMAGES.map((img, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="break-inside-avoid rounded-none overflow-hidden bg-white p-2.5 shadow-none border border-border group relative hover:border-black transition-colors duration-500"
                    >
                        <div className="overflow-hidden rounded-none relative">
                            <img
                                src={img.src}
                                alt={img.alt}
                                loading="lazy"
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out will-change-transform"
                            />
                            {/* Soft overlay */}
                            <div className="absolute inset-0 bg-[#c4a180]/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
