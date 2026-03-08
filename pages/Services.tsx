
import React from 'react';
import { SERVICES } from '../constants';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto bg-background">
      
        <div className="text-center mb-20">
            <span className="text-primary font-sans font-semibold uppercase tracking-[0.4em] text-[9px] mb-6 block">Our Offerings</span>
            <h1 className="font-serif text-7xl md:text-[120px] font-light text-secondary leading-[0.85] tracking-[-0.02em]">Curated Experiences</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {SERVICES.map((service, index) => (
                <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer flex flex-col"
                    onClick={() => navigate('/prices')}
                >
                    <div className="aspect-[4/5] overflow-hidden rounded-[40px] mb-6 relative bg-gray-200">
                        <img 
                            src={service.image} 
                            alt={service.name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-5 py-3 rounded-full text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                            Book Now
                        </div>
                    </div>

                    <div className="text-center px-4">
                        <h3 className="font-serif text-4xl font-light text-secondary mb-4 group-hover:text-primary transition-colors">{service.name}</h3>
                        <div className="w-12 h-[1px] bg-gray-200 mx-auto mb-5 group-hover:w-24 group-hover:bg-primary transition-all"></div>
                        <p className="text-text-muted text-sm font-light leading-relaxed line-clamp-2">
                            {service.description}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
  );
};

export default Services;
