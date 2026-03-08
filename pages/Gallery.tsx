
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
    <div className="pt-32 pb-20 min-h-screen bg-background">
       <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <h1 className="font-serif text-7xl md:text-[120px] font-light text-black mb-6 leading-[0.85] tracking-[-0.02em]">Visual <span className="text-primary italic">Journey</span></h1>
       </div>

       <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto px-6 space-y-6">
            {IMAGES.map((img, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="break-inside-avoid rounded-[32px] overflow-hidden bg-white border border-black/5 p-2 group relative shadow-lg hover:shadow-xl transition-shadow"
                >
                    <div className="overflow-hidden rounded-[24px] relative">
                        <img 
                            src={img.src} 
                            alt={img.alt} 
                            loading="lazy" 
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-[1.5s]" 
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                </motion.div>
            ))}
       </div>
    </div>
  );
};

export default Gallery;
